import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PageInfo } from 'src/app/interfaces/page-info';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _page_info: BehaviorSubject<PageInfo> = new BehaviorSubject({
    id: '',
    name: 'Loading App',
    fas_icon: 'circle-notch'
  });
  current_page_info = this._page_info.asObservable();

  constructor() {}

  changePageInfo(id: string, name: string, fas_icon: any) {
    this._page_info.next({
      id,
      name,
      fas_icon
    });
  }
}
