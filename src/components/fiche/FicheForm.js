import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Space, Modal, message } from 'antd';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PlusOutlined } from '@ant-design/icons';
import { TextField } from '@mui/material';
import EntrepriseForm from '../entreprise/EntrepriseForm';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

const { TextArea } = Input;
const { Option } = Select;

const FicheForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [dateVisite, setDateVisite] = useState(dayjs());
  const [dateProchainVisite, setDateProchainVisite] = useState(null);

  useEffect(() => {
    fetchEntreprises();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        // Ne pas inclure les dates ici car on les gère séparément
      });

      if (initialValues.dateVisite) {
        setDateVisite(dayjs(initialValues.dateVisite));
      }

      if (initialValues.dateProchainVisite) {
        setDateProchainVisite(dayjs(initialValues.dateProchainVisite));
      }
    }
  }, [initialValues, form]);

  const fetchEntreprises = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/entreprises`);
      setEntreprises(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des entreprises');
    }
    setLoading(false);
  };

  const handleEntrepriseSelect = async (entrepriseId) => {
    if (entrepriseId) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/entreprises/${entrepriseId}`);
        setSelectedEntreprise(response.data);
      } catch (error) {
        message.error('Erreur lors du chargement des détails de l\'entreprise');
      }
    } else {
      setSelectedEntreprise(null);
    }
  };

  const handleEntrepriseCreate = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/entreprises`, values);
      message.success('Entreprise créée avec succès');
      await fetchEntreprises();
      setModalVisible(false);
      form.setFieldsValue({ entrepriseId: response.data.id });
      setSelectedEntreprise(response.data);
    } catch (error) {
      message.error('Erreur lors de la création de l\'entreprise');
    }
  };

  const handleSubmit = async (values) => {
    if (!values.entrepriseId) {
      message.error('Veuillez sélectionner une entreprise');
      return;
    }

    // Combine form values with the date picker values
    const formattedValues = {
      ...values,
      dateVisite: dateVisite ? dateVisite.format('YYYY-MM-DD') : null,
      dateProchainVisite: dateProchainVisite ? dateProchainVisite.format('YYYY-MM-DD') : null
    };

    await onSubmit(formattedValues);
    form.resetFields();
    setDateVisite(dayjs());
    setDateProchainVisite(null);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        niveauInteret: 3,
        ...initialValues
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space align="baseline" style={{ width: '100%' }}>
          <Form.Item
            name="entrepriseId"
            label="Entreprise"
            rules={[{ required: true, message: 'Veuillez sélectionner une entreprise' }]}
            style={{ width: '300px' }}
          >
            <Select
              loading={loading}
              onChange={handleEntrepriseSelect}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {entreprises.map(entreprise => (
                <Option key={entreprise.id} value={entreprise.id}>
                  {entreprise.raisonSociale}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Nouvelle Entreprise
          </Button>
        </Space>

        {selectedEntreprise && (
          <div style={{ marginTop: 8, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
            <h4>Détails de l'entreprise sélectionnée :</h4>
            <p>Adresse : {selectedEntreprise.adresse}</p>
            <p>Téléphone : {selectedEntreprise.telephone}</p>
            <p>Secteur : {selectedEntreprise.secteurActivite}</p>
          </div>
        )}
      </div>

      <Form.Item
        label="Date de visite"
        required
        rules={[{ required: true, message: 'La date de visite est obligatoire' }]}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
          <DatePicker
            value={dateVisite}
            onChange={(newDate) => setDateVisite(newDate)}
            sx={{ width: '100%' }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
              }
            }}
          />
        </LocalizationProvider>
      </Form.Item>

      <Form.Item
        name="statut"
        label="Statut"
        rules={[{ required: true, message: 'Le statut est obligatoire' }]}
      >
        <Select>
          <Option value="Nouveau">Nouveau</Option>
          <Option value="En cours">En cours</Option>
          <Option value="Terminé">Terminé</Option>
          <Option value="Annulé">Annulé</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="commentairesGeneraux"
        label="Commentaires généraux"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="resultatVisite"
        label="Résultats de la visite"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Date de prochaine visite"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
          <DatePicker
            value={dateProchainVisite}
            onChange={(newDate) => setDateProchainVisite(newDate)}
            sx={{ width: '100%' }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
              }
            }}
          />
        </LocalizationProvider>
      </Form.Item>

      <Form.Item
        name="niveauInteret"
        label="Niveau d'intérêt"
      >
        <Select>
          <Option value={1}>1 - Très faible</Option>
          <Option value={2}>2 - Faible</Option>
          <Option value={3}>3 - Moyen</Option>
          <Option value={4}>4 - Élevé</Option>
          <Option value={5}>5 - Très élevé</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? 'Mettre à jour' : 'Créer'}
        </Button>
      </Form.Item>

      <Modal
        title="Nouvelle entreprise"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <EntrepriseForm
          onSubmit={handleEntrepriseCreate}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </Form>
  );
};

export default FicheForm; 