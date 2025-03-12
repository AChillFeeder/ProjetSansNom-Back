const express = require("express");
const cors = require("cors");

const annoncesRoutes = require("./routes/annonces");
const userRoutes = require("./routes/users");
const userController = require("./controllers/usersController");
const db = require("./db/db_config"); 

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Semaine_campus !");
});

app.get("/healthcheck", (req, res) => {
  res.json({ message: "Route /healthcheck OK : tout fonctionne !" });
});

app.use("/api/users", userRoutes);
app.use("/annonces", annoncesRoutes);

app.get("/api/all-users", userController.getAllUsers);


// (async () => {
//   try {
//     const [result] = await db.query("SELECT NOW()");
//     console.log("✅ Connexion à la base réussie :", result);
//   } catch (error) {
//     console.error("❌ Erreur de connexion à la base :", error);
//   }
// })();

const port = process.env.PORT || 8080; // ou 3001?

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Serveur backend démarré sur http://0.0.0.0:${port}`);
});


