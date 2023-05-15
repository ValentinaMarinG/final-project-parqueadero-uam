const mongoose = require("mongoose");

const tiposDocumentoValidos = ['Cédula de Ciudadania','Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad'];

const UserSchema = mongoose.Schema({
    documentType:{
        type:String,
        enum:tiposDocumentoValidos
    },
    documentNumber: {
        type:String,
        primaryKey: true
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true
    },
    phoneNumber : String,
    password: String,
    plate:[String],
    active: Boolean,
    avatar: String
});

module.exports = mongoose.model("User", UserSchema);
