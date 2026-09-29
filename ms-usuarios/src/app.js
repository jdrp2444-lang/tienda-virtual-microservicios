const express = require("express");
const routes = require("./routes/usuario.routes");

const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MS Usuarios corriendo en http://localhost:${PORT}`);
});