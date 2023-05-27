import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Input, Select, Form } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./SetPassword.scss";
import Logo from "../../assets/png/Logo_UAM.png";
import { Link } from "react-router-dom";

const { Option } = Select;

export const SetPassword = () => {
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
    <Layout className="setpassword">
      <div className="middle-box">
        <div className="setpassword-box">
          <h1>Cambiar contraseña</h1>
          <Form onFinish={handleChange}>
            <div className="container">
              <Row className="row">
                <Col span={12}>
                  <Input
                    placeholder="Contraseña actual"
                    name="contraseñaactual"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br/>
              <Row className="row">
                <Col span={12}>
                  <Input
                    placeholder="Nueva contraseña"
                    name="contraseñanueva"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <br />
              <Row className="row">
                <Col span={12}>
                  <Input
                    placeholder="Confirmar nueva contraseña"
                    name="confirmacontraseña"
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <div className="div-button">
                <Button className="button" danger onClick={() => window.location.replace("/")}>
                <Link to={"/../user/profile"}>Cancelar</Link>
                </Button>
                <Button
                  className="button"
                  type="primary"
                  onClick={() => window.location.replace("/LogIn")}
                >
                  Aceptar
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
