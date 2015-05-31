d3-helper API
-------------

## General guidelines

**Accessor methods.** Accessor methods behave as follows (unless specified otherwise):

* If _an argument of the right type_ is passed, the accessor sets the property's value to the argument
* If _an argument of the wrong type_ is passed, the accessor throws an exception
* If _no argument_ is passed, the accessor returns the property's value

## Base API

helper.**chart**(_ChartType_);

Returns a new chart object depending on _ChartType_ string. Supported _ChartType_ values are:

* _"pie"_ - for a pie chart
* _"donut"_ - for a donut chart

Unknown _ChartType_ values throw _"Unknown chart type"_ exception.

helper.**graph**();

Returns new Graph object. The Graph object is the 'root' of all d3-helper objects.

helper.**version**();

Returns d3-helper version information string in _"major.minor.bugfix"_ form.

## Graph

helper.graph().**d3**(_D3_);

Accessor.

helper.graph().**data**(_Data_);

Accessor. Gets / sets graph data field. Data must follow the convention defined by a given chart type in order for it to be visualised. Generally, the data is structured in an array of key-value anonymous objects.

helper.graph().**height**(_Height_);

Accessor- Gets / sets graph height.

helper.graph().**target**(_Target_);

Accessor. Gets / sets identifier of parent DOM element the graph will be appended to.

helper.graph().**width**(_Width_);

Accessor. Gets / sets graph width.

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

helper.chart('pie').**colorScale**(_D3ColorScale_);

Accessor.

helper.chart('pie').**draw**();

Draws the graph. Before drawing. updates _position_ and _outerRadius_ fields if update functions were passed as arguments to _outerRadius()_ and _position()_ methods.

helper.chart('pie').**outerRadius**(_OuterRadius_);

Accessor.

helper.chart('pie').**position**(_OuterRadius_);

Accessor.

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
