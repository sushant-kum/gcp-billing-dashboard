import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';

/* Config Imports */
import { Config } from 'src/app/configs/config';

/* Service Imports */
import { HelperService } from 'src/app/services/helper/helper.service';
import { RegexService } from 'src/app/services/regex/regex.service';
import { HttpTransactionsService } from 'src/app/services/http-transactions/http-transactions.service';

/* Interface Imports */
import { UserData } from 'src/app/interfaces/user-data';
import { MatCheckboxChange } from '@angular/material/checkbox';

interface PageInfo {
  identifier: string;
  name: string;
  is_subpage: boolean;
  parent_page: string;
  path: string;
  permissions: {
    read: boolean;
    write: boolean;
  };
}

@Component({
  selector: 'app-form-user-modal',
  templateUrl: './form-user-modal.component.html',
  styleUrls: ['./form-user-modal.component.scss']
})
export class FormUserModalComponent implements OnInit {
  new_user: boolean;

  form_user_details: FormGroup = new FormGroup(
    {
      username: new FormControl(null, [Validators.required, Validators.pattern(this._regex_service.username)]),
      name: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.pattern(this._regex_service.phone)]),
      password: new FormControl(null),
      confirm_password: new FormControl(null)
    },
    this._passwordMatchValidator
  );

  pages: string[] = [];
  pages_info: { [key: string]: PageInfo } = {};
  global_pages: string[] = [];

  constructor(
    private _regex_service: RegexService,
    private _http_service: HttpTransactionsService,
    public config: Config,
    public helper: HelperService,
    public dialogRef: MatDialogRef<FormUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: UserData
  ) {}

  ngOnInit() {
    this.pages = this.config.pages;
    if (this.pages.includes('login')) {
      this.pages.splice(this.pages.indexOf('login'), 1);
    }
    for (const page of this.pages) {
      this.pages_info[page] = {
        identifier: this.config.page_map[page].identifier,
        name: this.config.page_map[page].name,
        is_subpage: this.config.page_map[page].is_subpage,
        parent_page: this.config.page_map[page].parent_page,
        path: this.config.page_map[page].path,
        permissions: {
          read: false,
          write: false
        }
      };
    }
    for (const global_page of this.config.global_apps) {
      this.global_pages.push(global_page.identifier);
      this.pages_info[global_page.identifier].permissions = {
        read: global_page.permissions.includes('read'),
        write: global_page.permissions.includes('write')
      };
    }

    if (this.user != null) {
      this.new_user = false;
      this._populateUserDetails();
      this._populateUserPermissions();
    } else {
      this.new_user = true;
      this.form_user_details.get('password').setValidators(Validators.required);
      this.form_user_details.get('confirm_password').setValidators(Validators.required);
    }
  }

  private _populateUserDetails(): void {
    this.form_user_details.get('username').setValue(this.user.username);
    this.form_user_details.get('name').setValue(this.user.name);
    this.form_user_details.get('gender').setValue(this.user.gender);
    this.form_user_details.get('email').setValue(this.user.email);
    this.form_user_details.get('phone').setValue(this.user.phone);
  }

  private _populateUserPermissions(): void {
    for (const app_permission of this.user.app_permissions) {
      this.pages_info[app_permission.app].permissions = {
        read: app_permission.permissions.includes('read'),
        write: app_permission.permissions.includes('write')
      };
    }
  }

  permissionChanged(event: MatCheckboxChange, page: string, permission: 'read' | 'write') {
    if (this.pages_info[page].is_subpage && event.checked === true) {
      this.pages_info[this.pages_info[page].parent_page].permissions[permission] = true;
    } else if (event.checked === false) {
      for (const pg of this.pages) {
        if (this.pages_info[pg].parent_page === page) {
          this.pages_info[pg].permissions[permission] = false;
        }
      }
    }
  }

  private _passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    return form.get('password').value === form.get('confirm_password').value ? null : { passwordMismatch: true };
  }

  resetForm() {
    if (this.new_user) {
      this.form_user_details.get('username').setValue(null);
      this.form_user_details.get('name').setValue(null);
      this.form_user_details.get('gender').setValue(null);
      this.form_user_details.get('email').setValue(null);
      this.form_user_details.get('phone').setValue(null);
      this.form_user_details.get('password').setValue(null);
      this.form_user_details.get('confirm_password').setValue(null);

      for (const page of this.pages) {
        if (!this.global_pages.includes(page)) {
          this.pages_info[page].permissions = {
            read: false,
            write: false
          };
        }
      }
    } else {
      this._populateUserDetails();
      this.form_user_details.get('password').setValue(null);
      this.form_user_details.get('confirm_password').setValue(null);

      this._populateUserPermissions();
    }
    this.form_user_details.markAsUntouched();
  }

  isProfileFormEdited(): boolean {
    if (this.new_user) {
      for (const page of this.pages) {
        if (
          !this.global_pages.includes(page) &&
          (this.pages_info[page].permissions.read || this.pages_info[page].permissions.write)
        ) {
          return true;
        }
      }
      return (
        this.form_user_details.get('username').value != null ||
        this.form_user_details.get('name').value != null ||
        this.form_user_details.get('gender').value != null ||
        this.form_user_details.get('email').value != null ||
        this.form_user_details.get('phone').value != null ||
        this.form_user_details.get('password').value != null ||
        this.form_user_details.get('confirm_password').value != null
      );
    } else {
      // for (const page of this.pages) {
      //   if (!this.global_pages.includes(page)) {
      //     for (const app_permission of this.user.app_permissions) {
      //       if (
      //         app_permission.app === page && (
      //           this.pages_info[page].permissions.read !== app_permission.permissions.includes('read') ||
      //           this.pages_info[page].permissions.write !== app_permission.permissions.includes('write')
      //         )
      //       ) {
      //         return true;
      //       }
      //     }
      //   }
      // }
      // return (
      //   this.form_user_details.get('name').value !== this.user.name ||
      //   this.form_user_details.get('gender').value !== this.user.gender ||
      //   this.form_user_details.get('email').value !== this.user.email ||
      //   this.form_user_details.get('phone').value !== this.user.phone ||
      //   this.form_user_details.get('password').value != null ||
      //   this.form_user_details.get('confirm_password').value != null
      // );
      return true;
    }
  }

  onAddUserClick(): void {
    this._http_service.get_users.sendRequest().subscribe((res: any) => {
      let flag_non_unique_username = false;
      for (const user_data of res.data) {
        if (user_data.username === this.form_user_details.get('username').value) {
          this.form_user_details.get('username').setErrors({ notUnique: true });
          document.getElementById('input-username').focus();
          setTimeout(() => {
            this.form_user_details.get('username').setErrors({ notUnique: false });
          }, 5000);
          flag_non_unique_username = true;
          break;
        }
      }

      if (!flag_non_unique_username) {
        const return_data = this.form_user_details.getRawValue();
        return_data._id = null;

        return_data.password_hash = new Md5()
          .appendStr(return_data.password)
          .end()
          .toString();
        delete return_data.password;
        delete return_data.confirm_password;

        return_data.app_permissions = [];
        for (const page of this.pages) {
          if (!this.global_pages.includes(page)) {
            const permissions: string[] = [];
            if (this.pages_info[page].permissions.read) {
              permissions.push('read');
            }
            if (this.pages_info[page].permissions.write) {
              permissions.push('write');
            }

            if (permissions.length > 0) {
              return_data.app_permissions.push({
                app: this.pages_info[page].identifier,
                permissions
              });
            }
          }
        }

        this.dialogRef.close({
          data: return_data,
          operation: 'user.add'
        });
      }
    });
  }

  onEditUserClick(): void {
    const return_data = this.form_user_details.getRawValue();
    return_data._id = this.user._id;
    if (return_data.password == null) {
      return_data.password_hash = this.user.password_hash;
    } else {
      return_data.password_hash = new Md5()
        .appendStr(return_data.password)
        .end()
        .toString();
    }
    delete return_data.password;
    delete return_data.confirm_password;

    return_data.app_permissions = [];
    for (const page of this.pages) {
      if (!this.global_pages.includes(page)) {
        const permissions: string[] = [];
        if (this.pages_info[page].permissions.read) {
          permissions.push('read');
        }
        if (this.pages_info[page].permissions.write) {
          permissions.push('write');
        }

        if (permissions.length > 0) {
          return_data.app_permissions.push({
            app: this.pages_info[page].identifier,
            permissions
          });
        }
      }
    }

    this.dialogRef.close({
      data: return_data,
      operation: 'user.edit'
    });
  }

  onCloseClick(): void {
    this.dialogRef.close({
      data: null,
      operation: 'close'
    });
  }
}
