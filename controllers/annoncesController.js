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
    const { titre_livre, description_annonce, prix, created_by, titre_annonce, etat_livre } = req.body;

    // Convertir 'prix' en un nombre valide
    const prixConverted = parseFloat(prix);

    // Vérifier que 'prix' est un nombre valide
    if (isNaN(prixConverted)) {
      return res.status(400).json({ message: "Prix invalide, veuillez fournir un nombre valide." });
    }

    // Insertion dans la base de données
    const result = await pool.query(
      "INSERT INTO annonces (titre_livre, description_annonce, prix, created_by, titre_annonce, etat_livre) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [titre_livre, description_annonce, prixConverted, created_by, titre_annonce, etat_livre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);  // Ajouter un log d'erreur pour mieux diagnostiquer les problèmes
    res.status(500).json({ message: "Erreur serveur", error });
  }
};




// Mettre à jour une annonce
exports.updateAnnonce = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre_livre, description_annonce, prix, titre_annonce, etat_livre_id } = req.body;

    const result = await pool.query(
      `UPDATE annonces 
       SET titre_livre = $1, 
           description_annonce = $2, 
           prix = $3, 
           titre_annonce = $4, 
           etat_livre_id = $5 
       WHERE id = $6 
       RETURNING *`,
      [titre_livre, description_annonce, prix, titre_annonce, etat_livre_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


// Supprimer une annonce
exports.deleteAnnonce = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE annonces SET archive = 1 WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    res.json({ message: "Annonce archivée", annonce: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

