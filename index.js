const express = require("express");
const cors = require("cors");

const annoncesRoutes = require("./routes/annonces");
const userRoutes = require("./routes/users");
const userController = require("./controllers/usersController");
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

app.use("/api/users", userRoutes);
app.use("/annonces", annoncesRoutes);

// 🌟 Use the controller instead of direct db.query
app.get("/api/all-users", userController.getAllUsers);

// Check database connection
(async () => {
  try {
    const [result] = await db.query("SELECT NOW()");
    console.log("✅ Connexion à la base réussie :", result);
  } catch (error) {
    console.error("❌ Erreur de connexion à la base :", error);
  }
})();

app.listen(port, () => {
  console.log(`🚀 Serveur backend démarré`);
});
