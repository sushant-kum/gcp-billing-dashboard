import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/* Service Imports */
import { ConfirmService } from 'src/app/services/confirm/confirm.service';

/* Interface Imports */
import { ConfirmData } from 'src/app/interfaces/confirm-data';
import { DialogResponse } from 'src/app/interfaces/dialog-response';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './confirm.template.html',
  styleUrls: ['./confirm.template.scss']
})
export class ConfirmModalComponent {
  constructor(
    private _dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public confirm_data: ConfirmData
  ) {}

  onCloseClick(): void {
    const response: DialogResponse = {
      operation: 'close'
    };
    this._dialogRef.close(response);
  }

  onCancelClick(): void {
    const response: DialogResponse = {
      operation: 'confirm.cancel'
    };
    this._dialogRef.close(response);
  }

  onOkClick(): void {
    const response: DialogResponse = {
      operation: 'confirm.ok'
    };
    this._dialogRef.close(response);
  }
}

@Component({
  selector: 'app-confirm',
  template: ''
})
export class ConfirmComponent implements OnInit {
  constructor(private _confirm_service: ConfirmService, private _dialog: MatDialog) {}

  ngOnInit() {
    this._confirm_service.show_confirm.subscribe((show_alert: boolean) => {
      if (show_alert) {
        this.showConfirm({
          title: this._confirm_service.confirm_data.title ? this._confirm_service.confirm_data.title : 'Alert',
          message: this._confirm_service.confirm_data.message,
          info: this._confirm_service.confirm_data.info ? this._confirm_service.confirm_data.info : null,
          negative_btn_text: this._confirm_service.confirm_data.negative_btn_text
            ? this._confirm_service.confirm_data.negative_btn_text
            : 'Cancel',
          positive_btn_text: this._confirm_service.confirm_data.positive_btn_text
            ? this._confirm_service.confirm_data.positive_btn_text
            : 'OK'
        });
      }
    });
  }

  showConfirm(confirm_data: ConfirmData) {
    const dialogRef = this._dialog.open(ConfirmModalComponent, {
      data: confirm_data,
      closeOnNavigation: true,
      disableClose: true,
      minWidth: 250,
      position: {
        top: '50px'
      }
    });

    dialogRef.afterClosed().subscribe((result: DialogResponse) => {
      this._confirm_service.respond(result);
    });
  }
}
