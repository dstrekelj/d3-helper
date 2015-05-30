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
  
  var _drawBarChart = function _drawBarChart(Baseline) {
    Baseline = Baseline || 'bottom';
    
    var adjustX, adjustY, adjustW, adjustH;
    
    adjustW = _attributes.width / _data.length;
    adjustH = _attributes.height / _data.length;
    
    if (Baseline === 'bottom' || Baseline === 'top') {
      adjustX = function adjustX(d, i) { return (_attributes.width / _data.length) * i; };
      adjustH = function adjustH(d, i) { return (_scales.y) ? _scales.y(d.value) : d.value; };
    } else if (Baseline === 'left') {
      adjustX = 0;
    } else if (Baseline === 'right') {
      adjustX = function adjustX(d, i) { return _attributes.width - ((_scales.x) ? _scales.x(d.value) : d.value); };
    }
    
    if (Baseline === 'left' || Baseline === 'right') {
      adjustY = function adjustY(d, i) { return (_attributes.height / _data.length) * i; };
      adjustW = function adjustW(d, i) { return (_scales.x) ? _scales.x(d.value) : d.value; };
    } else if (Baseline === 'bottom') {
      adjustY = function adjustY(d, i) { return _attributes.height - ((_scales.y) ? _scales.y(d.value) : d.value); };
    } else if (Baseline === 'top') {
      adjustY = 0;
    }
    
    _d3 = d3.select(_attributes.target).append('svg')
      .attr('class', 'barchart')
      .attr(_attributes);
    
    _d3.append('g')
      .selectAll('rect')
      .data(_data).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr({
          x     : adjustX,
          y     : adjustY,
          width : adjustW,
          height: adjustH
        });
    
    for (var i = 0; i < _labels.length; i++) {
      var textAnchor        = 'middle',
          alignmentBaseline = 'alphabetic';
      
      var adjustLabelX, adjustLabelY;
      
      if (Baseline === 'bottom' || Baseline === 'top') {
        adjustLabelX = function adjustLabelX(d, j) { return ((_attributes.width / _data.length)) * j + ((_attributes.width / _data.length) / 2); };
      } else if (Baseline === 'left') {
        textAnchor = 'start';
        switch (_labels[i].location) {
          case 'inside-bottom':
            adjustLabelX = 5;
            break;
          case 'inside-top':
            break;
          case 'outside':
            adjustLabelX = function adjustLabelX(d, j) { return ((_scales.x) ? _scales.x(d.value) : d.value) + 5; };
            break;
          default:
        }
      } else if (Baseline === 'right') {
        textAnchor = 'end';
        switch (_labels[i].location) {
          case 'inside-bottom':
            adjustLabelX = _attributes.width - 5;
            break;
          case 'inside-top':
            break;
          case 'outside':
            adjustLabelX = function adjustLabelX(d, j) { return _attributes.width - ((_scales.x) ? _scales.x(d.value) : d.value) - 5; };
            break;
        }
      }
      
      if (Baseline === 'left' || Baseline === 'right') {
        adjustLabelY = function adjustLabelY(d, j) { return ((_attributes.height / _data.length)) * j + ((_attributes.height / _data.length) / 2); };
      } else if (Baseline === 'bottom') {
        switch (_labels[i].location) {
          case 'inside-bottom':
            adjustLabelY = _attributes.height - 5;
            break;
          case 'inside-top':
            adjustLabelY = 0;
            break;
          case 'outside':
            adjustLabelY = function adjustLabelY(d, j) { return _attributes.height - ((_scales.y) ? _scales.y(d.value) : d.value) - 5; };
            break;
          default:
        }
      } else if (Baseline === 'top') {
        alignmentBaseline = 'hanging';
        switch (_labels[i].location) {
          case 'inside-bottom':
            adjustLabelY = 5;
            break;
          case 'inside-top':
            adjustLabelY = 0;
            break;
          case 'outside':
            adjustLabelY = function adjustLabelY(d, j) { return ((_scales.y) ? _scales.y(d.value) : d.value) + 5; };
            break;
          default:
        }
      }
      
      _d3.append('g')
        .selectAll('text')
        .data(_data).enter()
          .append('text')
          .text(function setLabelText(d) { return d[_labels[i].dimension]; })
          .attr('class', 'label ' + _labels[i].dimension)
          .attr('text-anchor', textAnchor)
          .attr('alignment-baseline', alignmentBaseline)
          .attr({
            x: adjustLabelX,
            y: adjustLabelY
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
  
  helper.chart = function getChart(ChartType, Baseline) {
    switch (ChartType) {
      case 'bar'  : _drawBarChart(Baseline);  break;
      case 'line' : _drawLineChart();         break;
      case 'pie'  : _drawPieChart();          break;
      default     : throw 'Undefined chart type.';
    }
    
    return this;
  };
  
  helper.d3 = function getD3() {
    return _d3;
  };
  
  window.helper = helper;
})(window);
