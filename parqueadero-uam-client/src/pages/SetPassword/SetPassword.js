import React from "react";
import { Layout, Select } from "antd";
import "./SetPassword.scss";
import Logo from "../../assets/png/Logo_UAM.png";
import FormComponent from "./Form";

const { Option } = Select;

export const SetPassword = () => {

  return (
    <Layout className="setpassword">
      <div className="middle-box">
        <div className="setpassword-box">
          <h1>Cambiar contraseña</h1>
          <FormComponent />
        </div>
      </div>
      <img src={Logo} alt="Logo" className="logo-edit" />
    </Layout>
  );
};