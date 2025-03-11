const express = require("express");

const annoncesRoutes = require("./routes/annonces");

const cors = require("cors");
const db = require("./db/db_config");


const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Semaine_campus !");
});

app.get("/test", (req, res) => {
  res.json({ message: "Route /test OK : tout fonctionne !" });
});

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);


  client.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Erreur lors de la requête', err.stack);
    } else {
      console.log('Résultat de la requête :', res.rows);
    }
    client.end(); // Ferme la connexion après la requête
  });


  app.use(express.json());
  app.use("/annonces", annoncesRoutes);

app.listen(port, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${port}`);
});

