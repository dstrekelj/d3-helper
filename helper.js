/**
 * A collection of helper methods for drawing simple D3.js visualisations
 * @author  Domagoj Štrekelj
 */

(function(Window) {
  var helper = { version: '0.1.0' };
  
  var _attributes = {},
      _scales     = {},
      _data       = undefined,
      _d3         = undefined;
  
  var has = function has(JSON, Property) {
    return JSON.hasOwnProperty(Property);
  };
  
  var _drawBarChart = function _drawBarChart() {
    _d3 = d3.select(_attributes.target).append('svg')
      .attr('class', 'barchart')
      .attr(_attributes);
    
    var xScale = (function() {
      if (has(_scales, 'x')) {
        return d3.scale.linear().domain([_scales.x.minimum, _scales.x.maximum]).range([0, _attributes.width]);
      } else {
        return undefined;
      }
    })();
    
    var yScale = (function() {
      if (has(_scales, 'y')) {
        return d3.scale.linear().domain([_scales.y.minimum, _scales.y.maximum]).range([0, _attributes.height]);
      } else {
        return undefined;
      }
    })();
    
    _d3.append('g')
      .selectAll('rect')
      .data(_data).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr({
          x     : function adjustX(d, i) { return ((_attributes.width / _data.length) + 1) * i; },
          y     : function adjustY(d, i) { return _attributes.height - ((yScale) ? yScale(d.value) : d.value); },
          width : function adjustW(d, i) { return _attributes.width / _data.length; },
          height: function adjustH(d, i) { return (yScale) ? yScale(d.value) : d.value; }
        });
    
    return this;
  };
  
  var _drawLineChart = function _drawLineChart() { };
  
  var _drawPieChart = function _drawPieChart() { };
  
  helper.attr = function setAttr(Attributes) {
    _attributes = Attributes;
    return this;
  };
  
  helper.target = function setTarget(Target) {
    _attributes.target = Target;
    return this;
  };
  
  helper.width = function setWidth(Width) {
    _attributes.width = Width;
    return this;
  };
  
  helper.height = function setHeight(Height) {
    _attributes.height = Height;
    return this;
  };
  
  helper.data = function setData(Data) {
    _data = Data;
    return this;
  };
  
  helper.scale = function scale(Axis, Minimum, Maximum) {
    var domain = {};
    domain.minimum = Minimum;
    domain.maximum = Maximum;
    
    if (Axis == 'X' || Axis == 'x') {
      _scales.x = domain;
    } else if (Axis == 'Y' || Axis == 'y') {
      _scales.y = domain;
    } else {
      throw "Undefined axis.";
    }
    
    return this;
  };
  
  helper.chart = function getChart(ChartType) {
    switch (ChartType) {
      case 'bar'  : _drawBarChart();  break;
      case 'line' : _drawLineChart(); break;
      case 'pie'  : _drawPieChart();  break;
      default     : throw 'Undefined chart type.';
    }
    
    return this;
  };
  
  helper.d3 = function getD3() {
    return _d3;
  };
  
  helper.barChart = function barChart(Parameters) {
    if (!Parameters) throw 'Missing parameters.';
    if (!Parameters.data) throw 'Missing data.';
    
    var target  = Parameters.target || 'body',
        width   = Parameters.width  ||  640,
        height  = Parameters.height ||  480,
        data    = Parameters.data;
    
    var svg = d3.select(target).append('svg')
      .attr({
        class   : 'barchart',
        width   : width,
        height  : height
      });
    
    var yScale = d3.scale.linear().domain([0, d3.max(data)]).range([0, height]);
    
    svg.append('g')
      .selectAll('rect')
      .data(data).enter()
        .append('rect')
        .attr({
          class : 'bar',
          x     : function adjustX(d, i) { return (width / data.length) * i; },
          y     : function adjustY(d, i) { return height - yScale(d); },
          width : function adjustWidth(d, i) { return (width / data.length) - 2; },
          height: function adjustHeight(d, i) { return yScale(d); }
        });
    
    return this;
  };
  
  window.helper = helper;
})(window);
