import React, { useState } from "react";
import { Layout } from "antd";
import { MenuSider } from "../components/MenuComponents/MenuSider/MenuSider";
import { MenuTop } from "../components/MenuComponents/MenuTop/MenuTop";
import "./LayoutGeneral.scss";
import { FooterPage } from "../components/FooterPage/FooterPage";
import { BrowserRouter as Routes, Route, Outlet } from "react-router-dom";
import { AdminDelegates } from "./AdminDelegates/AdminDelegates";
import { RegisterParking } from "./AdminParkings/RegisterParking";
import { AdminUser } from "./AdminUsers/AdminUser";

export const LayoutGeneral = (props) => {
  const { children } = props;
  const { Content, Header, Footer } = Layout;
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [rutaMenuSider, setRutaMenuSider] = useState('');

  const actualizarRutaMenuSider = (ruta) => {
    setRutaMenuSider(ruta);
  };

  const renderizarContenido = () => {
    if (rutaMenuSider === '/admin/delegates') {
      return <AdminDelegates />;
    } else if (rutaMenuSider === '/admin/parkings/register') { 
      return <RegisterParking />
    } else if (rutaMenuSider === '/admin/users') { 
      return <AdminUser />
    }
    return null;
  };

  return (
    <Layout>
      <MenuSider menuCollapsed={menuCollapsed} onRutaSeleccionada={actualizarRutaMenuSider} />
      <Layout
        className="Layout-general"
        style={{ marginLeft: menuCollapsed ? "0px" : "50px" }}
      >
        <Header className="Layout-general-header">
          <MenuTop
            menuCollapsed={menuCollapsed}
            setMenuCollapsed={setMenuCollapsed}
          />
        </Header>
        <Content className="Layout-general-content">
          {renderizarContenido()}
        </Content>
        <Footer className="Layout-general-footer">
          <FooterPage></FooterPage>
        </Footer>
      </Layout>
    </Layout>
  );
};
