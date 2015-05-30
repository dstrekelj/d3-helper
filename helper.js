/**
 * A collection of helper methods for drawing simple D3.js visualisations
 * @author  Domagoj Štrekelj
 */

(function(Window) {
  var helper = { version: '0.1.0' };
  
  var _attributes = {},
      _scales     = {},
      _labels     = [],
      _data       = undefined,
      _d3         = undefined;
  
  var has = function has(JSON, Property) {
    return JSON.hasOwnProperty(Property);
  };
  
  var _drawBarChart = function _drawBarChart() {
    _d3 = d3.select(_attributes.target).append('svg')
      .attr('class', 'barchart')
      .attr(_attributes);
    
    _d3.append('g')
      .selectAll('rect')
      .data(_data).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr({
          x     : function adjustX(d, i) { return ((_attributes.width / _data.length) + 1) * i; },
          y     : function adjustY(d, i) { return _attributes.height - ((_scales.y) ? _scales.y(d.value) : d.value); },
          width : function adjustW(d, i) { return _attributes.width / _data.length; },
          height: function adjustH(d, i) { return (_scales.y) ? _scales.y(d.value) : d.value; }
        });
    
    for (var i = 0; i < _labels.length; i++) {
      _d3.append('g')
        .selectAll('text')
        .data(_data).enter()
          .append('text')
          .text(function setLabelText(d) { return d[_labels[i].dimension]; })
          .attr('class', 'label ' + _labels[i].dimension)
          .attr('text-anchor', 'middle')
          .attr({
            x: function adjustX(d, j) { return ((_attributes.width / _data.length) + 1 ) * j + ((_attributes.width / _data.length) / 2); },
            y: function adjustY(d, j) {
              var locationOffset = (function() {
                switch (_labels[i].location) {
                  case 'inside-bottom':
                    return 0;
                  case 'inside-top':
                    return 0;
                  case 'outside':
                    return (_scales.y) ? _scales.y(d.value) : d.value;
                  default:
                    return 0;
                }
              })();
              
              return _attributes.height - locationOffset - 5;
            }
          });
    }
    
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
    if (Axis === 'X' || Axis === 'x') {
      _scales.x = (function() {
        return d3.scale.linear()
          .domain([Minimum, Maximum])
          .range([0, _attributes.width]);
      })();
    } else if (Axis === 'Y' || Axis === 'y') {
      _scales.y = (function() {
        return d3.scale.linear()
          .domain([Minimum, Maximum])
          .range([0, _attributes.height]);
      })();
    } else {
      throw 'Undefined axis.';
    }
    
    return this;
  };
  
  helper.label = function label(Dimension, Location) {
    if (Dimension === 'key' || Dimension === 'value') {
      var labelObject = {
        dimension : Dimension,
        location  : Location || 'outside'
      };
      
      if (_labels.indexOf(labelObject) == -1) {
        _labels.push(labelObject);
      }
    } else if (Dimension === '' || typeof Dimension == 'undefined') {
      _labels = [];
    } else {
      throw 'Undefined dimension.';
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
  
  window.helper = helper;
})(window);
