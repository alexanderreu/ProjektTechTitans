const express = require("express")
const { Client } = require("pg");
const app = express()
const port = 3001

//Variabler defineres for plastik fate, så de kan bruges nedunder 
const AME_f_qry = "SELECT * FROM africa_middleeast_fate ORDER BY africa_fate_id ASC";
const Amer_f_qry = "SELECT * FROM americas_fate ORDER BY americas_fate_id ASC";
const Asia_f_qry = "SELECT * FROM asia_fate ORDER BY asia_fate_id ASC";
const Euro_f_qry = "SELECT * FROM europa_fate ORDER BY europa_fate_id ASC";
const Ocea_f_qry = "SELECT * FROM oceania_fate ORDER BY oceania_fate_id ASC";
const Wor_f_qry = "SELECT * FROM world_fate ORDER BY world_fate_id ASC";

//Variabler defineres for Share of global plastic waste emitted to ocean, så de kan bruges nedunder
const AME_emit_qry = "SELECT * FROM africa_middleeast_emit_ocean ORDER BY africa_eo_id ASC";
const Amer_emit_qry = "SELECT * FROM americas_emit_ocean ORDER BY americas_eo_id ASC";
const Asia_emit_qry = "SELECT * FROM asia_emit_ocean ORDER BY asia_eo_id ASC";
const Euro_emit_qry = "SELECT * FROM europa_emit_ocean ORDER BY europa_eo_id ASC";
const Ocea_emit_qry = "SELECT * FROM oceania_emit_ocean ORDER BY oceania_eo_id ASC";


const global_plastic_qry = "SELECT * FROM global_plastic_production ORDER BY gpo_id ASC";


// Oplysninger for skydatabasen benyttes til at oprette forbindelse til vores database 
const klient = new Client({
user: "jsdrsqxl", // Brug din egen bruger her
host: "ella.db.elephantsql.com", // Brug din egen Server her
database: "jsdrsqxl", // Din kalorie database
password: "nwCWVnk28d8xGklo-DSvNbsosVmN6yj7", // Dit password i skyen.
port: 5432
});

klient.connect();



//Der laves en route-funktionen, der kalder på den ønskede endepunkt ved hjælp af en callback funktion  
// Herunder laves den for 'global_plastic_production' tablen 

app.get("/global_plastic", async (req, res) => {
    try {
    let queryData = await klient.query(global_plastic_qry);
    res.json({
    "ok": true,
    "global_plastic": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})


//Der laves en route-funktionen, der kalder på den ønskede endepunkt ved hjælp af en callback funktion  
// Herunder laves de for alle 'plastik fate' tables 
app.get("/AME_f", async (req, res) => {
    try {
    let queryData = await klient.query(AME_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Amer_f", async (req, res) => {
    try {
    let queryData = await klient.query(Amer_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Asia_f", async (req, res) => {
    try {
    let queryData = await klient.query(Asia_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Euro_f", async (req, res) => {
    try {
    let queryData = await klient.query(Euro_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Euro_f", async (req, res) => {
    try {
    let queryData = await klient.query(Euro_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Ocea_f", async (req, res) => {
    try {
    let queryData = await klient.query(Ocea_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Wor_f", async (req, res) => {
    try {
    let queryData = await klient.query(Wor_f_qry);
    res.json({
    "ok": true,
    "values": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

//Der laves en route-funktionen, der kalder på den ønskede endepunkt ved hjælp af en callback funktion  
// Herunder laves de for alle 'Share of global plastic waste emitted to ocean' tables 

app.get("/Africa_eo", async (req, res) => {
    try {
    let queryData = await klient.query(AME_emit_qry);
    res.json({
    "ok": true,
    "emit_ocean": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Americas_eo", async (req, res) => {
    try {
    let queryData = await klient.query(Amer_emit_qry);
    res.json({
    "ok": true,
    "emit_ocean": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Asia_eo", async (req, res) => {
    try {
    let queryData = await klient.query(Asia_emit_qry);
    res.json({
    "ok": true,
    "emit_ocean": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Europe_eo", async (req, res) => {
    try {
    let queryData = await klient.query(Euro_emit_qry);
    res.json({
    "ok": true,
    "emit_ocean": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

app.get("/Oceania_eo", async (req, res) => {
    try {
    let queryData = await klient.query(Ocea_emit_qry);
    res.json({
    "ok": true,
    "emit_ocean": queryData.rows,
    })
    } catch (error) {
    res.json({
    "ok": false,
    "message": error.message,
    })
}
})

    app.listen(port, () => {
        console.log(`Appl. lytter på http://localhost:${port}`)
        })




