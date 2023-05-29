import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Input, Select, Form } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./RegisterDelegate.scss";
import Logo from "../../assets/png/Logo_UAM.png";
import { Footer } from "antd/es/layout/layout";
import { RegisterDelegateForm } from "./Form";

const { Option } = Select;
const url_uam ="https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

export const RegisterDelegate = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    contraseña: "",
    placa: "",
    tipoDocumento: "",
    documento: "",
    cargo: "",
    activo: "",
    parqueadero: ""
  });

  const handleChange = (values) => {
    setForm(values);
    console.table(form);
  };

  return (
    <Layout className="Layout-registerdelegate">
      <div className="box">
        <div className="registerdelegate-box">
          <h1>Registro Delegado</h1>
          <Row>
            <label className="introduccion">
              Se necesitan los siguientes campos para registrar un delegado.
            </label>
            <br/ >
            <label className="introduccion">Ingresa los datos de la{" "}
              <span
                className="introduccion-subrayado"
                onClick={() => window.open(url_uam)}
              >
                Cuenta UAM®
              </span>
            </label>
          </Row>
          <RegisterDelegateForm handleChange={handleChange} />
        </div>
      </div>
    </Layout>
  )
}
