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

  private _idle_timeout: number;
  private _stacked_data: d3.Series<{ [key: string]: number; }, string>[];
  private _x: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;

  constructor() {}

  ngOnInit() {
    console.log('ngOnInit()');
    console.log('this.data', this.data);
    console.log('this.margin', this.margin);
    console.log('this.height', this.height);
    console.log('this.axis', this.axis);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit()');
    const resize_sensor = new ResizeSensor(this._chartContainer.nativeElement, () => {
      this.onResize();
    });
    console.log('resize_sensor', resize_sensor);

    if (this.data !== undefined && this.data.length > 0) {
      this._createChart(this.data, this._chartContainer.nativeElement, this.margin);
    } else {
      return;
    }
  }

  ngOnChanges() {
    console.log('ngOnChanges()');
    if (this.data !== undefined && this.data.length > 0 && this._chartContainer.nativeElement.offsetWidth !== 0) {
      this._createChart(this.data, this._chartContainer.nativeElement, this.margin);
    } else {
      return;
    }
  }

  onResize(): void {
    console.log('onResize(): void');
    if (this.data !== undefined && this.data.length > 0) {
      this._createChart(this.data, this._chartContainer.nativeElement, this.margin);
    } else {
      return;
    }
  }

  private _createChart(data: GraphStackedAreaDataModel[], element: HTMLElement, margin: GraphMargin): void {
    const graph_height = this.height - this.margin.top - this.margin.bottom;
    const graph_width = element.offsetWidth - this.margin.left - this.margin.right;

    //
    // Create base SVG
    //
    d3.select(element)
      .select('svg')
      .remove();

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', graph_height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    //
    // Process data
    //
    const sumstat = d3
      .nest()
      .key((d: any) => d.plot.x)
      .entries(data);

    const optimized_data: { [key: string]: Date | string | number }[] = [];
    const keys: string[] = [];
    const colors: string[] = [];

    sumstat.forEach(ss => {
      const obj: { [key: string]: Date | string | number } = {
        key: d3.timeParse('%Y-%m-%d')(ss.key)
      };

      ss.values.forEach((value: GraphStackedAreaDataModel) => {
        obj[value.key] = value.plot.y;

        if (!keys.includes(value.key)) {
          keys.push(value.key);
          colors.push(value.color_hex);
        }
      });
      optimized_data.push(obj);
    });

    keys.forEach(key => {
      for (const row of optimized_data) {
        if (row[key] === undefined) {
          row[key] = 0;
        }
      }
    });

    console.log('optimized_data', optimized_data);
    console.log('keys', keys);
    console.log('colors', colors);

    this._stacked_data = d3.stack().keys(keys)(optimized_data as { [key: string]: number }[]);

    console.log('this._stacked_data', this._stacked_data);

    //
    // Axes
    //
    // Add X axis
    if (this.axis.x.type === 'timeseries') {
      this._x = this.axis.getXAxis(
        d3.extent(optimized_data, d => d.key as Date),
        graph_width
      );
    } else if (this.axis.x.type === 'indexed') {
      this._x = this.axis.getXAxis(
        d3.extent(optimized_data, d => d.key as number),
        graph_width
      );
    }

    const x_axis = svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + graph_height + ')')
      .call(
        d3
          .axisBottom(this._x)
          .ticks(
            this.axis.x.tick.count !== undefined && typeof this.axis.x.tick.count === 'number'
              ? this.axis.x.tick.count
              : Math.floor(graph_width / 90)
          )
      );

    // Add X axis label:
    if (this.axis.x.label.text) {
      let text_anchor: 'start' | 'middle' | 'end';
      let label_x_position: number;
      let label_y_position: number;
      switch (this.axis.x.label.position) {
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
      svg
        .append('text')
        .attr('class', 'w3-small label label--x')
        .attr('text-anchor', text_anchor)
        .attr('x', label_x_position)
        .attr('y', label_y_position)
        .text(this.axis.x.label.text);
    }

    // Add Y axis
    let y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
    if (this.axis.y.type === 'timeseries') {
      y = this.axis.getYAxis(this._getYRange(this._stacked_data, 'Date'), graph_height);
    } else if (this.axis.y.type === 'linear') {
      y = this.axis.getYAxis(this._getYRange(this._stacked_data, 'number'), graph_height);
    }

    const y_axis = svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(
        d3
          .axisLeft(y)
          .ticks(
            this.axis.y.tick.count !== undefined && typeof this.axis.y.tick.count === 'number'
              ? this.axis.y.tick.count
              : Math.floor(graph_height / 50)
          )
      );

    // Add Y axis label:
    if (this.axis.y.label.text) {
      let label_x_position: number;
      let label_y_position: number;
      let y_label: d3.Selection<SVGTextElement, unknown, null, undefined>;
      switch (this.axis.y.label.position) {
        case 'inner-top':
          label_x_position = 0;
          label_y_position = 0;

          y_label = svg
            .append('text')
            .attr('class', 'w3-small label label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this.axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width).attr('dy', y_label.node().getBBox().height);
          break;

        case 'inner-middle':
          label_x_position = -graph_height / 2;
          label_y_position = 0;

          y_label = svg
            .append('text')
            .attr('class', 'w3-small label label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this.axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width / 2).attr('dy', y_label.node().getBBox().height);
          break;

        case 'inner-bottom':
          label_x_position = -graph_height;
          label_y_position = 0;

          y_label = svg
            .append('text')
            .attr('class', 'w3-small label label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this.axis.y.label.text);
          y_label.attr('dx', 2).attr('dy', y_label.node().getBBox().height);
          break;

        case 'outer-top':
          label_x_position = 0;
          label_y_position = 0;

          y_label = svg
            .append('text')
            .attr('class', 'w3-small label label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this.axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width).attr('dy', -y_axis.node().getBBox().width);
          break;

        case 'outer-middle':
          label_x_position = -graph_height / 2;
          label_y_position = 0;

          y_label = svg
            .append('text')
            .attr('class', 'w3-small label label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this.axis.y.label.text);
          y_label.attr('dx', -y_label.node().getBBox().width / 2).attr('dy', -y_axis.node().getBBox().width);
          break;

        case 'outer-bottom':
          label_x_position = -graph_height;
          label_y_position = 0;

          y_label = svg
            .append('text')
            .attr('class', 'w3-small label label--y')
            .attr('transform', 'rotate(-90)')
            .attr('x', label_x_position)
            .attr('y', label_y_position)
            .text(this.axis.y.label.text);
          y_label.attr('dx', 2).attr('dy', -y_axis.node().getBBox().width);
          break;
      }
    }

    //
    // Brushing and Chart
    //
    svg
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', graph_width)
      .attr('height', graph_height)
      .attr('x', 0)
      .attr('y', 0);

    // Create the scatter variable: where both the circles and the brush take place
    const area_chart = svg.append('g').attr('clip-path', 'url(#clip)');

    // Add brushing
    const brush = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [graph_width, graph_height]
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', this._updateChart; // Each time the brush selection changes, trigger the 'updateChart' function

    // Area generator
    const area = d3
      .area()
      .x((d: any) => {
        return x(d.data.key);
      })
      .y0(d => {
        return y(d[0]);
      })
      .y1(d => {
        return y(d[1]);
      });

    // Show the areas
    area_chart
      .selectAll('mylayers')
      .data(this._stacked_data)
      .enter()
      .append('path')
      .attr('class', d => 'myArea ' + d.key)
      .style('stroke', d => colors[keys.indexOf(d.key)])
      .attr('stroke-width', 1)
      .style('fill', d => colors[keys.indexOf(d.key)])
      .attr('fill-opacity', '0.2')
      .attr('d', area as any);
  }

  private _getYRange(
    stack_data: d3.Series<
      {
        [key: string]: number;
      },
      string
    >[],
    type: 'number' | 'Date'
  ): [number, number] | [Date, Date] {
    switch (type) {
      case 'number':
        let min_num: number;
        let max_num: number;

        for (const stack_entry of stack_data) {
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

        for (const stack_entry of stack_data) {
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

  private _updateChart() {
    const extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!this._idle_timeout) { return this._idle_timeout = setTimeout(idled, 350); } // This allows to wait a little bit
      x.domain(d3.extent(data, function(d) { return d.year; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }
  }

  _idled() { this._idle_timeout = null; }
}
