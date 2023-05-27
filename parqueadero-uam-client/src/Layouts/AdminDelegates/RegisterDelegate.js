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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
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
          <Form onFinish={handleChange}>
            <div className="contenedor-registro">
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
                  <Input.Password
                    placeholder="Confirmar contraseña"
                    name="confirmarContraseña"
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
                    placeholder="Documento"
                    name="documento"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Input
                    placeholder="Cargo"
                    name="dargo"
                    onChange={handleChange}
                  />
                </Col>
                <Col span={12}>
                <Select
                    defaultValue="Activo"
                    name="activo"
                    onChange={(value) =>
                      handleChange({ target: { name: "Activo", value } })
                    }
                    className="Select_Custom"
                  >
                    <Option value="True">Si</Option>
                    <Option value="False">No</Option>
                  </Select>
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
              <Col span={12}>
                <Select
                    defaultValue="Asignar parqueadero"
                    name="asignarparqueadero"
                    onChange={(value) =>
                      handleChange({ target: { name: "asignarparqueadero", value } })
                    }
                    className="Select_Custom"
                  >
                    <Option value="True">Si</Option>
                    <Option value="False">No</Option>
                  </Select>
                </Col>
                <Col span={12}>
                <Select
                    defaultValue="Parqueadero"
                    name="parqueadero"
                    onChange={(value) =>
                      handleChange({ target: { name: "parqueadero", value } })
                    }
                    className="Select_Custom"
                  >
                    <Option value="Cúpula">Parqueadero Cúpula</Option>
                    <Option value="Vagón">Parqueadero Vagón</Option>
                    <Option value="Vagón">Parqueadero Economia</Option>
                  </Select>
                </Col>
              </Row>
              <div className="button-container">
                <Button danger onClick={() => window.location.replace("/admin")}>
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  onClick={() => window.location.replace("/admin")}
                >
                  Regístrar
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  )
}
