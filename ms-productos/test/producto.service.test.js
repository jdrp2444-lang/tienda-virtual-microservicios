const test = require("node:test");
const assert = require("node:assert");
const service = require("../src/services/producto.service");

test("listar devuelve los productos de ejemplo", () => {
  assert.ok(service.listar().length >= 2);
});

test("crear rechaza un precio inválido", () => {
  assert.throws(() => service.crear({ nombre: "X", precio: -5, stock: 1 }), /precio/);
});

test("crear guarda un producto válido", () => {
  const p = service.crear({ nombre: "Medias", descripcion: "Par", precio: 8000, stock: 5 });
  assert.strictEqual(p.nombre, "Medias");
});