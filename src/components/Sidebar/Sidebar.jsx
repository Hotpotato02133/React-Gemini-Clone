import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { useAuth } from '../../context/AuthContext';
import { deleteChatSession } from '../../config/supabase';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat, loadSession } = useContext(Context);
  const { user, userSessions, setShowAuthModal, refreshSessions } = useAuth();

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handleLoadSession = async (sessionId) => {
    await loadSession(sessionId);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat session?')) {
      await deleteChatSession(sessionId);
      refreshSessions();
    }
  };

  return (
    <div className={`sidebar ${extended ? 'extended' : 'collapsed'}`}>
      <div className="top">
        <img onClick={() => setExtended((prev) => !prev)} className="menu" src={assets.menu_icon} alt="" />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {user ? (
              userSessions.length > 0 ? (
                userSessions.slice(0, 10).map((session) => (
                  <div 
                    key={session.id} 
                    onClick={() => handleLoadSession(session.id)} 
                    className="recent-entry saved-session"
                  >
                    <img src={assets.message_icon} alt="" />
                    <p>{session.title?.slice(0, 18) || 'Chat'}...</p>
                    <button 
                      className="delete-session-btn"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      title="Delete session"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-sessions">No saved chats yet</p>
              )
            ) : (
              <>
                {prevPrompts.map((item, index) => (
                  <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                    <img src={assets.message_icon} alt="" />
                    <p>{item.slice(0, 18)} ...</p>
                  </div>
                ))}
                <div className="sign-in-prompt" onClick={() => setShowAuthModal(true)}>
                  <span>🔐</span>
                  <p>Sign in to save chats</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
