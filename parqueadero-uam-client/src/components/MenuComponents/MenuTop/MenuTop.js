import { Button } from "antd";
import React, { useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from "@ant-design/icons";
import "./MenuTop.scss";
import Logo from "../../../assets/png/logo.png";
import Modal from "antd/es/modal/Modal";

//MenuTop recibe las propiedades y se las comparte a menuSider
//Las propiedades las recibe de LayoutGeneral+
//Propiedad: Saber si el menu esta o no extendido

export const MenuTop = (props) => {
  const { menuCollapsed, setMenuCollapsed } = props;

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
    <div className="menu-top">
      <div className="menu-top__left">
        <Button 
        type="link" 
        onClick={() => setMenuCollapsed(!menuCollapsed)} 
        aria-label={menuCollapsed ? "Mostrar menú" : "Ocultar menú"}>
          {menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <img className="menu-top__left__logo" src={Logo} alt="Logo"/>
      </div>
      <div className="menu-top__right">
      <Button 
        type="link" 
        onClick={showModal} 
        >
          <LogoutOutlined />
      </Button>
        <Modal  title="Cerrar sesión" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>¿Desea cerrar sesión?</p>
        </Modal>
      </div>
    </div>
  );
};
