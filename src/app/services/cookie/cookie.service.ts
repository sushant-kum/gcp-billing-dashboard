import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private _cname = {
    sidebar_collapsed: '__liquipack_workflow.cookie.sidebar_collapsed',
    bookmarked_apps: '__liquipack_workflow.cookie.bookmarked_apps'
  };

  constructor() {}

  get cname() {
    return this._cname;
  }

  set(cname: string, cvalue: string, expdays: number = 1) {
    const d = new Date();
    d.setTime(d.getTime() + expdays * 24 * 60 * 60 * 1000);
    document.cookie = cname + '=' + cvalue + '; expires=' + d.toUTCString() + '; path=/;';
  }

  get(cname: string) {
    const name = cname + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  exists(cname: string) {
    const cvalue = this.get(cname);
    if (cvalue != null) {
      return true;
    } else {
      return false;
    }
  }

  delete(cname: string) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  deleteMulti(cnames: string[]) {
    for (const cname of cnames) {
      if (this.exists(cname)) {
        this.delete(cname);
      }
    }
  }

  deleteAll() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie;
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }
}
