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
import axios from "axios";
import React, { useState, useEffect } from "react";

const { Meta } = Card;

export const Home = () => {

  const [parkingData, setParkingData] = useState([]);

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/parking/home");
        if (response.status === 200) {
          setParkingData(response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error de respuesta del servidor:", error.response.data);
        } else if (error.request) {
          console.error("Error de solicitud HTTP:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      }
    };

    fetchParkingData();
  }, []);

  let availableCupula = 0;
  let numberOfCarsCupula = 0;
  let occupiedCupula = 0;

  let availableVagon = 0;
  let numberOfCarsVagon = 0;
  let occupiedVagon = 0;

  let availablePrincipal = 0;
  let numberOfCarsPrincipal = 0;
  let occupiedPrincipal = 0;

  const processParkingData = (parkings) => {
    parkings.forEach((parking) => {
      if (parking.name == 'Cúpula') {
        availableCupula = parking.available;
        numberOfCarsCupula = parking.numberofCars;
        occupiedCupula = parking.occupied;
      } else if (parking.name == 'Vagon') {
        availableVagon = parking.available;
        numberOfCarsVagon = parking.numberofCars;
        occupiedVagon = parking.occupied;
      } else if (parking.name == "Principal") {
        availablePrincipal = parking.available;
        numberOfCarsPrincipal = parking.numberofCars;
        occupiedPrincipal = parking.occupied;
      }
    });
  };

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
      {processParkingData(parkingData)}
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
                <p className="overlay-description">
                  Capacidad:
                  <div className="overlay-description-number">
                    {availableCupula}
                  </div>
                </p>
                <p className="overlay-description">
                  Ocupados:
                  <div className="overlay-description-number">
                    {occupiedCupula}
                  </div>
                </p>
                <p className="overlay-description">
                  Disponibles:
                  <div className="overlay-description-number">
                    {numberOfCarsCupula}
                  </div>
                </p>
              </div>
              <Meta className="meta-titulo" title="Parqueadero de la Cúpula" />
            </Card>
          </div>
          <div>
            <Card
              className="Layout-home-content-carousel-carousel-cupula"
              hoverable
              cover={<img alt="Parqueadero Principal" src={gratis} />}
            >
              <div className="overlay-container">
                <h3 className="overlay-title">Parqueaderos disponibles</h3>
                <p className="overlay-description">
                  Capacidad:
                  <div className="overlay-description-number">
                    {availablePrincipal}
                  </div>
                </p>
                <p className="overlay-description">
                  Ocupados:
                  <div className="overlay-description-number">
                    {occupiedPrincipal}
                  </div>
                </p>
                <p className="overlay-description">
                  Disponibles:
                  <div className="overlay-description-number">
                    {numberOfCarsPrincipal}
                  </div>
                </p>
              </div>
              <Meta className="meta-titulo" title="Parqueadero de Principal" />
            </Card>
          </div>
          <div>
            <Card
              className="Layout-home-content-carousel-carousel-cupula"
              hoverable
              cover={<img alt="Parqueadero Vagon" src={vagon} />}
            >
              <div className="overlay-container">
                <h3 className="overlay-title">Parqueaderos disponibles</h3>
                <p className="overlay-description">
                  Capacidad:
                  <div className="overlay-description-number">
                    {availableVagon}
                  </div>
                </p>
                <p className="overlay-description">
                  Ocupados:
                  <div className="overlay-description-number">
                    {occupiedVagon}
                  </div>
                </p>
                <p className="overlay-description">
                  Disponibles:
                  <div className="overlay-description-number">
                    {numberOfCarsVagon}
                  </div>
                </p>
              </div>
              <Meta className="meta-titulo" title="Parqueadero Vagón" />
            </Card>
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
