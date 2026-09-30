const express = require("express");
const routes = require("./routes/pedido.routes");

const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`MS Pedidos corriendo en http://localhost:${PORT}`);
});