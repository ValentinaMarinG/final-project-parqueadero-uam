import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, setFieldValue } from "formik";
import { Button, Input, Select, Row, Col } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

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
  department: "",
  municipality: "",
  active: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo inválido"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "El celular debe contener solo números"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y tener como mínimo 8 caracteres"
    ),
  confirmarContraseña: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas deben ser iguales"),
  documentType: Yup.string()
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
    .matches(/^[0-9]+$/, "El número de documento debe contener solo números")
});

export const AdminEditUserForm = () => {
  const { document } = useParams();

  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const { confirmarContraseña, ...data } = values;

    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    const token = localStorage.getItem('token');
    
    axios
      .patch(`http://localhost:5000/api/v1/users/${document}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        }
      })
      .catch((error) => {
        // Manejar el error si ocurre
        console.log(error.response.status);
        console.log("-------------------");
        console.log(error.response.data);
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get(
        "https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=departamento"
      );
      const dataFilter = [...new Set(response.data.map(JSON.stringify))].map(
        JSON.parse
      );

      const sortedDepartamentos = dataFilter.sort((a, b) =>
        a.departamento.localeCompare(b.departamento)
      );

      setDepartamentos(sortedDepartamentos);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMunicipios = async (departamento) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.datos.gov.co/resource/xdk5-pm3f.json?$select=municipio&departamento=${departamento}`
      );

      const sortedMunicipios = response.data.sort((a, b) =>
        a.municipio.localeCompare(b.municipio)
      );

      setMunicipios(sortedMunicipios);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDepartamentoChange = (value, { setFieldValue }) => {
    setFieldValue("department", value);
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
    <div className="formulario-tamaño">
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
              <Col span={12} style={{ paddingRight: "10px" }}>
                <Field name="department">
                  {({ field }) => (
                    <Select
                      className="select-custom"
                      name={field.name}
                      value={field.value}
                      onChange={(value) => {
                        setFieldValue("department", value);
                        fetchMunicipios(value);
                      }}
                    >
                      <Option value="" disabled>
                        Departamento
                      </Option>
                      {departamentos.map((departamento) => (
                        <Option
                          key={departamento.departamento}
                          value={departamento.departamento}
                        >
                          {departamento.departamento}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="department"
                  component="div"
                  className="error-message"
                />
              </Col>
              <Col span={12} style={{ paddingLeft: "10px" }}>
                <Field
                  className="select-custom"
                  name="municipality"
                  as={Select}
                  placeholder="Municipio"
                  disabled={loading || !municipios.length}
                  onChange={(value) => setFieldValue("municipality", value)}
                >
                  <Option value="" disabled>
                    Municipio
                  </Option>
                  {municipios.map((municipio) => (
                    <Option
                      key={municipio.municipio}
                      value={municipio.municipio}
                    >
                      {municipio.municipio}
                    </Option>
                  ))}
                </Field>
                <ErrorMessage
                  name="municipality"
                  component="div"
                  className="error-message"
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Field name="active" >
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
                      <Option value={true}>Si</Option>
                      <Option value={false}>No</Option>
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
            <div className="buttom-container">
              <Button danger onClick={() => window.location.replace("/admin")}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
