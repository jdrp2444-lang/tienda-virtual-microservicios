const repository = require("../repositories/pedido.repository");

const ESTADOS = ["pendiente", "enviado", "entregado", "cancelado"];

const crear = (usuarioId, { items }) => {
  if (!usuarioId) throw new Error("Usuario no identificado");
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("El pedido debe tener al menos un producto");
  }
  for (const item of items) {
    if (!item.productoId || !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
      throw new Error("Cada item necesita productoId y una cantidad mayor a 0");
    }
  }
  return repository.guardar({ usuarioId, items });
};

const listar = (usuarioId, rol) => {
  return rol === "admin" ? repository.listarTodos() : repository.listarPorUsuario(usuarioId);
};

const obtenerPorId = (id, usuarioId, rol) => {
  const pedido = repository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido no encontrado");
  if (rol !== "admin" && pedido.usuarioId !== usuarioId) {
    throw new Error("Pedido no encontrado");
  }
  return pedido;
};

const cambiarEstado = (id, estado) => {
  if (!ESTADOS.includes(estado)) {
    throw new Error("Estado inválido. Usa: " + ESTADOS.join(", "));
  }
  const pedido = repository.buscarPorId(id);
  if (!pedido) throw new Error("Pedido no encontrado");
  pedido.estado = estado;
  return pedido;
};

module.exports = { crear, listar, obtenerPorId, cambiarEstado };