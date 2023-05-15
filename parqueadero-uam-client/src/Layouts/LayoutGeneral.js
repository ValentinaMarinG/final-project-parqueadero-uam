import React, { useState } from "react";
import { Layout } from "antd";
import { MenuSider } from "../components/MenuComponents/MenuSider/MenuSider";
import { MenuTop } from "../components/MenuComponents/MenuTop/MenuTop";
import "./LayoutGeneral.scss";
import { FooterPage } from "../components/FooterPage/FooterPage";

export const LayoutGeneral = (props) => {
  const { children } = props;
  const { Content, Header, Footer} = Layout;
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  return (
    <Layout>
      <MenuSider menuCollapsed={menuCollapsed} />
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
        <Content className="Layout-general-content">{children}</Content>
        <Footer className='Layout-general-footer'>
          <FooterPage></FooterPage>
        </Footer>
      </Layout>
    </Layout>
  );
};
