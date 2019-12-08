export interface DialogResponse {
  data?: any;
  operation:
    | 'close'
    | 'alert.ok'
    | 'confirm.cancel'
    | 'confirm.ok'
    | 'user.add'
    | 'user.edit'
    | 'quotation.edit'
    | 'quotation.add'
    | 'quotation-config.add'
    | 'quotation-config.edit';
}
