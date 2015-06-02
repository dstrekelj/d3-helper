d3-helper
---------

A collection of methods for quick and easy d3 visualisations. Requires [d3](https://github.com/mbostock/d3) to work, of course.

Check out the repository wiki for a full API reference.

## Example use

The repository contains an _index.html_ file with several examples of bar, donut, and pie charts.  Here's a quick example of how the helper works, done in a way we can see the changes made:

```javascript
/**
 * The data must be an array of key-value pairs (bar, donut,
 * and pie charts usually visualise only one dimension)
 */
var data = [
      { key: 'Apples', value: 24 },
      { key: 'Bananas', value: 12 },
      { key: 'Coconuts', value: 8 }
    ];
// Set up the base graph object
var graph = helper.graph().width(400).height(400).data(data);
// Create a new pie chart instance and tell it to use `graph`
var pie = helper.chart('pie').graph(graph)
// Let's draw a pie chart to an element with 'pie1' ID
pie.target('#pie1').draw();
// Let's add key and value labels, with keys below values
pie.target('#pie2')
  .label('key', 'below')
  .label('value', 'above')
  .draw();
// The labels should be offset a bit...
pie.target('#pie3')
  .labelOffset(1.2)
  .labelSpacing(10)
  .draw();
// Perfect. But the pie radius is a bit too large!
pie.target('#pie4')
  .outerRadius(100)
  .draw();
// It would look cool in the top left corner, I think
pie.target('#pie5')
  .position([100, 100])
  .draw();
// And to finish, let's give the chart a fresh coat of paint
pie.target('#pie6')
  .colorScale(d3.scale.category20c())
  .draw();
```

## TODO

Lots of stuff! Interactive updates, mouse event handlers, other chart types, etc.