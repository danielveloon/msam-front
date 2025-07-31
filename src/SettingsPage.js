import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import axios from 'axios';

function SettingsPage() {
  const [isActive, setIsActive] = useState(true);
  const [inactivityMinutes, setInactivityMinutes] = useState(4320);
  const [customMessage, setCustomMessage] = useState(
    'Olá! Como não tivemos retorno estamos finalizando esta conversa. Caso ainda precise de ajuda ou queira dar continuidade, é só voltar a nos chamar. Ficamos à disposição!\n\nM.SAM Distribuidora de Peças'
  );
  const [portfolioFilter, setPortfolioFilter] = useState('carteirizados');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efeito para carregar as configurações iniciais
  useEffect(() => {
    // URL CORRIGIDA
    axios.get('https://msam-back-f94d9ce96824.herokuapp.com/api/v1/settings')
      .then(response => {
        const { data } = response;
        setIsActive(data.isAutomationActive);
        setInactivityMinutes(data.inactivityMinutes);
        setCustomMessage(data.customMessage);
        setPortfolioFilter(data.portfolioFilter);
      })
      .catch(error => {
        console.error("Erro ao carregar configurações iniciais!", error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const settingsData = {
      isAutomationActive: isActive,
      inactivityMinutes: parseInt(inactivityMinutes, 10),
      customMessage: customMessage,
      portfolioFilter: portfolioFilter,
    };

    console.log('Enviando para a API:', settingsData);

    // URL CORRIGIDA
    axios.put('https://msam-back-f94d9ce96824.herokuapp.com/api/v1/settings', settingsData)
      .then(response => {
        alert('Configurações salvas com sucesso!');
        console.log('Resposta do servidor:', response.data.message);
      })
      .catch(error => {
        console.error('Erro ao salvar as configurações!', error);
        alert('Houve um erro ao salvar as configurações. Verifique o console do navegador e o terminal do backend.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    // O resto do seu código JSX continua igual...
    <div className="settings-background">
      <div className="settings-container">
        <h2>Configurações da Automação</h2>
        <p>Ative, desative e personalize o encerramento automático de atendimentos inativos.</p>

        <form onSubmit={handleSubmit}>
          {/* ... todos os seus form-groups ... */}
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
              <label>Aplicar aos contatos:</label>
              <div className="radio-group">
                 <label className="radio-label">
                     <input
                         type="radio"
                         name="portfolioFilter"
                         value="carteirizados"
                         checked={portfolioFilter === 'carteirizados'}
                         onChange={(e) => setPortfolioFilter(e.target.value)}
                     />
                     Carteirizados
                 </label>
                 <label className="radio-label">
                     <input
                         type="radio"
                         name="portfolioFilter"
                         value="nao_carteirizados"
                         checked={portfolioFilter === 'nao_carteirizados'}
                         onChange={(e) => setPortfolioFilter(e.target.value)}
                     />
                     Não Carteirizados
                 </label>
              </div>
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
                rows="5"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              ></textarea>
              <small className="form-text text-muted">
                (Essa mensagem será enviada apenas para atendimentos finalizados em até 24 horas)
              </small>
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