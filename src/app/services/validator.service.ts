import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor() {}

  moment(format: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const datetime = moment(control.value, format, true);

      if (!datetime.isValid()) {
        return { invalidMomentFormat: true, requiredFormat: format };
      }

      return null;
    };
  }
}
