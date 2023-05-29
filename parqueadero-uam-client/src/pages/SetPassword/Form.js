import React from "react";
import { Form, Input, Button, message } from "antd";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SetPassword.scss";

const validationSchema = Yup.object().shape({
  contrasenaActual: Yup.string().required("La contraseña actual es requerida"),
  contrasenaNueva: Yup.string()
    .required("La nueva contraseña es requerida")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener como mínimo 8 caracteres"
    ),
  confirmarContrasena: Yup.string()
    .required("Por favor confirme su nueva contraseña")
    .oneOf(
      [Yup.ref("contrasenaNueva")],
      "Las contraseñas ingresadas no coinciden"
    ),
});

const FormComponent = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      const formData = new FormData();
      formData.append("current_password", values.contrasenaActual);
      formData.append("new_password", values.contrasenaNueva);

      const token = localStorage.getItem("token");

      await axios
        .post("http://localhost:5000/api/v1/users/change-password", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            navigate("/user/profile");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            form.setFields([
              {
                name: "contrasenaActual",
                errors: ["La contraseña actual es incorrecta"],
              },
            ]);
          }
        });
    } catch (error) {
      console.log("Error de solicitud:", error);
    }
  };

  const onCancel = () => {
    form.resetFields();
    navigate("/user/profile");
  };

  const showSuccessMessage = () => {
    message.success("Su contraseña ha sido cambiada exitosamente");
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      validationSchema={validationSchema}
      initialValues={{
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: "",
      }}
    >
      <div className="form-container">
        <Form.Item
          name="contrasenaActual"
          rules={[
            {
              required: true,
              message: "Por favor ingrese su contraseña actual",
            },
          ]}
        >
          <Input.Password placeholder="Contraseña actual" />
        </Form.Item>
        <Form.Item
          name="contrasenaNueva"
          rules={[
            {
              required: true,
              message: "Por favor ingrese su nueva contraseña",
            },
          ]}
        >
          <Input.Password placeholder="Nueva contraseña" />
        </Form.Item>
        <Form.Item
          name="confirmarContrasena"
          dependencies={["contrasenaNueva"]}
          rules={[
            {
              required: true,
              message: "Por favor confirme su nueva contraseña",
            },
          ]}
        >
          <Input.Password placeholder="Confirmar nueva contraseña" />
        </Form.Item>
      </div>
      <Form.Item>
        <div className="div-button">
          <Button className="button" danger onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="button" type="primary" htmlType="submit">
            Aceptar
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default FormComponent;
