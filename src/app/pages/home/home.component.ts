import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

/* Component Imports */
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

/* Services Imports */
import { CookieService } from 'src/app/services/cookie/cookie.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { HeaderService } from 'src/app/services/header/header.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

/* Interfaces Imports */
// import { PageMap } from 'src/app/interfaces/page-map';

const PAGE_ID = 'home';

interface Mode {
  password_visible: boolean;
  logging_in: boolean;
}

interface PageMapWithHover {
  path: string;
  identifier: string;
  name: string;
  short_name: string;
  img_icon_theme: string;
  img_icon_white: string;
  fas_icon: string;
  hovered: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private _page_id = PAGE_ID;
  config: Config = new Config();

  mode: Mode = {
    password_visible: false,
    logging_in: false
  };

  bookmarked_apps: PageMapWithHover[] = [];
  my_apps: PageMapWithHover[] = [];
  constructor(
    private _title: Title,
    private _toast: MatSnackBar,
    private _header_service: HeaderService,
    private _localstorage_service: LocalStorageService,
    private _cookie_service: CookieService,
    public sidebar: SidebarComponent
  ) {}

  ngOnInit() {
    this._title.setTitle(this.config.page_map[this._page_id].name + ' - ' + this.config.app_title);
    this._header_service.changePageInfo(
      this.config.page_map[this._page_id].identifier,
      this.config.page_map[this._page_id].name,
      this.config.page_map[this._page_id].fas_icon
    );

    this.sidebar.activate();
    this.sidebar.colorize(this.config.page_map[this._page_id].identifier);

    const app_permissions = JSON.parse(
      this._localstorage_service.get(this._localstorage_service.lsname.app_permissions)
    );

    for (const page of this.config.pages) {
      for (const app of app_permissions) {
        if (app.app === page) {
          const temp_app = this.config.page_map[app.app];
          temp_app.hovered = false;
          this.my_apps.push(temp_app);
          break;
        }
      }
    }

    try {
      const bookmarked_apps_identifier_arr = JSON.parse(
        this._cookie_service.get(this._cookie_service.cname.bookmarked_apps)
      )
        ? JSON.parse(this._cookie_service.get(this._cookie_service.cname.bookmarked_apps))
        : [];
      for (const bookmarked_apps_identifier of bookmarked_apps_identifier_arr) {
        for (const my_app of this.my_apps) {
          if (bookmarked_apps_identifier === my_app.identifier) {
            this.bookmarked_apps.push(my_app);
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);
      this.bookmarked_apps = [];
    }
  }

  onCardMouseOver(index: number) {
    this.bookmarked_apps[index].hovered = true;
  }

  onCardMouseOut(index: number) {
    this.bookmarked_apps[index].hovered = false;
  }

  toggleBookmarkApp(index: number, event: Event) {
    event.stopPropagation();
    if (this.bookmarked_apps.indexOf(this.my_apps[index]) < 0) {
      this.bookmarked_apps.push(this.my_apps[index]);
    } else {
      this.bookmarked_apps.splice(this.bookmarked_apps.indexOf(this.my_apps[index]), 1);
    }

    const bookmarked_apps_identifier_arr: string[] = [];
    for (const bookmarked_app of this.bookmarked_apps) {
      bookmarked_apps_identifier_arr.push(bookmarked_app.identifier);
    }
    if (bookmarked_apps_identifier_arr.length >= 1) {
      this._cookie_service.set(
        this._cookie_service.cname.bookmarked_apps,
        JSON.stringify(bookmarked_apps_identifier_arr),
        15
      );
    } else {
      this._cookie_service.delete(this._cookie_service.cname.bookmarked_apps);
    }
  }

  showToast(message: string, action: string, duration: number = null, is_error: boolean = true) {
    const toast_config: any = {
      horizontalPosition: 'end'
    };
    if (duration !== null) {
      toast_config.duration = duration;
    }
    if (is_error) {
      toast_config.panelClass = 'toast-error';
    }

    this._toast.open(message, action, toast_config);
  }

  stringify(obj: object) {
    return JSON.stringify(obj, null, 4);
  }
}
