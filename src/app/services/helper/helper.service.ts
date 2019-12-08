import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as equal from 'fast-deep-equal';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor() {}
  time = {
    format(date: moment.Moment | Date, format: string): string {
      return moment(date).format(format);
    }
  };

  json = {
    stringify(obj: object): string {
      return JSON.stringify(obj);
    }
  };

  object = {
    Keys(obj: object): string[] {
      return Object.keys(obj);
    },
    copy: {
      deep(obj: object): object {
        try {
          return JSON.parse(JSON.stringify(obj));
        } catch (err) {
          return err;
        }
      },
      shallow(obj: object): object {
        return Object.assign(obj, {});
      }
    },
    isEqual: (obj1: any, obj2: any): boolean => {
      return equal(obj1, obj2);
    }
  };

  console = {
    log(...args: any[]): string {
      console.log(args);
      return `console.logged ${args}`;
    }
  };

  array = {
    num_list(end: number, start: number = 0, jump: number = 1): number[] {
      const list: number[] = [];
      for (let i = start; i < end; i += jump) {
        list.push(i);
      }
      return list;
    }
  };

  variable = {
    typeof: (variable: any): string => {
      return typeof variable;
    },
    isNaN: (variable: any): boolean => {
      return isNaN(variable);
    }
  };
}
