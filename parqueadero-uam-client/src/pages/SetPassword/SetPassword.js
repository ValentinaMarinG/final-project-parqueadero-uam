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
          <FormComponent />
        </div>
      </div>
      <img src={Logo} alt="Logo" className="logo-edit" />
    </Layout>
  );
};
