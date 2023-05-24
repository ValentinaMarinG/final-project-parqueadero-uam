import React, { useState } from "react";
import { Layout } from "antd";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./User.scss";

const UserPage = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { Content, Header, Footer } = Layout;
  return (
    <Layout>
      <UserMenuSider className="UserMenuSider" menuCollapsed={menuCollapsed} />
      <Layout
        className="UserPage-layout"
        style={{ marginLeft: menuCollapsed ? "0px" : "50px" }}>
          <Header className="UserPage-header">
        <MenuTop
          menuCollapsed={menuCollapsed}
          setMenuCollapsed={setMenuCollapsed}
        />
      </Header>
      <Content className="UserPage-content"></Content>
      <Footer className="UserPage-footer">
        <FooterPage></FooterPage>
      </Footer>
      </Layout>     
    </Layout>
  );
};

export default UserPage;
