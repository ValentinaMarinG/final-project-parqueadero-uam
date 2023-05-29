import React, { useState, useEffect } from "react";
import { Layout, Avatar, Col, Row, Table, Button, Spin, Input, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import cupula from "../../assets/jpg/sobre_uam.jpg";
import { UserMenuSider } from "../../components/MenuComponents/UserMenuSider/UserMenuSider";
import { MenuTop } from "../../components/MenuComponents/MenuTop/MenuTop";
import { FooterPage } from "../../components/FooterPage/FooterPage";
import "./User.scss";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form } from "antd";

export const User = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [userPlates, setUserPlates] = useState([]);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [plate, setPlate] = useState("");


  const handleOpenModal = (plate) => {
    console.log("modal");
    setVisible(true);
    setPlate(plate);
  };

  const handleSave = () => {
    addPlate(plate)
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    navigate("/user/profile");
  };

  const handleOpenModal2 = (plate) => {
    setVisible2(true);
    setPlate(plate);
  };

  const handleSave2 = () => {
    deletePlate(plate);
    setVisible2(false);
  };

  const handleCancel2 = () => {
    setVisible2(false);
    navigate("/user/profile");
  };

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

  const addPlate = (plate) => {
    const formData = new FormData();
    formData.append("plate", plate);
    axios
      .post("http://localhost:5000/api/v1/users/plate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((error) => {});
  };

  const deletePlate = (plate) => {
    const formData = new FormData();
    formData.append("plate", plate);
    console.log(token)
    axios
    .delete("http://localhost:5000/api/v1/users/plate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    })
      .then((response) => {console.log(response.data)})
      .catch((error) => {console.log(error)});
  };


  useEffect(() => {
    const getUserData = async (token) => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/me",
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
      <UserMenuSider className="UserMenuSider" menuCollapsed={menuCollapsed} />
      <Layout
        className="UserPage-layout"
        style={{ marginLeft: menuCollapsed ? "0px" : "0px" }}
      >
        <Header className="UserPage-header">
          <MenuTop
            menuCollapsed={menuCollapsed}
            setMenuCollapsed={setMenuCollapsed}
          />
        </Header>
        <Content className="UserPage-content">
          <div className="content-title">
            <label>Parqueadero UAM</label>
            <label className="content-title-subtitle">Perfil de Usuario</label>
          </div>
          <div className="principal">
            <Row gutter={[120, 120]}>
              <Col>
                {avatar ? (
                  <Avatar
                    className="principal-avatar"
                    size={140}
                    src={URL.createObjectURL(avatar)}
                  />
                ) : (
                  <Avatar
                    className="principal-avatar"
                    size={140}
                    icon={<UserOutlined />}
                  />
                )}
              </Col>
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
                <div className="botones-perfil">
                <Input
                  className="input-imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Button className="subir-avatar" onClick={handleUploadAvatar}>Subir Avatar</Button>
                  <Button className="button-edit">
                    <Link to={"/../user/edit"}>Editar información</Link>
                  </Button>
                  <Button className="button-edit">
                    <Link to={"/../user/setpassword"}>Cambiar contraseña</Link>
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="container-table">
            <Row gutter={[50, 50]}>
              <Col>
                <Table
                  className="table"
                  columns={columns}
                  dataSource={data}
                  pagination={{ pageSize: 5 }}
                />
              </Col>
              <Col>
                <div className="button-div">
                  <Button className="button-table" onClick={handleOpenModal}>
                    Agregar placa
                  </Button>
                  <Modal
                    open={visible}
                    className="modal-1"
                    title="Ingresar número de placa"
                    onCancel={handleCancel}
                    onOk={handleSave}
                  >
                    <Form layout="vertical">
                      <Form.Item>
                        <Input
                          className="input-placas"
                          placeholder="Número de placa"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value)}
                        />
                      </Form.Item>
                    </Form>
                  </Modal>
                  <br />
                  <Button className="botones" onClick={handleOpenModal2}>
                    Eliminar placa
                  </Button>
                  <Modal
                    open={visible2}
                    className="modal-1"
                    title="Ingresar placa"
                    onCancel={handleCancel2}
                    onOk={handleSave2}
                  >
                    <Form layout="vertical">
                      <Form.Item>
                        <Input
                          placeholder="Número de placa"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value)}
                        />
                      </Form.Item>
                    </Form>
                  </Modal>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer className="UserPage-footer">
          <FooterPage></FooterPage>
        </Footer>
      </Layout>
    </Layout>
  );
};
