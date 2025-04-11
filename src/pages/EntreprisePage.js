import React from 'react';
import EntrepriseList from '../components/entreprise/EntrepriseList';
import { Typography } from 'antd';

const { Title } = Typography;

const EntreprisePage = () => {
  return (
    <div>
      <Title level={2}>Gestion des Entreprises</Title>
      <EntrepriseList />
    </div>
  );
};

export default EntreprisePage; 