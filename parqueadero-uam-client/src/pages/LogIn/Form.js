import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Input } from 'antd';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import axios from 'axios';

const initialValues = {
  email: '',
  password: ''
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required('El correo institucional es requerido'),
  password: Yup.string().required('La contraseña es requerida')
});

const onSubmit = (values) => {
  console.log(values);
  axios.post('http://localhost:5000/api/v1/auth/login', values)
    .then(response => {
      // Imprimir la respuesta exitosa
      console.log('Respuesta exitosa:', response.data);
    })
    .catch(error => {
      if (error.response) {
        // Imprimir el mensaje de error de la respuesta del servidor
        console.error('Error de respuesta del servidor:', error.response.data);
      } else if (error.request) {
        // Imprimir el mensaje de error de la solicitud HTTP
        console.error('Error de solicitud HTTP:', error.request);
      } else {
        // Imprimir el mensaje de error general
        console.error('Error:', error.message);
      }
    });
};


export const LoginForm = () => {
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
