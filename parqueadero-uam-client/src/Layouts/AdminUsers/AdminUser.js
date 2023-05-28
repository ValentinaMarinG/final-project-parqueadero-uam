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
    dataIndex: "documentNumber",
    key: "documentNumber",
  },
  {
    title: "Contacto",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Departamento",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "Municipio",
    dataIndex: "municipality",
    key: "municipality",
  },
];

export const AdminUser = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [document, setDocumentNumber] = useState("");

  const handleOpenModal = (documento) => {
    console.log("modal");
    setVisible(true);
    setDocumentNumber(documento);
  };

  const handleSave = () => {
    navigate(`admin/users/${document}`);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    navigate("/admin/users");
  };

  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  const handleOpenModal2 = (documento) => {
    console.log("modal");
    setVisible2(true);
    setDocumentNumber(documento);
  };

  const handleSave2 = () => {
    deleteUser(document);
    setVisible2(false);
  };

  const handleCancel2 = () => {
    setVisible2(false);
    navigate("/admin/users");
  };

  const deleteUser = async (documento) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/users/${documento}`);
      console.log("Usuario eliminado:", response.data);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
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
            <Modal
              open={visible}
              className="modal"
              title="Ingresar número de documento"
              onCancel={handleCancel}
              onOk={handleSave}
            >
              <Form layout="vertical">
                <Form.Item label="Número de documento del usuario a editar">
                  <Input
                    placeholder="Número de documento"
                    value={document}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Button className="botones" onClick={handleOpenModal2}>
              Eliminar Usuario
            </Button>
            <Modal
              open={visible2}
              className="modal"
              title="Ingresar número de documento"
              onCancel={handleCancel2}
              onOk={handleSave2}
            >
              <Form layout="vertical">
                <Form.Item label="Número de documento del usuario a eliminiar">
                  <Input
                    placeholder="Número de documento"
                    value={document}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Modal>
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
      </div>
    </Layout>
  );
};
