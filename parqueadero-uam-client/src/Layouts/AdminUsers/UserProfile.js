import React, { useState, useEffect } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./UserProfile.scss"; // Importa el archivo de estilos

export const UserProfile = () => {
  const { document } = useParams();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [userPlates, setUserPlates] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
  };

  const handleUploadAvatar = () => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    axios
      .put("http://localhost:5000/api/v1/users/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    const getUserData = async (token) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/users/${document}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data;

        setUserData(userData.data);
        setUserPlates([userData.data.plate]);
      } catch (error) {
        console.error(error);
      }
    };

    getUserData(token);
  }, [token]);

  const { Content, Header, Footer } = Layout;

  if (!userData) {
    return (
      <div className="cargando-pagina">
        <Spin tip="Cargando" size="large"></Spin>
      </div>
    );
  }

  const {
    firstname,
    lastname,
    email,
    documentType,
    documentNumber,
    phoneNumber,
  } = userData;

  const data = userPlates.map((plate, index) => ({
    key: index.toString(),
    plate: plate,
  }));

  const columns = [
    {
      title: "Mis Placas",
      dataIndex: "plate",
      key: "plate",
      render: (userPlates) => (
        <ul className="ul">
          {userPlates &&
            userPlates.map((plate) => (
              <li className="no-marker" key={plate}>
                {plate}
              </li>
            ))}
        </ul>
      ),
    },
  ];

  return (
    <Layout>
      <Content className="UserProfile-content">
        <div className="content-title">
          <label>Parqueadero UAM</label>
          <label className="content-title-subtitle">Perfil de Usuario</label>
        </div>
        <Row gutter={[150, 150]}>
          <Col>
            <div className="avatar-col">
              {avatarUrl ? (
                <Avatar
                  className="principal-avatar"
                  size={140}
                  src={avatarUrl}
                />
              ) : (
                <Avatar
                  className="principal-avatar"
                  size={140}
                  icon={<UserOutlined />}
                />
              )}
              
            </div>
          </Col>
          <Col>
            <div className="personal-info">
              <label className="label-titulo-info">Información personal</label>
              <br />
              <label className="label">
                Nombre:{" "}
                <span className="custom-label">
                  {firstname} {lastname}
                </span>
              </label>
              <br />
              <label className="label">
                Correo: <span className="custom-label">{email}</span>
              </label>
              <br />
              <label className="label">
                Tipo de documento:{" "}
                <span className="custom-label">{documentType}</span>
              </label>
              <br />
              <label className="label">
                Documento:{" "}
                <span className="custom-label">{documentNumber}</span>
              </label>
              <br />
              <label className="label">
                Contacto: <span className="custom-label">{phoneNumber}</span>
              </label>
            </div>
          </Col>
        </Row>
        <Row gutter={[120, 120]}>
        <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <Button onClick={handleUploadAvatar}>Subir Avatar</Button>
        </Row>
        <div className="container-table">
          <Row gutter={[50, 50]}>
            <Col>
              <Table
                className="table"
                columns={columns}
                dataSource={data}
                pagination={{ defaultPageSize: 3 }}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};
