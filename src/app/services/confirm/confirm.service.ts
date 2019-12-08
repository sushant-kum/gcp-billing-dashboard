import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ConfirmData } from 'src/app/interfaces/confirm-data';
import { DialogResponse } from 'src/app/interfaces/dialog-response';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private _show_confirm = new Subject<boolean>();
  show_confirm = this._show_confirm.asObservable();

  private _confirm_data: ConfirmData;
  private _confirm_response = new Subject<DialogResponse>();
  private _confirm_resp_asobservable = this._confirm_response.asObservable();

  constructor() {}

  get confirm_data(): ConfirmData {
    return this._confirm_data;
  }

  confirm(confirm_data: ConfirmData): Observable<DialogResponse> {
    this._confirm_data = confirm_data;
    this._show_confirm.next(true);
    return this._confirm_resp_asobservable;
  }

  respond(confirm_respond: DialogResponse): void {
    this._show_confirm.next(false);
    this._confirm_response.next(confirm_respond);
  }
}
