const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Get All The Players

const convertDbObjToResponseObj = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
        * 
    FROM
        cricket_team`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) => convertDbObjToResponseObj(eachPlayer))
  );
});
module.exports = app;

//create new player in the team

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const AddPlayerIntoTeam = `
            INSERT INTO 
                    cricket_team
                (player_name,jersey_number,role) VALUES ('${playerName}',
                '${jerseyNumber}',
                '${role}');`;
  const dbResponse = await db.run(AddPlayerIntoTeam);
  const playerId = dbResponse.lastID;
  response.send("player Added to team");
});

//return player based on playerId

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `SELECT * FROM cricket_team
    WHERE player_id = ${playerId}; `;
  const player = await db.get(getPlayer);
  response.send(convertDbObjToResponseObj(player));
});
