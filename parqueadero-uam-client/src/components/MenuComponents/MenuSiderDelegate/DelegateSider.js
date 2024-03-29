import React from "react";
import "./DelegateSider.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Layout } from "antd";
import {
  UserOutlined,
  CarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export const SiderUser = (props) => {
  const { Sider } = Layout;
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/delegate/profile",
      icon: <UserOutlined />,
      label: <span className="navbar-text">Perfil</span>,
    },
    {
      key: "/delegate/parkings",
      icon: <CarOutlined />,
      label: <span className="navbar-text">Parqueaderos</span>,
      subMenu: [
        { key: "/delegate/parkings/cupula", icon:<CarOutlined />, label: "  Parqueadero Cúpula" },
        { key: "/delegate/parkings/economia", icon:<CarOutlined />, label: "   Parqueadero Economía" },
        { key: "/delegate/parkings/vagon", icon:<CarOutlined />, label: "   Parqueadero Vagón" }
      ],
    },
    {
      key: "/admin/statistics",
      icon: <BarChartOutlined />,
      label: <span className="navbar-text">Estadisticas</span>,
    },
  ];

  const menuClick = (e) => {
    const path = e.key;
    console.log("Di click en el menú " + path);
    navigate(path);
  };

  const itemRender = (item, index) => {
    const { icon, label, subMenu } = item;
    const isSelected = location.pathname === item.key;
    if (subMenu) {
      return (
        <Menu.SubMenu key={item.key} icon={icon} title={label}>
          {subMenu.map((subMenuItem) => (
            <Menu.Item key={subMenuItem.key} onClick={menuClick} className="submenu">
              {subMenuItem.icon}
              {subMenuItem.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item
       key={item.key}
       icon={React.cloneElement(icon, { className: "menu-item-icon" })}
      className={
        isSelected 
        ? "ant-menu-item ant-menu-item-selected" 
        : "ant-menu-item"
      }>
        {label}
      </Menu.Item>
    );
  };

  return (
    <Sider className="menu-sider" collapsed={props.menuCollapsed}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        onClick={menuClick}
        defaultOpenKeys={menuItems
                        .filter((item) => item.subMenu)
                        .map((item) => item.key)}
      >
        {menuItems.map((item) => itemRender(item))}
      </Menu>
    </Sider>
  );
};

