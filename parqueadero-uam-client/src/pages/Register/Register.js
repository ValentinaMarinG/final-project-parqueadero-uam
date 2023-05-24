import "./Register.scss";
import Layout from "antd/es/layout/layout";
import Logo from "../../assets/png/Logo_UAM.png";
import React, { useState } from "react";
import { RegisterForm } from "./Form";
import { Row } from "antd";


const url_uam =
  "https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

export const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    contraseña: "",
    placa: "",
    tipoDocumento: "",
    documento: "",
  });

  const handleChange = (values) => {
    setForm(values);
    console.table(form);
  };

  return (
    <Layout className="Layout-register">
      <div className="middle-box">
        <div className="register-box">
          <h1>Registro</h1>
          <Row>
            <label className="texto-datos">
              Ingresa los datos de tu{" "}
              <span
                className="texto-datos-subrayado"
                onClick={() => window.open(url_uam)}
              >
                Cuenta UAM®
              </span>
            </label>
          </Row>
          <RegisterForm handleChange={handleChange} />
        </div>
      </div>
      <img src={Logo} alt="Logo" className="bottom-logo" />
    </Layout>
  );
};
