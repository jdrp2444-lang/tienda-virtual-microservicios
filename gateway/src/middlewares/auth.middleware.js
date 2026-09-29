//revisar que la peticion traiga un JWT valido. Aqui se ve la diferencia entre autenticacion y autorizacion, porque hay dos funciones: una verifica quien eres y la otra que puedes hacer.
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "clave_secreta_de_clase";

// AUTENTICACION: el token es valido?
const verificarToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no enviado" });
  }

  const token = header.split(" ")[1];

  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// AUTORIZACIoN: tiene el rol necesario?
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "No tienes permisos para esta acción" });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };