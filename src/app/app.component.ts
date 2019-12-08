import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from './configs/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  config: Config = new Config();

  constructor(private _title: Title) {
    this._title.setTitle(this.config.app_title);
  }
}
