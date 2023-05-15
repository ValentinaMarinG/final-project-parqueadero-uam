const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const axios = require("axios");

const register = async (req, res) => {
    const { documentType, documentNumber, firstname, lastname, email, phoneNumber, plate, password} = req.body;
    
    if ((documentType ==="Cédula de Ciudadania" || documentType ==="Tarjeta de identidad" ) && (documentNumber[0]=== "0" || (documentNumber.length !=10 && documentNumber.length !=8 ))){
      res.status(400).send({ msg: "El número de documento es inválido" });
    };
    if (documentType ==="Cédula de Extranjería" &&  documentNumber.length !=10 ){
      res.status(400).send({ msg: "La cédula de extranjería es inválida" });
    };
    if (!documentNumber) res.status(400).send({ msg: "La cedula es requerida" });
    if (!email) res.status(400).send({ msg: "El email es requerido" });
    if (!password) res.status(400).send({ msg: "La contraseñas es requerida" });
    if (!phoneNumber) res.status(400).send({ msg: "El número de telefono es requerido" });
    if (phoneNumber.length != 10) res.status(400).send({ msg: "El número de telefono es inválido" });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = new User({
        documentType,
        documentNumber,
        firstname,
        lastname,
        email: email.toLowerCase(),
        phoneNumber,
        plate,
        active: false,
        password: hashPassword,
    });

    try {
        const userStorage = await user.save();
        res.status(201).send(userStorage);
    } catch (error) {
        res.status(400).send({ msg: "Error al crear el usuario", error });
    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("El email y la contraseña son obligatorias");
    }
    const emailLowerCase = email.toLowerCase();
    const userStore = await User.findOne({ email: emailLowerCase }).exec();
    if (!userStore) {
      throw new Error("El usuario no existe");
    }
    const check = await bcrypt.compare(password, userStore.password);
    if (!check) {
      throw new Error("Contraseña incorrecta");
    }
    if (!userStore.active) {
      throw new Error("Usuario no autorizado o no activo");
    }
    res.status(200).send({
      access: jwt.createAccessToken(userStore),
      refresh: jwt.createRefreshToken(userStore),
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

const refreshAccessToken = (req, res) => {
  const { token } = req.body;
  if (!token) res.status(400).send({ msg: "Token requerido" });
  const { user_id } = jwt.decoded(token);
  User.findOne({ _id: user_id }, (error, userStorage) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else {
      res.status(200).send({
        accessToken: jwt.createAccessToken(userStorage),
      });
    }
  });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};
