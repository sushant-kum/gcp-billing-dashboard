export class Config {
  private _app_title = 'Billing Dashboard';
  private _api_base_path = '/api';
  private _app_base_path = '';
  private _pages = ['login', 'home', 'server-costs', 'server-costs-reports'];
  private _page_map = {
    login: {
      path: this._app_base_path + '/login',
      identifier: 'login',
      name: 'Login',
      short_name: 'Login',
      img_icon_theme: null,
      img_icon_white: null,
      fa_icon: ['fas', 'unlock-alt'],
      is_subpage: false,
      parent_page: null
    },
    home: {
      path: this._app_base_path + '/home',
      identifier: 'home',
      name: 'Home',
      short_name: 'Home',
      img_icon_theme: 'assets/images/icons/apps/icon_home_theme.svg',
      img_icon_white: 'assets/images/icons/apps/icon_home_white.svg',
      fa_icon: ['fas', 'home'],
      is_subpage: false,
      parent_page: null
    },
    'server-costs': {
      path: this._app_base_path + '/server-costs',
      identifier: 'server-costs',
      name: 'Server Costs',
      short_name: 'Server Costs',
      img_icon_theme: 'assets/images/icons/apps/icon_server-costs_theme.svg',
      img_icon_white: 'assets/images/icons/apps/icon_server-costs_white.svg',
      fa_icon: ['fas', 'server'],
      is_subpage: false,
      parent_page: null
    },
    'server-costs-reports': {
      path: this._app_base_path + '/server-costs/reports',
      identifier: 'server-costs-reports',
      name: 'Reports - Server Costs',
      short_name: 'Reports',
      img_icon_theme: 'assets/images/icons/apps/icon_server-costs-report_theme.svg',
      img_icon_white: 'assets/images/icons/apps/icon_server-costs-report_white.svg',
      fa_icon: ['fas', 'chart-line'],
      is_subpage: true,
      parent_page: 'server-costs'
    }
  };
  private _global_apps = [
    {
      identifier: 'home',
      app: this._page_map.home,
      permissions: ['read', 'write']
    },
    {
      identifier: 'server-costs',
      app: this._page_map['server-costs'],
      permissions: ['read']
    },
    {
      identifier: 'server-costs-reports',
      app: this._page_map['server-costs-reports'],
      permissions: ['read']
    }
  ];

  private _default_app_path = this._app_base_path + '/home';

  get app_title() {
    return this._app_title;
  }

  get api_base_path() {
    return this._api_base_path;
  }

  get app_base_path() {
    return this._app_base_path;
  }

  get pages() {
    return this._pages;
  }

  get page_map() {
    return this._page_map;
  }

  get default_app_path() {
    return this._default_app_path;
  }

  get global_apps() {
    return this._global_apps;
  }
}
