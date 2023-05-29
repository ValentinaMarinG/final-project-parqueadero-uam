import React, { useState, useEffect } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Spin, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import './AdminProfile.scss'

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
      <div className="cargando-pagina-1">
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
      <Content className="AdminProfile-content-1">
        <div className="content-titu-1">
          <label>Parqueadero UAM</label>
          <label className="content-titu-subtitle-1">Perfil Administrador</label>
        </div>
        <Row justify="center" align="middle">
            <div>
          <Col span={24} className="avatar-col-1">
            {avatar ? (
              <Avatar
                className="principle-avatar-1"
                size={140}
                src={URL.createObjectURL(avatar)}
              />
            ) : (
              <Avatar
                className="principle-avatar-1"
                size={140}
                icon={<UserOutlined />}
              />
            )}
            <Input
              className="botones-avatar-1"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <Button className="botones-avatar-1" onClick={handleUploadAvatar}>Subir Avatar</Button>
          </Col>
          </div>
          <Col span={24} className="info-col-1">
            <div className="conatiner-info-1">
              <label className="label-titulo-info-1">
                Tu información personal
              </label>
              <br />
              <label className="label-1">
                Nombre:{" "}
                <label className="custom-label-1">
                  {firstname} {lastname}
                </label>
              </label>
              <br />
              <label className="label-1">
                Correo: <label className="custom-label-1">{email}</label>
              </label>
              <br />
              <label className="label-1">
                Tipo de documento:{" "}
                <label className="custom-label-1">{documentType}</label>
              </label>
              <br />
              <label className="label-1">
                Documento:{" "}
                <label className="custom-label-1">{documentNumber}</label>
              </label>
              <br />
              <label className="label-1">
                Contacto: <label className="custom-label-1">{phoneNumber}</label>
              </label>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
