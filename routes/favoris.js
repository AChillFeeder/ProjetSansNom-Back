const express = require("express");
const router = express.Router();
const favorisController = require("../controllers/favorisController");


//router.post("/favoris/:annonceId", favorisController.addFavori);
router.get("/favoris", favorisController.getFavorites);


module.exports = router;
