const pool = require("../db/db_config");
const { getCurrentUser } = require("../controllers/usersController");

exports.getFavorites = async (req, res) => {
    try {
      const userId = req.headers.userid;

      // Récupérer toutes les annonces favorites de l'utilisateur
      const favorites = await pool.query(
        "SELECT * FROM annonces INNER JOIN favoris ON annonces.id = favoris.annonce WHERE favoris.utilisateur = $1",
        [userId]
      );
  
      res.json(favorites.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };