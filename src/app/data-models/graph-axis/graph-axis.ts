import * as d3 from 'd3';
import moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface GraphAxisXOption {
  type?: 'timeseries' | 'indexed';
  min?: number | string;
  max?: number | string;
  tick?: {
    count?: number;
    format?: (x: any) => string | number;
  };
  label?: {
    text?: string;
    position?: 'inner-right' | 'inner-center' | 'inner-left' | 'outer-right' | 'outer-center' | 'outer-left';
  };
}

export interface GraphAxisYOption {
  type?: 'timeseries' | 'linear';
  min?: number | string;
  max?: number | string;
  tick?: {
    count?: number;
    format?: (x: any) => string | number;
  };
  label?: {
    text?: string;
    position?: 'inner-top' | 'inner-middle' | 'inner-bottom' | 'outer-top' | 'outer-middle' | 'outer-bottom';
  };
}

export class GraphAxis {
  x: GraphAxisXOption;
  y: GraphAxisYOption;

  constructor(x: GraphAxisXOption, y: GraphAxisYOption) {
    this.x = x;
    this.x.type = x.type ? x.type : 'indexed';
    this.x.tick = x.tick ? x.tick : {};
    this.x.label = x.label ? x.label : {};
    this.x.label.position = x.label.position ? x.label.position : 'inner-right';

    this.y = y;
    this.y.type = y.type ? y.type : 'linear';
    this.y.tick = y.tick ? y.tick : {};
    this.y.label = y.label ? y.label : {};
    this.y.label.position = y.label.position ? y.label.position : 'inner-top';
  }

  getXAxis(
    domain: (Date | number | { valueOf(): number })[],
    graph_width: number
  ): d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain> {
    let x: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
    if (this.x.type === 'timeseries') {
      x = d3.scaleTime().range([0, graph_width]);
    } else if (this.x.type === 'indexed') {
      x = d3.scaleLinear().range([0, graph_width]);
    }

    x.domain(this.getXAxisDomain(domain));
    return x;
  }

  getXAxisDomain(domain: (Date | number | { valueOf(): number })[]): (Date | number | { valueOf(): number })[] {
    if (this.x.min !== undefined || this.x.min !== undefined) {
      const computed_domain: (Date | number | { valueOf(): number })[] = [undefined, undefined];
      if (this.x.min !== undefined) {
        if (this.x.type === 'timeseries') {
          computed_domain[0] = moment(this.x.min, 'YYYY-MM-DD').toDate();
        } else {
          computed_domain[0] = domain[0];
        }
      }
      if (this.x.max !== undefined) {
        if (this.x.type === 'timeseries') {
          computed_domain[1] = moment(this.x.max, 'YYYY-MM-DD').toDate();
        } else {
          computed_domain[1] = domain[1];
        }
      }
      return computed_domain;
    } else {
      return domain;
    }
  }

  getYAxis(
    domain: (Date | number | { valueOf(): number })[],
    graph_height: number
  ): d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain> {
    let y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
    if (this.y.type === 'timeseries') {
      y = d3.scaleTime().range([graph_height, 0]);
    } else if (this.y.type === 'linear') {
      y = d3.scaleLinear().range([graph_height, 0]);
    }

    if (this.y.min !== undefined || this.y.min !== undefined) {
      if (this.y.type === 'timeseries') {
        y.domain([moment(this.y.min, 'YYYY-MM-DD').toDate(), moment(this.y.max, 'YYYY-MM-DD').toDate()]);
      } else if (this.y.type === 'linear') {
        y.domain([this.y.min as number, this.y.max as number]);
      }
    } else {
      if (this.y.type === 'timeseries') {
        y.domain(domain);
      } else if (this.y.type === 'linear') {
        y.domain(domain);
      }
    }
    return y;
  }
}
