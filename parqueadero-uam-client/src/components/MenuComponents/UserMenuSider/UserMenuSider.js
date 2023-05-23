import React from "react";
import "./UserMenuSider.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Layout } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  BarChartOutlined,
  CarryOutOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";

export const UserMenuSider = ({ menuCollapsed }) => {
  const { Sider } = Layout;
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/user/profile",
      icon: <UserOutlined />,
      label: <span className="navbar-text">Perfil</span>,
    },
    {
      key: "/user/cars",
      icon: <TeamOutlined />,
      label: <span className="navbar-text">Buscar mi carro</span>,
    },    
  ];

  const menuClick = (e) => {
    const path = e.key;
    console.log("Di click en el menú " + path);
    navigate(path);
  };

  const itemRender = (item, index) => {
    const { icon, label } = item;
    const isSelected = location.pathname === item.key;

    return (
      <Menu.Item
        key={item.key}
        className={isSelected ? "ant-menu-item ant-menu-item-selected" : "ant-menu-item"}
      >
        <div className="menu-item-content">
          {React.cloneElement(icon, { className: "menu-item-icon" })}
          {label}
        </div>
      </Menu.Item>
    );
  };

  return (
    <Sider className="user-menu-sider" collapsed={menuCollapsed}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        onClick={menuClick}
      >
        {menuItems.map((item) => itemRender(item))}
      </Menu>
    </Sider>
  );
};
