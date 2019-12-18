import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { HelperService } from 'src/app/services/helper/helper.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

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
    duration_start: new FormControl(moment().date(1), [this._validator_service.moment('DD MMM, YYYY')]),
    duration_end: new FormControl(moment().date(moment().daysInMonth()), [
      this._validator_service.moment('DD MMM, YYYY')
    ]),
    group_by: new FormControl('product', [Validators.required])
  });

  constructor(
    private _title: Title,
    private _header_service: HeaderService,
    private _validator_service: ValidatorService,
    public helper_service: HelperService,
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

    this.form_filters.get('duration').valueChanges.subscribe(() => {
      this.fetchTrendsData();
    });
    this.form_filters.get('duration_start').valueChanges.subscribe(() => {
      this.fetchTrendsData();
    });
    this.form_filters.get('duration_end').valueChanges.subscribe(() => {
      this.fetchTrendsData();
    });
    this.form_filters.get('group_by').valueChanges.subscribe(() => {
      this.fetchTrendsData();
    });
  }

  fetchTrendsData(): void {
    switch (this.form_filters.get('duration').value) {
      case 'current_month':
        this.form_filters.get('duration_start').setValue(moment().date(1));
        this.form_filters.get('duration_end').setValue(moment().date(moment().daysInMonth()));
        break;
      case 'last_month':
        this.form_filters.get('duration_start').setValue(
          moment()
            .subtract(1, 'month')
            .date(1)
        );
        this.form_filters.get('duration_end').setValue(
          moment()
            .subtract(1, 'month')
            .date(
              moment()
                .subtract(1, 'month')
                .daysInMonth()
            )
        );
        break;
      case 'last_30_days':
        this.form_filters.get('duration_start').setValue(moment().subtract(30, 'days'));
        this.form_filters.get('duration_end').setValue(moment());
        break;
      case 'last_90_days':
        this.form_filters.get('duration_start').setValue(moment().subtract(90, 'days'));
        this.form_filters.get('duration_end').setValue(moment());
        break;
      case 'year_to_date':
        this.form_filters.get('duration_start').setValue(
          moment()
            .month(0)
            .date(1)
        );
        this.form_filters.get('duration_end').setValue(moment());
        break;
    }
  }
}
