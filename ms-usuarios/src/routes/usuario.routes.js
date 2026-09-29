//dice que URL llama a que funcion del controller.
const express = require("express");
const controller = require("../controllers/usuario.controller");

const router = express.Router();

router.post("/auth/register", controller.registrar);
router.post("/auth/login", controller.login);
router.get("/usuarios/:id", controller.obtenerPorId);

module.exports = router;