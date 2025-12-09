import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    handleSignIn, 
    handleSignUp, 
    authError, 
    setAuthError 
  } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setSuccessMessage('');

    if (isLogin) {
      const success = await handleSignIn(email, password);
      if (success) {
        resetForm();
      }
    } else {
      const success = await handleSignUp(email, password, displayName);
      if (success) {
        setSuccessMessage('Account created! Please check your email to verify your account.');
        setIsLogin(true);
      }
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAuthError(null);
    setSuccessMessage('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    setShowAuthModal(false);
    resetForm();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={handleClose}>
          &times;
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Sign in to save your chat history' 
              : 'Join Nexus AI for a better experience'}
          </p>
        </div>

        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}

        {successMessage && (
          <div className="auth-success">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading 
              ? 'Please wait...' 
              : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={switchMode} className="auth-switch-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="auth-benefits">
          <p className="benefits-title">Benefits of signing in:</p>
          <ul>
            <li>Save your chat history</li>
            <li>Access from any device</li>
            <li>Upload images to chat</li>
            <li>More features coming soon!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
