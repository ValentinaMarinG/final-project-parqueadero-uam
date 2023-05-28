import { Button, Layout, Table, Row, Col } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { LayoutGeneral } from "../LayoutGeneral";
import "./AdminDelegates.scss";

const columns = [
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
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
    title: "Cargo",
    dataIndex: "cargo",
    key: "cargo",
  },
  {
    title: "Activo",
    dataIndex: "activo",
    key: "activo",
  },
];

export const AdminDelegates = () => {
  return (
    <Layout className="dashboard-delegates">
      <div className="div-delegate">
        <Row gutter={[16, 16]}  style={{ marginBottom: "40px" }}>
        <div className="title">
          <label>Dashboard Parqueadero UAM</label>
          <label className="title-subtitle">Sección de Delegados</label>
        </div>
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: "40px" }}>
        <div className="div-botones">
          <Button className="botones">
            <Link to={"../admin/delegates/register"}>Añadir Delegado</Link>
          </Button>
          <Button className="botones">
            <Link to={"../admin/delegates/"}>Eliminar Delegado</Link>
          </Button>
          <Button className="botones">
            <Link to={"../admin/delegates/delegates"}>Editar Delegado</Link>
          </Button>
        </div>
        </Row>
        <Row gutter={[10, 10]} style={{ marginBottom: "10px" }}>
        <Table
          className="lista-delegados"
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
        </Row>
      </div>
    </Layout>
  );
};
