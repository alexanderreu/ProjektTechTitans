<<<<<<< HEAD

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
=======
// Her hentes data fra plastik fate
fetch('http://localhost:3001/AME_f')
    .then(response => response.json())
    .then(Africa_MiddleEast_fate=> {

      console.log(Africa_MiddleEast_fate);
        });

fetch('http://localhost:3001/Amer_f')
    .then(response => response.json())
    .then(americas_fate=> {
    
    console.log(americas_fate);
    });

fetch('http://localhost:3001/Asia_f')
    .then(response => response.json())
    .then(asia_fate=> {
    
    console.log(asia_fate);
    });

fetch('http://localhost:3001/Euro_f')
    .then(response => response.json())
    .then(europa_fate=> {
    
    console.log(europa_fate);
    });

fetch('http://localhost:3001/Ocea_f')
    .then(response => response.json())
    .then(oceania_fate=> {
    
    console.log(oceania_fate);
    });

fetch('http://localhost:3001/Wor_f')
    .then(response => response.json())
    .then(world_fate=> {
    
    console.log(world_fate);
    });

// Her hentes data fra Share of global plastic waste emitted to ocean

fetch('http://localhost:3001/AME_eo')
    .then(response => response.json())
    .then(Africa_MiddleEast_emit_ocean=> {
    
    console.log(Africa_MiddleEast_emit_ocean);
    });

fetch('http://localhost:3001/Amer_eo')
    .then(response => response.json())
    .then(Americas_emit_ocean=> {
    
    console.log(Americas_emit_ocean);
    });

fetch('http://localhost:3001/Asia_eo')
    .then(response => response.json())
    .then(Asia_emit_ocean=> {
    
    console.log(Asia_emit_ocean);
    });

fetch('http://localhost:3001/Euro_eo')
    .then(response => response.json())
    .then(Europa_emit_ocean=> {
    
    console.log(Europa_emit_ocean);
    });

fetch('http://localhost:3001/Ocea_eo')
    .then(response => response.json())
    .then(Oceania_emit_ocean=> {
    
    console.log(Oceania_emit_ocean);
    });
>>>>>>> a555bc6a66e5a0f42dd6af106164b602d23a6d16
