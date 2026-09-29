//decidir a que microservicio va cada ruta y cuales estan protegidas
const express = require("express");
const axios = require("axios");
const { verificarToken, soloAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

const USUARIOS_URL = "http://localhost:3001";
const PRODUCTOS_URL = "http://localhost:3002";
const PEDIDOS_URL = "http://localhost:3003";

// Función que reenvía la petición al microservicio y devuelve su respuesta
const reenviar = (baseUrl) => async (req, res) => {
  try {
    const respuesta = await axios({
      method: req.method,
      url: baseUrl + req.originalUrl,
      data: req.body,
      headers: { "x-usuario-id": req.usuario ? req.usuario.id : "" },
    });
    res.status(respuesta.status).json(respuesta.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(503).json({ mensaje: "Microservicio no disponible" });
    }
  }
};

// Rutas PÚBLICAS (no requieren token)
router.post("/auth/register", reenviar(USUARIOS_URL));
router.post("/auth/login", reenviar(USUARIOS_URL));

// Rutas PROTEGIDAS (requieren JWT válido)
router.get("/usuarios/:id", verificarToken, reenviar(USUARIOS_URL));

router.get("/productos", verificarToken, reenviar(PRODUCTOS_URL));
router.get("/productos/:id", verificarToken, reenviar(PRODUCTOS_URL));
router.post("/productos", verificarToken, soloAdmin, reenviar(PRODUCTOS_URL));
router.put("/productos/:id", verificarToken, soloAdmin, reenviar(PRODUCTOS_URL));
router.delete("/productos/:id", verificarToken, soloAdmin, reenviar(PRODUCTOS_URL));

router.post("/pedidos", verificarToken, reenviar(PEDIDOS_URL));
router.get("/pedidos", verificarToken, reenviar(PEDIDOS_URL));
router.get("/pedidos/:id", verificarToken, reenviar(PEDIDOS_URL));
router.put("/pedidos/:id/estado", verificarToken, soloAdmin, reenviar(PEDIDOS_URL));

module.exports = router;