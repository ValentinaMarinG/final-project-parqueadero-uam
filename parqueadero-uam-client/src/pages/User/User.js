import React, { useState } from "react";
import { Layout, Avatar, Col, Row, Table, Button } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./User.scss";
import axios from 'axios';

const columns = [
  {
    title: "Mis Placas",
    dataIndex: "placa",
    key: "placa",
  }
];

const UserPage = () => {
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);

  axios.get('http://localhost:5000/api/v1/users/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
  })
  .then(response => {
    const data = response.data
    setUserData(data);
  })
  .catch(error => {
    console.log(error);
  }, [token]);

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { Content, Header, Footer } = Layout;

  const { firstname, lastname, email, documentType, documentNumber, phoneNumber } = "hoal estrellitas"; 

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
          <div className="principal">
              <div className="principal-info">
                <label className="titulo-profie">¡Hola, {firstname}!</label>
              </div>
            <Row gutter={[120, 120]}>
              <Col>
              <Avatar
                  className="principal-avatar"
                  size={140}
                  icon={<UserOutlined />}/>
              </Col>
              <Col>
              <div className="conatiner-info">
                <label className="label-titulo-info">Tu información personal</label>
                <br/>
                <label className="label">Nombre: <label className="custom-label">{firstname} {lastname}</label></label>
                <br/>
                <label className="label">Correo: <label className="custom-label">{email}</label></label>
                <br/>
                <label className="label">Tipo de documento: <label className="custom-label">{documentType}</label></label>
                <br/>
                <label className="label">Documento: <label className="custom-label">{documentNumber}</label></label>
                <br/>
                <label className="label">Contacto: <label className="custom-label">{phoneNumber}</label></label>
              </div>
              <div className="botones-perfil">
              <Button className="button-edit">
                Editar información
              </Button>
              <Button className="button-edit">
                Cambiar contraseña
              </Button>
              </div>
              </Col>
            </Row>
          </div>
          <div className="container-table">
            <Row gutter={[50, 50]}>
              <Col>
              <Table className="table" columns={columns}></Table>
              </Col>
              <Col>
              <div className="button-div">
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
