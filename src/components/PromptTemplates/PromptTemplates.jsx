import React, { useContext } from 'react';
import './PromptTemplates.css';
import { Context } from '../../context/Context';

const TEMPLATES = {
  academic: {
    title: 'Academic & Research',
    templates: [
      { icon: '📚', title: 'Essay Outline', prompt: 'Create a detailed essay outline on the topic: [your topic]. Include introduction, main points, supporting evidence, and conclusion.' },
      { icon: '🔬', title: 'Research Summary', prompt: 'Summarize the following research topic in simple terms, including key concepts and findings: [your topic]' },
      { icon: '📝', title: 'Citation Helper', prompt: 'Help me create citations in APA/MLA format for the following source: [source details]' },
      { icon: '🎓', title: 'Study Guide', prompt: 'Create a comprehensive study guide for the following subject, including key concepts, definitions, and practice questions: [subject]' },
    ],
  },
  writing: {
    title: 'Writing & Content',
    templates: [
      { icon: '✍️', title: 'Grammar Check', prompt: 'Please check the following text for grammar, spelling, and clarity: [your text]' },
      { icon: '📧', title: 'Email Writer', prompt: 'Write a professional email for: [purpose]. Tone should be [formal/casual].' },
      { icon: '📄', title: 'Resume Builder', prompt: 'Help me write a compelling resume bullet point for this experience: [your experience]' },
      { icon: '🎨', title: 'Creative Writing', prompt: 'Help me brainstorm creative ideas for a story about: [your theme]' },
    ],
  },
  learning: {
    title: 'Learning & Tutoring',
    templates: [
      { icon: '🧮', title: 'Math Solver', prompt: 'Explain how to solve this math problem step by step: [your problem]' },
      { icon: '💡', title: 'Concept Explainer', prompt: 'Explain the following concept in simple terms with examples: [concept]' },
      { icon: '🗣️', title: 'Language Practice', prompt: 'Help me practice [language] by having a conversation about [topic]' },
      { icon: '❓', title: 'Q&A Tutor', prompt: 'I have questions about [subject]. Can you explain: [your question]' },
    ],
  },
  productivity: {
    title: 'Productivity & Planning',
    templates: [
      { icon: '📋', title: 'To-Do Organizer', prompt: 'Help me organize and prioritize these tasks: [list your tasks]' },
      { icon: '🎯', title: 'Goal Planner', prompt: 'Help me create a step-by-step plan to achieve this goal: [your goal]' },
      { icon: '📊', title: 'Data Analysis', prompt: 'Analyze this data and provide insights: [your data]' },
      { icon: '💼', title: 'Meeting Notes', prompt: 'Help me organize these meeting notes into action items: [your notes]' },
    ],
  },
  coding: {
    title: 'Programming & Tech',
    templates: [
      { icon: '💻', title: 'Code Explainer', prompt: 'Explain what this code does line by line: [paste code]' },
      { icon: '🐛', title: 'Debug Helper', prompt: 'Help me debug this code error: [error message and code]' },
      { icon: '⚡', title: 'Code Optimizer', prompt: 'Suggest optimizations for this code: [paste code]' },
      { icon: '📖', title: 'Documentation', prompt: 'Generate documentation for this function/class: [paste code]' },
    ],
  },
};

const PromptTemplates = () => {
  const { setInput, setShowTemplates } = useContext(Context);

  const handleTemplateClick = (prompt) => {
    setInput(prompt);
    setShowTemplates(false);
  };

  return (
    <div className="prompt-templates-overlay" onClick={() => setShowTemplates(false)}>
      <div className="prompt-templates-modal" onClick={(e) => e.stopPropagation()}>
        <div className="templates-header">
          <h2>✨ Prompt Templates</h2>
          <p>Choose a template to get started quickly</p>
          <button className="close-btn" onClick={() => setShowTemplates(false)}>✕</button>
        </div>
        
        <div className="templates-grid">
          {Object.entries(TEMPLATES).map(([key, category]) => (
            <div key={key} className="template-category">
              <h3>{category.title}</h3>
              <div className="template-list">
                {category.templates.map((template, idx) => (
                  <div
                    key={idx}
                    className="template-card"
                    onClick={() => handleTemplateClick(template.prompt)}
                  >
                    <span className="template-icon">{template.icon}</span>
                    <span className="template-title">{template.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptTemplates;
