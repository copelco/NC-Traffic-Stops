import DataHandlerBase from '../../base/DataHandlerBase.js';
import VisualBase from '../../base/VisualBase.js';
import TableBase from '../../base/TableBase.js';
import Stops from './defaults.js';

import * as C from '../../common/Stops.js';

import Backbone from 'backbone';
import _ from 'underscore';
import d3 from 'd3';
import $ from 'jquery';
Backbone.$ = $;

export var StopsHandler = DataHandlerBase.extend({
  clean_data: function () {

    // build totals
    var data = this.get('raw_data');
    var total = C.build_totals(data);

    // build data for pie-chart
    var pie = C.build_pie_data(data, total, Stops);

    // build data for line-chart
    var line = C.build_line_data(data, [Stops.ethnicities], Stops);

    // set object data
    this.set('data', {
      type: 'stop',
      raw: this.get('raw_data'),
      pie: pie,
      line: line
    });
  }
});

export var StopRatioDonut = C.StopRatioDonutBase.extend({
  defaults: {
    width: 300,
    height: 300
  },

  _formatData: function(){
    var data = [],
        selected = this.dataset,
        items = Stops.ethnicities;

    // build data specifically for this pie chart
    items.forEach((d, i) => {
      if (!d) return;
      data.push({
        "key": d,
        "value": selected.get(d) || 0,
        "color": Stops.colors[i]
      });
    });

    return data;
  },
  
  triggerRaceToggle: () => null
});

export var StopRatioTimeSeries = VisualBase.extend({
  defaults: {
    width: 750,
    height: 375
  },
  setDefaultChart: function(){
    this.chart = nv.models.lineChart()
                  .useInteractiveGuideline (true)
                  .transitionDuration(350)
                  .showLegend(true)
                  .showYAxis(true)
                  .showXAxis(true)
                  .forceY([0, 1])
                  .width(this.get("width"))
                  .height(this.get("height"));

    this.chart.xAxis
        .axisLabel('Year')
        .tickFormat(d3.format('.0d'));

    this.chart.yAxis
        .axisLabel('Percentage of stops by race')
        .tickFormat(d3.format('%'));
  },
  drawStartup: function(){},
  drawChart: function(){
    var data = this._formatData();

    nv.addGraph(() => {
        d3.select(this.svg[0])
          .datum(data)
          .attr('width', "100%")
          .attr('height', "100%")
          .attr('preserveAspectRatio', "xMinYMin")
          .attr('viewBox', `0 0 ${this.get('width')} ${this.get('height')}`)
          .call(this.chart);
      });
  },
  _formatData: function(){
    var data = [],
        items = Stops.ethnicities,
        subset = [],
        i = 0,
        disabled;

    this.data.line.forEach(function(key, vals){
      if (items.indexOf(key) < 0) return;
      // disable by default if maximum value < 5%
      disabled = d3.max(vals, function(d){return d.y;})<0.05;
      data.push({
        key: key,
        values: vals,
        color: Stops.colors[i],
        disabled: disabled
      });
      i += 1;
    });
    return data;
  },
  triggerRaceToggle: () => null
});

export var StopsTable = TableBase.extend({
  get_tabular_data: function(){
    var header, row, rows = [];

    // create header
    header = ["Year"];
    header.push.apply(header, Stops.ethnicities);
    rows.push(header);

    // create data rows
    this.data.pie.forEach(function(k, v){
      row = [k];
      Stops.ethnicities.forEach(function(e){ row.push((v.get(e)||0).toLocaleString()); });
      rows.push(row);
    });

    return rows;
  }
});

export default {
  StopsHandler,
  StopRatioDonut,
  StopRatioTimeSeries,
  StopsTable
};
