var width = 600;
var height = 600;
var margin = {top: 40, bottom: 40, left: 40, right: 100};

// Get svg
var svg = d3.select('#my-svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

// Create inner container to hold the bar chart
var g = svg.append('g')
  .attr('width', width)
  .attr('height', height)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var x0 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1)
  .paddingOuter(0.15);

var x1 = d3.scaleBand()
  .padding(0.05);

var y = d3.scaleLinear()
  .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#7fbf7b", "#af8dc3"]);



d3.csv('data/mindthegap2.csv', type, function(error, data) {

  var keys = data.columns.slice(1);

  // Set domains
  x0.domain(data.map(function(d) { return d['Treatments']; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) {
    return d3.max(keys, function(key) {
      return d[key]; });
  }) + 1]).nice();

  g.append('g')
    .selectAll('g')
    .data(data)
    .enter().append('g')
      .attr('transform', d => { return 'translate(' + x0(d['Treatments']) + ',0)'; })
    .selectAll('rect')
    .data(d => {
      return keys.map(key => {
        return {key: key, value: d[key]};
      });
    })
    .enter().append('rect')
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  // Add legend
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 18)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr('font-size', 18)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });


  // Append xAxis
  g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0))
      .attr('font-size', '18');

  // Append yAxis
  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr('fill', '#fff')
      .attr("transform", "rotate(-90)")
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "1.21em")
      .style("text-anchor", "end")
      .text("global cohesion (principle orientation)")
      .attr('font-size', '16')
      .style('fill', 'black');


  // Add F statistics for draft
  g.append('line')
    .style('stroke', 'grey')
    .attr('x1', x0('Draft Explanation') + x1.bandwidth() + 10)
    .attr('x2', x0('Draft Explanation') + x1.bandwidth() + 10)
    .attr('y1', y(2.6))
    .attr('y2', y(2.7));

  g.append('text')
    .attr('x', x0('Draft Explanation') + x1.bandwidth() + 10)
    .attr('y', y(2.8))
    .text('F(1,25) = 0.24, p = .63')
    .attr('text-anchor', 'middle')
    .attr('font-size', 18);



  // Add F statistics for revision
  g.append('line')
    .style('stroke', 'grey')
    .attr('x1', x0('Revision Explanation') + x1.bandwidth() + 10)
    .attr('x2', x0('Revision Explanation') + x1.bandwidth() + 10)
    .attr('y1', y(3.1))
    .attr('y2', y(3.2));

  g.append('text')
    .attr('x', x0('Revision Explanation') + x1.bandwidth() + 10)
    .attr('y', y(3.3))
    .text('F(1,24) = 2.93, p = .10, np2 = .11')
    .attr('text-anchor', 'middle')
    .attr('font-size', 18);


  // Add F statistics for revision
  g.append('line')
    .style('stroke', 'grey')
    .attr('x1', x0('Transfer Explanation') + x1.bandwidth() + 10)
    .attr('x2', x0('Transfer Explanation') + x1.bandwidth() + 10)
    .attr('y1', y(2.9))
    .attr('y2', y(2.95));

  g.append('text')
    .attr('x', x0('Transfer Explanation') + x1.bandwidth() + 10)
    .attr('y', y(3.0))
    .text('F(1,25) = 7.89, p = .01*, np2 = .24')
    .attr('text-anchor', 'middle')
    .attr('font-size', 18);




});

function type(d, i, columns) {
  d['Concept-Map'] = +d['Concept-Map'];
  d['Control'] = +d['Control'];
  return d;
}
