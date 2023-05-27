import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import "./EditUser.scss";

const initialValues = {
    firstname: "",
    lastname: "",
    phoneNumber: "",
  };


const FormComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("Ingresa tu nombre"),
    lastname: Yup.string().required("Ingresa tu apellido"),
    phoneNumber: Yup.string().required("Ingresa tu número de celular"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("phoneNumber", values.phoneNumber);

      const token = localStorage.getItem("token");

      await axios.patch("http://localhost:5000/api/v1/users/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => {
        form.resetFields();
        navigate("/user/profile");
      }, 2000);
    } catch (error) {
      console.log("Error de solicitud:", error);
    }
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={onSubmit} validationSchema={validationSchema} initialValues={initialValues}>
      <div className="inputs-container">
        <Form.Item name="firstname">
          <Input placeholder="Nombre" />
        </Form.Item>
        <Form.Item name="lastname">
          <Input placeholder="Apellido" />
        </Form.Item>
        <Form.Item name="phoneNumber">
          <Input placeholder="Número celular" />
        </Form.Item>
      </div>
      <div className="button-d">
        <Button danger>
          <Link to={"/../user/profile"}>Cancelar</Link>
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Guardar
        </Button>
      </div>
    </Form>
  );
};

export default FormComponent;
