const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {API_VERSION}=require("./constants");

const app=express();

/* Cargar rutas */
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");

/* Trabajar con la extension client-rest */
app.use(bodyParser.json());
/* Evitar bloqueos en el navegador cuando estemos trabajando con 
el backend y frontend a la vez */
app.use(cors());

/* Pruebas de request utilizando postman */
app.use(bodyParser.urlencoded({ entended: true }));

app.use(`api/${API_VERSION}/`, authRoutes);
app.use(`api/${API_VERSION}/`, userRoutes);

module.exports=app;