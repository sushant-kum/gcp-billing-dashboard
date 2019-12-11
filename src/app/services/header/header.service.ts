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
    fa_icon: ['fas', 'circle-notch']
  });
  current_page_info = this._page_info.asObservable();

  constructor() {}

  changePageInfo(id: string, name: string, fa_icon: string[]) {
    this._page_info.next({
      id,
      name,
      fa_icon
    });
  }
}
