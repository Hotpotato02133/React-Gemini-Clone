import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserMenu.css';

const UserMenu = () => {
  const { user, handleSignOut, setShowAuthModal } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button 
        className="sign-in-btn"
        onClick={() => setShowAuthModal(true)}
      >
        Sign In
      </button>
    );
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-avatar-btn"
        onClick={() => setShowMenu(!showMenu)}
        title={displayName}
      >
        <span className="user-avatar">{initial}</span>
      </button>
      
      {showMenu && (
        <div className="user-dropdown">
          <div className="user-info">
            <span className="user-avatar-large">{initial}</span>
            <div className="user-details">
              <p className="user-name">{displayName}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={() => { handleSignOut(); setShowMenu(false); }}>
            <span className="dropdown-icon">🚪</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
