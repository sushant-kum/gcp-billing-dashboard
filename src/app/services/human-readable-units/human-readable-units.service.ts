import { Injectable } from '@angular/core';
import * as humanFormat from 'human-format';

import { UnitsStorage, UnitsTime, UnitsStorageTime } from 'src/app/data-models/units.enum';

@Injectable({
  providedIn: 'root'
})
export class HumanReadableUnitsService {
  private _scales = {
    storage: new humanFormat.Scale({
      bytes: 1,
      kilobytes: 1024,
      megabytes: 1024 * 1024,
      gigabytes: 1024 * 1024 * 1024
    }),
    time: new humanFormat.Scale({
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
      months: 2592000
    })
  };

  constructor() {
    this._scales['storage-time'] = new humanFormat.Scale({
      'byte-seconds': this._scales.storage.byte * this._scales.time.seconds,
      'kilobyte-seconds': this._scales.storage.kilobytes * this._scales.time.seconds,
      'megabyte-seconds': this._scales.storage.megabytes * this._scales.time.seconds,
      'gigabyte-seconds': this._scales.storage.gigabytes * this._scales.time.seconds,
      'byte-minutes': this._scales.storage.byte * this._scales.time.minutes,
      'kilobyte-minutes': this._scales.storage.kilobytes * this._scales.time.minutes,
      'megabyte-minutes': this._scales.storage.megabytes * this._scales.time.minutes,
      'gigabyte-minutes': this._scales.storage.gigabytes * this._scales.time.minutes,
      'byte-hours': this._scales.storage.byte * this._scales.time.hours,
      'kilobyte-hours': this._scales.storage.kilobytes * this._scales.time.hours,
      'megabyte-hours': this._scales.storage.megabytes * this._scales.time.hours,
      'gigabyte-hours': this._scales.storage.gigabytes * this._scales.time.hours,
      'byte-days': this._scales.storage.byte * this._scales.time.days,
      'kilobyte-days': this._scales.storage.kilobytes * this._scales.time.days,
      'megabyte-days': this._scales.storage.megabytes * this._scales.time.days,
      'gigabyte-days': this._scales.storage.gigabytes * this._scales.time.days,
      'byte-months': this._scales.storage.byte * this._scales.time.months,
      'kilobyte-months': this._scales.storage.kilobytes * this._scales.time.months,
      'megabyte-months': this._scales.storage.megabytes * this._scales.time.months,
      'gigabyte-months': this._scales.storage.gigabytes * this._scales.time.months
    });
  }

  storage(value: number, unit: UnitsStorage): string {
    const base_value = this.parse(value, unit);
    if (typeof base_value === 'number') {
      return humanFormat(value, { scale: this._scales.storage });
    }
    throw new Error(`${base_value} is not a number`);
  }

  time(value: number, unit: UnitsTime): string {
    const base_value = this.parse(value, unit);
    if (typeof base_value === 'number') {
      return humanFormat(value, { scale: this._scales.time });
    }
    throw new Error(`${base_value} is not a number`);
  }

  storage_time(value: number, unit: UnitsStorageTime): string {
    const base_value = this.parse(value, unit);
    if (typeof base_value === 'number') {
      return humanFormat(value, { scale: this._scales['storage-time'] });
    }
    throw new Error(`${base_value} is not a number`);
  }

  format(value: number, unit: UnitsStorage | UnitsTime | UnitsStorageTime): string {
    if (Object.keys(UnitsStorage).includes(unit.toString())) {
      return this.storage(value, unit as UnitsStorage);
    } else if (Object.keys(UnitsTime).includes(unit.toString())) {
      return this.time(value, unit as UnitsTime);
    } else if (Object.keys(UnitsStorageTime).includes(unit.toString())) {
      return this.storage_time(value, unit as UnitsStorageTime);
    }
    throw new Error('unit must be of type UnitsStorage | UnitsTime | UnitsStorageTime');
  }

  parse(value: number, unit: UnitsStorage | UnitsTime | UnitsStorageTime): number {
    if (Object.keys(UnitsStorage).includes(unit.toString())) {
      return value / this._scales.storage[unit];
    } else if (Object.keys(UnitsTime).includes(unit.toString())) {
      return value / this._scales.time[unit];
    } else if (Object.keys(UnitsStorageTime).includes(unit.toString())) {
      return value / this._scales['storage-time'][unit];
    }
    throw new Error('unit must be of type UnitsStorage | UnitsTime | UnitsStorageTime');
  }
}
