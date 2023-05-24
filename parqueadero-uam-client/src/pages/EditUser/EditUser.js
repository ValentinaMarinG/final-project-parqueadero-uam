import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Input, Select, Form } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./EditUser.scss";
import Logo from "../../assets/png/Logo_UAM.png";

const { Option } = Select;
const url_uam ="https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

export const EditUser = () => {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
    console.table(form);
  };

  return (
    <Layout className="Layout-register">
      <div className="middle-box">
        <div className="register-box">
          <h1>Editar Información Usuario</h1>
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
          </Row >
          <Form onFinish={handleChange}>
            <div className="container">
              <Row className="row">
                <Col span={12}>
                  <Input
                    placeholder="Nombre"
                    name="nombre"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br/>
              <Row className="row">
                <Col span={12}>
                  <Input
                    placeholder="Apellido"
                    name="apellido"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <Row className="row">
                <Col span={12}>
                  <Input
                    placeholder="Celular"
                    name="celular"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <div className="container-button">
                <Button className="button" danger onClick={() => window.location.replace("/")}>
                  Cancelar
                </Button>
                <Button
                  className="button"
                  type="primary"
                  onClick={() => window.location.replace("/LogIn")}
                >
                  Regístrate
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <img src={Logo} alt="Logo" className="logo-edit" />
    </Layout>
  )
}
