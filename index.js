const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const annoncesRoutes = require("./routes/annonces");
const userRoutes = require("./routes/users");
const userController = require("./controllers/usersController");
const favorisController = require("./controllers/favorisController");
const messagesRoutes = require("./routes/messages");
const favorisRoutes = require("./routes/favoris");

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
app.use("/api/annonces", annoncesRoutes);
app.use("/api/favoris", favorisRoutes);

app.get("/api/all-users", userController.getAllUsers);
app.get("/api/currentUser", userController.getCurrentUser);

app.get("/api/favoris", favorisController.getFavorites);

app.use("/messages", messagesRoutes);

const port = process.env.PORT || 8080;
const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Nouvelle connexion socket :", socket.id);

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} a rejoint la salle ${roomName}`);
  });

  socket.on("sendMessage", async (msgData) => {
    try {
      const db = require("./db/db_config");
      const [result] = await db.query(
        "INSERT INTO Messages (id_sender, id_receiver, message, date_message) VALUES (?, ?, ?, NOW())",
        [msgData.id_sender, msgData.id_receiver, msgData.message]
      );
      msgData.id = result.insertId;
      const room1 = `${msgData.id_sender}-${msgData.id_receiver}`;
      const room2 = `${msgData.id_receiver}-${msgData.id_sender}`;
      io.to(room1).emit("newMessage", msgData);
      io.to(room2).emit("newMessage", msgData);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
    }
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Serveur backend démarré sur http://0.0.0.0:${port}`);
});
