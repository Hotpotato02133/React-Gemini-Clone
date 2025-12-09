import { createContext, useState, useEffect, useContext } from 'react';
import { supabase, signIn, signUp, signOut, getChatSessions } from '../config/supabase';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userSessions, setUserSessions] = useState([]);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserSessions(session.user.id);
      }
      setLoading(false);
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserSessions(session.user.id);
        } else {
          setUserSessions([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserSessions = async (userId) => {
    const { data, error } = await getChatSessions(userId);
    if (!error && data) {
      setUserSessions(data);
    }
  };

  const handleSignUp = async (email, password, displayName) => {
    setAuthError(null);
    const { data, error } = await signUp(email, password, displayName);
    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  };

  const handleSignIn = async (email, password) => {
    setAuthError(null);
    const { data, error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
      return false;
    }
    setShowAuthModal(false);
    return true;
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      setAuthError(error.message);
      return false;
    }
    setUserSessions([]);
    return true;
  };

  const refreshSessions = async () => {
    if (user) {
      await loadUserSessions(user.id);
    }
  };

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    showAuthModal,
    setShowAuthModal,
    userSessions,
    setUserSessions,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    refreshSessions,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
