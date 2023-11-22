
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

fetch('http://localhost:3001/Africa_eo')
    .then(response => response.json())
    .then(emit_ocean=> {
    
    console.log(emit_ocean);
    });

fetch('http://localhost:3001/Americas_eo')
    .then(response => response.json())
    .then(emit_ocean=> {
    
    console.log(emit_ocean);
    });

fetch('http://localhost:3001/Asia_eo')
    .then(response => response.json())
    .then(emit_ocean=> {
    
    console.log(emit_ocean);
    });

fetch('http://localhost:3001/Europe_eo')
    .then(response => response.json())
    .then(emit_ocean=> {
    
    console.log(emit_ocean);
    });

fetch('http://localhost:3001/Oceania_eo')
    .then(response => response.json())
    .then(emit_ocean=> {
    
    console.log(emit_ocean);
    });

let endpointUrl='http://localhost:3001/Wor_f';
    
const tooltip = d3.select('body').append('div')
.attr('class','tooltip')
.style('opacity', 0);

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
    d3.json("oceania.geojson")])
    .then(continentsData => {
   
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
    
        // Log kontinentet til consolen
        console.log(`Klik på kontinent: ${continent}`);

          // Kald 'handleContinentClick' med navnet på det valgte kontinent
        handleContinentClick(continent); // Dette er tilføjelsen

        fetchDataAndDisplayDiagram(continent);

        showWelcomeText(continent);
      });
    });
    
 
    function showWelcomeText(continent) {
        // Fjern eksisterende velkomsttekst
        d3.selectAll(".welcome-text").remove();
      
        // Opret ny velkomsttekst baseret på kontinentet
        const welcomeText = svg.append("text")
          .attr("class", "welcome-text")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("font-size", 20)
          .text(`Velkommen til ${continent}`);
           
}
      

function fillYearSelector(data) {
    const selector = document.getElementById('yearSelector');
    data.forEach((yearData, index) => {
      let option = document.createElement('option');
      option.value = index; // Brug indexet af data array som værdi
      option.text = yearData.year; // Vis årstallet som tekst
      selector.appendChild(option);
    });
  selector.value=0;
    // Sæt en event listener til at opdatere boksene, når et nyt år vælges
    selector.addEventListener('change', (event) => {
      updateBoxContent(data, event.target.value);
    });
  }

// Denne funktion vil håndtere klik på hvert kontinent og hente/viser data.
function handleContinentClick(continent) {
const endpoints = {
    'Africa': 'AME_f',
    'Americas': 'Amer_f',
    'Asia': 'Asia_f',
    'Europe': 'Euro_f',
    'Oceania': 'Ocea_f',
    'World': 'Wor_f'
};

const endpoint = endpoints[continent];
if (endpoint) {
    console.log("update")
    fetchAndDisplayData(endpoint, 'box'); 
    // Nulstil eller opdater årsvælgeren for det nye kontinent
    // Du skal tilføje logik her for at håndtere årsvælgeren
} else {
    console.error(`Endpoint for ${continent} not found.`);
}
}


