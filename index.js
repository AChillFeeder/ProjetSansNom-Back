// back/index.js
const express = require("express");
const app = express();
const port = 3001;

// Pour tester : un endpoint simple
app.get("/api", (req, res) => {
  res.json({ message: "Hello depuis le backend !" });
});

// Démarre le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});

// Connexion à la base de données
const { Client } = require('pg');

const client = new Client({
  user: 'ukufgjyj5qrvluxo7tdm',
  host: 'bpftacyavdjtnc6d0ue6-postgresql.services.clever-cloud.com',
  database: 'bpftacyavdjtnc6d0ue6',
  password: 'uQTHIXoTgGtza9YPirG2Celi6ajFCb',
  port: 50013,
});

client.connect()
  .then(() => console.log('Connecté à PostgreSQL'))
  .catch(err => console.error('Erreur de connexion', err.stack));


  client.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Erreur lors de la requête', err.stack);
    } else {
      console.log('Résultat de la requête :', res.rows);
    }
    client.end(); // Ferme la connexion après la requête
  });
  