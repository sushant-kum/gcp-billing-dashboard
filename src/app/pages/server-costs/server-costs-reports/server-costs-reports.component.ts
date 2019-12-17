import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { RegexService } from 'src/app/services/regex/regex.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

const moment = _rollupMoment || _moment;

export const DATE_PICKER_FORMATS = {
  parse: {
    dateInput: 'DD MMM, YYYY'
  },
  display: {
    dateInput: 'DD MMM, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM, YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

const PAGE_ID = 'server-costs-reports';

@Component({
  selector: 'app-server-costs-reports',
  templateUrl: './server-costs-reports.component.html',
  styleUrls: ['./server-costs-reports.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_FORMATS }
  ]
})
export class ServerCostsReportsComponent implements OnInit {
  private _page_id = PAGE_ID;
  config: Config = new Config();

  form_filters: FormGroup = new FormGroup({
    duration: new FormControl('current_month', [Validators.required]),
    duration_start: new FormControl(moment(), [Validators.pattern(this._regex_service.date_dd_mmm_yyyy)]),
    duration_end: new FormControl(moment(), [Validators.pattern(this._regex_service.date_dd_mmm_yyyy)]),
    group_by: new FormControl()
  });

  constructor(
    private _title: Title,
    private _header_service: HeaderService,
    private _regex_service: RegexService,
    public sidebar: SidebarComponent
  ) {}

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
