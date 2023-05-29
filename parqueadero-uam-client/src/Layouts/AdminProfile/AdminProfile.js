import React, { useState, useEffect } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import axios from "axios";
import { Link } from "react-router-dom";
import './AdminProfile.js'

export const AdminProfile = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
  };

  const handleUploadAvatar = () => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    axios
      .put("http://localhost:5000/api/v1/admin/avatar", formData, {
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
          "http://localhost:5000/api/v1/admin/me",
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

  const [menuCollapsed, setMenuCollapsed] = useState(false);
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

  return (
    <Layout>
      <Content className="AdminProfile-content">
        <div className="content-titulo">
          <label>Parqueadero UAM</label>
          <label className="content-titulo-subtitle">Perfil Administrador</label>
        </div>
        <div className="principle">
          <Row gutter={[120, 120]}>
            <Col>
              {avatar ? (
                <Avatar
                  className="principle-avatar"
                  size={140}
                  src={URL.createObjectURL(avatar)}
                />
              ) : (
                <Avatar
                  className="principle-avatar"
                  size={140}
                  icon={<UserOutlined />}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <button onClick={handleUploadAvatar}>Subir Avatar</button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="conatiner-info">
                <label className="label-titulo-info">
                  Tu información personal
                </label>
                <br />
                <label className="label">
                  Nombre:{" "}
                  <label className="custom-label">
                    {firstname} {lastname}
                  </label>
                </label>
                <br />
                <label className="label">
                  Correo: <label className="custom-label">{email}</label>
                </label>
                <br />
                <label className="label">
                  Tipo de documento:{" "}
                  <label className="custom-label">{documentType}</label>
                </label>
                <br />
                <label className="label">
                  Documento:{" "}
                  <label className="custom-label">{documentNumber}</label>
                </label>
                <br />
                <label className="label">
                  Contacto:{" "}
                  <label className="custom-label">{phoneNumber}</label>
                </label>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};
