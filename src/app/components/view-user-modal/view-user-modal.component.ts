import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/* Config Imports */
import { Config } from 'src/app/configs/config';

/* Service Imports */
import { HelperService } from 'src/app/services/helper/helper.service';

/* Interface Imports */
import { UserData } from 'src/app/interfaces/user-data';

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
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss']
})
export class ViewUserModalComponent implements OnInit {
  pages: string[] = [];
  pages_info: { [key: string]: PageInfo } = {};
  global_pages: string[] = [];

  constructor(
    public config: Config,
    public helper: HelperService,
    private _dialogRef: MatDialogRef<ViewUserModalComponent>,
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

    for (const app_permission of this.user.app_permissions) {
      this.pages_info[app_permission.app].permissions = {
        read: app_permission.permissions.includes('read'),
        write: app_permission.permissions.includes('write')
      };
    }
  }

  onCloseClick(): void {
    this._dialogRef.close();
  }
}
