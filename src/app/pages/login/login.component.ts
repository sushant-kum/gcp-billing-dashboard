import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/configs/config';
import { HeaderService } from 'src/app/services/header/header.service';
import { FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';

/* Services Imports */
import { HttpTransactionsService } from 'src/app/services/http-transactions/http-transactions.service';
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

/* Interfaces Imports */
import { ApiResponse } from 'src/app/interfaces/api-response';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Mode {
  password_visible: boolean;
  logging_in: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  config: Config = new Config();

  mode: Mode = {
    password_visible: false,
    logging_in: false
  };

  col_height_px: number;

  username_ctrl: FormControl = new FormControl(null, [Validators.required]);
  password_ctrl: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private _title: Title,
    private _toast: MatSnackBar,
    private _header_service: HeaderService,
    private _http_service: HttpTransactionsService,
    private _localstorage_service: LocalStorageService,
    private _auth_service: AuthService
  ) {}

  ngOnInit() {
    this._title.setTitle(this.config.page_map.login.name + ' - ' + this.config.app_title);
    this._header_service.changePageInfo(
      this.config.page_map.login.identifier,
      this.config.page_map.login.name,
      this.config.page_map.login.fas_icon
    );

    this.col_height_px = document.getElementById('login-form-holder').offsetHeight;

    $('#input-username').on('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.login();
      }
    });
    $('#input-password').on('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.login();
      }
    });

    if (
      this._localstorage_service.exists(this._localstorage_service.lsname.username) &&
      this._localstorage_service.exists(this._localstorage_service.lsname.token)
    ) {
      this.login(true);
    }
  }

  togglePasswordVisibility() {
    this.mode.password_visible = !this.mode.password_visible;
  }
  loginFormValid() {
    if (!this.username_ctrl.value || this.username_ctrl.value.length === 0) {
      return false;
    }
    if (!this.password_ctrl.value || this.password_ctrl.value.length === 0) {
      return false;
    }
    return true;
  }

  login(use_token: boolean = false) {
    const urlParams = new URLSearchParams(window.location.search);
    let redirect_path: string = this.config.default_app_path;
    if (urlParams.has('redirect')) {
      if (this.config.page_map[urlParams.get('redirect')] !== undefined) {
        redirect_path = this.config.page_map[urlParams.get('redirect')].path;
      }
    }

    if (use_token) {
      const username = this._localstorage_service.get(this._localstorage_service.lsname.username);
      const token = this._localstorage_service.get(this._localstorage_service.lsname.token);
      if (username && token) {
        this._auth_service.authUserToken((error, new_token) => {
          if (error) {
            console.error(error);
          } else {
            if (new_token) {
              window.location.href = redirect_path;
            } else {
              this._localstorage_service.deleteMulti([
                this._localstorage_service.lsname.app_permissions,
                this._localstorage_service.lsname.token,
                this._localstorage_service.lsname.user_id,
                this._localstorage_service.lsname.username
              ]);
            }
          }
        });
      } else {
        this._localstorage_service.deleteAll();
      }
    } else {
      this.mode.logging_in = true;
      this._http_service.get_login.sendRequest(this.username_ctrl.value, this.password_ctrl.value).subscribe(
        (data: ApiResponse) => {
          if (data.status === 'success') {
            this._localstorage_service.set(this._localstorage_service.lsname.user_id, data.user_id);
            this._localstorage_service.set(this._localstorage_service.lsname.username, this.username_ctrl.value);
            for (const global_app of this.config.global_apps) {
              data.data.app_permissions.push({
                app: global_app.app.identifier,
                permissions: global_app.permissions,
                _id: 'client_grown'
              });
            }
            this._localstorage_service.set(
              this._localstorage_service.lsname.app_permissions,
              JSON.stringify(data.data.app_permissions)
            );
            window.location.href = redirect_path;
          } else {
            this.showToast('Something went wrong. Please try again later.', 'Close', null, true);
          }
          this.mode.logging_in = false;
        },
        error => {
          console.error(error);
          if (error.status === 401) {
            this.showToast('Username/password provided is incorrect.', 'Close', null, true);
          } else {
            this.showToast('Something went wrong. Please try again later.', 'Close', null, true);
          }
          this.mode.logging_in = false;
        }
      );
    }
  }

  showToast(message: string, action: string, duration: number = null, is_error: boolean = true) {
    const toast_config: any = {
      horizontalPosition: 'end'
    };
    if (duration !== null) {
      toast_config.duration = duration;
    }
    if (is_error) {
      toast_config.panelClass = 'toast-error';
    }

    this._toast.open(message, action, toast_config);
  }
}
