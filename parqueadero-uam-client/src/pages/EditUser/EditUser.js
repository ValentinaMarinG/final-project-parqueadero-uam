import React from "react";
import { Layout, Row, Button } from "antd";
import { Link } from "react-router-dom";
import Logo from "../../assets/png/Logo_UAM.png";
import FormComponent from "./Form";
import "./EditUser.scss";

const { Content } = Layout;

export const EditUser = () => {
  const url_uam = "https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

  return (
    <Layout className="Layout-register">
      <Content className="Layout-register-content">
        <div className="middle-box">
          <div className="register-box">
            <h1>Editar Información Usuario</h1>
            <Row>
              <label className="datos-texto">
                Ingresa los datos de tu cuenta {""}
                <span
                  className="texto-datos-subrayado"
                  onClick={() => window.open(url_uam)}
                >
                  Cuenta UAM®
                </span>
              </label>
            </Row>
            <div className="container-edit">
              <FormComponent />
            </div>
          </div>
        </div>
      </Content>
      <img src={Logo} alt="Logo" className="logo-edit" />
    </Layout>
  );
};
