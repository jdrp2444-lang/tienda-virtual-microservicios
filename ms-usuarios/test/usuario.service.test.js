const test = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const service = require("../src/services/usuario.service");

test("registrar y login generan un JWT válido", async () => {
  await service.registrar({ nombre: "Test", correo: "t@t.com", password: "1234", rol: "admin" });
  const { token } = await service.login({ correo: "t@t.com", password: "1234" });
  const datos = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta_de_clase");
  assert.strictEqual(datos.rol, "admin");
});

test("login con contraseña incorrecta falla", async () => {
  await assert.rejects(
    () => service.login({ correo: "t@t.com", password: "mala" }),
    /Credenciales inválidas/
  );
});