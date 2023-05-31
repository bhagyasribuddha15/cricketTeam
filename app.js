const express = require("express");
const app = express();
module.exports = app;
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertDbObjToResObj = (dbObject) => {
    return {
        playerId : dbObject.player_id,
        playerName : dbObject.player_name,
        jerseyNumber : dbObject.jersey_number,
        role : dbObject.role,
    }
};

app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT 
    * FROM 
    cricket_team
    `;

  const allPlayers = await db.all(getPlayers);
  response.send(allPlayers.map((eachplayer) => {
      convertDbObjToResObj(eachplayer)
  ))
  ;
});
