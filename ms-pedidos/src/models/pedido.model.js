class Pedido {
  constructor({ id, usuarioId, items, estado, fecha }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.items = items; // [{ productoId, cantidad }]
    this.estado = estado || "pendiente";
    this.fecha = fecha || new Date().toISOString();
  }
}

module.exports = Pedido;