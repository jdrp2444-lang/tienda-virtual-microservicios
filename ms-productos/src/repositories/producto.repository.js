//Solo guarda y busca datos. Empieza con dos productos de ejemplo para que la demo no arranque vacía.
const Producto = require("../models/producto.model");

const productos = [
  new Producto({ id: 1, nombre: "Camiseta", descripcion: "Camiseta de algodón", precio: 35000, stock: 20 }),
  new Producto({ id: 2, nombre: "Gorra", descripcion: "Gorra ajustable", precio: 25000, stock: 15 }),
];
let siguienteId = 3;

const listar = () => productos;

const buscarPorId = (id) => productos.find((p) => p.id === Number(id));

const guardar = (datos) => {
  const producto = new Producto({ ...datos, id: siguienteId++ });
  productos.push(producto);
  return producto;
};

const actualizar = (id, datos) => {
  const producto = buscarPorId(id);
  if (!producto) return null;
  Object.assign(producto, datos, { id: producto.id });
  return producto;
};

const eliminar = (id) => {
  const indice = productos.findIndex((p) => p.id === Number(id));
  if (indice === -1) return false;
  productos.splice(indice, 1);
  return true;
};

module.exports = { listar, buscarPorId, guardar, actualizar, eliminar };