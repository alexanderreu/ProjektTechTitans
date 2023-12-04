$(document).ready(function () {
  // Lyt efter klik på "Hjem"-menuvalget
  $('a[href="#Hjem"]').on("click", function (event) {
    // Forhindre standard klikadfærd
    event.preventDefault();

    // Rul til toppen af siden over 500 millisekunder
    $("html, body").animate({ scrollTop: 0 }, 500);

    // Vent 600 millisekunder (0.6 sekunder) og genindlæs siden
    setTimeout(function () {
      location.reload();
    }, 600);
  });
});

$(document).ready(function () {
  // Lyt efter klik på "Håndtering af plastik"-menuvalget
  $('a[href="#Håndtering af plastik"]').on("click", function (event) {
    // Forhindre standard klikadfærd
    event.preventDefault();

    // Rul ned til containeren over 500 millisekunder
    $("html, body").animate({ scrollTop: $(".container").offset().top }, 500);
  });
});

// Lyt efter klik på knappen
$("#scrollToGraphsBtn").on("click", function () {
  // Rul ned til graferne over 500 millisekunder
  $("html, body").animate({ scrollTop: $(".grafer").offset().top }, 500);
});

$(document).ready(function () {
  // Lyt efter klik på "Håndtering af plastik"-menuvalget
  $('a[href="#Plastik i havet"]').on("click", function (event) {
    // Forhindre standard klikadfærd
    event.preventDefault();

    // Rul ned til containeren over 500 millisekunder
    $("html, body").animate({ scrollTop: $(".grafer").offset().top }, 500);
  });
});

$(document).ready(function () {
  // Vis eller skjul knappen baseret på scrollpositionen
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $("#backToTopBtn").fadeIn();
    } else {
      $("#backToTopBtn").fadeOut();
    }
  });

  // Rul til toppen ved klik på knappen
  $("#backToTopBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
});

// Der defineres en variabel med vores localhost for world_fate, som skal bruges senere i vores script
let endpointUrl = "http://localhost:3001/Wor_f";

// Der defineres en variabel med vores localhost for global_plastic, som skal bruges senere i vores script
let endpointUrlWorld = "http://localhost:3001/global_plastic";

// Her defineres vores tooltip, som bruges senere til visning af grafer. Den vil indstil videre være usynlig
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Her defineres højden og bredden for svg-elementet
const width = 1400;
const height = 800;

// Her tilføjes svg-elementet til body
const svg = d3
  .select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

/* Der laves en Mercator-projektion, hvorefter skalaen indstilles i forhold til hvor meget der skal zoomes ind eller ud.
 Slutligt placeres den i forhold til centrum af siden */
const projection = d3
  .geoMercator()
  .scale(150)
  .translate([width / 2, height / 1.6]);

// Der oprettes en sti-generator, der angiver den geografiske projektion ved hjælp af den tidligere defineret Mercator-projektion
const path = d3.geoPath().projection(projection);

// Farverne defineres for hvert kontinent når de trykkes på
const continentColors = {
  Asia: "lightgreen",
  Europe: "lightgreen",
  Africa: "lightgreen",
  Americas: "lightgreen",
  Oceania: "lightgreen",
};

// Der oprettes en standardfarve for hvert kontinent
const defaultColor = "white";

