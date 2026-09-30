const Pedido = require("../models/pedido.model");

const pedidos = [];
let siguienteId = 1;

const guardar = (datos) => {
  const pedido = new Pedido({ ...datos, id: siguienteId++ });
  pedidos.push(pedido);
  return pedido;
};

const listarPorUsuario = (usuarioId) => pedidos.filter((p) => p.usuarioId === usuarioId);

const listarTodos = () => pedidos;

const buscarPorId = (id) => pedidos.find((p) => p.id === Number(id));

module.exports = { guardar, listarPorUsuario, listarTodos, buscarPorId };