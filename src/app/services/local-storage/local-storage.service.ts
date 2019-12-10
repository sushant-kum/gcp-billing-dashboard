import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _lsname = {
    user_id: '__billing_dashboard.localstorage.user_id',
    username: '__billing_dashboard.localstorage.username',
    token: '__billing_dashboard.localstorage.token',
    app_permissions: '__billing_dashboard.localstorage.app_permissions'
  };

  constructor() {}

  get lsname() {
    return this._lsname;
  }

  set(lsname: string, lsvalue: string) {
    localStorage.setItem(lsname, lsvalue);
  }

  get(lsname: string): string {
    return localStorage.getItem(lsname);
  }

  exists(lsname: string) {
    const lsvalue = this.get(lsname);
    if (lsvalue != null) {
      return true;
    } else {
      return false;
    }
  }

  delete(lsname: string) {
    localStorage.removeItem(lsname);
  }

  deleteMulti(lsnames: string[]) {
    for (const lsname of lsnames) {
      if (this.exists(lsname)) {
        this.delete(lsname);
      }
    }
  }

  deleteAll() {
    localStorage.clear();
  }
}