// Dataen fra hver geojson fil indlæses for hvert kontinent
Promise.all([
  d3.json("asia.geojson"),
  d3.json("europe.geojson"),
  d3.json("africa_middle_east.geojson"),
  d3.json("americas.geojson"),
  d3.json("oceania.geojson"),
]).then((continentsData) => {
  // Sti-generatoren bruges nu til at konvertere den geografiske data til SVG-stier, så de kan tegnes på kortet
  svg
    .selectAll("path")
    .data(continentsData) // Dataen indlæses
    .enter()
    .append("g") // Dataen tilføjes til "g"
    .attr("class", "continent") // Klassen "continent" tilføjes til hver af de nye "g"
    .attr("continentFile", (d) => d.features[0].properties.continent) // Der tilføjes en attribut med navnet "continentFile", som returnere vædien af det valgt lands kontinent
    .selectAll("path")
    .data((d) => d.features) //Hvert lands features bindes nu på den geografiske data
    .enter()
    .append("path") // Der tilføjes nu et nyt path element
    .attr("d", path) // Attributten "d" tilføjes til det nye path element, med dataen fra "path" som er tidligere defineret
    .attr("fill", defaultColor) //Attributten "fill" sættes på det nye path element, og sættes til defaultColor
    .on("click", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Nulstil farve for alle kontinenter
      d3.selectAll(".continent path").attr("fill", defaultColor);

      // Ændrer farven for det valgte kontinent
      d3.selectAll(`.continent[continentFile="${continent}"] path`).attr(
        "fill",
        continentColors[continent]
      );

      // Funktionen handleContinentClick kaldes med continent som argument,
      handleContinentClick(continent);

      // Funktionen fetchDataAndDisplayDiagram kaldes med continent som argument,
      fetchDataAndDisplayDiagram(continent);

      // Funktionen showWelcomeText kaldes med continent som argument,
      showWelcomeText(continent);
    })

    .on("mouseover", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Change the stroke color to show hover effect
      d3.selectAll(`.continent[continentFile="${continent}"] path`).attr(
        "stroke",
        "black"
      );

      // Add any other actions you want to perform on hover
    })
    .on("mouseout", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Change the stroke color back to none on mouseout
      d3.selectAll(`.continent[continentFile="${continent}"] path`).attr(
        "stroke",
        "none"
      );
    })
    .on("mouseover", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Start værdien for stroke bredde
      const initialStrokeWidth = 0.0;

      // Animation for stroke
      d3.selectAll(`.continent[continentFile="${continent}"] path`)
        .transition()
        .duration(200)
        .attrTween("stroke-width", function () {
          // Slut værdien / transition for stroke bredde
          const targetStrokeWidth = 0.5;

          // Fra start -> slut værdi
          const interpolate = d3.interpolate(
            initialStrokeWidth,
            targetStrokeWidth
          );

          return function (t) {
            return interpolate(t);
          };
        })
        .attr("stroke", "black");
    })
    .on("mouseout", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Fjern stroke når mus fjernes
      d3.selectAll(`.continent[continentFile="${continent}"] path`)
        .transition()
        .duration(200)
        .attr("stroke", "none");
    })

    .on("mouseover", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Start værdien for stroke bredde
      const initialStrokeWidth = 0.0;

      // Animation for stroke
      d3.selectAll(`.continent[continentFile="${continent}"] path`)
        .transition()
        .duration(200)
        .attrTween("stroke-width", function () {
          // Slut værdien / transition for stroke bredde
          const targetStrokeWidth = 0.5;

          // Fra start -> slut værdi
          const interpolate = d3.interpolate(
            initialStrokeWidth,
            targetStrokeWidth
          );

          return function (t) {
            return interpolate(t);
          };
        })
        .attr("stroke", "black");
    })
    .on("mouseout", function (event, d) {
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Fjern stroke når mus fjernes
      d3.selectAll(`.continent[continentFile="${continent}"] path`)
        .transition()
        .duration(200)
        .attr("stroke", "none");
    });
});

const kontinent = {
  Africa: "Afrikas",
  Americas: "Amerikas",
  Asia: "Asiens",
  Europe: "Europas",
  Oceania: "Oceaniens",
};

let currentWelcomeText = null;

function showWelcomeText(continent) {
  if (currentWelcomeText) {
    currentWelcomeText.remove();
  }

  const welcomeContainer = d3.select("#welcome-container");
  currentWelcomeText = welcomeContainer
    .append("div")
    .attr("class", "welcome-text");

  if (continent) {
    currentWelcomeText.text(
      `${kontinent[continent]} håndtering af plastik affald`
    );
  } else {
    currentWelcomeText.text("Verdens håndtering af plastik affald");
  }
}
showWelcomeText(null);

function fillYearSelector(data) {
  const selector = document.getElementById("yearSelector");
  data.forEach((yearData, index) => {
    let option = document.createElement("option");
    option.value = index; // Brug indexet af data array som værdi
    option.text = yearData.year; // Vis årstallet som tekst
    selector.appendChild(option);
  });
  selector.value = 0;
  // Sæt en event listener til at opdatere boksene, når et nyt år vælges
  selector.addEventListener("change", (event) => {
    updateBoxContent(data, event.target.value);
  });
}

// Denne funktion vil håndtere klik på hvert kontinent og hente/viser data.
function handleContinentClick(continent) {
  clearBarChart();
  const endpoints = {
    Africa: "AME_f",
    Americas: "Amer_f",
    Asia: "Asia_f",
    Europe: "Euro_f",
    Oceania: "Ocea_f",
    World: "Wor_f",
  };

  const endpoint = endpoints[continent];
  if (endpoint) {
    console.log("update");
    fetchAndDisplayData(endpoint, "box");
    // Nulstil eller opdater årsvælgeren for det nye kontinent
    // Du skal tilføje logik her for at håndtere årsvælgeren
    // Scroll to a generic container class for all continents
    $("html, body").animate({ scrollTop: $(".container").offset().top }, 1000);
  } else {
    console.error(`Endpoint for ${continent} not found.`);
  }
}

// Din generelle funktion til at hente og vise data
function fetchAndDisplayData(endpoint, containerPrefix) {
  fetch(`http://localhost:3001/${endpoint}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.values);
      clearYearSelector();
      fillYearSelector(data.values); // Udfyld årsvælgeren
      updateBoxContent(data.values, 0); // Vis data for det første år som standard
    })
    .catch((error) => console.error("Error:", error));
}

// Tilføj denne nye funktion til at rydde årsvælgeren så vi undgår duplikater
function clearYearSelector() {
  const selector = document.getElementById("yearSelector");
  while (selector.options.length > 0) {
    selector.remove(0);
  }
}

document.querySelectorAll(".box").forEach((box) => {
  box.addEventListener("click", () => {
    box.classList.toggle("expanded");
  });
});

// Denne funktion organiserer opdateringen af alle bokse baseret på det valgte år.
function updateBoxContent(data, selectedIndex) {
  const selectedYearData = data[selectedIndex];
  updateSingleBoxContent(
    "box_recycled",
    selectedYearData,
    "Share_of_waste_recycled_from_total_regional_waste",
    "/Recycled001.png"
  );
  updateSingleBoxContent(
    "box_incinerated",
    selectedYearData,
    "Share_of_waste_incinerated_from_total_regional_waste",
    "/Incinerated001.png"
  );
  updateSingleBoxContent(
    "box_mismanaged_littered",
    selectedYearData,
    "Share_of_littered_and_mismanaged_from_total_regional_waste",
    "/Mismanaged_littered001.png"
  );
  updateSingleBoxContent(
    "box_landfilled",
    selectedYearData,
    "Share_of_waste_landfilled_from_total_regional_waste",
    "/Landfilled001.png"
  );
}

function updateSingleBoxContent(boxId, yearData, dataField, imagePath) {
  const box = document.getElementById(boxId);
  if (box) {
    // Ryd eksisterende indhold
    box.innerHTML = "";

    // Tilføj billede
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = dataField; // Tilføj 'alt' for bedre tilgængelighed
    img.className = "boxImage";
    box.appendChild(img);

    // Tilføj tekst
    const content = document.createElement("div");
    content.className = "boxContent";
    const dataValue = yearData[dataField] || "Data ikke tilgængelig"; // Tilføj fallback for undefined værdier
    content.innerText = `${dataField.replace(/_/g, " ")}: ${dataValue}%`;
    box.appendChild(content);
  } else {
    console.error(`Box with id '${boxId}' not found.`);
  }
}

// Denne event handler udføres, når DOM'en er fuldt indlæst.
document.addEventListener("DOMContentLoaded", () => {
  fetch(endpointUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.values) {
        fillYearSelector(data.values); // Udfyld årsvælgeren
        updateBoxContent(data.values, 0); // Vis data for det første år som standard
      }
    })
    .catch((error) => console.error("Error:", error));
});

function clearBarChart() {
  // Vælg container elementet ved hjælp af ID og fjern alt indhold inde i det
  const chartContainer = d3.select("#my_dataviz2");

  if (!chartContainer.empty()) {
    // Fjerner det indre 'svg' element, som indeholder barcharten
    chartContainer.selectAll("svg").remove();
  }
}

// Denne event handler sørger for at grafen med data om global plastik produktion bliver vist når hjemmesiden reloades
document.addEventListener("DOMContentLoaded", () => {
  fetch(endpointUrlWorld)
    .then((response) => response.json())
    .catch((error) => console.error("Error:", error));
});

// Fetcher global data
fetch("http://localhost:3001/global_plastic")
  .then((response) => response.json())
  .then((global_plastic) => {
    console.log(global_plastic.global_plastic);
    if (global_plastic.ok) {
      clearAndShowDiagramGlobal(global_plastic.global_plastic);
    } else {
      document.write("<h1>ERROR</h1>");
    }
  });

// Funktion for global
function clearAndShowDiagramGlobal(dataArray) {
  // Clear existing content
  d3.select("#my_dataviz2").select("svg").remove();
  d3.select("#my_dataviz2").select("h1").remove();

  // Dimensioner og margener for global
  var margin = { top: 50, right: 50, bottom: 120, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // Svg til body for global
  var svg4 = d3
    .select("#my_dataviz2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X akse for global
  var x4 = d3
    .scaleBand()
    .range([0, width])
    .domain(
      dataArray.map(function (d) {
        return d.year;
      })
    )
    .padding(0.2);

  svg4
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x4))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y akse for global
  var y4 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataArray, function (d) {
        return d.annual_plastic_production_between_1950_and_2019;
      }),
    ])
    .range([height, 0]);

  svg4.append("g").call(d3.axisLeft(y4));

  // Y-akse label for global
  d3.select("#my_dataviz2")
    .append("h1")
    .style("text-align", "center")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "24px")
    .style("margin", "20px 0")
    .text("Global plastikproduktion");

  svg4
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(0)")
    .attr("y", -30)
    .attr("x", -5)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Tons");

  // Bars for global
  svg4
    .selectAll("mybar")
    .data(dataArray)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x4(d.year);
    })
    .attr("width", x4.bandwidth())
    .attr("fill", "#42280E")
    .attr("height", 0)
    .attr("y", height)

    // Tooltip for global
    .on("mouseover", function (event, d) {
      console.log("Mouseover event triggered for World:", event, d);
      const tooltip = d3.select("#tooltip");

      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html(
          `<strong>År:</strong> ${
            d.year
          }<br><strong>Global plastikproduktion:</strong> ${parseFloat(
            d.annual_plastic_production_between_1950_and_2019
          ).toFixed(2)} tons `
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })

    .on("mouseout", function () {
      const tooltip = d3.select("#tooltip");

      tooltip.transition().duration(500).style("opacity", 0);
    })

    // Animation for global
    .transition()
    .duration(800)
    .attr("y", function (d) {
      return y4(d.annual_plastic_production_between_1950_and_2019);
    })
    .attr("height", function (d) {
      return height - y4(d.annual_plastic_production_between_1950_and_2019);
    })
    .delay(function (d, i) {
      return i * 100;
    });
}
const labelTextMap = {
  Americas_eo: "Lande i Amerika og deres andel af plastikforurening i havene",
  Asia_eo: "Lande i Asien og deres andel af plastikforurening i havene",
  Europe_eo: "Lande i Europa og deres andel af plastikforurening i havene",
  Oceania_eo: "Lande i Oceanien og deres andel af plastikforurening i havene",
  Africa_eo: "Lande i Afrika og deres andel af plastikforurening i havene",
};

// Function to fetch data and display diagram based on continent
function fetchDataAndDisplayDiagram(continent) {
  const endpoint = `http://localhost:3001/${continent}_eo`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.ok) {
        data.emit_ocean.forEach(function (d) {
          d.share_of_global_plastics_emittet_to_ocean = parseFloat(
            d.share_of_global_plastics_emittet_to_ocean
          );
        });
        console.log(data.emit_ocean);
        // Pass the appropriate label text when calling clearAndShowDiagram
        clearAndShowDiagram(data.emit_ocean, labelTextMap[`${continent}_eo`]);
      } else {
        document.write("<h1>ERROR</h1>");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      document.write("<h1>ERROR</h1>");
    });
}

