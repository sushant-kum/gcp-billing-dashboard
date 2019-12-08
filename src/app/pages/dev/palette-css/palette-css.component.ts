import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Title } from '@angular/platform-browser';

import rgbHex from 'rgb-hex';

/* Services Imports */
import { HeaderService } from 'src/app/services/header/header.service';
import { HelperService } from 'src/app/services/helper/helper.service';

/* Config Imports */
import { Config } from 'src/app/configs/config';

interface ColorLevel {
  suffix: string;
  color_hex: string;
  css_classes: string;
}

const COLOR_LEVEL_SUFFIXES = ['-l5', '-l4', '-l3', '-l2', '-l1', '', '-d1', '-d2', '-d3', '-d4'];

@Component({
  selector: 'app-palette-css',
  templateUrl: './palette-css.component.html',
  styleUrls: ['./palette-css.component.scss']
})
export class PaletteCssComponent implements OnInit, AfterViewChecked {
  config: Config = new Config();

  readonly palettes = [
    { id: 'primary', name: 'Primary' },
    { id: 'accent', name: 'Accent' },
    { id: 'warn', name: 'Warn' }
  ];
  readonly color_levels: {
    primary: ColorLevel[];
    accent: ColorLevel[];
    warn: ColorLevel[];
  } = {
    primary: [],
    accent: [],
    warn: []
  };

  constructor(public helper_service: HelperService, private _title: Title, private _header_service: HeaderService) {}

  ngOnInit() {
    this._title.setTitle('App Palette - Developers Page - ' + this.config.app_title);
    this._header_service.changePageInfo('palette-app', 'App Palette', 'swatchbook');

    for (const color_suffix of COLOR_LEVEL_SUFFIXES) {
      for (const palette of this.palettes) {
        let css_class = `.app-theme-${palette.id}${color_suffix}`;
        if (COLOR_LEVEL_SUFFIXES.indexOf(color_suffix) === 0) {
          css_class += `, .app-theme-${palette.id}-light`;
        }
        if (COLOR_LEVEL_SUFFIXES.indexOf(color_suffix) === COLOR_LEVEL_SUFFIXES.length - 1) {
          css_class += `, .app-theme-${palette.id}-dark, .app-theme-${palette.id}-action`;
        }

        this.color_levels[palette.id].push({
          suffix: color_suffix,
          color_hex: '',
          css_classes: css_class
        });
      }
    }
  }

  ngAfterViewChecked() {
    for (const palette of this.palettes) {
      for (const color_level of this.color_levels[palette.id]) {
        const ele: HTMLElement = document.querySelectorAll(
          `.color-swatch.app-theme-${palette.id}${color_level.suffix}`
        )[0] as HTMLElement;
        color_level.color_hex = rgbHex(getComputedStyle(ele).getPropertyValue('background-color')).toUpperCase();
      }
    }
  }
}
