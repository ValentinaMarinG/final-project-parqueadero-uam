import "./AdminEditUser.scss";
import Layout from "antd/es/layout/layout";
import Logo from "../../../assets/png/Logo_UAM.png";
import React, { useState } from "react";
import { RegisterForm } from "./Form";
import { Row } from "antd";


const url_uam =
  "https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

export const AdminEditUser = () => {
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
    <Layout className="Layout-edit-user">
      <div className="middle-container">
        <div className="edit-box">
          <h1>Editar información de Usuario</h1>
          <Row>
            <label className="texto-datos">
              Ingresa los datos de la{" "}
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
      <img src={Logo} alt="Logo" className="logo-footer" />
    </Layout>
  );
};