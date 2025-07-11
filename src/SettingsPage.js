import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SettingsPage.css';

function SettingsPage() {
  const [isActive, setIsActive] = useState(true);
  const [inactivityMinutes, setInactivityMinutes] = useState(5);
  const [customMessage, setCustomMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // novo estado

  useEffect(() => {
    // Buscar dados atuais ao carregar a página
    axios.get('/api/v1/settings')
      .then((res) => {
        const config = res.data;
        setIsActive(config.isAutomationActive);
        setInactivityMinutes(config.inactivityMinutes);
        setCustomMessage(config.customMessage);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar configurações:', err);
        alert('Erro ao carregar configurações. Tente novamente.');
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const settingsData = {
      isAutomationActive: isActive,
      inactivityMinutes: parseInt(inactivityMinutes, 10),
      customMessage: customMessage,
    };

    axios.put('/api/v1/settings', settingsData)
      .then(() => {
        alert('Configurações salvas com sucesso!');
      })
      .catch((err) => {
        console.error('Erro ao salvar configurações:', err);
        alert('Erro ao salvar. Tente novamente.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isLoading) {
    return <div className="settings-container"><p>Carregando configurações...</p></div>;
  }

  return (
    <div className="settings-background">
      <div className="settings-container">
        <h2>Configurações da Automação</h2>
        <p>Ative, desative e personalize o encerramento automático de atendimentos inativos.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group form-group-toggle">
            <label htmlFor="automation-toggle">Ativar finalização automática</label>
            <label className="toggle-switch">
              <input
                id="automation-toggle"
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="inactivity-minutes">Finalizar após (minutos)</label>
            <input
              id="inactivity-minutes"
              type="number"
              className="form-input"
              value={inactivityMinutes}
              onChange={(e) => setInactivityMinutes(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="custom-message">Mensagem de finalização</label>
            <textarea
              id="custom-message"
              className="form-textarea"
              rows="4"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;
