$(document).ready(function () {
  // Lyt efter klik på "Hjem"-menuvalget
  $('a[href="#Hjem"]').on("click", function (event) {
    // Forhindre standard klikadfærd
    event.preventDefault();

    // Rul til toppen af siden over 500 millisekunder
    $("html, body").animate({ scrollTop: 0 }, 500);

    // Vent 600 millisekunder og genindlæs siden
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
  // Vis/skjul knappen baseret på scrollpositionen
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
let endpointUrl = "https://plastikforurening-server.onrender.com/Wor_f";

// Der defineres en variabel med vores localhost for global_plastic, som skal bruges senere i vores script
let endpointUrlWorld =
  "https://plastikforurening-server.onrender.com/global_plastic";

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
    .data(continentsData)
    .enter()
    // Opret et nyt gruppeelement ("g") for hver data-post og tilføj klassen "continent"
    .append("g")
    .attr("class", "continent")
    // Tilføj attributten "continentFile" til hver gruppe med kontinentet for det valgte land
    .attr("continentFile", (d) => d.features[0].properties.continent)

    // Indlejrer en ny selektion inden i hver gruppe og tilknytter features fra den geografiske data
    .selectAll("path")
    .data((d) => d.features)
    .enter()
    // Opret et nyt path element for hver feature
    .append("path")
    // Sæt attributten "d" for hvert path element til dataen fra "path"
    .attr("d", path)
    // Sæt farveattributten "fill" for hvert path element til defaultColor
    .attr("fill", defaultColor)
    // Tilføjer en klikhændelse til hvert path element
    .on("click", function (event, d) {
      /*Inde i klikfunktionen, vælges det overordnede element for det klikkede path-element,
      og henter derefter værdien af attributten "continentFile". Denne værdi gemmes i variablen continent*/
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Nulstil farve for alle kontinenter
      d3.selectAll(".continent path").attr("fill", defaultColor);

      // Ændrer farven for det valgte kontinent
      d3.selectAll(`.continent[continentFile="${continent}"] path`).attr(
        "fill",
        continentColors[continent]
      );

      // Funktionen handleContinentClick kaldes med continent som argument, variablen continent er defineret ovenfor
      handleContinentClick(continent);

      // Funktionen fetchDataAndDisplayDiagram kaldes med continent som argument, variablen continent er defineret ovenfor
      fetchDataAndDisplayDiagram(continent);

      // Funktionen showWelcomeText kaldes med continent som argument, variablen continent er defineret ovenfor
      showWelcomeText(continent);
    })

    // Tilføjer animation med streger ved hover
    .on("mouseover", function (event, d) {
      // Henter data for kontinentet der er mouseover
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Startværdien for stregbredde
      const initialStrokeWidth = 0.0;

      // Animation for stregbredde
      d3.selectAll(`.continent[continentFile="${continent}"] path`)
        .transition()
        .duration(200)
        .attrTween("stroke-width", function () {
          // Slutværdien / transition for stregbredden
          const targetStrokeWidth = 0.5;

          // Der animeres en overgang fra en startværdi til en slutværdi
          const interpolate = d3.interpolate(
            initialStrokeWidth,
            targetStrokeWidth
          );

          return function (t) {
            return interpolate(t);
          };
        })
        //Stregerne farves sort
        .attr("stroke", "black");
    })
    // Der oprettes en handling der håndtere når der er mouseout
    .on("mouseout", function (event, d) {
      // Henter data for kontinentet hvor musen er over
      const continent = d3.select(this.parentNode).attr("continentFile");

      // Fjerner stregerne når musen flyttes væk fra kontinentet
      d3.selectAll(`.continent[continentFile="${continent}"] path`)
        .transition()
        .duration(200)
        .attr("stroke", "none");
    });
});

// Der defineres en variabel "kontinent" som holder værdien for det vi gerne vil have skrevet i vores overskrift
const kontinent = {
  Africa: "Afrikas og mellemøstens",
  Americas: "Amerikas",
  Asia: "Asiens",
  Europe: "Europas",
  Oceania: "Oceaniens",
};

// Der definderes en global variabel til at holde styr på den aktuelle overskrift
let currentWelcomeText = null;

/* Funktionen showWelcomeText viser velkomstteksten baseret på det valgte kontinent. Den fjerner først den eksisterende tekst,
 opretter et nyt element og tilføjer teksten baseret på det valgte kontinent*/
function showWelcomeText(continent) {
  if (currentWelcomeText) {
    currentWelcomeText.remove();
  }

  // DOM-elementet med id'en "welcome-container" vælges ved hjælp af D3.js-biblioteket
  const welcomeContainer = d3.select("#welcome-container");

  // Der oprettes et nyt div-element for velkomstteksten og tilføjes en klasse
  currentWelcomeText = welcomeContainer
    .append("div")
    .attr("class", "welcome-text");

  // Tjekker om et kontinent er valgt
  if (continent) {
    // Hvis et kontinent er valgt, visses teksten som blev defineret ovenfor i variablen "kontinent"
    currentWelcomeText.text(
      `${kontinent[continent]} håndtering af plastik affald`
    );
    // Hvis intet kontinent er valgt, visses en generel tekst om verdens håndtering af plastikaffald
  } else {
    currentWelcomeText.text("Verdens håndtering af plastik affald");
  }
}
//funktionen showWelcomeText kaldes og tager null som argument
showWelcomeText(null);

// Funktion til at fylde indholdet af årsvælgeren baseret på det leverede data-array
function fillYearSelector(data) {
  // Der defineres en variabel, som tildeles værdien af det returneret DOM-elementet med id'en "yearSelector"
  const selector = document.getElementById("yearSelector");

  // Iterér gennem hvert år i det leverede data-array
  data.forEach((yearData, index) => {
    // Opret et nyt HTML-option-element
    let option = document.createElement("option");

    // Brug indexet af data-arrayet som værdi for hvert år
    option.value = index;

    // Vis årstallet som tekst i det oprettede option-element
    option.text = yearData.year;

    // Tilføj det oprettede option-element til årsvælgeren
    selector.appendChild(option);
  });

  // Sæt værdien af årsvælgeren til det første år i data-arrayet
  selector.value = 0;

  // Sæt en event listener til at opdatere boksene, når et nyt år vælges i årsvælgeren
  selector.addEventListener("change", (event) => {
    // Opdater boksens indhold baseret på det valgte år
    updateBoxContent(data, event.target.value);
  });
}

// Denne funktion håndterer klik på hvert kontinent og henter/viser data.
function handleContinentClick(continent) {
  // Ryd bjælke diagrammet først
  clearBarChart();

  // Definér endpoints for hvert kontinent for at hente data
  const endpoints = {
    Africa: "AME_f",
    Americas: "Amer_f",
    Asia: "Asia_f",
    Europe: "Euro_f",
    Oceania: "Ocea_f",
    World: "Wor_f",
  };

  // Find det relevante endpoint baseret på det valgte kontinent
  const endpoint = endpoints[continent];

  // Hvis et gyldigt endpoint findes, opdateres data og vises i boksen
  if (endpoint) {
    console.log("update");
    fetchAndDisplayData(endpoint, "box");

    // Nulstil eller opdater årsvælgeren for det nye kontinent
    // Du skal tilføje logik her for at håndtere årsvælgeren

    // Rul til en generisk containerklasse for alle kontinenter med en animation over 1000 ms
    $("html, body").animate({ scrollTop: $(".container").offset().top }, 1000);
  } else {
    // Hvis der ikke findes et endpoint for det valgte kontinent, udskrives en fejlmeddelelse i konsollen
    console.error(`Endpoint for ${continent} not found.`);
  }
}

/*Din generelle funktion til at hente og vise data.
Definerer en funktion kaldet fetchAndDisplayData med to parametre: endpoint og containerPrefix*/
function fetchAndDisplayData(endpoint, containerPrefix) {
  /*Udfører en forespørgsel til den specificerede URL, som kombinerer en base-URL (https://plastikforurening-server.onrender.com/) med endpoint-parameteren. 
  Denne forespørgsel henter data fra vores lokale server.*/
  fetch(`https://plastikforurening-server.onrender.com/${endpoint}`)
    //Når serveren svarer, konverteres svaret til JSON-format
    .then((response) => response.json())
    //Efter konvertering af svaret til JSON, håndteres dataene i denne blok
    .then((data) => {
      console.log(data.values);
      //kalder funktionen clearYearSelector, som nulstiller den eksisterende årsvælger
      clearYearSelector();
      //Opdaterer årsvælgeren med nye data ved at kalde fillYearSelector og give den values-egenskaben fra de hentede data.
      fillYearSelector(data.values);
      // Viser data for det første år som standard
      updateBoxContent(data.values, 0);
    })
    //hvis fejl opstår,fanges fejlen, og en fejlmeddelelse logges til konsollen
    .catch((error) => console.error("Error:", error));
}

// Tilføj denne nye funktion til at rydde årsvælgeren så vi undgår duplikater
function clearYearSelector() {
  //Finder et HTML-element i dokumentet med id'et "yearSelector" og tilskriver det til variablen selector.
  const selector = document.getElementById("yearSelector");
  //while-loop, der kører, så længe selector-elementet har et eller flere valgmuligheder.
  while (selector.options.length > 0) {
    //Fjerner det første option-element fra selector-elementet.
    selector.remove(0);
  }
}

// Vælger alle elementer med klassen 'box' og anvender en funktion på hvert element
document.querySelectorAll(".box").forEach((box) => {
  // Tilføjer en 'click'-event-lytter til hver 'box'
  box.addEventListener("click", () => {
    // Toggler 'expanded'-klassen på den 'box', der blev klikket på
    box.classList.toggle("expanded");
  });
});

// definerer en funktion ved navn updateBoxContent, som tager to parametre: data og selectedIndex
function updateBoxContent(data, selectedIndex) {
  // Der oprettes en ny variabel selectedYearData, som henter datasættet for det specifikke år eller indeks, som brugeren har valgt.
  const selectedYearData = data[selectedIndex];
  //Her kaldes en anden funktion, updateSingleBoxContent, fire gange med forskellige parametre. Hver kald opdaterer en specifik 'box' på hjemmesiden.
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

//Definerer en funktion kaldet updateSingleBoxContent, der tager fire parametre: boxId, yearData, dataField, og imagePath.
function updateSingleBoxContent(boxId, yearData, dataField, imagePath) {
  //Finder HTML-elementet med det givne ID og tilskriver det til variablen box.
  const box = document.getElementById(boxId);
  if (box) {
    // Rydder alt eksisterende indhold i box-elementet.
    box.innerHTML = "";
    // Opretter et nyt billede-element og gemmer det i variablen img
    const img = document.createElement("img");
    //Sætter billedets kilde til den angivne imagePath.
    img.src = imagePath;
    //Sætter billedets alternativ tekst til dataField
    img.alt = dataField;
    //Tilføjer en klasse med navnet "boxImage" til billedet
    img.className = "boxImage";
    //appender det nyoprettede billede-element til box-elementet.
    box.appendChild(img);

    // Opretter et nyt div element til at holde teksten og gemmer det i variablen content.
    const content = document.createElement("div");
    //Tilføjer en klasse med navnet "boxContent" til det nye div element.
    content.className = "boxContent";
    //Henter værdien fra yearData objektet, der matcher dataField nøglen. Hvis værdien ikke findes, bruges teksten "Data ikke tilgængelig".
    const dataValue = yearData[dataField] || "Data ikke tilgængelig";
    //Sætter tekstindholdet af content-elementet.
    content.innerText = `${dataField.replace(/_/g, " ")}: ${dataValue}%`;
    //appender det nyoprettede div element med tekst som et barn til box-elementet.
    box.appendChild(content);
  } else {
    //Hvis der ikke findes noget element med det angivne ID, vil denne linje skrive en fejlmeddelelse til konsollen.
    console.error(`Box with id '${boxId}' not found.`);
  }
}

// når HTML-dokumentet er fuldt indlæst udløses 'DOMContentLoaded' eventen
document.addEventListener("DOMContentLoaded", () => {
  //Udfører en fetch til den url, der er gemt  i variablen 'endpointURL'
  fetch(endpointUrl)
    //.then metoden tager svaret og forsøger at parse det som JSON
    .then((response) => response.json())
    //.then() metode bruges her til at arbejde med de parsed JSON data.
    .then((data) => {
      //tjekker, om data og data.values eksisterer.
      if (data && data.values) {
        fillYearSelector(data.values);
        updateBoxContent(data.values, 0);
      }
    })
    //.catch() metoden  fanger eventuelle fejl og logger den til konsollen.
    .catch((error) => console.error("Error:", error));
});

function clearBarChart() {
  // Vælger container elementet ved hjælp af ID og fjerner alt indhold inde i det
  const chartContainer = d3.select("#my_dataviz2");

  if (!chartContainer.empty()) {
    // Fjerner det indre 'svg' element, som indeholder barcharten
    chartContainer.selectAll("svg").remove();
  }
}

// Denne event handler sørger for at grafen med data om global plastik produktion bliver vist når hjemmesiden reloades
document.addEventListener("DOMContentLoaded", () => {
  //Udfører en fetch til den url, der er gemt  i variablen 'endpointUrlWorld'
  fetch(endpointUrlWorld)
    //.then metoden tager svaret og forsøger at parse det som JSON
    .then((response) => response.json())
    //.catch() metoden  fanger eventuelle fejl og logger den til konsollen.
    .catch((error) => console.error("Error:", error));
});

// Fetcher global data fra den angivet url
fetch("https://plastikforurening-server.onrender.com/global_plastic")
  //.then metoden tager svaret og forsøger at parse det som JSON
  .then((response) => response.json())
  //.then() metode bruges her til at arbejde med de parsed JSON data.
  .then((global_plastic) => {
    console.log(global_plastic.global_plastic);
    //tjekker om ok-egenskaben i global_plastic-objektet er sand. Hvis ja, antages det, at dataene blev hentet korrekt
    if (global_plastic.ok) {
      //rydder det eksisterende diagram og viser et nyt diagram baseret på de hentede data
      clearAndShowDiagramGlobal(global_plastic.global_plastic);
    } else {
      //Hvis ok-egenskaben ikke er sand, skrives der "ERROR" i et <h1>-tag direkte til dokumentet.
      document.write("<h1>ERROR</h1>");
    }
  });

//Funktionen clearAndShowDiagramGlobal defineres og tager et parameter: dataArray
function clearAndShowDiagramGlobal(dataArray) {
  //Tager et element med ID'et my_dataviz2 og fjerner underordnet svg elementer inde i my_dataviz2.
  d3.select("#my_dataviz2").select("svg").remove();
  // Tager et element med ID'et my_dataviz2 og fjerner underordnet h1 elementer inde i my_dataviz2.
  d3.select("#my_dataviz2").select("h1").remove();

  //Dimensioner og margener for global

  /*Opretter et objekt kaldet margin, der definerer afstanden fra kanten af visualiseringsområdet til selve indholdet. 
  Består af 4 egenskaber: top, right, bottom og left*/
  var margin = { top: 50, right: 50, bottom: 120, left: 100 },
    // width bliver defineret og er sat til 1200 pixels minus venstre og højre margin.
    width = 1200 - margin.left - margin.right,
    //højden bliver defineret og er sat til 700 pixels minus top og bund margin.
    height = 700 - margin.top - margin.bottom;

  // Svg til body for global
  var svg4 = d3
    //Vælger det første element i DOM'en, der matcher id "#my_dataviz2".
    .select("#my_dataviz2")
    //appender svg-elementet
    .append("svg")
    //Sætter bredden på SVG-elementet.
    .attr("width", width + margin.left + margin.right)
    //sætter højden op svg-elementet
    .attr("height", height + margin.top + margin.bottom)
    //appender et gruppe elementet inde i svg-elementet
    .append("g")
    //flytter gruppe elementet til højre og nedad baseret på værdierne af margin.left og margin.top.
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X akse for global

  //Definerer en variabel x4, der opretter en ny band-skala ved hjælp af D3.js.
  var x4 = d3
    .scaleBand()
    //Sætter rækkevidden af skalaen. Her er rækkevidden sat fra 0 til width
    .range([0, width])
    /*domænet er sat et sæt af værdier udledt fra dataArray.
    map funktionen bruges til at oprette et array af årstal fra dataArray, hvor hvert element d repræsenterer et datapunkt, og d.year er egenskaben, der angiver årstallet.*/
    .domain(
      dataArray.map(function (d) {
        return d.year;
      })
    )
    //Tilføjer en lille mængde plads mellem hver band eller søjle på skalaen
    .padding(0.2);

  // Tilføjer en gruppe i SVG til at holde x-aksen
  svg4
    .append("g")
    // Flytter gruppen til bunden af SVG-elementet
    .attr("transform", "translate(0," + height + ")")
    // Genererer og placerer x-aksen baseret på x4-skalaen
    .call(d3.axisBottom(x4))
    // Vælger al tekst i x-aksen (typisk aksen labels)
    .selectAll("text")
    // Drejer tekstlabels på x-aksen for bedre læsbarhed
    .attr("transform", "translate(-10,0)rotate(-45)")
    // Justerer tekstens ankerpunkt for korrekt alignment
    .style("text-anchor", "end");

  // Y akse for global

  // Initialiserer en lineær skala for Y-aksen i diagrammet
  var y4 = d3
    .scaleLinear()
    // Definerer domænet for Y-aksen
    .domain([
      // Starter fra 0, hvilket er den laveste værdi på Y-aksen
      0,
      // Finder den højeste værdi i dataArray for 'annual_plastic_production' og sætter det som øvre grænse
      d3.max(dataArray, function (d) {
        return d.annual_plastic_production_between_1950_and_2019;
      }),
    ])
    // Sætter rækkevidden for Y-aksen fra 'height' til 0
    .range([height, 0]);

  svg4.append("g").call(d3.axisLeft(y4));

  // Y-akse label for global

  // Vælger HTML-elementet med id 'my_dataviz2' og tilføjer en overskrift (h1)
  d3.select("#my_dataviz2")
    .append("h1")
    // Sætter stilen for overskriften til at være centreret
    .style("text-align", "center")
    // Bruger Arial skrifttype for overskriften
    .style("font-family", "Arial, sans-serif")
    // Sætter skriftstørrelsen til 24 pixels
    .style("font-size", "24px")
    // Tilføjer margin over og under overskriften
    .style("margin", "20px 0")
    // Sætter teksten i overskriften
    .text("Global plastikproduktion");

  // Tilføjer et tekst-element til SVG-elementet svg4
  svg4
    .append("text")
    // Tilføjer en klasse til tekst-elementet for yderligere styling
    .attr("class", "y-axis-label")
    // Sætter en rotationstransformation, her bruges 0 grader, så ingen rotation
    .attr("transform", "rotate(0)")
    // Positionerer teksten 30 pixels over y-aksen
    .attr("y", -30)
    // Positionerer teksten 5 pixels til venstre fra y-aksen
    .attr("x", -5)
    // Justerer vertikal positionering yderligere med 1em
    .attr("dy", "1em")
    // Sætter ankerpunktet for teksten til midten, for bedre centrering
    .style("text-anchor", "middle")
    // Sætter selve teksten, der vises ved y-aksen
    .text("Tons");

  // Bars for global
  svg4
    .selectAll("mybar")
    // Binder dataArray til de fremtidige 'rect' (rektangel/søjle) elementer
    .data(dataArray)
    // Behandler hvert element i dataArray der endnu ikke har en tilsvarende 'rect'
    .enter()
    // Tilføjer et 'rect' element for hvert datapunkt i dataArray
    .append("rect")
    // Sætter x-positionen for hver søjle baseret på året (bruger x4-skalaen)
    .attr("x", function (d) {
      return x4(d.year);
    })
    // Sætter bredden for hver søjle baseret på den forudbestemte båndbredde af x4-skalaen
    .attr("width", x4.bandwidth())
    // Farver søjlerne med en bestemt farvekode
    .attr("fill", "#513918")
    // Initialiserer søjlernes højde til 0 (vil sandsynligvis blive animeret senere)
    .attr("height", 0)
    // Sætter startpositionen for y (toppen af hver søjle) til bunden af diagrammet
    .attr("y", height)

    /*Tooltip for global
    event handler for 'mouseover'-hændelsen til SVG-elementet. Funktionen udløses derefter og har to argumenter: (event,d)*/
    .on("mouseover", function (event, d) {
      console.log("Mouseover event triggered for World:", event, d);
      //Vælger et element med id 'tooltip' fra DOM'en.
      const tooltip = d3.select("#tooltip");
      //Starter en overgang på tooltip-elementet, der varer 200 millisekunder.
      tooltip.transition().duration(200).style("opacity", 0.9);
      /*Sætter HTML-indholdet inden i tooltip-elementet til en streng, 
      som viser årstal og mængden af global plastikproduktion for det pågældende år.*/
      tooltip
        .html(
          `<strong>År:</strong> ${
            d.year
          }<br><strong>Global plastikproduktion:</strong> ${parseFloat(
            d.annual_plastic_production_between_1950_and_2019
          ).toFixed(2)} tons `
        )
        //Placerer tooltip-elementet i nærheden af musemarkøren
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    //eventhandler for mouseout hændelsen. Når musen føres væk udføres funktionen
    .on("mouseout", function () {
      const tooltip = d3.select("#tooltip");
      //Starter en anden overgang på tooltip-elementet, der varer 500 millisekunder.
      tooltip.transition().duration(500).style("opacity", 0);
    })

    /* Animation for global 
    starter animationssekvensen*/
    .transition()
    //Angiver varigheden af animationen til 800 millisekunder
    .duration(800)
    /*Opdaterer 'y'-attributten for hvert element baseret på data. Funktionen tager et datapunkt d og returnerer en y-værdi udregnet af skala-funktionen y4. 
    Dette bestemmer den vertikale position af hvert element i diagrammet baseret på værdien af annual_plastic_production_between_1950_and_2019 for hvert datapunkt.*/
    .attr("y", function (d) {
      return y4(d.annual_plastic_production_between_1950_and_2019);
    })
    /*Her opdatereres 'height'-attributten for hvert element. Dette fastsætter højden af hvert element i diagrammet.
    Højden beregnes som den totale højde af diagramområdet minus den y-værdi, der er udregnet for datapunktet.*/
    .attr("height", function (d) {
      return height - y4(d.annual_plastic_production_between_1950_and_2019);
    })
    //delay er sat til det enkelte elements indeks i datasættet med hver efterfølgende element, der starter sin animation 100 millisekunder efter det forrige.
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

/*Funktion til at hente data og vise et diagram baseret på kontinent
Funktionen fetchDataAndDisplayDiagram og tager en parameter: continent*/
function fetchDataAndDisplayDiagram(continent) {
  // Opretter URL til API-endpoint baseret på det valgte kontinent
  const endpoint = `https://plastikforurening-server.onrender.com/${continent}_eo`;
  // Udfører en fetch forespørgsel til det oprettede endpoint
  fetch(endpoint)
    // Konverterer svaret fra serveren til JSON
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Tjekker om dataene blev hentet korrekt
      if (data.ok) {
        // Behandler hver datapunkt i 'emit_ocean' arrayet
        data.emit_ocean.forEach(function (d) {
          // Konverterer værdien til et tal
          d.share_of_global_plastics_emittet_to_ocean = parseFloat(
            d.share_of_global_plastics_emittet_to_ocean
          );
        });
        // Kalder funktionen  clearAndShowDiagram for at rydde og vise det nye diagram med de hentede data
        clearAndShowDiagram(data.emit_ocean, labelTextMap[`${continent}_eo`]);
      } else {
        // Viser en fejlmeddelelse, hvis data ikke blev hentet korrekt
        document.write("<h1>ERROR</h1>");
      }
    })
    .catch((error) => {
      // Logger en fejl til konsollen, hvis fetch-anmodningen mislykkes
      console.error("Fetch error:", error);
      // Viser en fejlmeddelelse, hvis der opstår en fejl under fetch-anmodningen
      document.write("<h1>ERROR</h1>");
    });
}

// Funktion defineret for at rydde og vise diagram
function clearAndShowDiagram(dataArray, labelText) {
  // Fjerner eksisterende overskrift(er) (h1-tag) fra elementet med id 'my_dataviz2'
  d3.select("#my_dataviz2").select("h1").remove();
  // Fjerner eksisterende SVG-element(er) fra elementet med id 'my_dataviz1'
  d3.select("#my_dataviz1").select("svg").remove();
  // Fjerner også en eksisterende overskrift (h1-tag) fra elementet med id 'my_dataviz1'
  d3.select("#my_dataviz1").select("h1").remove();

  /* Dimensioner og margener for diagram.
  Opretter et variabel kaldet margin, der definerer afstanden fra kanten af visualiseringsområdet til selve indholdet. 
  Består af 4 egenskaber: top, right, bottom og left*/
  var margin = { top: 50, right: 50, bottom: 120, left: 80 },
    //bredden af visualiseringsområdet. Sat til 900 pixels her minus venstre og højre margin.
    width = 900 - margin.left - margin.right,
    //højden af visualiseringsområdet. Sat til 700 pixels her minus top og bund margin.
    height = 700 - margin.top - margin.bottom;

  // Svg til body
  //Definerer en variabel svg5 og bruger D3.js til at vælge det første DOM-element med id #my_dataviz1.
  var svg5 = d3
    .select("#my_dataviz1")
    //appender et nyt SVG-element til den valgte container.
    .append("svg")
    //Sætter bredden på SVG-elementet.
    .attr("width", width + margin.left + margin.right)
    //Sætter højden på SVG-elementet.
    .attr("height", height + margin.top + margin.bottom)
    //appender et 'g' (gruppe) element indeni SVG-elementet.
    .append("g")
    //flytter gruppen af elementer med en afstand svarende til venstre og top marginer
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X akse

  // Opretter en band-skala til brug for X-aksen
  var x5 = d3
    .scaleBand()
    // Definerer rækkevidden af skalaen fra start til slut af aksen
    .range([0, width])
    // Angiver domænet for skalaen med unikke værdier fra 'entity' i dataArray
    .domain(
      dataArray.map(function (d) {
        return d.entity;
      })
    )
    // Tilføjer en lille afstand mellem hver band på aksen for at skabe plads mellem søjlerne
    .padding(0.2);

  // Tilføjer og positionerer X-aksen i SVG-elementet
  svg5
    .append("g")
    // Flytter X-aksen til bunden af SVG-elementet
    .attr("transform", "translate(0," + height + ")")
    // Genererer X-aksen med ticks og labels baseret på x5-skalaen
    .call(d3.axisBottom(x5))
    // Vælger alle tekstlabels på X-aksen
    .selectAll("text")
    // Drejer labels for at forhindre overlap og forbedre læsbarhed
    .attr("transform", "translate(-10,0)rotate(-45)")
    // Justerer tekstens ankerpunkt til slutningen for korrekt placering
    .style("text-anchor", "end");

  // Y akse for det femte diagram
  // Opretter en skala for y-aksen, som er linæer
  var y5 = d3
    .scaleLinear()
    // Opretter skalaens område af data, fra 0 til max-værdi i datasættet
    .domain([
      0,
      d3.max(dataArray, function (d) {
        return d.share_of_global_plastics_emittet_to_ocean;
      }),
    ])
    // Angiver området af pixels, der skal bruges til at repræsentere domænet
    .range([height, 0]);

  // Tilføjer og kalder en akse, som viser numeriske værdier langs aksen
  svg5.append("g").call(d3.axisLeft(y5));

  // Vælger d3 elementet
  d3.select("#my_dataviz1")
    // Tilføjer en overskrift
    .append("h1")
    // Centrer teksten
    .style("text-align", "center")
    // Sætter skrifttypen
    .style("font-family", "Arial, sans-serif")
    // Sætter skriftstørrelse
    .style("font-size", "24px")
    // Sætter margen
    .style("margin", "20px 0")
    // Indsætter teksten for overskriften
    .text(labelText);

  // Tilføjer tekst til SVG-elementet
  svg5
    // Tilføjer tekst-element
    .append("text")
    // Definerer elementet
    .attr("class", "y-axis-label")
    // Roterer teksten med 180 grader
    .attr("transform", "rotate(-180)")
    // Sætter y-kordinaten for teksten
    .attr("y", +0)
    // Sætter x-kordinaten for teksten
    .attr("x", +30)
    // Tilpasser y-kordinaten for teksten
    .attr("dy", "1em")
    // Placerer teksten i midten
    .style("text-anchor", "middle")
    // Indsætter teksten
    .text("%");

  // Bars for det femte diagram
  // Tilføjelse af bars
  svg5
    // Vælger alle elementer som hedder "mybar"
    .selectAll("mybar")
    // Kobler dataen til valgte elementer
    .data(dataArray)
    // Oprettelse af datapunkter uden matchende elementer
    .enter()
    // Tilføjelse af rektangler til datapunkter
    .append("rect")
    // Angiver x-kordinatens værdi på baggrund af entity værdi i data
    .attr("x", function (d) {
      return x5(d.entity);
    })
    // Sætter bredden på rektanglet
    .attr("width", x5.bandwidth())
    // Farven af rektanglet
    .attr("fill", "#513918")
    // Søjlen starter på 0 for animation
    .attr("height", 0)
    // Y-kordinaten sættes til bunden af SVG-elementet
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
