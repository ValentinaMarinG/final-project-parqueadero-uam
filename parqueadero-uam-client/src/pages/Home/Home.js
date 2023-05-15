import React from "react";
import Logo from "../../assets/png/logo.png";
import { Button, Layout } from "antd";
import "./Home.scss";
import { Header, Content } from "antd/es/layout/layout";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Carousel } from 'antd';

const contentStyle = {
  height: "90px",
  color: "#fff",
  lineHeight: "90px",
  textAlign: "center",
  background: "#364d79",
};

export const Home = () => {
  return (
    <Layout className="Layout-home">
      <Header className="Layout-home-header">
        <img className="Layout-home-header-left-logo" src={Logo} alt="Logo" />
        <Button className="button__right" type="link">
          <Link to={"/../LogIn"} className="link">
            <label className="button__right-text">Iniciar sesión</label>
            <LoginOutlined />
          </Link>
        </Button>
      </Header>
      <Content className="Layout-home-content">
        <Carousel autoplay className="Layout-home-content-carousel">
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      </Content>
    </Layout>
  );
};
