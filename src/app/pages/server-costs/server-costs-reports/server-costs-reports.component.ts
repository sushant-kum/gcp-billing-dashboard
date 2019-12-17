import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

const PAGE_ID = 'server-costs-reports';
@Component({
  selector: 'app-server-costs-reports',
  templateUrl: './server-costs-reports.component.html',
  styleUrls: ['./server-costs-reports.component.scss']
})
export class ServerCostsReportsComponent implements OnInit {
  private _page_id = PAGE_ID;
  config: Config = new Config();

  constructor(private _title: Title, private _header_service: HeaderService, public sidebar: SidebarComponent) {}

  ngOnInit() {
    this._title.setTitle(this.config.page_map[this._page_id].name + ' - ' + this.config.app_title);
    this._header_service.changePageInfo(
      this.config.page_map[this._page_id].identifier,
      this.config.page_map[this._page_id].name,
      this.config.page_map[this._page_id].fa_icon
    );

    this.sidebar.activate();
    this.sidebar.colorize(this.config.page_map[this._page_id].identifier);
  }
}
