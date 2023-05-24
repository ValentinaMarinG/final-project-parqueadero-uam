import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Input } from 'antd';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import * as Yup from 'yup';

const initialValues = {
  username: '',
  password: ''
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required('El correo institucional es requerido'),
  password: Yup.string().required('La contraseña es requerida')
});

const onSubmit = (values) => {
  console.log(values);
  // Aquí puedes realizar las acciones necesarias con los datos del formulario, como enviar una solicitud al servidor, etc.
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
          <label htmlFor='username'>Usuario</label>
          <Field
            id='username'
            name='username'
            as={Input}
            prefix={<UserOutlined />}
            placeholder='Correo institucional'
          />
          <ErrorMessage name='username' component='div' className='error-message' />
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
