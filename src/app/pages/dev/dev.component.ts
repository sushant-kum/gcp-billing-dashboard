import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { HelperService } from 'src/app/services/helper/helper.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {
  config: Config = new Config();

  constructor(
    public helper_service: HelperService,
    private _title: Title,
    private _header_service: HeaderService,
    private _sidebar: SidebarComponent
  ) {}

  ngOnInit() {
    this._title.setTitle('Developers Page' + ' - ' + this.config.app_title);
    this._header_service.changePageInfo('dev', 'Developers Page', 'file-code');

    this._sidebar.colorize();
  }
}
