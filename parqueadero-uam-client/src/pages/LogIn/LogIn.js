import React, { useState } from 'react';
import Logo from "../../assets/png/Logo_UAM.png";
import { Layout, Button, Space, Row } from 'antd';
import '../../scss/index.scss';
import { Content, Footer } from 'antd/es/layout/layout';
import { FooterPage } from '../../components/FooterPage/FooterPage';
import "./LogIn.scss";
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const LogIn = (props) => {
    const url_aum="https://www.autonoma.edu.co/uamvirtual?errorcode=4#seccion-uamvirtual";

    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
        console.log(form);
    };

  const { children } = props; 
  const { Header, Footer, Content } = Layout;

  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <Layout className='Layout-LogIn'>
        <Header className='Layout-LogIn-header'></Header>
        <Content className='Layout-LogIn-content'>
            <div className='container-principal'>
                <div className='container-secundario'>
                    <label className='container-secundario-titulo'>Parqueadero UAM</label>
                </div>
                <label className='container-principal-texto'>Ingresa los datos de tu <span className='container-principal-texto-subrayado' onClick={() => window.open(url_aum)}>Cuenta UAM®</span></label>
                <label className='container-principal-usuario'>Usuario</label>
                <Input className='username' 
                       type='text' 
                       name='username' 
                       placeholder="Correo institucional"
                       value={form.username} 
                       prefix={<UserOutlined />} 
                       onChange={handleChange} />
                <label className='container-principal-contraseña'>Contraseña</label>
                <Input.Password
                    className='password'
                    type='text' 
                    name='password'
                    value={form.password}
                    placeholder="Contraseña"
                    onChange={handleChange}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                <Button className='button-log-in' type="primary">
                    <Link to={"/../signin"}>Iniciar sesión</Link>
                </Button>
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
            <div>
                <label></label>
            </div>
        </Content>
        <img src={Logo} alt="Logo" className="bottom-logo" />
    </Layout>
  );
};

