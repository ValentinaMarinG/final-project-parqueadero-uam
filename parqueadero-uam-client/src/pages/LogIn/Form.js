import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Input } from "antd";
import { useState } from "react";
import {
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import "./LogIn.scss";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required("El correo es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

export const LoginForm = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = (values) => {
    axios
      .post("http://localhost:5000/api/v1/auth/login", values)
      .then((response) => {
        // Manejar la respuesta del servidor
        if (response.status === 200) {
          //setSuccessMessage(true); // Mostrar mensaje de éxito
          const token = response.data.access_token;
          const refresh_token = response.data.refresh_token;
          localStorage.setItem("token", token);
          localStorage.setItem("refresh_token", refresh_token);
          setTimeout(() => {
            navigate("/user/profile");
          }, 2000);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(
            "Error de respuesta del servidor:",
            error.response.data
          );
          setShowErrorMessage(true);
          setErrorMessage("Usuario o contraseña incorrecta");
        } else if (error.request) {
          console.error("Error de solicitud HTTP:", error.request);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="form-group">
          <label htmlFor="email">Usuario</label>
          <Field
            id="email"
            name="email"
            as={Input}
            prefix={<UserOutlined />}
            placeholder="Correo institucional"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="error-message"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <Field
            id="password"
            name="password"
            type="password"
            as={Input.Password}
            placeholder="Contraseña"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          {showErrorMessage && (
            <div className="error-message-password">{errorMessage}</div>
          )}
          <ErrorMessage
            name="password"
            component="div"
            className="error-message"
          />
        </div>
        <br />
        <Button className="button-log-in" type="primary" htmlType="submit">
          Iniciar sesión
        </Button>
      </Form>
    </Formik>
  );
};
