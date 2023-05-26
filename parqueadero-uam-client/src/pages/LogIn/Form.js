import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import forge from 'node-forge';
import "./LogIn.scss";

const initialValues = {
  email: '',
  password: ''
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('El correo es requerido'),
  password: Yup.string().required('La contraseña es requerida')
});

export const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = (values) => {
    axios.get('http://localhost:5000/api/v1/auth/public-key')
      .then(response => {
        const publicKeyString = response.data;
        const publicKey = forge.pki.publicKeyFromPem(publicKeyString);
        localStorage.setItem('publicKey', publicKeyString);
        const passwordBuffer = forge.util.createBuffer(values.password, 'utf8');
        const encryptedPasswordBuffer = publicKey.encrypt(passwordBuffer, 'RSAES-PKCS1-V1_5');
        const encryptedPasswordBase64 = forge.util.encode64(encryptedPasswordBuffer.getBytes());
        values.password = encryptedPasswordBase64;

        axios.post('http://localhost:5000/api/v1/auth/login', values)
          .then((response) => {
            // Manejar la respuesta del servidor
            if (response.status === 200) {
              //setSuccessMessage(true); // Mostrar mensaje de éxito
              const token = response.data.access_token;
              const refresh_token = response.data.refresh_token;
              localStorage.setItem('token', token);
              localStorage.setItem('refresh_token', refresh_token);
              console.log(localStorage.getItem('token'));
              console.log(localStorage.getItem('refresh_token'));
              setTimeout(() => {
                //navigate("/user/profile");
              }, 2000);
            }
            console.log(response.data);
          })
          .catch(error => {
            if (error.response) {
              console.error('Error de respuesta del servidor:', error.response.data);
            } else if (error.request) {
              console.error('Error de solicitud HTTP:', error.request);
            } else {
              console.error('Error:', error.message);
            }
          });
      })
      .catch(error => {
        if (error.response) {
          const statusCode = error.response.status;
          console.log(statusCode);
          if (statusCode === 401) {
            setErrorMessage('Contraseña incorrecta');
          }
        }
        console.log(error);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div className='form-group'>
          <label htmlFor='email'>Usuario</label>
          <Field
            id='email'
            name='email'
            as={Input}
            prefix={<UserOutlined />}
            placeholder='Correo institucional'
          />
          <ErrorMessage name='email' component='div' className='error-message' />
        </div>
        <br/>
        <div className='form-group'>
          <label htmlFor='password'>Contraseña</label>
          <Field
            id='password'
            name='password'
            type='password'
            as={Input.Password}
            placeholder='Contraseña'
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
          {errorMessage && <div className='error-message-password'>{errorMessage}</div>}
          <ErrorMessage name='password' component='div' className='error-message' />
        </div>
        <br/>
        <Button className='button-log-in' type='primary' htmlType='submit'>
          Iniciar sesión
        </Button>
      </Form>
    </Formik>
  );
};
