d3-helper API
-------------

## General guidelines

**Accessor methods.** Accessor methods behave as follows (unless specified otherwise):

* If _an argument of the right type_ is passed, the accessor sets the field's value to the argument
* If _an argument of the wrong type_ is passed, the accessor throws an exception
* If _no argument_ is passed, the accessor returns the field's value

## Base API

~ helper.**chart**(_ChartType_);

Returns a new chart object depending on _ChartType_ string. Supported _ChartType_ values are:

* _"pie"_ - for a pie chart
* _"donut"_ - for a donut chart

Unknown _ChartType_ values throw _"Unknown chart type"_ exception.

~ helper.**graph**();

Returns new Graph object. The Graph object is the parent of all d3-helper objects.

~ helper.**version**();

Returns d3-helper version information string in _"major.minor.bugfix"_ form.

## Graph

~ helper.graph().**d3**(_D3_);

Accessor. Gets / sets D3 field, which stores the D3 result of d3-helper's actions.

~ helper.graph().**data**(_Data_);

Accessor. Gets / sets graph data field. Data must follow the convention defined by a given chart type in order for it to be visualised. Generally, the data is structured in an array of key-value anonymous objects.

~ helper.graph().**height**(_Height_);

Accessor. Gets / sets the height of the graph's SVG element.

~ helper.graph().**target**(_Target_);

Accessor. Gets / sets identifier of parent DOM element the graph will be appended to.

~ helper.graph().**width**(_Width_);

Accessor. Gets / sets the width of the graph's SVG element.

## Charts

### Bar

**Data format.** Data is structured as key-value pairs inside an anonymous object. For example:

```javascript
var data =
[
  { key: "Apple", value: 10 },
  { key: "Banana", value: 20 }
];
```

### Pie

**Data format.** Data is structured as key-value pairs inside an anonymous object. For example:

```javascript
var data =
[
  { key: "Apple", value: 10 },
  { key: "Banana", value: 20 }
];
```

~ helper.chart('pie').**colorScale**(_D3ColorScale_);

Accessor. Gets / sets the D3 color scale that affects a pie segment's fill color. The _D3ColorScale_ argument must be a D3 scale object. The default scale is _d3.scale.category10();

~ helper.chart('pie').**draw**();

Draws the graph. Before drawing. updates _position_ and _outerRadius_ fields if update functions were passed as arguments to _outerRadius()_ and _position()_ methods.

~ helper.chart('pie').**outerRadius**(_OuterRadius_);

Accessor. Gets / sets pie chart outer radius. Defaults to half of the smaller of the graph's size measures; meaning the pie chart fills the graph along either the width or height (or both) of the graph.

The _OuterRadius_ argument can be either a number or a function

~ helper.chart('pie').**position**(_Position_);

Accessor. Gets / sets pie chart position. Defaults to half of the smaller of the graph's size measures; meaning the pie chart is centred either vertically or horizontally (or both) inside the graph. The _Position_ argument must be an [_XOffset_, _YOffset_] array of values.

### Donut

The donut chart is a type of pie chart with an added inner radius. Therefore, all of the fields and methods defined in the pie chart are inherited by the donut chart.

**Data format.** Data is structured as key-value pairs inside an anonymous object. For example:

```javascript
var data =
[
  { key: "Apple", value: 10 },
  { key: "Banana", value: 20 }
];
```