// Din generelle funktion til at hente og vise data
function fetchAndDisplayData(endpoint, containerPrefix) {
fetch(`http://localhost:3001/${endpoint}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.values);
        fillYearSelector(data.values); // Udfyld årsvælgeren
          updateBoxContent(data.values, 0); // Vis data for det første år som standard
    })
    .catch(error => console.error('Error:', error));
}
  

// Denne funktion organiserer opdateringen af alle bokse baseret på det valgte år.
function updateBoxContent(data, selectedIndex) {
const selectedYearData = data[selectedIndex];
updateSingleBoxContent('box_recycled', selectedYearData, 'Share_of_waste_recycled_from_total_regional_waste', '/Recycled001.png');
updateSingleBoxContent('box_incinerated', selectedYearData, 'Share_of_waste_incinerated_from_total_regional_waste', '/Incinerated001.png');
updateSingleBoxContent('box_mismanaged_littered', selectedYearData, 'Share_of_littered_and_mismanaged_from_total_regional_waste', '/Mismanaged_littered001.png');
updateSingleBoxContent('box_landfilled', selectedYearData, 'Share_of_waste_landfilled_from_total_regional_waste', '/Landfilled001.png');
}

function updateSingleBoxContent(boxId, yearData, dataField, imagePath) {
const box = document.getElementById(boxId);
if (box) {
    // Ryd eksisterende indhold
    box.innerHTML = '';
    
    // Tilføj billede
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = dataField; // Tilføj 'alt' for bedre tilgængelighed
    img.className = 'boxImage';
    box.appendChild(img);
    
    // Tilføj tekst
    const content = document.createElement('div');
    content.className = 'boxContent';
    const dataValue = yearData[dataField] || 'Data ikke tilgængelig'; // Tilføj fallback for undefined værdier
    content.innerText = `${dataField.replace(/_/g, ' ')}: ${dataValue}%`;
    box.appendChild(content);
} else {
    console.error(`Box with id '${boxId}' not found.`);
}
}


// Denne event handler udføres, når DOM'en er fuldt indlæst.
document.addEventListener('DOMContentLoaded', () => {

    fetch(endpointUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.values) {
          fillYearSelector(data.values); // Udfyld årsvælgeren
          updateBoxContent(data.values, 0); // Vis data for det første år som standard
        }
      })
      .catch(error => console.error('Error:', error));
  });


    
      // Fetcher Afrika og Mellemøsten data
// Function to fetch data and display diagram based on continent
function fetchDataAndDisplayDiagram(continent) {
    const endpoint = `http://localhost:3001/${continent}_eo`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.ok) {
                // Show diagram for the specific continent
                clearAndShowDiagram(data.emit_ocean);
            } else {
                // Display an error message
                document.write("<h1>ERROR</h1>");
            }
        })
        .catch(error => {
            // Handle fetch errors
            console.error('Fetch error:', error);
            document.write("<h1>ERROR</h1>");
        });
}
      
      // Funktion laves for det femte diagram (Afrika og Mellemøsten)
function clearAndShowDiagram(dataArray) {
    // Clear existing content
    d3.select("#my_dataviz5").select("svg").remove();
  
    // Dimensioner og margener for det femte diagram (Afrika og Mellemøsten)
    var margin = { top: 50, right: 50, bottom: 120, left: 80 },
      width = 900 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;
  
    // Svg til body for det femte diagram (Afrika og Mellemøsten)
    var svg5 = d3.select("#my_dataviz5")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // X akse for det femte diagram (Afrika og Mellemøsten)
    var x5 = d3.scaleBand()
      .range([0, width])
      .domain(dataArray.map(function (d) { return d.entity; }))
      .padding(0.2);
  
    svg5.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x5))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  
    // Y akse for det femte diagram (Afrika og Mellemøsten)
    var y5 = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function (d) { return d.share_of_global_plastics_emittet_to_ocean; })])
      .range([height, 0]);
  
    svg5.append("g")
      .call(d3.axisLeft(y5));
  
    // Y-akse label for det femte diagram (Afrika og Mellemøsten)
    svg5.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Plastikforurening per land i Afrika og Mellemøsten (procent)");
  
    // Bars for det femte diagram (Afrika og Mellemøsten)
  svg5.selectAll("mybar")
  .data(dataArray)
  .enter()
  .append("rect")
  .attr("x", function (d) { return x5(d.entity); })
  .attr("width", x5.bandwidth())
  .attr("fill", "#42280E")
  .attr("height", 0)
  .attr("y", height)

  // Tooltip for Afrika og Mellemøsten chart
  .on("mouseover", function (event, d) {
    console.log("Mouseover event triggered for Afrika og Mellemøsten:", event, d);
    const tooltip = d3.select("#tooltip");

    tooltip.transition()
      .duration(200)
      .style("opacity", .9);

    tooltip.html(`<strong>Land:</strong> ${d.entity}<br><strong>Andel af plastikforurening:</strong> ${parseFloat(d.share_of_global_plastics_emittet_to_ocean).toFixed(2)}%`)
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
  })

  .on("mouseout", function () {
    const tooltip = d3.select("#tooltip");

    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  })

  // Animation for det femte diagram (Afrika og Mellemøsten)
  .transition()
  .duration(800)
  .attr("y", function (d) { return y5(d.share_of_global_plastics_emittet_to_ocean); })
  .attr("height", function (d) { return height - y5(d.share_of_global_plastics_emittet_to_ocean); })
  .delay(function (d, i) { return i * 100; });
}

