import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/* Service Imports */
import { AlertService } from 'src/app/services/alert/alert.service';

/* Interface Imports */
import { AlertData } from 'src/app/interfaces/alert-data';
import { DialogResponse } from 'src/app/interfaces/dialog-response';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './alert.template.html',
  styleUrls: ['./alert.template.scss']
})
export class AlertModalComponent {
  constructor(
    private _dialogRef: MatDialogRef<AlertModalComponent>,
    @Inject(MAT_DIALOG_DATA) public alert_data: AlertData
  ) {}

  onCloseClick(): void {
    const response: DialogResponse = {
      operation: 'close'
    };
    this._dialogRef.close(response);
  }

  onOkClick(): void {
    const response: DialogResponse = {
      operation: 'alert.ok'
    };
    this._dialogRef.close(response);
  }
}

@Component({
  selector: 'app-alert',
  template: ''
})
export class AlertComponent implements OnInit {
  constructor(private _alert_service: AlertService, private _dialog: MatDialog) {}

  ngOnInit() {
    this._alert_service.show_alert.subscribe((show_alert: boolean) => {
      if (show_alert) {
        this.showAlert({
          title: this._alert_service.alert_data.title ? this._alert_service.alert_data.title : 'Alert',
          message: this._alert_service.alert_data.message,
          info: this._alert_service.alert_data.info ? this._alert_service.alert_data.info : null,
          positive_btn_text: this._alert_service.alert_data.positive_btn_text
            ? this._alert_service.alert_data.positive_btn_text
            : 'OK'
        });
      }
    });
  }

  showAlert(alert_data: AlertData) {
    const dialogRef = this._dialog.open(AlertModalComponent, {
      data: alert_data,
      closeOnNavigation: true,
      minWidth: 250,
      position: {
        top: '50px'
      }
    });

    dialogRef.afterClosed().subscribe((result: DialogResponse) => {
      this._alert_service.respond(result);
    });
  }
}