// Funktion laves for det femte diagram (Afrika og Mellemøsten)
function clearAndShowDiagram(dataArray, labelText) {
  // Clear existing content
  d3.select("#my_dataviz2").select("h1").remove();
  d3.select("#my_dataviz1").select("svg").remove();
  d3.select("#my_dataviz1").select("h1").remove();

  // Dimensioner og margener for det femte diagram (Afrika og Mellemøsten)
  var margin = { top: 50, right: 50, bottom: 120, left: 80 },
    width = 900 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // Svg til body for det femte diagram (Afrika og Mellemøsten)
  var svg5 = d3
    .select("#my_dataviz1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X akse for det femte diagram (Afrika og Mellemøsten)
  var x5 = d3
    .scaleBand()
    .range([0, width])
    .domain(
      dataArray.map(function (d) {
        return d.entity;
      })
    )
    .padding(0.2);

  svg5
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x5))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y akse for det femte diagram
  var y5 = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataArray, function (d) {
        return d.share_of_global_plastics_emittet_to_ocean;
      }),
    ])
    .range([height, 0]);

  svg5.append("g").call(d3.axisLeft(y5));

  d3.select("#my_dataviz1")
    .append("h1")
    .style("text-align", "center")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "24px")
    .style("margin", "20px 0")
    .text(labelText);

  svg5
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-180)")
    .attr("y", +0)
    .attr("x", +30)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("%");

  // Bars for det femte diagram
  svg5
    .selectAll("mybar")
    .data(dataArray)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x5(d.entity);
    })
    .attr("width", x5.bandwidth())
    .attr("fill", "#42280E")
    .attr("height", 0)
    .attr("y", height)

    // Tooltip for barchart med information om hvert land i kontinentet og dets andel af plastikforurening ved mouseover hændelse.
    .on("mouseover", function (event, d) {
      // definerer en funktion, der håndterer mouseover-hændelsen.
      console.log(
        "Mouseover event triggered for Afrika og Mellemøsten:",
        event,
        d
      );
      const tooltip = d3.select("#tooltip");

      //starter en overgangsanimation for tooltip'ens gennemsigtighed.
      tooltip.transition().duration(200).style("opacity", 0.9);

      /*Når brugeren fører musen hen over et element i visualiseringen vises en lille boks tæt på musen
      Den viser specifik information om det pågældende land og dets andel af plastikforurenin.*/
      tooltip
        .html(
          `<strong>Land:</strong> ${
            d.entity
            //"d.entity" sørger for at det land der vises i tooltippen er bundet til det element musen føres hen over.
          }<br><strong>Andel af plastikforurening:</strong> ${parseFloat(
            d.share_of_global_plastics_emittet_to_ocean
          ).toFixed(2)}%`
          //Konverter dataen til et tal vha. parseFloat og sætter tallet til 2 decimaler.
        )
        //Sørger for at tooltippens position er nær musen ved mouseover hændelsen.
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    //Fjerner tooltip, når musen forlader elementet.
    .on("mouseout", function () {
      const tooltip = d3.select("#tooltip");

      //starter en overgangsanimation med en avrighed sat til 500 millisekunder der ændrer gennemsigtigheden
      tooltip.transition().duration(500).style("opacity", 0);
    })

    //Animation for det femte diagram
    //Definerer en animation, der varer 800 millisekunder for hvert rektangel.
    .transition()
    .duration(800)
    //Bestemmer positionen af hvert rektangel baseret på data
    .attr("y", function (d) {
      return y5(d.share_of_global_plastics_emittet_to_ocean);
    })
    //Bestemmer højden af hvert rektangel baseret på data
    .attr("height", function (d) {
      return height - y5(d.share_of_global_plastics_emittet_to_ocean);
    })
    /*funktion, der bliver kaldt for hvert element. Funktionen modtager to argumenter, d og i
    Forsinkelsen af animationen i millisekunder. For hvert element stiger forsinkelsen med 100 millisekunder.*/
    .delay(function (d, i) {
      return i * 100;
    });
}
