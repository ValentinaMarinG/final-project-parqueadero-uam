import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Input, Select, Form } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./RegisterParking.scss";
import Logo from "../../assets/png/Logo_UAM.png";
import { Footer } from "antd/es/layout/layout";

const { Option } = Select;
const url_uam ="https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

export const RegisterParking = () => {
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
    <Layout className="Layout-registerparking">
      <div className="container-box">
        <div className="registerparking-box">
          <h1>Registro Parqueadero</h1>
          <Row>
            <label className="texto-primero">
              Se necesitan los siguientes campos para registrar un parqueadero.
            </label>
          </Row>
          <Form onFinish={handleChange}>
            <div className="contenedor-registro-parking">
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
                  <Select
                    defaultValue="Tipo"
                    name="tipo"
                    onChange={(value) =>
                      handleChange({ target: { name: "tipo", value } })
                    }
                    className="Select_Custom"
                  >
                    <Option value="público">Público</Option>
                    <Option value="privado">Privado</Option>
                  </Select>
                </Col>
              </Row>
              <br />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Input
                    placeholder="Capacidad"
                    name="capacidad"
                    onChange={handleChange}
                  />
                </Col>
                <Col span={12}>
                <Select
                    defaultValue="De pago"
                    name="depago"
                    onChange={(value) =>
                      handleChange({ target: { name: "De pago", value } })
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
                  <Input
                    placeholder="Precio"
                    name="precio"
                    onChange={handleChange}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    defaultValue="Categoria"
                    name="categoria"
                    onChange={(value) =>
                      handleChange({ target: { name: "categoria", value } })
                    }
                    className="Select_Custom"
                  >
                    <Option value="servicio">Servicio</Option>
                    <Option value="accesibilidad">Accesibilidad</Option>
                    <Option value="reserva">Reserva</Option>
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
