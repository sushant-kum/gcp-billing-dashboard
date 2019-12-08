import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';
import { FormControl } from '@angular/forms';

const PAGE_ID = 'home';

interface Page {
  name: string;
  value: string;
  path: string;
  fas_icon: string;
}

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {
  private _page_id = PAGE_ID;
  config: Config = new Config();

  pages: Page[] = [];
  page_ctrl = new FormControl(null);
  filtered_pages: Observable<Page[]>;

  constructor(
    private _title: Title,
    private _header_service: HeaderService,
    private _sidebar: SidebarComponent,
    private _router: Router
  ) {}

  ngOnInit() {
    this._title.setTitle('Error 404 - ' + this.config.app_title);
    this._header_service.changePageInfo('error404', 'Error 404', 'exclamation-circle');

    this._sidebar.activate();
    this._sidebar.colorize();

    for (const page of this.config.pages) {
      if (page !== 'login') {
        this.pages.push({
          name: this.config.page_map[page].short_name,
          value: this.config.page_map[page].identifier,
          path: this.config.page_map[page].path,
          fas_icon: this.config.page_map[page].fas_icon
        });
      }
    }

    this.filtered_pages = this.page_ctrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Page[] {
    const filter_value = value.toLowerCase();
    return this.pages.filter((option: Page) => {
      return option.value.toLowerCase().indexOf(filter_value) >= 0;
    });
  }

  goToPage(): void {
    for (const page of this.pages) {
      if (this.page_ctrl.value === page.name) {
        this._router.navigate([page.path]);
      }
    }
  }

  goBack(): void {
    window.history.back();
  }
}
