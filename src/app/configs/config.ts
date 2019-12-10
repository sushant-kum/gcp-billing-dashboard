export class Config {
  private _app_title = 'Billing Dashboard';
  private _api_base_path = '/api';
  private _app_base_path = '';
  private _pages = ['login', 'home'];
  private _page_map = {
    login: {
      path: this._app_base_path + '/login',
      identifier: 'login',
      name: 'Login',
      short_name: 'Login',
      img_icon_theme: null,
      img_icon_white: null,
      fas_icon: 'unlock-alt',
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
      fas_icon: 'home',
      is_subpage: false,
      parent_page: null
    }
  };
  private _global_apps = [
    {
      identifier: 'home',
      app: this._page_map.home,
      permissions: ['read', 'write']
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
