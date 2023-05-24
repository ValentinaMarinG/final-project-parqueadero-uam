import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./User.scss";
import Input from "antd";

const nombre = "Jeronimo";
const apellido = "Cortés";
const correo = "jc@gmail.com";
const tipoDocumento = "Tarjeta de Identidad";
const documento = "123456789";
const contacto = "3125678909";

const columns = [
  {
    title: "Mis Placas",
    dataIndex: "placa",
    key: "placa",
  }
];

const UserPage = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { Content, Header, Footer } = Layout;
  return (
    <Layout>
      <UserMenuSider className="UserMenuSider" menuCollapsed={menuCollapsed} />
      <Layout
        className="UserPage-layout"
        style={{ marginLeft: menuCollapsed ? "0px" : "0px" }}>
          <Header className="UserPage-header">
        <MenuTop
          menuCollapsed={menuCollapsed}
          setMenuCollapsed={setMenuCollapsed}
        />
      </Header>
      <Content className="UserPage-content">
          <div className="content-title">
            <label>Parqueadero UAM</label>
            <label className="content-title-subtitle">
              Perfil de Usuario
            </label>
          </div>
          <div className="container-principal">
            <Row gutter={[120, 120]}>
                <div className="container-principal-info">
                  <label className="titulo-profie">¡Hola, {nombre}!</label>
                </div>
              <Col>
              <Avatar
                  className="container-principal-avatar"
                  size={140}
                  icon={<UserOutlined />}/>
              </Col>
              <Col>
              <div className="conatiner-info">
                <label className="label-titulo-info">Tu información personal</label>
                <br/>
                <label className="label">Nombre: <label className="custom-label">{nombre} {apellido}</label></label>
                <br/>
                <label className="label">Correo: <label className="custom-label">{correo}</label></label>
                <br/>
                <label className="label">Tipo de documento: <label className="custom-label">{tipoDocumento}</label></label>
                <br/>
                <label className="label">Documento: <label className="custom-label">{documento}</label></label>
                <br/>
                <label className="label">Contacto: <label className="custom-label">{contacto}</label></label>
              </div>
              <Button className="button-edit">
                Editar mi información
              </Button>
              </Col>
            </Row>
          </div>
          <div className="container-table">
            <Row gutter={[50, 50]}>
              <Col>
              <Table className="table" columns={columns}></Table>
              </Col>
              <Col>
              <div className="button-container">
              <Button className="button-table">Agregar placa</Button>
              <br/>
              <Button className="button-table">Eliminar placa</Button>
              </div>
              </Col>
            </Row>
          </div>
      </Content>
      <Footer className="UserPage-footer">
        <FooterPage></FooterPage>
      </Footer>
      </Layout>     
    </Layout>
  );
};

export default UserPage;
