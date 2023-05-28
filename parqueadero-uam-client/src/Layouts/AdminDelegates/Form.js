import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, setFieldValue } from "formik";
import { Button, Input, Select, Row, Col } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";


const { Option } = Select;

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmarContraseña: "",
  documentType: "",
  documentNumber: "",
  position: "",
  active: "",
  parkingId:""
};

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("El nombre es requerido"),
  lastname: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es requerido"),
  phoneNumber: Yup.string()
    .required("El celular es requerido")
    .matches(/^[0-9]+$/, "El celular debe contener solo números"),
  password: Yup.string()
    .required("La contraseña es requerida")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener como mínimo 8 caracteres"
    ),
  confirmarContraseña: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas deben ser iguales")
    .required("Debes confirmar la contraseña"),
  documentType: Yup.string()
    .required("El tipo de documento es requerido")
    .oneOf(
      [
        "Tarjeta de identidad",
        "Cédula de Ciudadanía",
        "Cédula de Extranjería",
        "Pasaporte",
      ],
      "Tipo de documento inválido"
    ),
  documentNumber: Yup.string()
    .required("El número de documento es requerido")
    .matches(/^[0-9]+$/, "El número de documento debe contener solo números"),
  position: Yup.string().required("El cargo es requerido"),
  active: Yup.string().required("El estado es requerido"),

});

