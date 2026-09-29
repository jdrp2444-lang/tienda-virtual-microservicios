//Aqui van las reglas de negocio (validaciones).
const repository = require("../repositories/producto.repository");

const validar = ({ nombre, precio, stock }) => {
  if (!nombre) throw new Error("El nombre es obligatorio");
  if (typeof precio !== "number" || precio <= 0) throw new Error("El precio debe ser un número mayor a 0");
  if (typeof stock !== "number" || stock < 0) throw new Error("El stock debe ser un número mayor o igual a 0");
};

const listar = () => repository.listar();

const obtenerPorId = (id) => {
  const producto = repository.buscarPorId(id);
  if (!producto) throw new Error("Producto no encontrado");
  return producto;
};

const crear = (datos) => {
  validar(datos);
  return repository.guardar(datos);
};

const actualizar = (id, datos) => {
  const actual = obtenerPorId(id);
  validar({ ...actual, ...datos });
  return repository.actualizar(id, datos);
};

const eliminar = (id) => {
  if (!repository.eliminar(id)) throw new Error("Producto no encontrado");
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };