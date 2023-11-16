
// JavaScript code for an interactive world map using D3.js

// Width and height for the SVG
const width = 960, height = 600;

// Define map projection
const projection = d3.geoMercator()
                     .translate([width / 2, height / 2])
                     .scale(150);

// Define path generator using the projection
const path = d3.geoPath()
               .projection(projection);

// Create SVG element
const svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

// Load the GeoJSON data for continents
d3.json("continents.geojson").then(data => {
    svg.selectAll("path")
       .data(data.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("class", "continent")
       .style("fill", "steelblue")
       .style("stroke", "white")
       .style("stroke-width", "1")
       // Adding hover effect
       .on("mouseover", function() {
           d3.select(this)
             .style("fill", "green");
       })
       .on("mouseout", function() {
           d3.select(this)
             .style("fill", "steelblue");
       })
       // Adding click event
       .on("click", function(event, d) {
           alert("Clicked on " + d.propeties.continent);
       });
});