const onSubmit = (values) => {
  const { confirmarContraseña, ...data } = values;

  const formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  console.log("Form Data:", Object.fromEntries(formData));

  axios
    .post("http://localhost:5000/api/v1/auth/register", values)
    .then((response) => {
      // Manejar la respuesta del servidor
      console.log(response.data);
    })
    .catch((error) => {
      // Manejar el error si ocurre
      console.error(error);
    }); 
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NTE5NjgxOSwianRpIjoiNjg1ZmNkNTQtODc2Mi00MDEwLWI5ZTItYzMyMWE0MTQwMGJhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY0NmQxNGVlNTAxMWY2OWU0M2Q4N2NhNyIsIm5iZiI6MTY4NTE5NjgxOSwiZXhwIjoxNjg1MjAwNDE5LCJyb2wiOiJhZG1pbiJ9.XbYUb1aL70EzhER1dFIFT9J5V460YxMdKGkW_nxIOvs"

export const RegisterDelegateForm = () => {
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const { confirmarContraseña, ...data } = values;

    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    console.log("Form Data:", Object.fromEntries(formData));

    axios
      .post("http://localhost:5000/api/v1/delegates", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            navigate("/admin");
          }, 2000);

          navigate("/admin");
        }
        console.log(response.data);
      })
      .catch((error) => {
        // Manejar el error si ocurre
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };

  
  const handleTipoDocumentoChange = (value, { setFieldValue }) => {
    setFieldValue("documentType", value);
  };

  useEffect(() => {
    let timer;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  return (
    <div className="formulario">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, setSubmitting, resetForm }) => (
                    <Form style={{ padding: "10px" }}>
                    {showSuccessMessage && (
                      <div style={{ color: "green", marginBottom: "10px" }}>
                        Registro exitoso
                      </div>
                    )}
                    <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                      <Col span={12}>
                        <Field name="firstname" as={Input} placeholder="Nombre" />
                        <ErrorMessage
                          name="firstname"
                          component="div"
                          className="error-message"
                        />
                      </Col>
                      <Col span={12}>
                        <Field name="lastname" as={Input} placeholder="Apellido" />
                        <ErrorMessage
                          name="lastname"
                          component="div"
                          className="error-message"
                        />
                      </Col>
                    </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Field name="email" as={Input} placeholder="Correo" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </Col>
              <Col span={12}>
                <Field
                  name="phoneNumber"
                  as={Input}
                  placeholder="Número de teléfono"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="error-message"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Field
                  name="password"
                  as={Input.Password}
                  placeholder="Contraseña"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </Col>
              <Col span={12}>
                <Field
                  name="confirmarContraseña"
                  as={Input.Password}
                  placeholder="Confirmar Contraseña"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
                <ErrorMessage
                  name="confirmarContraseña"
                  component="div"
                  className="error-message"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Field name="documentType">
                  {({ field, form }) => (
                    <Select
                      className="select-custom"
                      placeholder="Tipo de documento"
                      value={field.value}
                      onChange={(value) => {
                        form.setFieldValue("documentType", value);
                      }}
                      onBlur={field.onBlur}
                    >
                      <Option value="" disabled>
                        Tipo de documento
                      </Option>
                      <Option value="Tarjeta de identidad">
                        Tarjeta de identidad
                      </Option>
                      <Option value="Cédula de Ciudadanía">
                        Cédula de Ciudadanía
                      </Option>
                      <Option value="Cédula de Extranjería">
                        Cédula de Extranjería
                      </Option>
                      <Option value="Pasaporte">Pasaporte</Option>
                    </Select>
                  )}
                </Field>

                <ErrorMessage
                  name="documentType"
                  component="div"
                  className="error-message"
                />
              </Col>
              <Col span={12}>
                <Field
                  name="documentNumber"
                  as={Input}
                  placeholder="Documento"
                />
                <ErrorMessage
                  name="documentNumber"
                  component="div"
                  className="error-message"
                />
              </Col>
            </Row>
            
              <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Field
                  name="position"
                  as={Input}
                  placeholder="Cargo"
                />
                <ErrorMessage
                  name="position"
                  component="div"
                  className="error-message"
                />
              </Col>
              <Col span={12}>
                <Field name="active">
                  {({ field, form }) => (
                    <Select
                      className="select-custom"
                      placeholder="Activo"
                      value={field.value}
                      onChange={(value) => {
                        form.setFieldValue("active", value);
                      }}
                      onBlur={field.onBlur}
                    >
                      <Option value="" disabled>
                        Activo
                      </Option>
                      <Option value={true}>
                        Si
                      </Option>
                      <Option value={false}>
                        No
                      </Option>
                    </Select>
                  )}
                </Field>

                <ErrorMessage
                  name="active"
                  component="div"
                  className="error-message"
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Field name="asignarparqueadero">
                  {({ field, form }) => (
                    <Select
                      className="select-custom"
                      placeholder="Asignar parqueadero"
                      value={field.value}
                      onChange={(value) => {
                        form.setFieldValue("asignarparqueadero", value);
                      }}
                      onBlur={field.onBlur}
                    >
                      <Option value="" disabled>
                        Asignar parqueadero
                      </Option>
                      <Option value={true}>
                        Si
                      </Option>
                      <Option value={false}>
                        No
                      </Option>
                    </Select>
                  )}
                </Field>

                <ErrorMessage
                  name="asignarparqueadero"
                  component="div"
                  className="error-message"
                />
              </Col>
              <Col span={12}>
                <Field name="parkingId">
                  {({ field, form }) => (
                    <Select
                      className="select-custom"
                      placeholder="Parqueadero"
                      value={field.value}
                      onChange={(value) => {
                        form.setFieldValue("parkingId", value);
                      }}
                      onBlur={field.onBlur}
                    >
                      <Option value="" disabled>
                        Parqueadero
                      </Option>
                      <Option value="Cupula">
                        Parqueadero Cúpula
                      </Option>
                      <Option value="Vagon">
                        Parqueadero Vagon
                      </Option>
                      <Option value="Economia">
                        Parqueadero Economia
                      </Option>
                    </Select>
                  )}
                </Field>

                <ErrorMessage
                  name="parkingId"
                  component="div"
                  className="error-message"
                />
              </Col>
            </Row>
            <div className="button-container">
              <Button danger onClick={() => window.location.replace("/")}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Regístrate
              </Button>
            </div>
            </Form>
        )}
      </Formik>
    </div>
  );
};