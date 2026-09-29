//recibe la peticion HTTP, llamar al service y responder con el codigo correcto.
const service = require("../services/usuario.service");

const registrar = async (req, res) => {
  try {
    const usuario = await service.registrar(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const login = async (req, res) => {
  try {
    const resultado = await service.login(req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ mensaje: error.message });
  }
};

const obtenerPorId = (req, res) => {
  try {
    res.status(200).json(service.obtenerPorId(req.params.id));
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

module.exports = { registrar, login, obtenerPorId };