import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';

export const BACKEND_URL = new InjectionToken<string>('backend-url');

export let URL = environment.production? 'https://frontendJR.nl/gedichtenDb' :  'http://localhost:8000/gedichtenDb';
