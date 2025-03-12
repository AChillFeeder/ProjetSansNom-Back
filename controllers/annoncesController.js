const pool = require("../db/db_config");

// Récupérer toutes les annonces
exports.getAllAnnonces = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM annonces");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer une annonce par ID
exports.getAnnonceById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM annonces WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer une annonce
exports.createAnnonce = async (req, res) => {
  try {
    const { titre, description, prix } = req.body;
    const result = await pool.query(
      "INSERT INTO annonces (titre, description, prix) VALUES ($1, $2, $3) RETURNING *",
      [titre, description, prix]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mettre à jour une annonce
exports.updateAnnonce = async (req, res) => {
  try {
    const { titre, description, prix } = req.body;
    const result = await pool.query(
      "UPDATE annonces SET titre = $1, description = $2, prix = $3 WHERE id = $4 RETURNING *",
      [titre, description, prix, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer une annonce
exports.deleteAnnonce = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM annonces WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    res.json({ message: "Annonce supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
