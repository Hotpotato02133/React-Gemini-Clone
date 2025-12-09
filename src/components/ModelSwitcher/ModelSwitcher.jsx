import React, { useContext, useState } from 'react';
import './ModelSwitcher.css';
import { Context } from '../../context/Context';

const ModelSwitcher = () => {
  const { selectedModel, switchModel, AI_MODELS } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);

  const handleModelChange = (model) => {
    switchModel(model);
    setIsOpen(false);
  };

  return (
    <div className="model-switcher">
      <button 
        className="model-selector-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Switch AI Model"
      >
        <span className="model-name">{selectedModel.name}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="model-dropdown">
          <div className="model-dropdown-header">
            <h3>Select AI Model</h3>
            <p>Choose your preferred AI assistant</p>
          </div>
          <div className="model-list">
            {Object.values(AI_MODELS).map((model) => (
              <div
                key={model.id}
                className={`model-item ${selectedModel.id === model.id ? 'active' : ''}`}
                onClick={() => handleModelChange(model)}
              >
                <div className="model-item-header">
                  <div className="model-info">
                    <h4>{model.name}</h4>
                    <p className="model-provider">{model.provider}</p>
                  </div>
                  {model.free && <span className="free-badge">FREE</span>}
                </div>
                <p className="model-description">{model.description}</p>
                <div className="model-features">
                  {model.features.map((feature) => (
                    <span key={feature} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSwitcher;
