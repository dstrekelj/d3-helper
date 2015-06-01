(function(Window) {
  var d3helper = { version: '0.1.2' };
  /*
  var Graph = function Graph() {
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.DATA = undefined;
  };
  
  Graph.prototype.width = function setWidth(Width) {
    this.width = Width;
    return this;
  };
  
  Graph.prototype.height = function setHeight(Height) {
    this.height = Height;
    return this;
  };
  
  Graph.prototype.data = function setData(Data) {
    this.data = Data;
    return this;
  };
  
  var PieChart = function PieChart() {
    Graph.call(this);
    
    this.innerRadius = 0;
    this.outerRadius = 0;
    this.SCALE = { };
  };
  
  PieChart.prototype.scale = function setScale(Axis, Scale) {
    this.scale.Axis = Scale;
    return this;
  };
  
  //PieChart.prototype = Object.create(Graph.prototype);
  //PieChart.prototype.constructor = Graph;
  */
  
  /**
   * Graph base. Defines width, height, target parent, as well as 
   * data and the D3.js result of our actions. The 'root' of all.
   */
  function Graph() {
    var that = {};
    
    var _data =   [],
        _height = 640,
        _target = 'body',
        _width =  480,
        _d3 =     undefined;
    
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
    
    var _graph = {};
    
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
  
  function BarChart() {
    
  };
  
  /**
   * Pie chart. Root of DonutChart.
   */
  function PieChart() {
    var that = Chart();
    
    var _position = 0,
        _outerRadius = 0,
        _innerRadius = 0,
        _colorScale = d3.scale.category10();
    
    var updatePosition = function() {
      return [Math.min(that.height(), that.width()) / 2, Math.min(that.height(), that.width()) / 2];
    };
    
    var updateOuterRadius = function() {
      return Math.min(that.height(), that.width()) / 2;
    };
    
    var updateInnerRadius = function() {
      return 0;
    };
    
    // Get / set `_scale'
    that.colorScale = function(D3ColorScale) {
      if (D3ColorScale) {
        _colorScale = D3ColorScale;
        return this;
      }
      
      return _colorScale;
    };
    
    that.draw = function() {
      if (updatePosition) _position = updatePosition();
      if (updateOuterRadius) _outerRadius = updateOuterRadius();
      if (updateInnerRadius) _innerRadius = updateInnerRadius();
      
      var svg = d3.select(that.target())
        .append('svg')
        .attr('class', 'piechart')
        .attr('width', that.width())
        .attr('height', that.height())

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
              .attr('fill', function(d, i) { return _colorScale(i); });
      
      return that;
    };
    
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
    
    // Get / set `_outerRadius`
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
    
    // Get / set `_position`
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