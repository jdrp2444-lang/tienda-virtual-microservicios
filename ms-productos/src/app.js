const express = require("express");
const routes = require("./routes/producto.routes");

const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`MS Productos corriendo en http://localhost:${PORT}`);
});
