const express = require("express");
var cors = require('cors');

const port = 3001; 

const onus = require("./controller/get-ont-smart");
const router = require("./controller/auth-ont-routing");
const bridge = require("./controller/auth-ont-bridge");
const phone = require("./controller/auth-ont-phone");
const detail_ont = require("./controller/get-ont-sn");
const add_service = require("./controller/add-service");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
  app.use(cors());
  next();
});

app.use('/api-smart/', onus);
app.use('/api-smart/', detail_ont);
app.use('/api-router/', router);
app.use('/api-bridge/', bridge);
app.use('/api-phone/', phone);
app.use('/api-add/', add_service);

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`);
});

