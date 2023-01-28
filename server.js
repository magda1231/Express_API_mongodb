const express = require("express");
const { allowedNodeEnvironmentFlags } = require("process");
const app = express();
require("dotenv").config({ path: "./config/.env" });
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(express.json());
app.use(require("./routes/product"));
app.use(cors());

const dbo = require("./db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port ${port}`);
});
