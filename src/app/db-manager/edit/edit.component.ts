import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import * as FormData from 'form-data'

import { BACKEND_URL } from '../../app-tokens';
import { ListItem, PoemsListItem, PoetsListItem, BundlesListItem } from '../../models/list-items';
import { ListItemsStore } from '../services/list-items.store';
import { DbManagerService } from '../services/db-manager.service';
import { EditService } from '../services/edit.service';
import { Poet, Bundle } from '../../models/foreign-key-children';
import { urlValidator, urlLabelValidator } from '../../shared/app-validators';

/**
 * The EditComponent offers the user a form to edit a poem, poet or bundle, or to create a new one.
 * The EditComponent is hosted by the PoemItemComponent, PoetsListComponent and BundlesComponent.
 * Which formfields the form contains, is determined by the listType input binding.
 * The EditComponent prefills the form with data it receives from the ListItemStore. This data is based on the id of the poem, poet or bundle which the EditComponent receives from the EditService.
 * If the id === 0, it means a new listItem must be added. When the id === 0 no listItem will be filtered out. In this case the EditComponent offer the user a blank form.
 * If the id === -1, it means the form must be hidden. The id === -1 is triggered by the EditComponent itself, by its hideForm method.
 *
 * An image can be added to a Poet-item. This has some additional concerns: *
 * - In the Poet model there is a 'img_url' property. The value is the url of the image on the backend, the value is received from the backend. In the formbuilder is a field  called 'img'. The value is the filename of the uploaded img and the user sees it in the form.  
 * - Because this EditComponent lives on as long as the user doesn't navigate between the three lists, the poetImgFile and poetImgSrc also live on. Therefore they're explicitely set to undefined after submitting.
 * - The component property 'poetImgSrc' is used to display the image in the form. It can be set to the src of a just uploaded image or to the src of an image on the server.
 * - The component property 'poetImgFile' is used to add an uploaded image to the FormData object.
 * - The editForm value 'img' is the text shown in the file upload form field. If the file sizes or format is not correct, the value is reset to '' so the form field shows the 'no file choosen' text.
 * - The editForm value 'img_url' is for setting the initial value of poetImgSrc. This component doesn't change the value of img_url; it's send with the form data because the backend needs it as reference in case the image must be deleted.
 *
 * In the submit method there's an if-statement for setting the img-property of editedItem to ''.
 * Without it, after uploading an image with the form, the form's img property has a value like: "C:\fakepath\slauerhoff-website.jpg". We get this property back here as listItem's property from the listStore after submitting. If then we patch this to the form in the OnInit subscription, we get in Chrome: DOMException: Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string. In Firefox the message is less clear and difficult to debug: DOMExeption: the operation is insecure.
 */

