const express = require("express");
const router = express.Router();
const annoncesController = require("../controllers/annoncesController");

router.get("/", annoncesController.getAllAnnonces);
router.get("/:id", annoncesController.getAnnonceById);
router.post("/", annoncesController.createAnnonce);
router.put("/:id", annoncesController.updateAnnonce);
router.delete("/:id", annoncesController.deleteAnnonce);

module.exports = router;
