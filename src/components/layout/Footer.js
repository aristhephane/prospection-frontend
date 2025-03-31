import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} - Système de Prospection</p>
      </div>
    </footer>
  );
};

export default Footer;
