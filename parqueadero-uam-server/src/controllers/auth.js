const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const axios = require("axios");

const register = async (req, res) => {
    const { firstname, lastname, email, departamento, municipio, password } = req.body;

    if (!email) res.status(400).send({ msg: "El email es requerido" });
    if (!password) res.status(400).send({ msg: "La contraseñas es requerida" });

    const response = await axios.get("https://www.datos.gov.co/resource/xdk5-pm3f.json");
    const ResponseData = response.data;
    const DepartamentoResponse = ResponseData.find(ResponseData =>{ return ResponseData.departamento === departamento});
    const MunicipioResponse = ResponseData.find(ResponseData =>{return ResponseData.municipio === municipio});

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        departamento: DepartamentoResponse.departamento,
        municipio: MunicipioResponse.municipio,
        role: "user",
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
