import { Button, Layout, Table, Row, Col, Modal } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { LayoutGeneral } from "../LayoutGeneral";
import "../AdminDelegates/AdminDelegates.scss";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input } from "antd";

const columns = [
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Apellido",
    dataIndex: "lastname",
    key: "lastname",
  },
  {
    title: "Tipo de documento",
    dataIndex: "documentType",
    key: "documentType",
  },
  {
    title: "Documento",
    dataIndex: "document",
    key: "document",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Contacto",
    dataIndex: "contacto",
    key: "contacto",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];

export const AdminUser = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");

  const handleSave = () => {
    navigate(`/users/edit?documentNumber=${documentNumber}`);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  const handleOpenModal = (documento) => {
    console.log("modal");
    setVisible(true);
    setDocumentNumber(documento);
  };

  useEffect(() => {
    const getUserData = async (token) => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data;

        setUserData(userData.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUserData(token);
  }, [token]);

  return (
    <Layout className="dashboard-delegates">
      <div className="div-delegate">
        <Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
          <div className="title">
            <label>Dashboard Parqueadero UAM</label>
            <label className="title-subtitle">Sección de Usuarios</label>
          </div>
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
          <div className="div-botones">
            <Button className="botones">
              <Link to={"/admin/users/register"}>Añadir Usuario</Link>
            </Button>
            <Button className="botones" onClick={handleOpenModal}>
              Editar Usuario
            </Button>
            <Button className="botones">
              <Link to={"../admin/delegates/"}>Eliminar Usuario</Link>
            </Button>
          </div>
        </Row>
        <Row gutter={[10, 10]} style={{ marginBottom: "10px" }}>
          <Table
            className="lista-delegados"
            columns={columns}
            dataSource={userData}
            pagination={{ defaultPageSize: 5 }}
          />
        </Row>
        <Modal
          title="Modal de Administrador de Usuario"
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancelar
            </Button>,
            <Button key="save" type="primary" onClick={handleSave}>
              Aceptar
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Número de documento">
              <Input
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};
