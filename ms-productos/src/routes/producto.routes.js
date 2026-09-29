const express = require("express");
const controller = require("../controllers/producto.controller");

const router = express.Router();

router.get("/productos", controller.listar);
router.get("/productos/:id", controller.obtenerPorId);
router.post("/productos", controller.crear);
router.put("/productos/:id", controller.actualizar);
router.delete("/productos/:id", controller.eliminar);

module.exports = router;