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


// Her defineres højden og bredden for svg-elementet
  const width = 1400;
  const height = 800;
  document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', () => {
        box.classList.toggle('expanded');
    });
});
// Her tilføjes svg-elementet til body
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

/* Der laves en Mercator-projektion, hvorefter skalaen indstilles i forhold til hvor meget der skal zoomes ind eller ud.
 Slutligt placeres den i forhold til centrum af siden */
  const projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.6]);

// Der oprettes en sti-generator, der angiver den geografiske projektion ved hjælp af den tidligere defineret Mercator-projektion
  const path = d3.geoPath().projection(projection);

  // Farverne defineres for hvert kontinent når de trykkes på 
  const continentColors = {
    "Asia": "lightgreen",
    "Europe": "lightgreen",
    "Africa": "lightgreen",
    "Americas": "lightgreen",
    "Oceania": "lightgreen"
  };

  // Der oprettes en standardfarve for hvert kontinent   
  const defaultColor = "white";

  // Dataen fra hver geojson fil indlæses for hvert kontinent
  Promise.all([
    d3.json("asia.geojson"),
    d3.json("europe.geojson"),
    d3.json("africa_middle_east.geojson"),
    d3.json("americas.geojson"),
    d3.json("oceania.geojson")
  ]).then(continentsData => {
   
    // Sti-generatoren bruges nu til at konvertere den geografiske data til SVG-stier, så de kan tegnes på kortet
    svg.selectAll("path")
      .data(continentsData) // Dataen indlæses
      .enter()
      .append("g") // Dataen tilføjes til "g"
      .attr("class", "continent") // Klassen "continent" tilføjes til hver af de nye "g"
      .attr("continentFile", d => d.features[0].properties.continent) // Der tilføjes en attribut med navnet "continentFile", som returnere vædien af det valgt lands kontinent  
      .selectAll("path")
      .data(d => d.features) //Hvert lands features bindes nu på den geografiske data 
      .enter()
      .append("path") // Der tilføjes nu et nyt path element
      .attr("d", path) // Attributten "d" tilføjes til det nye path element, med dataen fra "path" som er tidligere defineret
      .attr("fill", defaultColor) //Attributten "fill" sættes på det nye path element, og sættes til defaultColor
      .on("click", function (event, d) {
        const continent = d3.select(this.parentNode).attr("continentFile");
    
        // Nulstil farve for alle kontinenter
        d3.selectAll(".continent path").attr("fill", defaultColor);
    
        // Ændrer farven for det valgte kontinent
        d3.selectAll(`.continent[continentFile="${continent}"] path`).attr("fill", continentColors[continent]);
    
        // Tjekker om det valgte kontinent er Afrika og Mellemøsten
        if (continent === "africa_middle_east") {
            fetchAndDisplayData(); // Funktionen til at hente og vise data for Afrika og Mellemøsten
        }
    });
    
    function fetchAndDisplayData() {
        fetch('http://localhost:3001/AME_f')
            .then(response => response.json())
            .then(data => {
                const africaMiddleEastData = data.Africa_MiddleEast_fate;
                // Antager at du vil vise data for de første fire år
                for (let i = 0; i < 4; i++) {
                    const yearData = africaMiddleEastData[i];
                    const content = `År: ${yearData.year}\nRecycled: ${yearData.share_of_waste_recycled_from_total_regional_waste}%\nIncinerated: ${yearData.share_of_waste_incinerated_from_total_regional_waste}%`;
                    document.getElementById(`box${i + 1}`).innerText = content;
                }
            })
            .catch(error => console.error('Error:', error));
    }
    
  })
  
  document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/AME_f')
        .then(response => response.json())
        .then(data => {
            const africaMiddleEastData = data.Africa_MiddleEast_fate;
            // Antager at du vil vise data for de første fire år
            for (let i = 0; i < 18; i++) {
                const yearData = africaMiddleEastData[i];
                const content = `År: ${yearData.year}\nRecycled: ${yearData.share_of_waste_recycled_from_total_regional_waste}%\nIncinerated: ${yearData.share_of_waste_incinerated_from_total_regional_waste}%`;
                document.getElementById(`box${i + 1}`).innerText = content;
            }
        })
        .catch(error => console.error('Error:', error));
});
;
