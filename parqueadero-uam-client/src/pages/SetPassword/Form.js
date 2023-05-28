import React from "react";
import { Form, Input, Button, message } from "antd";
import * as Yup from "yup";
import axios from "axios";
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

  const onFinish = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      const formData = new FormData();
      formData.append("current_password", values.contrasenaActual);
      formData.append("new_password", values.contrasenaNueva);

      const token = localStorage.getItem("token");

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log(token);

      await axios.post("http://localhost:5000/api/v1/users/change-password", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        
      });
      
      form.resetFields();
    } catch (error) {
        console.log("Error de solicitud:", error);
        if (error.response) {
          console.log("Código de error:", error.response.status);
          console.log("Mensaje de error:", error.response.data);
          // Manejar el mensaje de error recibido del servidor
        } else {
          console.log("Error desconocido:", error.message);
          // Manejar cualquier otro tipo de error
        }
      }
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
          <Button className="button" danger>
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
