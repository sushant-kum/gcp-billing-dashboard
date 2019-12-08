import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AlertData } from 'src/app/interfaces/alert-data';
import { DialogResponse } from 'src/app/interfaces/dialog-response';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _show_alert = new Subject<boolean>();
  show_alert = this._show_alert.asObservable();

  private _alert_data: AlertData;
  private _alert_response = new Subject<DialogResponse>();
  private _alert_resp_asobservable = this._alert_response.asObservable();

  constructor() {}

  get alert_data(): AlertData {
    return this._alert_data;
  }

  alert(alert_data: AlertData): Observable<DialogResponse> {
    this._alert_data = alert_data;
    this._show_alert.next(true);
    return this._alert_resp_asobservable;
  }

  respond(alert_respond: DialogResponse): void {
    this._show_alert.next(false);
    this._alert_response.next(alert_respond);
  }
}
