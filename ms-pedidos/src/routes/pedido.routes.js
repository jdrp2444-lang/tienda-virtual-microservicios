const express = require("express");
const controller = require("../controllers/pedido.controller");

const router = express.Router();

router.post("/pedidos", controller.crear);
router.get("/pedidos", controller.listar);
router.get("/pedidos/:id", controller.obtenerPorId);
router.put("/pedidos/:id/estado", controller.cambiarEstado);

module.exports = router;