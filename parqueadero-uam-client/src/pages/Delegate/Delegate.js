import React, { useState } from "react";
import { Modal, message } from "antd";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { Row, Col, Layout, Table, Button } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import "./Delegate.scss";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import Input from "antd/es/input/Input";
import { CarOutlined } from "@ant-design/icons";
import { SiderUser } from "../../components/MenuComponents/MenuSiderDelegate/DelegateSider";

const Parqueadero = "Vagón";
const capacidad = 50;
const ocupados = 19;
const disponibles = 31;
const IsPago = true ;

const columns = [
  {
    title: "Placa",
    dataIndex: "placa",
    key: "placa",
  },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "estado",
  },
  {
    title: "Valor",
    dataIndex: "valor",
    key: "valor",
  },
];

export const Delegate = (props) => {
  const [form, setForm] = useState({
        placa: ''
  });
    
  const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
        console.log(form);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("¿Desea pagar la placa ?");

  const showModal = () => {
    actualizarModalText();
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("Registrando pago");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      limpiarInput();
    }, 1000);
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Placa ingresa al sistema",
    });
    limpiarInput();
  };

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'Salida del sistema a la placa ingresada',
    });
    limpiarInput();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const limpiarInput = () => {
    setForm(prevState => ({ ...prevState, placa: '' }));
  };

  const actualizarModalText = () => {
    setModalText("¿Desea pagar la placa " + form.placa + "?");
  };

  return (
    <Layout>
      {contextHolder}
      <SiderUser menuCollapsed={menuCollapsed} />
      <Layout
        className="Layout-delegate"
        style={{ marginLeft: menuCollapsed ? "0px" : "50px" }}
      >
        <Header className="Layout-delegate-header">
          <MenuTop
            className="header-menutop"
            menuCollapsed={menuCollapsed}
            setMenuCollapsed={setMenuCollapsed}
          />
        </Header>
        <Content className="content">
          <div className="content-title">
            <label>Parqueadero UAM</label>
            <label className="content-title-subtitle">
              Parqueadero {Parqueadero}
            </label>
          </div>
          <div className="content-statistics">
            <Row className="row1" justify="center" gutter={[180, 180]}>
              <Col className="column">
                <label>
                  Capacidad: <div className="column-box">{capacidad}</div>
                </label>
              </Col>
              <Col className="column">
                <label>
                  Ocupados: <div className="column-box">{ocupados}</div>
                </label>
              </Col>
              <Col className="column">
                <label>
                  Disponibles: <div className="column-box">{disponibles}</div>
                </label>
              </Col>
            </Row>
          </div>
          <div className="input-placas">
            <label className="text">Ingrese la placa:</label>
            <Input
              className="placa"
              name="placa"
              type="text"
              placeholder="Ingrese número de placa"
              value={form.placa} 
              onChange={handleChange} 
              prefix={<CarOutlined />}
            />
          </div>
          <div className="container-table-unpaid">
            <Row className="row2" justify="center">
              <Col className="table-column">
                <label className="title-table">Pendientes de pago</label>
                <Table className="table" columns={columns}></Table>
              </Col>
              <Col className="column-button">
                <div className="button-container">
                  <Button type="default" size={"large"} className="button" onClick={success}>
                    Ingresar
                  </Button>
                  {IsPago ? (
                    <Button
                      type="default"
                      size={"large"}
                      className="button"
                      onClick={showModal}
                    >
                      Pagar
                    </Button>
                  ) : (
                    <Button
                      type="default"
                      disabled
                      size={"large"}
                      className="button"
                    >
                      Pagar
                    </Button>
                  )}
                  <Modal
                    title="Confirmación de pago"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                  >
                    <p>{modalText}</p>
                  </Modal>
                  <Button type="default" size={"large"} className="button" onClick={warning}>
                    Salida
                  </Button>
                  <Button type="default" size={"large"} className="button">
                    Buscar datos placa
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer className="footer">
          <FooterPage />
        </Footer>
      </Layout>
    </Layout>
  );
};
