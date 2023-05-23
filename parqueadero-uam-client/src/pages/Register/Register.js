import "./Register.scss";
import Layout from "antd/es/layout/layout";
import Logo from "../../assets/png/Logo_UAM.png";
import { Form, Input, Row, Col, Select, Button, Space } from "antd";
import React, { useState } from "react";

const { Option } = Select;
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
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
          <Form onFinish={handleChange}>
            <div className="container">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Input
                    placeholder="Nombre"
                    name="nombre"
                    onChange={handleChange}
                    rules={[
                      {
                        required: true,
                        message: 'Ingresa tú nombre!',
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    placeholder="Apellido"
                    name="apellido"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Input
                    placeholder="Correo"
                    name="correo"
                    onChange={handleChange}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    placeholder="Celular"
                    name="celular"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Input.Password
                    placeholder="Contraseña"
                    name="contraseña"
                    onChange={handleChange}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    placeholder="Placa"
                    name="placa"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Select
                    defaultValue="Tipo de documento"
                    name="tipoDocumento"
                    onChange={(value) =>
                      handleChange({ target: { name: "tipoDocumento", value } })
                    }
                    className="Select_Custom"
                  >
                    <Option value="ti">T.I</Option>
                    <Option value="cedula">Cédula de ciudadanía</Option>
                    <Option value="pasaporte">Pasaporte</Option>
                  </Select>
                </Col>
                <Col span={12}>
                  <Input
                    placeholder="documento"
                    name="documento"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <div className="button-container">
                <Button danger onClick={() => window.location.replace("/")}>
                  Cancelar
                </Button>
                <Button
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
      <img src={Logo} alt="Logo" className="bottom-logo" />
    </Layout>
  );
};
