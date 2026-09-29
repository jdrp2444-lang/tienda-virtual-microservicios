//Maneja HTTP y decide el codigo de respuesta.
const service = require("../services/producto.service");

const listar = (req, res) => res.status(200).json(service.listar());

const obtenerPorId = (req, res) => {
  try {
    res.status(200).json(service.obtenerPorId(req.params.id));
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

const crear = (req, res) => {
  try {
    res.status(201).json(service.crear(req.body));
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const actualizar = (req, res) => {
  try {
    res.status(200).json(service.actualizar(req.params.id, req.body));
  } catch (error) {
    const codigo = error.message === "Producto no encontrado" ? 404 : 400;
    res.status(codigo).json({ mensaje: error.message });
  }
};

const eliminar = (req, res) => {
  try {
    service.eliminar(req.params.id);
    res.status(200).json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };