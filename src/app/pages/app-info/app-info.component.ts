import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

import { environment as env } from 'src/environments/environment';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { HttpTransactionsService } from 'src/app/services/http-transactions/http-transactions.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss']
})
export class AppInfoComponent implements OnInit {
  config: Config = new Config();

  version_info: any = env.version_info;
  third_party_license: string;

  constructor(
    public helper_service: HelperService,
    private _title: Title,
    private _header_service: HeaderService,
    private _http_service: HttpTransactionsService,
    private _sidebar: SidebarComponent
  ) {}

  ngOnInit() {
    this._title.setTitle('App Info' + ' - ' + this.config.app_title);
    this._header_service.changePageInfo('app-info', 'App Info', 'layer-group');

    this._sidebar.colorize();

    this.fetch_3rdparty_licenses();
  }

  fetch_3rdparty_licenses(): void {
    this._http_service.get_3rdpartylicenses.sendRequest().subscribe(
      (res: any) => {
        res = res as string;
        res = res.replace(/\n/g, '<br />');
        this.third_party_license = res;
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );
  }
}
