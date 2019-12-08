import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InputFilterService {
  constructor() {}

  /**
   * Sets the input filter on `inputEle` with `inputFilterRegExp` and sets `formControl` value
   *
   * @author Sushant Kumar
   * @param inputEle input element to apply filter
   * @param inputFilterRegExp regexp of filter
   * @param [formControl=null] formcontrol to apply filter
   */
  setInputFilter(inputEle: HTMLInputElement, inputFilterRegExp: RegExp, formControl: FormControl = null) {
    const inputFilterFunc = (value: any): boolean => {
      return inputFilterRegExp.test(value);
    };
    ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(event => {
      inputEle.addEventListener(event, function() {
        if (inputFilterFunc(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty('oldValue')) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          if (formControl) {
            formControl.setValue(this.value);
          }
        }
      });
    });
  }
}
