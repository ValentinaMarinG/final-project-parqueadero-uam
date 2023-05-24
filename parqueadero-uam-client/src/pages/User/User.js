import React, { useState } from "react";
import { Layout, Avatar, Col, Row } from "antd";
import { UserOutlined } from '@ant-design/icons';
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./User.scss";
import Input from "antd";

const nombre = "Jeronimo";

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
            <Row className="row1" gutter={[16, 16]}>
                <Avatar
                  className="container-principal-avatar"
                  size={90}
                  icon={<UserOutlined />}/>
              <div className="container-principal-info">
                  <label className="titulo-profie">¡Hola, {nombre}!</label>
                </div>
            </Row>
            <Row>
              <Col>
              <div>
                <label className="label-titulo-info">Tu  información personal</label>
                <br/>
                <label className="label">Nombre: <label className="custom-label"></label></label>
                <br/>
                <label className="label">Correo: <label className="custom-label"></label></label>
                <br/>
                <label className="label">Tipo de documento: <label className="custom-label"></label></label>
                <br/>
                <label className="label">Documento: <label className="custom-label"></label></label>
                <br/>
                <label className="label">Contacto: <label className="custom-label"></label> </label>
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
