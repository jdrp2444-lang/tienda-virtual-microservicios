//Responsabilidad: solo guardar y buscar datos. No sabe nada de HTTP ni de reglas de negocio.
const Usuario = require("../models/usuario.model");

const usuarios = []; // "base de datos" en memoria
let siguienteId = 1;

const guardar = (datos) => {
  const usuario = new Usuario({ ...datos, id: siguienteId++ });
  usuarios.push(usuario);
  return usuario;
};

const buscarPorCorreo = (correo) => usuarios.find((u) => u.correo === correo);

const buscarPorId = (id) => usuarios.find((u) => u.id === Number(id));

module.exports = { guardar, buscarPorCorreo, buscarPorId };