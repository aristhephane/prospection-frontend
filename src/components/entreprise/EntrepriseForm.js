import React from 'react';
import { Form, Input, Button, Select, InputNumber, Space } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const EntrepriseForm = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues || {
        pays: 'France',
        potentielCommercial: 3
      }}
    >
      <Form.Item
        name="raisonSociale"
        label="Raison Sociale"
        rules={[{ required: true, message: 'La raison sociale est obligatoire' }]}
      >
        <Input />
      </Form.Item>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="adresse"
          label="Adresse"
          rules={[{ required: true, message: 'L\'adresse est obligatoire' }]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="codePostal"
          label="Code Postal"
          rules={[
            { pattern: /^[0-9]{5}$/, message: 'Le code postal doit comporter 5 chiffres' }
          ]}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="ville"
          label="Ville"
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="pays"
          label="Pays"
          style={{ width: '200px' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="telephone"
          label="Téléphone"
          rules={[
            { required: true, message: 'Le téléphone est obligatoire' },
            { pattern: /^(\+?\d{1,3}[-. ]?)?\d{10}$/, message: 'Format de téléphone invalide' }
          ]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Format d\'email invalide' }]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="secteurActivite"
          label="Secteur d'activité"
          rules={[{ required: true, message: 'Le secteur d\'activité est obligatoire' }]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="sousSecteurActivite"
          label="Sous-secteur d'activité"
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="tailleEntreprise"
          label="Taille de l'entreprise"
          style={{ width: '200px' }}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="siteWeb"
          label="Site Web"
          rules={[{ type: 'url', message: 'Format d\'URL invalide' }]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="siret"
          label="SIRET"
          rules={[{ pattern: /^[0-9]{14}$/, message: 'Le SIRET doit comporter 14 chiffres' }]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="codeNaf"
          label="Code NAF/APE"
          style={{ width: '200px' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="chiffreAffaires"
          label="Chiffre d'affaires"
          style={{ width: '100%' }}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            parser={value => value.replace(/\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="anneeCA"
          label="Année du CA"
          style={{ width: '200px' }}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={2000}
            max={2100}
          />
        </Form.Item>
      </Space>

      <h3>Contact Principal</h3>
      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="contactPrincipalNom"
          label="Nom"
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contactPrincipalPrenom"
          label="Prénom"
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item
          name="contactPrincipalFonction"
          label="Fonction"
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contactPrincipalEmail"
          label="Email"
          rules={[{ type: 'email', message: 'Format d\'email invalide' }]}
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contactPrincipalTelephone"
          label="Téléphone"
          style={{ width: '100%' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Form.Item
        name="potentielCommercial"
        label="Potentiel Commercial"
      >
        <Select>
          <Option value={1}>1 - Très faible</Option>
          <Option value={2}>2 - Faible</Option>
          <Option value={3}>3 - Moyen</Option>
          <Option value={4}>4 - Élevé</Option>
          <Option value={5}>5 - Très élevé</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="sourceAcquisition"
        label="Source d'acquisition"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
      >
        <Input placeholder="Séparez les tags par des virgules" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialValues ? 'Mettre à jour' : 'Créer'}
          </Button>
          <Button onClick={onCancel}>
            Annuler
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EntrepriseForm; 