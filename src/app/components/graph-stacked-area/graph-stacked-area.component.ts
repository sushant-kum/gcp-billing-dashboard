import { Component, ElementRef, Input, OnChanges, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import moment from 'moment';
import { ResizeSensor } from 'css-element-queries';

import { GraphStackedAreaDataModel } from 'src/app/interfaces/graph-stacked-area-data-model';
import { GraphMargin } from 'src/app/interfaces/graph-margin';
import { GraphAxis } from 'src/app/data-models/graph-axis/graph-axis';

@Component({
  selector: 'graph-stacked-area',
  templateUrl: './graph-stacked-area.component.html',
  styleUrls: ['./graph-stacked-area.component.scss']
})
export class GraphStackedAreaComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chart', { static: true })
  private _chartContainer: ElementRef;

  @Input() data: GraphStackedAreaDataModel[];
  @Input() margin: GraphMargin = { top: 20, right: 20, bottom: 30, left: 40 };
  @Input() height = 350;
  @Input() axis: GraphAxis;

  private _data: GraphStackedAreaDataModel[];
  private _margin: GraphMargin;
  private _height: number;
  private _axis: GraphAxis;

  private _idle_timeout: NodeJS.Timer;
  private _svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _optimized_data: { [key: string]: Date | string | number }[] = [];
  private _keys: string[] = [];
  private _colors: string[] = [];
  private _stacked_data: d3.Series<{ [key: string]: number }, string>[];
  private _x: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
  private _x_axis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
  private _y_axis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _area: d3.Area<[number, number]>;
  private _area_chart: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _brush: d3.BrushBehavior<unknown>;

  constructor() {}

  ngOnInit() {
    console.log('ngOnInit()');
    console.log(' this.data', this.data);
    console.log(' this.margin', this.margin);
    console.log('this.height', this.height);
    console.log('this.axis', this.axis);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit()');
    // tslint:disable-next-line: no-unused-expression
    new ResizeSensor(this._chartContainer.nativeElement, () => {
      this.onResize();
    });

    if (this._data !== undefined && this._data.length > 0) {
      this._createChart(this._data, this._chartContainer.nativeElement, this._margin);
    } else {
      return;
    }
  }

  ngOnChanges() {
    console.log('ngOnChanges()');
    console.log(' this.data', this.data);
    console.log(' this.margin', this.margin);
    console.log('this.height', this.height);
    console.log('this.axis', this.axis);
    this._data = this.data;
    this._margin = this.margin;
    this._height = this.height;
    this._axis = this.axis;

    if (this._data !== undefined && this._data.length > 0 && this._chartContainer.nativeElement.offsetWidth !== 0) {
      this._createChart(this._data, this._chartContainer.nativeElement, this._margin);
    } else {
      return;
    }
  }

  onResize(): void {
    console.log('onResize(): void');
    if (this._data !== undefined && this._data.length > 0) {
      this._createChart(this._data, this._chartContainer.nativeElement, this._margin);
    } else {
      return;
    }
  }

  private _createChart(data: GraphStackedAreaDataModel[], element: HTMLElement, margin: GraphMargin): void {
    const graph_height = this._height - this._margin.top - this._margin.bottom;
    const graph_width = element.offsetWidth - this._margin.left - this._margin.right;

    /**
     * Create base SVG
     */
    d3.select(element)
      .select('svg')
      .remove();

    this._svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', graph_height + this._margin.top + this._margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this._margin.left + ',' + this._margin.top + ')');

    /**
     * Process data
     */
    const sumstat = d3
      .nest()
      .key((d: any) => d.plot.x)
      .entries(data);

    sumstat.forEach(ss => {
      const obj: { [key: string]: Date | string | number } = {
        key: d3.timeParse('%Y-%m-%d')(ss.key)
      };

      ss.values.forEach((value: GraphStackedAreaDataModel) => {
        obj[value.key] = value.plot.y;

        if (!this._keys.includes(value.key)) {
          this._keys.push(value.key);
          this._colors.push(value.color_hex);
        }
      });
      this._optimized_data.push(obj);
    });

    this._keys.forEach(key => {
      for (const row of this._optimized_data) {
        if (row[key] === undefined) {
          row[key] = 0;
        }
      }
    });

    // console.log('this._optimized_data', this._optimized_data);
    // console.log('this._keys', this._keys);
    // console.log('this._colors', this._colors);

    this._stacked_data = d3.stack().keys(this._keys)(this._optimized_data as { [key: string]: number }[]);

    // console.log('this._stacked_data', this._stacked_data);

    /**
     * Axes
     */
    // Add X axis
    if (this._axis.x.type === 'timeseries') {
      this._x = this._axis.getXAxis(
        d3.extent(this._optimized_data, d => d.key as Date),
        graph_width
      );
    } else if (this._axis.x.type === 'indexed') {
      this._x = this._axis.getXAxis(
        d3.extent(this._optimized_data, d => d.key as number),
        graph_width
      );
    }

    this._x_axis = this._svg
      .append('g')
      .attr('class', 'ngx-d3--axis ngx-d3--axis--x')
      .attr('transform', 'translate(0,' + graph_height + ')')
      .call(
        d3
          .axisBottom(this._x)
          .ticks(
            this._axis.x.tick.count !== undefined && typeof this._axis.x.tick.count === 'number'
              ? this._axis.x.tick.count
              : Math.floor(graph_width / 90)
          )
      );

    // Add X axis label:
    if (this._axis.x.label.text) {
      let text_anchor: 'start' | 'middle' | 'end';
      let label_x_position: number;
      let label_y_position: number;
      switch (this._axis.x.label.position) {
        case 'inner-left':
          text_anchor = 'start';
          label_x_position = 0;
          label_y_position = graph_height - 5;
          break;
        case 'inner-center':
          text_anchor = 'middle';
          label_x_position = graph_width / 2;
          label_y_position = graph_height - 5;
          break;
        case 'inner-right':
          text_anchor = 'end';
          label_x_position = graph_width;
          label_y_position = graph_height - 5;
          break;
        case 'outer-left':
          text_anchor = 'start';
          label_x_position = 0;
          label_y_position = graph_height + 27;
          break;
        case 'outer-center':
          text_anchor = 'middle';
          label_x_position = graph_width / 2;
          label_y_position = graph_height + 27;
          break;
        case 'outer-right':
          text_anchor = 'end';
          label_x_position = graph_width;
          label_y_position = graph_height + 27;
          break;
        default:
          break;
      }
      this._svg
        .append('text')
        .attr('class', 'ngx-d3--label ngx-d3--label--x')
        .attr('text-anchor', text_anchor)
        .attr('x', label_x_position)
        .attr('y', label_y_position)
        .text(this._axis.x.label.text);
    }

    // Add Y axis
    if (this._axis.y.type === 'timeseries') {
      this._y = this._axis.getYAxis(this._getYRange('Date'), graph_height);
    } else if (this._axis.y.type === 'linear') {
      this._y = this._axis.getYAxis(this._getYRange('number'), graph_height);
    }

    this._y_axis = this._svg
      .append('g')
      .attr('class', 'ngx-d3--axis ngx-d3--axis--y')
      .call(
        d3
          .axisLeft(this._y)
          .ticks(
            this._axis.y.tick.count !== undefined && typeof this._axis.y.tick.count === 'number'
              ? this._axis.y.tick.count
              : Math.floor(graph_height / 50)
          )
      );

    // Add Y axis label:
    if (this._axis.y.label.text) {
      let label_x_position: number;
      let label_y_position: number;
      let y_label: d3.Selection<SVGTextElement, unknown, null, undefined>;
      switch (this._axis.y.label.position) {
        case 'inner-top':
          label_x_position = 0;
          label_y_position = 0;

          y_label = this._svg
            .append('text')
            .attr('class', 'ngx-d3--label ngx-d3--label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this._axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width).attr('dy', y_label.node().getBBox().height);
          break;

        case 'inner-middle':
          label_x_position = -graph_height / 2;
          label_y_position = 0;

          y_label = this._svg
            .append('text')
            .attr('class', 'ngx-d3--label ngx-d3--label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this._axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width / 2).attr('dy', y_label.node().getBBox().height);
          break;

        case 'inner-bottom':
          label_x_position = -graph_height;
          label_y_position = 0;

          y_label = this._svg
            .append('text')
            .attr('class', 'ngx-d3--label ngx-d3--label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this._axis.y.label.text);
          y_label.attr('dx', 2).attr('dy', y_label.node().getBBox().height);
          break;

        case 'outer-top':
          label_x_position = 0;
          label_y_position = 0;

          y_label = this._svg
            .append('text')
            .attr('class', 'ngx-d3--label ngx-d3--label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this._axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width).attr('dy', -this._y_axis.node().getBBox().width);
          break;

        case 'outer-middle':
          label_x_position = -graph_height / 2;
          label_y_position = 0;

          y_label = this._svg
            .append('text')
            .attr('class', 'ngx-d3--label ngx-d3--label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this._axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width / 2).attr('dy', -this._y_axis.node().getBBox().width);
          break;

        case 'outer-bottom':
          label_x_position = -graph_height;
          label_y_position = 0;

          y_label = this._svg
            .append('text')
            .attr('class', 'ngx-d3--label ngx-d3--label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this._axis.y.label.text);
          y_label.attr('dx', 2).attr('dy', -this._y_axis.node().getBBox().width);
          break;
      }
    }

    /**
     * Brushing and Chart
     */
    this._svg
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', graph_width)
      .attr('height', graph_height)
      .attr('x', 0)
      .attr('y', 0);

    // Create the scatter variable: where both the circles and the brush take place
    this._area_chart = this._svg.append('g').attr('clip-path', 'url(#clip)');

    // Add brushing
    this._brush = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [graph_width, graph_height]
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', this._updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

    // Area generator
    this._area = d3
      .area()
      .x((d: any) => {
        return this._x(d.data.key);
      })
      .y0(d => {
        return this._y(d[0]);
      })
      .y1(d => {
        return this._y(d[1]);
      });

    // Show the areas
    this._area_chart
      .selectAll('ngx-d3--layers')
      .data(this._stacked_data)
      .enter()
      .append('path')
      .attr('class', d => 'ngx-d3--area ' + d.key)
      .style('stroke', d => this._colors[this._keys.indexOf(d.key)])
      .attr('stroke-width', 1)
      .style('fill', d => this._colors[this._keys.indexOf(d.key)])
      .attr('fill-opacity', '0.2')
      .attr('d', this._area as any);

    // Add the brushing
    this._area_chart
      .append('g')
      .attr('class', 'ngx-d3--brush')
      .call(this._brush);
  }

  private _getYRange(type: 'number' | 'Date'): [number, number] | [Date, Date] {
    switch (type) {
      case 'number':
        let min_num: number;
        let max_num: number;

        for (const stack_entry of this._stacked_data) {
          for (const entry of stack_entry) {
            if (min_num === undefined || entry[0] < min_num) {
              min_num = entry[0];
            }
            if (max_num === undefined || entry[1] > max_num) {
              max_num = entry[1];
            }
          }
        }

        return [min_num, max_num];

      case 'Date':
        let min_date: moment.Moment;
        let max_date: moment.Moment;

        for (const stack_entry of this._stacked_data) {
          for (const entry of stack_entry) {
            if (min_date === undefined || moment(entry[0]).isBefore(min_date)) {
              min_date = moment(entry[0]);
            }
            if (max_date === undefined || moment(entry[1]).isAfter(max_date)) {
              max_date = moment(entry[1]);
            }
          }
        }

        return [min_date.toDate(), max_date.toDate()];
    }
  }

  private _updateChart = () => {
    const extent = d3.event.selection;

    console.log('extent', extent);

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!this._idle_timeout) {
        this._idle_timeout = setTimeout(this._idled, 350);
        return;
      } // This allows to wait a little bit

      if (this._axis.x.type === 'timeseries') {
        this._x.domain(this.axis.getXAxisDomain(d3.extent(this._optimized_data, d => d.key as Date)));
      } else if (this._axis.x.type === 'indexed') {
        this._x.domain(this.axis.getXAxisDomain(d3.extent(this._optimized_data, d => d.key as number)));
      }
    } else {
      if (this._axis.x.type === 'timeseries') {
        console.log([(this._x as any).invert(extent[0]), (this._x as any).invert(extent[1])]);
        this._x.domain([(this._x as any).invert(extent[0]), (this._x as any).invert(extent[1])]);
      } else if (this._axis.x.type === 'indexed') {
        this._x.domain([(this._x as any).invert(extent[0]), (this._x as any).invert(extent[1])]);
      }
      this._area_chart.select('.brush').call(this._brush.move, null);
      // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    this._x_axis
      .transition()
      .duration(1000)
      .call(d3.axisBottom(this._x).ticks(5));
    this._area_chart
      .selectAll('path')
      .transition()
      .duration(1000)
      .attr('d', this._area);
  };

  private _idled = () => {
    this._idle_timeout = null;
  };
}
