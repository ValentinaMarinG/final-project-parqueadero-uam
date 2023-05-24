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
      // Manejar la respuesta del servidor
      console.log(response.data);
    })
    .catch(error => {
      // Manejar el error si ocurre
      console.error(error);
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
