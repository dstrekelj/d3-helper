/*
 
The MIT License (MIT)

Copyright (c) 2015 Domagoj Štrekelj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function(Window) {
  var helper = { version: '0.2.4' };
  
  /**
   * Graph base. Defines width, height, target parent, as well as 
   * data and the D3.js result of our actions. The 'root' of all.
   */
  function Graph() {
    var that = {};
    
    var _d3 =     undefined,
        _data =   [],
        _height = 640,
        _target = 'body',
        _width =  480;
    
    // Get / set the D3.js result of what we did
    that.d3 = function d3(D3) {
      if (D3) {
        _d3 = D3;
        return this;
      } else {
        return _d3;
      }
    };
    
    // Get / set graph data
    that.data = function data(Data) {
      if (Data) {
        _data = Data;
        return this;
      } else {
        return _data;
      }
    };
    
    // Get / set graph height
    that.height = function height(Height) {
      if (Height) {
        _height = Height;
        return this;
      } else {
        return _height;
      }
    };
    
    // Get / set parent element (draw target)
    that.target = function target(Target) {
      if (Target) {
        _target = Target;
        return this;
      } else {
        return _target;
      }
    };
    
    // Get / set graph width
    that.width = function width(Width) {
      if (Width) {
        _width = Width;
        return this;
      } else {
        return _width;
      }
    };
    
    return that;
  };
  
  /**
   * Chart base. Stores a Graph so we can have a chart draw based on 
   * a Graph object. Root of all charts. Could possibly be removed.
   */
  function Chart() {
    var that = Graph();
    
    var _graph = {},
        _scale = {
          c: d3.scale.category10(),
          x: null,
          y: null
        };
    
    // Get / set color scale
    that.colorScale = function(D3ColorScale) {
      if (D3ColorScale) {
        _scale.c = D3ColorScale;
        return this;
      }
      
      return _scale.c;
    };
    
    // Get / set Graph object
    that.graph = function(Graph) {
      if (Graph) {
        that.data(Graph.data());
        that.height(Graph.height());
        that.target(Graph.target());
        that.width(Graph.width());
        return this;
      } else {
        return {
          data:   that.data(),
          height: that.height(),
          target: that.target(),
          width:  that.width()
        };
      }
    };
    
    // Get / set x-axis scale
    that.xScale = function(D3Scale) {
      if (D3Scale) {
        _scale.x = D3Scale;
        return this;
      }
      
      return _scale.x;
    };
    
    // Get / set y-axis scale
    that.yScale = function(D3Scale) {
      if (D3Scale) {
        _scale.y = D3Scale;
        return this;
      }
      
      return _scale.y;
    };
    
    return that;
  };
  
  /**
   * Bar chart.
   */
  function BarChart() {
    var that = Chart();
    
    var _alignmentBaseline,
        _barHeight,
        _barWidth,
        _barX,
        _barY,
        _baseline = 'bottom',
        _labels = [],
        _labelPadding = 10,
        _labelX,
        _labelY,
        _scales = { c: that.colorScale(), x: that.xScale(), y: that.yScale() },
        _textAnchor;
    
    var updateLabelVariables = function(Label) {
      _alignmentBaseline = 'alphabetic';
      _textAnchor = 'middle';
      
      _labelX = (function() {
        switch (_baseline) {
          case 'bottom':
          case 'top':
            return function(d, j) { return that.width() / that.data().length * (j + 1/2); };
          case 'left':
            _textAnchor = 'start';
            switch (Label.location) {
              case 'inside-bottom':
                return _labelPadding;
              case 'outside':
                return function(d, j) { return (_scales.x ? _scales.x(d.value) : d.value) + _labelPadding; };
              default:
                return 0;
            }
          case 'right':
            _textAnchor = 'end';
            switch (Label.location) {
              case 'inside-bottom':
                return that.width() - _labelPadding;
              case 'outside':
                return function(d, j) { return that.width() - (_scales.x ? _scales.x(d.value) : d.value) - _labelPadding; };
              default:
                return 0;
            }
          default:
            return 0;
        }
      })();
      
      _labelY = (function() {
        switch (_baseline) {
          case 'left':
          case 'right':
            _alignmentBaseline = 'middle';
            return function(d, j) { return that.height() / that.data().length * (j + 1/2); };
          case 'bottom':
            switch (Label.location) {
              case 'inside-bottom':
                return that.height() - _labelPadding;
              case 'outside':
                return function(d, j) { return that.height() - (_scales.y ? _scales.y(d.value) : d.value) - _labelPadding; };
              default:
                return 0;
            }
          case 'top':
            _alignmentBaseline = 'hanging';
            switch (Label.location) {
              case 'inside-bottom':
                return _labelPadding;
              case 'outside':
                return function(d, j) { return (_scales.y ? _scales.y(d.value) : d.value) + _labelPadding; };
              default:
                return 0;
            }
          default:
            return 0;
        }
      })();
    };
    
    var updateVariables = function() {
      _scales.c = that.colorScale();
      _scales.x = that.xScale();
      _scales.y = that.yScale();
      
      _barHeight = (function() {
        switch (_baseline) {
          case 'bottom':
          case 'top':
            return function(d, i) { return _scales.y ? _scales.y(d.value) : d.value; };
          default:
            return that.height() / that.data().length;
        }
      })();
      
      _barWidth = (function() {
        switch (_baseline) {
          case 'left':
          case 'right':
            return function(d, i) { return _scales.x ? _scales.x(d.value) : d.value; };
          default:
            return that.width() / that.data().length;
        }
      })();
      
      _barX = (function() {
        switch (_baseline) {
          case 'bottom':
          case 'top':
            return function(d, i) { return that.width() / that.data().length * i; };
          case 'right':
            return function(d, i) { return that.width() - (_scales.x ? _scales.x(d.value) : d.value); };
          case 'left':
          default:
            return 0;
        }
      })();

      _barY = (function() {
        switch (_baseline) {
          case 'left':
          case 'right':
            return function(d, i) { return that.height() / that.data().length * i; };
          case 'bottom':
            return function(d, i) { return that.height() - (_scales.y ? _scales.y(d.value) : d.value); };
          case 'top':
          default:
            return 0;
        }
      })();
    };
    
    // Get / set bar chart baseline
    that.baseline = function(Baseline) {
      if (Baseline) {
        _baseline = Baseline;
        return this;
      }
      
      return _baseline;
    };
    
    that.draw = function() {
      updateVariables();
      
      var svg = d3.select(that.target())
        .append('svg')
        .attr('class', 'barchart')
        .attr('width', that.width())
        .attr('height', that.height());
      
      svg.selectAll('rect')
        .data(that.data())
        .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('height', _barHeight)
          .attr('width', _barWidth)
          .attr('x', _barX)
          .attr('y', _barY)
          .attr('fill', function(d, i) { return _scales.c(i); });
      
      for (var i = 0; i < _labels.length; i++) {
        updateLabelVariables(_labels[i]);
        
        svg.append('g')
          .attr('class', 'labels ' + _labels[i].dimension)
          .selectAll('text')
          .data(that.data())
          .enter()
            .append('text')
            .attr('class', 'label ' + _labels[i].dimension)
            .attr('text-anchor', _textAnchor)
            .attr('alignment-baseline', _alignmentBaseline)
            .attr('x', _labelX)
            .attr('y', _labelY)
            .text(function(d) { return d[_labels[i].dimension]; })
      }
      
      that.d3(svg);
      
      return this;
    };
    
    that.label = function(Dimension, Location) {
      var dimensionIsValid = (function() {
        return Dimension === 'key' || Dimension === 'value';
      })();
      
      var locationIsValid = (function() {
        return Location === 'inside-bottom' || Location === 'outside';
      })();
      
      if (dimensionIsValid && locationIsValid) {
        var labelObject = { dimension: Dimension, location: Location };
        if (_labels.indexOf(labelObject) == -1) _labels.push(labelObject);
        return this;
      } else if (Dimension || Location) {
        throw 'Undefined dimension or location';
      }
      
      return _labels;
    };
    
    that.labelPadding = function(LabelPadding) {
      if (typeof LabelPadding === 'number') {
        _labelPadding = LabelPadding;
        return this;
      } else if (LabelPadding) {
        throw 'Argument must be of type Number';
      }
      
      return _labelPadding;
    };
    
    return that;
  };
  
  /**
   * Pie chart. Root of DonutChart.
   */
  function PieChart() {
    var that = Chart();
    
    var _innerRadius = 0,
        _labels = [],
        _labelOffset = 1,
        _labelSpacing = 0,
        _labelX,
        _labelY,
        _outerRadius = 0,
        _position = 0,
        _scales = { c: that.colorScale() };
    
    var updatePosition = function() {
      return [Math.min(that.height(), that.width()) / 2, Math.min(that.height(), that.width()) / 2];
    };
    
    var updateOuterRadius = function() {
      return Math.min(that.height(), that.width()) / 2;
    };
    
    var updateInnerRadius = function() {
      return 0;
    };
    
    var updateLabelVariables = function(Label) {
      _alignmentBaseline = (function() {
        switch (Label.location) {
          case 'below':
            _labelY = _labels.length > 1 ? _labelSpacing / 2 : 0;
            return 'hanging';
          case 'above':
          default:
            _labelY = - (_labels.length > 1 ? _labelSpacing / 2 : 0);
            return 'alphabetic';
        }
      })();
      
      _textAnchor = 'middle';
    };
    
    var updateVariables = function() {
      _scales.c = that.colorScale();
      if (updatePosition) _position = updatePosition();
      if (updateOuterRadius) _outerRadius = updateOuterRadius();
      if (updateInnerRadius) _innerRadius = updateInnerRadius();
    };
    
    that.draw = function() {
      updateVariables();
      
      var svg = d3.select(that.target())
        .append('svg')
        .attr('class', 'piechart')
        .attr('width', that.width())
        .attr('height', that.height());

      var arc = d3.svg.arc().outerRadius(_outerRadius).innerRadius(_innerRadius);
      
      var pie = d3.layout.pie().value(function(d) { return d.value; });
      
      var arcs = svg.selectAll('g.arc')
        .data(pie(that.data()))
        .enter()
          .append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(' + _position + ')')
      
      arcs.append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { return _scales.c(i); });
      
      for (var i = 0; i < _labels.length; i++) {
        updateLabelVariables(_labels[i]);
        
        arcs.append('text')
          .attr('class', 'label ' + _labels[i].dimension)
          .attr('transform', function(d) {
            var centroid = arc.centroid(d),
                centroidX = centroid[0] * _labelOffset,
                centroidY = centroid[1] * _labelOffset + _labelY;
            
            return 'translate(' + centroidX + ',' + centroidY + ')';
          })
          .attr('text-anchor', _textAnchor)
          .attr('alignment-baseline', _alignmentBaseline)
          .text(function(d) { return d.data[_labels[i].dimension]; });
      }
      
      that.d3(svg);
      
      return this;
    };
    
    // Get / set inner radius
    that.innerRadius = function(InnerRadius) {
      if (typeof InnerRadius === 'number') {
        _innerRadius = InnerRadius;
        updateInnerRadius = undefined;
        return this;
      } else if (typeof InnerRadius === 'function') {
        updateInnerRadius = InnerRadius;
        return this;
      }
      
      return _innerRadius;
    };
    
    that.label = function(Dimension, Location) {
      var dimensionIsValid = (function() {
        return Dimension === 'key' || Dimension === 'value';
      })();
      
      var locationIsValid = (function() {
        return Location === 'above' || Location === 'below';
      })();
      
      if (dimensionIsValid && locationIsValid) {
        var labelObject = { dimension: Dimension, location: Location };
        if (_labels.indexOf(labelObject) == -1) _labels.push(labelObject);
        return this;
      } else if (Dimension || Location) {
        throw 'Undefined dimension or location';
      }
      
      return _labels;
    };
    
    that.labelOffset = function(LabelOffset) {
      if (typeof LabelOffset === 'number') {
        _labelOffset = LabelOffset;
        return this;
      } else if (LabelOffset) {
        throw 'Argument must be of type Number';
      }
      
      return _labelOffset;
    };
    
    that.labelSpacing = function(LabelSpacing) {
      if (typeof LabelSpacing === 'number') {
        _labelSpacing = LabelSpacing;
        return this;
      } else if (LabelSpacing) {
        throw 'Argument must be of type Number';
      }
      
      return _labelSpacing;
    };
    
    // Get / set outer radius
    that.outerRadius = function(OuterRadius) {
      if (typeof OuterRadius === 'number') {
        _outerRadius = OuterRadius;
        updateOuterRadius = undefined;
        return this;
      } else if (typeof OuterRadius === 'function') {
        updateOuterRadius = OuterRadius;
        return this;
      }
      
      return _outerRadius;
    };
    
    // Get / set chart position
    that.position = function(Position) {
      if (typeof Position === 'object') {
        _position = Position;
        updatePosition = undefined;
        return this;
      } else if (typeof Position === 'function') {
        updatePosition = Position;
        return this;
      }
      
      return _position;
    };
    
    return that;
  };
  
  function DonutChart() {
    var that = PieChart();
    
    that.innerRadius(function() { return Math.min(that.height(), that.width()) / 4; });
    
    return that;
  };
  
  helper.graph = function getGraph() {
    return Graph();
  };
  
  helper.chart = function getChart(ChartType) {
    switch (ChartType) {
      case 'bar':   return BarChart();
      case 'donut': return DonutChart();
      case 'pie':   return PieChart();
      default: throw 'Unknown chart type';
    }
  };
  
  window.helper = helper;
})(window);