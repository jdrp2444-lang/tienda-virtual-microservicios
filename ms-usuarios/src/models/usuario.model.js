//Define como es un usuario
class Usuario {
  constructor({ id, nombre, correo, password, rol }) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.password = password; // siempre guardada encriptada
    this.rol = rol || "cliente"; // "cliente" o "admin"
  }
}

module.exports = Usuario;