const service = require("../services/pedido.service");

const leerUsuario = (req) => ({
  usuarioId: Number(req.headers["x-usuario-id"]),
  rol: req.headers["x-usuario-rol"],
});

const crear = (req, res) => {
  try {
    const { usuarioId } = leerUsuario(req);
    res.status(201).json(service.crear(usuarioId, req.body));
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const listar = (req, res) => {
  const { usuarioId, rol } = leerUsuario(req);
  res.status(200).json(service.listar(usuarioId, rol));
};

const obtenerPorId = (req, res) => {
  try {
    const { usuarioId, rol } = leerUsuario(req);
    res.status(200).json(service.obtenerPorId(req.params.id, usuarioId, rol));
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

const cambiarEstado = (req, res) => {
  try {
    res.status(200).json(service.cambiarEstado(req.params.id, req.body.estado));
  } catch (error) {
    const codigo = error.message === "Pedido no encontrado" ? 404 : 400;
    res.status(codigo).json({ mensaje: error.message });
  }
};

module.exports = { crear, listar, obtenerPorId, cambiarEstado };