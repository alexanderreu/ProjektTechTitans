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