@Component({
  selector: 'jr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  editForm: FormGroup;
  listItem: ListItem;
  listItemSubscription: Subscription;
  locationSubscription: ISubscription;
  headerInfo = {
    'poems': 'Gedicht',
    'poets': 'Dichter',
    'bundles': 'Bundel'
  }
  askDeleteConfirmationDisplay = 'none';
  remoteError = false;
  authError = false;
  poetImgUploadError = '';
  poetImgSrc: string = '';
  poetImgFile: File;
  imgBaseUrl: string;
  deletePoetImg = '';

  _listType: string;
  @Input()
  set listType(listType: string) {
    this._listType = listType;
    this.buildForm(this.fb);
  };
  get listType(): string {
    return this._listType;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private listItemsStore: ListItemsStore,
    private dbManagerService: DbManagerService,
    private location: Location,
    private editService: EditService,
    private router: Router,
    @Inject(BACKEND_URL) backendUrl: string
  ) {
    const host = backendUrl.substring(0, backendUrl.indexOf('/gedichtenDb'));
    this.imgBaseUrl = host + '/uploads/gedichtenDb/';
  }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.data['title'];
    this.titleService.setTitle(title);

    const id$ = this.editService.listItemId$;
    const listItems$ = this.listItemsStore.listItems$;
    this.listItemSubscription = combineLatest(id$, listItems$).subscribe(([id, listItems]) => {
      if (id === -1) {
        this.listItem = undefined;
        return;
      }
      if (id === 0) {
        this.listItem = this.newListItem();
      } else {
        this.listItem = listItems.filter(listItem => listItem.id === id)[0];
      }
      // After deleting the listItems.filter(...) results in an undefined this.listItem, on which editForm.patchValue throws, so we test if we have a listItem.
      if (this.listItem) {
        this.editForm.patchValue(this.listItem);
        this.poetImgUploadError = '';
        if (this.listType === 'poets' && (<PoetsListItem>this.listItem).img_url) {
          this.poetImgSrc = this.imgBaseUrl + (<PoetsListItem>this.listItem).img_url;
        }
      }
    });

    // Hide the edit form after the browsers back button is clicked
    this.locationSubscription = this.location.subscribe(() => {
      this.hideForm();
    })
  }

  buildForm(fb: FormBuilder) {
    switch (this.listType) {
      case 'poems':
        this.editForm = fb.group({
          text: ['', [Validators.maxLength(30000), Validators.required]],
          title: '',
          poet_id: '',
          poet_name: '',
          bundle_id: '',
          bundle_title: '',
          url: ['', urlValidator],
          url_label: '',
          comment: ''
        },
          { validator: urlLabelValidator }
        );
        break;
      case 'poets':
        this.editForm = fb.group({
          name: ['', Validators.required],
          born: ['', Validators.pattern(/^\d{4}$/)],
          died: ['', Validators.pattern(/^\d{4}$/)],
          img: '',
          img_url: ''
        });
        break;
      case 'bundles':
        this.editForm = fb.group({
          title: ['', Validators.required],
          year: ['', Validators.pattern(/^\d{4}$/)],
          poet_id: '',
          poet_name: ''
        });
        break;
    }
  }

  newListItem(): ListItem {
    // Returns an empty listItem
    switch (this.listType) {
      case 'poems':
        return { text: '' }
      case 'poets':
        return { name: '' }
      case 'bundles':
        return { title: '' }
    }
  }

  onSubmit(formValue: any) {
    const formData = new FormData();
    for (const key in formValue) {
      formData.append(key, formValue[key] || ''); // If we don't pass '', then FormData passes null, which from the backend will return as a string 'null'
    }
    formData.append('id', this.listItem.id);
    if (this.listType === 'poets') {
      formData.append('delete_poet_img', this.deletePoetImg);
      formData.append('item_id', (<PoetsListItem>this.listItem).item_id)
      if (this.poetImgFile) {
        formData.append('img', this.poetImgFile);
      }
    }
    const editedItem = Object.assign(this.listItem, formValue);
    // See the doc text above for the reason for the following if-statement.
    if (editedItem.img) {
      editedItem.img = '';
    }
    this.dbManagerService.createOrUpdateListItem(this.listType, formData, editedItem)
      .subscribe(
        succes => {
          if (this.listType === 'poets') {
            this.poetImgSrc = '';
            this.poetImgFile = undefined;
          }
          this.hideForm();
        },
        error => this.handleError(error)
      );
  }

  hideRemoteErrorMessage() {
    this.remoteError = false;
  }

  hideForm() {
    this.listItem = undefined;
    this.editForm.reset();
    this.poetImgSrc = '';
    this.editService.pushListItemId(-1);
    return false;
  }

  askDeleteConfirmation() {
    this.askDeleteConfirmationDisplay = 'block';
    return false;
  }

  hideDeleteConfirmation() {
    this.askDeleteConfirmationDisplay = 'none';
  }

  deleteListItem() {
    this.dbManagerService.deleteListItem(this.listType, this.listItem)
      .subscribe(
        // The EditFormComponent is child of the Poems-, Poets- or BundlesListComponent. It survives after deleting a poem. When we then add a new list item, the delete confirmation will show up, so we must hide it.
        succes => this.hideDeleteConfirmation(),
        error => this.handleError(error)
      );
    return false;
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authError = true;
    }
    else {
      this.remoteError = true;
    }
  }

  // onForeignKeyChange is triggered by the ForeignKeySearch child components.
  onForeignKeyChange(event: Poet | Bundle) {
    function isTypePoet(value: Poet | Bundle): value is Poet {
      return value.hasOwnProperty('name')
    }
    if (isTypePoet(event)) {
      this.editForm.patchValue({
        poet_id: event.id,
        poet_name: event.name
      })
    } else {
      this.editForm.patchValue({
        bundle_id: event.id,
        bundle_title: event.title
      })
    }
  }

  onFileUpload(files: FileList): HTMLImageElement {
    this.poetImgUploadError = '';
    const file = files[0];
    if (!file) return;
    const fileTypeErr = !(file.type === 'image/jpeg' || file.type === 'image/png');
    const fileSizeErr = file.size > 24576;
    if (fileTypeErr) {
      this.poetImgUploadError = file.name + ' is geen correct afbeeldingsbestand. Het moet een jpg of png zijn.'
      this.editForm.patchValue({ 'img': '' });
      return;
    }
    if (fileSizeErr) {
      this.poetImgUploadError = file.name + ' is een te groot afbeeldingsbestand. Maximum is 20 kB.'
      this.editForm.patchValue({ 'img': '' });
      return;
    }
    this.checkImageSizes(file)
      .then((file: File | false) => {
        if (file) {
          this.poetImgFile = file;
          this.deletePoetImg = '';
        }
      });
  }

  checkImageSizes(file: File): Promise<File | boolean> {
    const reader = new FileReader();
    const img = new Image();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
    })
      .then((event: ProgressEvent) => {
        return new Promise((resolve, reject) => {
          img.onload = () => {
            if (img.width !== 150 || img.height !== 150) {
              this.poetImgUploadError = `${file.name} is ${img.width}px bij ${img.height}px. De afbeelding moet 150px bij 150px zijn.`
              this.editForm.patchValue({ 'img': '' });
              resolve();
            }
            resolve(img);
          };
          img.onerror = () => reject()
          img.src = (<FileReader>event.target).result;
        })
      })
      .then((img: HTMLImageElement) => {
        if (img) {
          this.poetImgSrc = img.src;
          return file;
        }
        return false;
      })
      .catch(() => {
        this.poetImgUploadError = `Er is een probleem met ${file.name}. Kies opnieuw een afbeeldingsbestand.`;
        this.poetImgFile = undefined;
        this.editForm.patchValue({ 'img': '' });
        return false;
      });
  }

  removeImage(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.editForm.patchValue({ 'img': '' });
    this.poetImgSrc = '';
    this.poetImgFile = undefined;
    this.deletePoetImg = 'true';
    this.poetImgUploadError = '';
  }

  ngOnDestroy() {
    this.listItemSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }
}
