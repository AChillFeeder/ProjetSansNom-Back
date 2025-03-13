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

exports.addFavorite = async (req, res) => {
    try{
        const userId = req.headers.userid;
        const { annonceId } = req.params;

        const checkFavorite = await pool.query(
            "SELECT * FROM favoris WHERE utilisateur = $1 AND annonce = $2",
            [userId, annonceId]
          );

          if (checkFavorite.rows.length > 0) {
            // Supprimer des favoris si déjà présent
            await pool.query("DELETE FROM favoris WHERE utilisateur = $1 AND annonce = $2", [userId, annonceId]);
            return res.json({ message: "Annonce retirée des favoris." });
          } else {
            // Ajouter en favoris sinon
            await pool.query("INSERT INTO favoris (utilisateur, annonce) VALUES ($1, $2)", [userId, annonceId]);
            return res.json({ message: "Annonce ajoutée aux favoris." });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Erreur serveur" });
        }

    }