import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import moment from 'moment';
import * as uniqueColors from 'unique-colors';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { HttpTransactionsService } from 'src/app/services/http-transactions/http-transactions.service';
import { HumanReadableUnitsService } from 'src/app/services/human-readable-units/human-readable-units.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';
import { ApiResponse } from 'src/app/interfaces/api-response';

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

interface EntryDataRow {
  graph_color_hex?: string;
  product: string;
  sub_product?: string;
  cost: {
    amount: number;
    currency: string;
  };
  usage?: {
    amount: number;
    unit: string;
  };
}

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
  @ViewChild('tableProduct', { static: false }) tableProduct: MatTable<Element>;
  @ViewChild('tableSubProduct', { static: false }) tableSubProduct: MatTable<Element>;

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

  form_values: {
    duration_start: moment.Moment;
    duration_end: moment.Moment;
    group_by: 'product' | 'sub_product' | 'no_grouping';
  } = {
    duration_start: null,
    duration_end: null,
    group_by: null
  };

  kpi_data: KPIData = {
    currency: null,
    current_duration_cost: null,
    previous_duration_cost: null,
    change_percentage: null
  };

  trends_data = null;
  entries_data: EntryDataRow[] = null;

  entries_columns = {
    product: ['graph_color_hex', 'product', 'cost'],
    sub_product: ['graph_color_hex', 'sub_product', 'product', 'usage', 'cost']
  };

  constructor(
    private _title: Title,
    private _header_service: HeaderService,
    private _validator_service: ValidatorService,
    private _http_service: HttpTransactionsService,
    public human_readable_units_service: HumanReadableUnitsService,
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
        this.form_values.duration_start = moment(this.form_filters.get('duration_start').value);
        this.form_values.duration_end = moment(this.form_filters.get('duration_end').value);
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
        this.form_values.duration_start = moment(this.form_filters.get('duration_start').value);
        this.form_values.duration_end = moment(this.form_filters.get('duration_end').value);
        break;
      case 'last_30_days':
        this.form_filters.get('duration_start').setValue(moment().subtract(30, 'days'));
        this.form_filters.get('duration_end').setValue(moment());
        this.form_values.duration_start = moment(this.form_filters.get('duration_start').value);
        this.form_values.duration_end = moment(this.form_filters.get('duration_end').value);
        break;
      case 'last_90_days':
        this.form_filters.get('duration_start').setValue(moment().subtract(90, 'days'));
        this.form_filters.get('duration_end').setValue(moment());
        this.form_values.duration_start = moment(this.form_filters.get('duration_start').value);
        this.form_values.duration_end = moment(this.form_filters.get('duration_end').value);
        break;
      case 'year_to_date':
        this.form_filters.get('duration_start').setValue(
          moment()
            .month(0)
            .date(1)
        );
        this.form_filters.get('duration_end').setValue(moment());
        this.form_values.duration_start = moment(this.form_filters.get('duration_start').value);
        this.form_values.duration_end = moment(this.form_filters.get('duration_end').value);
        break;
    }

    this.form_values.group_by = this.form_filters.get('group_by').value;

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
        this.form_values.duration_start.format('YYYY-MM-DD'),
        this.form_values.duration_end.format('YYYY-MM-DD')
      )
      .subscribe(
        (res: ApiResponse) => {
          this.trends_data = [{}];
          this.entries_data = [];

          if (this.form_values.group_by === 'product') {
            for (const res_row of res.data) {
              let flag_row_identifier_found = false;
              for (const entry_data_row of this.entries_data) {
                if (entry_data_row.product === res_row.service_description) {
                  entry_data_row.cost.amount += res_row.cost_sum;
                  flag_row_identifier_found = true;
                  break;
                }
              }
              if (!flag_row_identifier_found) {
                this.entries_data.push({
                  product: res_row.service_description,
                  cost: {
                    amount: res_row.cost_sum,
                    currency: res_row.currency
                  }
                });
              }
            }
          } else if (this.form_values.group_by === 'sub_product') {
            for (const res_row of res.data) {
              let flag_row_identifier_found = false;
              for (const entry_data_row of this.entries_data) {
                if (entry_data_row.sub_product === res_row.sku_description) {
                  entry_data_row.usage.amount += res_row.usage_amount;
                  entry_data_row.cost.amount += res_row.cost_sum;
                  flag_row_identifier_found = true;
                  break;
                }
              }
              if (!flag_row_identifier_found) {
                this.entries_data.push({
                  sub_product: res_row.sku_description,
                  product: res_row.service_description,
                  usage: {
                    amount: res_row.usage_amount,
                    unit: res_row.usage_unit
                  },
                  cost: {
                    amount: res_row.cost_sum,
                    currency: res_row.currency
                  }
                });
              }
            }
          } else {
            this.entries_data.push({
              product: 'Total Cost',
              cost: {
                amount: 0,
                currency: res.data[0].currency
              }
            });

            for (const res_row of res.data) {
              this.entries_data[0].cost.amount += res_row.cost_sum;
            }
          }

          this.entries_data.sort((a: EntryDataRow, b: EntryDataRow): number => {
            if (a.cost.amount > b.cost.amount) {
              return -1;
            } else if (a.cost.amount < b.cost.amount) {
              return 1;
            }
            return 0;
          });

          const colors = uniqueColors.unique_colors(this.entries_data.length);

          for (const entry_data_row of this.entries_data) {
            entry_data_row.graph_color_hex = colors[this.entries_data.indexOf(entry_data_row)];
          }

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
        this.form_values.duration_start.format('YYYY-MM-DD'),
        this.form_values.duration_end.format('YYYY-MM-DD')
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
              moment(this.form_values.duration_start)
                .subtract(this.form_values.duration_end.diff(this.form_values.duration_start, 'days') + 1, 'days')
                .format('YYYY-MM-DD'),
              moment(this.form_values.duration_start)
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

  sortEntriesTableHandler(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.sortEntriesData('cost', 'desc');
    } else {
      this.sortEntriesData(sort.active, sort.direction);
    }

    switch (this.form_values.group_by) {
      case 'product':
        this.tableProduct.renderRows();
        break;
      case 'sub_product':
        this.tableSubProduct.renderRows();
        break;
      case 'no_grouping':
        break;
      default:
        this.tableProduct.renderRows();
        break;
    }
  }

  sortEntriesData(field: string, order: 'asc' | 'desc'): void {
    switch (field) {
      case 'product':
        this.entries_data.sort((a: EntryDataRow, b: EntryDataRow): number => {
          if (a.product > b.product) {
            return order === 'asc' ? 1 : -1;
          } else if (a.product < b.product) {
            return order === 'asc' ? -1 : 1;
          }
          return 0;
        });
        break;
      case 'sub_product':
        this.entries_data.sort((a: EntryDataRow, b: EntryDataRow): number => {
          if (a.sub_product > b.sub_product) {
            return order === 'asc' ? 1 : -1;
          } else if (a.sub_product < b.sub_product) {
            return order === 'asc' ? -1 : 1;
          }
          return 0;
        });
        break;
      case 'usage':
        this.entries_data.sort((a: EntryDataRow, b: EntryDataRow): number => {
          if (a.usage.amount > b.usage.amount) {
            return order === 'asc' ? 1 : -1;
          } else if (a.usage.amount < b.usage.amount) {
            return order === 'asc' ? -1 : 1;
          }
          return 0;
        });
        break;
      case 'cost':
        this.entries_data.sort((a: EntryDataRow, b: EntryDataRow): number => {
          if (a.cost.amount > b.cost.amount) {
            return order === 'asc' ? 1 : -1;
          } else if (a.cost.amount < b.cost.amount) {
            return order === 'asc' ? -1 : 1;
          }
          return 0;
        });
        break;
      default:
        this.sortEntriesData('cost', 'desc');
        break;
    }
  }

  getTotalEntriesCost(): number {
    let total_cost = 0;

    for (const entry_row of this.entries_data) {
      total_cost += entry_row.cost.amount;
    }

    return total_cost;
  }
}
