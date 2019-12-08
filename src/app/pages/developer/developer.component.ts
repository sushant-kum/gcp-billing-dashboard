import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {
  config: Config = new Config();

  constructor(private _title: Title, private _header_service: HeaderService, private _sidebar: SidebarComponent) {}

  ngOnInit() {
    this._title.setTitle('About the Developer' + ' - ' + this.config.app_title);
    this._header_service.changePageInfo('developer', 'About the Developer', 'code');

    this._sidebar.colorize();
  }
}
