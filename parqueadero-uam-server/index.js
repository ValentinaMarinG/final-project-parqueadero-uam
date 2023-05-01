const mongoose = require("mongoose")
const app = require('./app')

const port = process.env.PORT || 3977

const { API_VERSION, IP_SERVER, PORT_DB } = require("./constants")