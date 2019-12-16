import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

const PAGE_ID = 'server-costs';

interface PageMapWithHover {
  path: string;
  identifier: string;
  name: string;
  img_icon_theme: string;
  img_icon_white: string;
  fas_icon: string;
  hovered: boolean;
}

@Component({
  selector: 'app-server-costs',
  templateUrl: './server-costs.component.html',
  styleUrls: ['./server-costs.component.scss']
})
export class ServerCostsComponent implements OnInit {
  private _page_id = PAGE_ID;
  config: Config = new Config();

  apps: PageMapWithHover[] = [];

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

    for (const app_name of this.config.pages) {
      if (app_name.indexOf('server-costs-') === 0) {
        const temp_app = JSON.parse(JSON.stringify(this.config.page_map[app_name]));
        temp_app.hovered = false;
        this.apps.push(temp_app);
      }
    }
  }
}
