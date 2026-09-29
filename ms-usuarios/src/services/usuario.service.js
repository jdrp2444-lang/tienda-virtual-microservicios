//la logica de negocio (encriptar, validar, generar el JWT). No sabe nada de req ni res.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const repository = require("../repositories/usuario.repository");

const SECRET = process.env.JWT_SECRET || "clave_secreta_de_clase";

const registrar = async ({ nombre, correo, password, rol }) => {
  if (!nombre || !correo || !password) {
    throw new Error("Nombre, correo y contraseña son obligatorios");
  }
  if (repository.buscarPorCorreo(correo)) {
    throw new Error("El correo ya está registrado");
  }
  const passwordEncriptada = await bcrypt.hash(password, 10);
  const usuario = repository.guardar({
    nombre,
    correo,
    password: passwordEncriptada,
    rol,
  });
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
};

const login = async ({ correo, password }) => {
  const usuario = repository.buscarPorCorreo(correo);
  if (!usuario) throw new Error("Credenciales inválidas");

  const coincide = await bcrypt.compare(password, usuario.password);
  if (!coincide) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
    SECRET,
    { expiresIn: "1h" }
  );
  return { token };
};

const obtenerPorId = (id) => {
  const usuario = repository.buscarPorId(id);
  if (!usuario) throw new Error("Usuario no encontrado");
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
};

module.exports = { registrar, login, obtenerPorId };