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
import { HttpTransactionsService } from 'src/app/services/http-transactions/http-transactions.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { HttpErrorResponse } from '@angular/common/http';

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

interface KPIData {
  currency: string;
  current_duration_cost: number;
  previous_duration_cost: number;
  change_percentage: number;
}

// interface GraphData {

// }

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

  kpi_data: KPIData = {
    currency: null,
    current_duration_cost: null,
    previous_duration_cost: null,
    change_percentage: null
  };

  trends_data = null;
  entries_data = null;

  constructor(
    private _title: Title,
    private _header_service: HeaderService,
    private _validator_service: ValidatorService,
    private _http_service: HttpTransactionsService,
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

    this.setFilters();
  }

  setFilters(): void {
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

    this.fetchTrendsData();
  }

  fetchTrendsData(): void {
    this.trends_data = null;
    this.entries_data = null;
    this.kpi_data = {
      currency: null,
      current_duration_cost: null,
      previous_duration_cost: null,
      change_percentage: null
    };

    this._http_service.get_gcp_billing_entries
      .sendRequest(
        this.form_filters.get('duration_start').value.format('YYYY-MM-DD'),
        this.form_filters.get('duration_end').value.format('YYYY-MM-DD')
      )
      .subscribe(
        (res: ApiResponse) => {
          this.trends_data = res.data;
          this.entries_data = res.data;
          this.fetchKPIData();
        },
        (err: HttpErrorResponse) => {
          console.error(err);
        }
      );
  }

  fetchKPIData(): void {
    this.kpi_data = {
      currency: null,
      current_duration_cost: null,
      previous_duration_cost: null,
      change_percentage: null
    };

    this._http_service.get_gcp_billing_entries_cost
      .sendRequest(
        this.form_filters.get('duration_start').value.format('YYYY-MM-DD'),
        this.form_filters.get('duration_end').value.format('YYYY-MM-DD')
      )
      .subscribe(
        (res: ApiResponse) => {
          this.kpi_data.current_duration_cost = 0;
          if (res.data.length > 0) {
            this.kpi_data.currency = res.data[0].currency;
            for (const cost_row of res.data) {
              this.kpi_data.current_duration_cost += cost_row.cost_sum;
            }
            this.kpi_data.current_duration_cost = Number(this.kpi_data.current_duration_cost.toFixed(2));
          }

          this._http_service.get_gcp_billing_entries_cost
            .sendRequest(
              moment(this.form_filters.get('duration_start').value)
                .subtract(
                  this.form_filters
                    .get('duration_end')
                    .value.diff(this.form_filters.get('duration_start').value, 'days') + 1,
                  'days'
                )
                .format('YYYY-MM-DD'),
              moment(this.form_filters.get('duration_start').value)
                .subtract(1, 'day')
                .format('YYYY-MM-DD')
            )
            .subscribe(
              (res_previous: ApiResponse) => {
                this.kpi_data.previous_duration_cost = 0;
                if (res_previous.data.length > 0) {
                  this.kpi_data.currency = res_previous.data[0].currency;
                  for (const cost_row of res_previous.data) {
                    this.kpi_data.previous_duration_cost += cost_row.cost_sum;
                  }
                  this.kpi_data.previous_duration_cost = Number(this.kpi_data.previous_duration_cost.toFixed(2));
                }

                if (this.kpi_data.previous_duration_cost !== 0) {
                  this.kpi_data.change_percentage = Number(
                    (
                      ((this.kpi_data.previous_duration_cost - this.kpi_data.current_duration_cost) /
                        this.kpi_data.previous_duration_cost) *
                      100
                    ).toFixed(2)
                  );
                }
              },
              (err_previous: HttpErrorResponse) => {
                console.error(err_previous);
              }
            );
        },
        (err: HttpErrorResponse) => {
          console.error(err);
        }
      );
  }
}
