import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Input, Select, Form } from "antd";
import { UserOutlined } from "@ant-design/icons";
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./SetPassword.scss";
import Logo from "../../assets/png/Logo_UAM.png";
import { Link, useNavigate } from "react-router-dom";
import FormComponent from "./Form";

const { Option } = Select;

export const SetPassword = () => {
  const navigate = useNavigate();

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
