import React, { useState } from "react";
import Logo from "../../assets/png/logo.png";
import { Button, Layout } from "antd";
import "./Home.scss";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import cupula from "../../assets/jpg/sobre_uam.jpg";
import vagon from "../../assets/png/trenvagon.png";
import gratis from "../../assets/jpg/nuestra_uam.jpg";
import { Card } from "antd";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import Modal from "antd/es/modal/Modal";
import mapa from "../../assets/png/mapa.png";

const { Meta } = Card;

const Automoviles = 30;
const Motocicletas = 25;
const Discapacitados = 3

export const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <div className="titulo-home">
          <label>Bienvenido</label>
          <label>Parqueadero UAM</label>
        </div>
        <Carousel autoplay className="Layout-home-content-carousel">
          <div>
              <Card
                className="Layout-home-content-carousel-carousel-cupula"
                hoverable
                cover={<img alt="Parqueadero Cupula" src={cupula} />}
              >
                <div className="overlay-container">
                  <h3 className="overlay-title">Parqueaderos disponibles</h3>
                  <p className="overlay-description">Automóviles:<div className="overlay-description-number">{Automoviles}</div></p>
                  <p className="overlay-description">Motocicletas:<div className="overlay-description-number">{Motocicletas}</div></p>
                  <p className="overlay-description">Discapacitados:<div className="overlay-description-number">{Discapacitados}</div></p>
                </div>
                <Meta className="meta-titulo" title="Parqueadero de la Cúpula" />
              </Card>
          </div>
          <div>
              <Card
                className="Layout-home-content-carousel-carousel-cupula"
                hoverable
                cover={<img alt="Parqueadero Gratis" src={gratis} />}
              >
                <div className="overlay-container">
                  <h3 className="overlay-title">Parqueaderos disponibles</h3>
                  <p className="overlay-description">Automóviles:<div className="overlay-description-number">25</div></p>
                  <p className="overlay-description">Motocicletas:<div className="overlay-description-number">30</div></p>
                  <p className="overlay-description">Discapacitados:<div className="overlay-description-number">3</div></p>
                </div>
                <Meta className="meta-titulo" title="Parqueadero de Economía" />
              </Card>
          </div>
          <div>
            <Button type="link">
              <Card
                className="Layout-home-content-carousel-carousel-cupula"
                hoverable
                cover={<img alt="Parqueadero Vagones" src={vagon} />}
              >
                <div className="overlay-container">
                  <h3 className="overlay-title">Parqueaderos disponibles</h3>
                  <p className="overlay-description">Automóviles:<div className="overlay-description-number">25</div></p>
                  <p className="overlay-description">Motocicletas:<div className="overlay-description-number">30</div></p>
                  <p className="overlay-description">Discapacitados:<div className="overlay-description-number">3</div></p>
                </div>
                <Meta className="meta-titulo" title="Parqueadero Vagones" />
              </Card>
            </Button>
          </div>
        </Carousel>
        <div className="div">
          <Button className="button-link" type="link" onClick={showModal}>
            <label>Acceder al mapa de la zona</label>
          </Button>
          <Modal
            className="mapa"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={870}
          >
            <img src={mapa} alt="mapa" />
          </Modal>
        </div>
        <div className="texto-introduccion">
          <label>
            En este portal encontrará la informacion en tiempo real sobre la
            disponibilidad de los
          </label>
          <label>
            parqueaderos que tiene la Universidad Autónoma de Manizales.
          </label>
          <br></br>
          <label>
            Ofrecemos una gran herramienta para la gestión y monitorización de
            los parqueaderos
          </label>
          <label>
            para permitirle fácil acceso a la información de cada parqueadero a
            toda{" "}
          </label>
          <label>la comunidad educativa.</label>
        </div>
      </Content>
      <Footer className="Layout-home-footer">
        <FooterPage />
      </Footer>
    </Layout>
  );
};
