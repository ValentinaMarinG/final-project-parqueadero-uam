import React from 'react';
import Logo from "../../assets/png/Logo_UAM.png";
import { Layout, Button, Space, Row } from 'antd';
import '../../scss/index.scss';
import { Content } from 'antd/es/layout/layout';
import { FooterPage } from '../../components/FooterPage/FooterPage';
import "./LogIn.scss";
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { LoginForm } from './Form'; // Importamos el componente LoginForm desde Form.js

export const LogIn = (props) => {
  const url_aum="https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

  const { children } = props; 
  const { Header, Content } = Layout;

  return (
    <Layout className='Layout-LogIn'>
      <Header className='Layout-LogIn-header'></Header>
      <Content className='Layout-LogIn-content'>
        <div className='container-principal'>
          <div className='container-secundario'>
            <label className='container-secundario-titulo'>Parqueadero UAM</label>
          </div>
          <label className='container-principal-texto'>Ingresa los datos de tu <span className='container-principal-texto-subrayado' onClick={() => window.open(url_aum)}>Cuenta UAM®</span></label>
        <div className='inputs-box'>
        <LoginForm />
        </div>
          <div className='registrarse'>
            <Row>
              <label className='registrarse-texto'>Si no estás registrado ingresa aquí.
                
                <Button className='button-link' type='link'>
                  <Link to={"/../register"}>Registrarse</Link>
                </Button>
              </label>
            </Row>
          </div>
        </div>
      </Content>
      <img src={Logo} alt="Logo" className="bottom-logo" />
    </Layout>
  );
};