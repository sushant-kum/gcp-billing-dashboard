import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpTransactionsService } from 'src/app/services/http-transactions/http-transactions.service';
import { Config } from 'src/app/configs/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _is_authed: boolean;
  @Output() auth_state_change: EventEmitter<boolean> = new EventEmitter();

  constructor(private _http_client: HttpTransactionsService, private _config: Config) {}

  changeAuthState(auth_state: boolean) {
    this._is_authed = auth_state;
    this.auth_state_change.emit(this._is_authed);
  }

  authUserToken(callback): void {
    this._http_client.get_login_token.sendRequest().subscribe(
      data => {
        return callback(null, data.token);
      },
      error => {
        return callback(error);
      }
    );
  }

  getAccess(user_id: string, callback): void {
    this._http_client.get_profile_user_id.sendRequest(user_id).subscribe(
      data => {
        for (const global_app of this._config.global_apps) {
          data.data.app_permissions.unshift({
            app: global_app.app.identifier,
            permissions: global_app.permissions,
            _id: 'client_grown'
          });
        }

        return callback(null, {
          access: data.data.app_permissions,
          token: data.token
        });
      },
      error => {
        return callback(error);
      }
    );
  }
}
