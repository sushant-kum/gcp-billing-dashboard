import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/configs/config';

import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  config: Config = new Config();
  version_info = env.version_info;

  current_year: number = new Date().getFullYear();

  constructor() {}

  ngOnInit() {}
}
