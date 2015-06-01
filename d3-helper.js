(function(Window) {
  var d3helper = { version: '0.1.2' };
  
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
    
    return that;
  };
  
  /**
   * Bar chart.
   */
  function BarChart() {
    var that = Chart();
    
    var _barHeight,
        _barWidth,
        _barX,
        _barY,
        _baseline = 'bottom',
        _scales = { c: that.colorScale(), x: that.xScale(), y: that.yScale() };
    
    var updateVariables = function() {
      _scales.c = that.colorScale();
      _scales.x = that.xScale();
      _scales.y = that.yScale();
      
      _barHeight = (function() {
        switch (_baseline) {
          case 'bottom':
          case 'top':
            return function(d, i) { return _scales.y ? _scales.y(d.value) : d.value; };
            break;
          default:
            return that.height() / that.data().length;
        }
      })();
      
      _barWidth = (function() {
        switch (_baseline) {
          case 'left':
          case 'right':
            return function(d, i) { return _scales.x ? _scales.x(d.value) : d.value; };
            break;
          default:
            return that.width() / that.data().length;
        }
      })();
      
      _barX = (function() {
        switch (_baseline) {
          case 'bottom':
          case 'top':
            return function(d, i) { return that.width() / that.data().length * i; };
            break;
          case 'right':
            return function(d, i) { return that.width() - (_scales.x ? _scales.x(d.value) : d.value); };
            break;
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
            break;
          case 'bottom':
            return function(d, i) { return that.height() - (_scales.y ? _scales.y(d.value) : d.value); };
            break;
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
      
      that.d3(svg);
      
      return this;
    };
    
    return that;
  };
  
  /**
   * Pie chart. Root of DonutChart.
   */
  function PieChart() {
    var that = Chart();
    
    var _innerRadius = 0,
        _outerRadius = 0,
        _position = 0,
        _scales = { c: that.colorScale() },
    
    var updatePosition = function() {
      return [Math.min(that.height(), that.width()) / 2, Math.min(that.height(), that.width()) / 2];
    };
    
    var updateOuterRadius = function() {
      return Math.min(that.height(), that.width()) / 2;
    };
    
    var updateInnerRadius = function() {
      return 0;
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
            .append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) { return _scales.c(i); });
      
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
  
  d3helper.graph = function getGraph() {
    return Graph();
  };
  
  d3helper.chart = function getChart(ChartType) {
    switch (ChartType) {
      case 'bar':   return BarChart();    break;
      case 'donut': return DonutChart();  break;
      case 'pie':   return PieChart();    break;
      default: throw 'Unknown chart type';
    }
  };
  
  window.d3helper = d3helper;
})(window);