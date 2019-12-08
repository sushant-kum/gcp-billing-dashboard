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

const COLOR_LEVEL_SUFFIXES = [
  '-50',
  '-100',
  '-200',
  '-300',
  '-400',
  '-500',
  '-600',
  '-700',
  '-800',
  '-900',
  '-A100',
  '-A200',
  '-A400',
  '-A700'
];
@Component({
  selector: 'app-palette-ng-material',
  templateUrl: './palette-ng-material.component.html',
  styleUrls: ['./palette-ng-material.component.scss']
})
export class PaletteNgMaterialComponent implements OnInit, AfterViewChecked {
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
    this._title.setTitle('Angular Material Palette - Developers Page - ' + this.config.app_title);
    this._header_service.changePageInfo('palette-ng-material', 'Angular Material Palette', 'layer-group');

    for (const color_suffix of COLOR_LEVEL_SUFFIXES) {
      for (const palette of this.palettes) {
        if (!(palette.id === 'accent' && color_suffix.includes('A'))) {
          this.color_levels[palette.id].push({
            suffix: color_suffix,
            color_hex: '',
            css_classes: `.ng-mat-palette-${palette.id}${color_suffix}`
          });
        }
      }
    }
  }

  ngAfterViewChecked() {
    for (const palette of this.palettes) {
      for (const color_level of this.color_levels[palette.id]) {
        const ele: HTMLElement = document.querySelectorAll(
          `.color-swatch.ng-mat-palette-${palette.id}${color_level.suffix}`
        )[0] as HTMLElement;
        color_level.color_hex = rgbHex(getComputedStyle(ele).getPropertyValue('background-color')).toUpperCase();
      }
    }
  }
}
