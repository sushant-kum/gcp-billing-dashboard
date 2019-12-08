import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { HelperService } from 'src/app/services/helper/helper.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

interface FontSize {
  tag: string;
  ex_inner_html: string;
}

interface FontWeight {
  name: 'thin' | 'extra-light' | 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold' | 'extra-bold' | 'black';
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

const FONT_WEIGHTS: { [key: string]: FontWeight } = {
  thin: {
    name: 'thin',
    weight: 100
  },
  'extra-light': {
    name: 'extra-light',
    weight: 200
  },
  light: {
    name: 'light',
    weight: 300
  },
  regular: {
    name: 'regular',
    weight: 400
  },
  medium: {
    name: 'medium',
    weight: 500
  },
  'semi-bold': {
    name: 'semi-bold',
    weight: 600
  },
  bold: {
    name: 'bold',
    weight: 700
  },
  'extra-bold': {
    name: 'extra-bold',
    weight: 800
  },
  black: {
    name: 'black',
    weight: 900
  }
};

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent implements OnInit {
  config: Config = new Config();
  readonly test_str =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890 ‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*';

  font_size_tags: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'];
  font_size_list: FontSize[] = [];

  font_weights: {
    roboto: FontWeight[];
    raleway: FontWeight[];
  } = {
    roboto: [
      FONT_WEIGHTS.thin,
      FONT_WEIGHTS.light,
      FONT_WEIGHTS.regular,
      FONT_WEIGHTS.medium,
      FONT_WEIGHTS.bold,
      FONT_WEIGHTS.black
    ],
    raleway: [
      FONT_WEIGHTS.thin,
      FONT_WEIGHTS['extra-light'],
      FONT_WEIGHTS.light,
      FONT_WEIGHTS.regular,
      FONT_WEIGHTS.medium,
      FONT_WEIGHTS['semi-bold'],
      FONT_WEIGHTS.bold,
      FONT_WEIGHTS['extra-bold'],
      FONT_WEIGHTS.black
    ]
  };

  constructor(public helper_service: HelperService, private _title: Title, private _header_service: HeaderService) {}

  ngOnInit() {
    this._title.setTitle('Typography - Developers Page - ' + this.config.app_title);
    this._header_service.changePageInfo('typography', 'Typography', 'font');

    for (const tag of this.font_size_tags) {
      this.font_size_list.push({
        tag,
        ex_inner_html: `<${tag}>${this.test_str}</${tag}>`
      });
    }
  }
}
