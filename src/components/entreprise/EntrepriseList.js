import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import EntrepriseForm from './EntrepriseForm';
import axios from 'axios';

const EntrepriseList = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [searchText, setSearchText] = useState('');

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

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const handleEdit = (entreprise) => {
    setEditingEntreprise(entreprise);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/entreprises/${id}`);
      message.success('Entreprise supprimée avec succès');
      fetchEntreprises();
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingEntreprise) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/entreprises/${editingEntreprise.id}`, values);
        message.success('Entreprise mise à jour avec succès');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/entreprises`, values);
        message.success('Entreprise créée avec succès');
      }
      setModalVisible(false);
      setEditingEntreprise(null);
      fetchEntreprises();
    } catch (error) {
      message.error('Erreur lors de l\'enregistrement');
    }
  };

  const columns = [
    {
      title: 'Raison Sociale',
      dataIndex: 'raisonSociale',
      key: 'raisonSociale',
      sorter: (a, b) => a.raisonSociale.localeCompare(b.raisonSociale),
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.raisonSociale)
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    {
      title: 'Secteur d\'activité',
      dataIndex: 'secteurActivite',
      key: 'secteurActivite',
    },
    {
      title: 'Ville',
      dataIndex: 'ville',
      key: 'ville',
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Modifier
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingEntreprise(null);
              setModalVisible(true);
            }}
          >
            Nouvelle Entreprise
          </Button>
          <Input.Search
            placeholder="Rechercher une entreprise"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={entreprises}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingEntreprise ? "Modifier l'entreprise" : "Nouvelle entreprise"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingEntreprise(null);
        }}
        footer={null}
        width={800}
      >
        <EntrepriseForm
          initialValues={editingEntreprise}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false);
            setEditingEntreprise(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default EntrepriseList; 