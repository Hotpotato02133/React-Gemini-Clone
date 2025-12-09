import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://egjbmmbzrtukcoemtaph.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnamJtbWJ6cnR1a2NvZW10YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDU0NzIsImV4cCI6MjA4MDgyMTQ3Mn0.U-MowBotuSdJ-MJD-A7FKZIiuLeiFRatt-l7Picocrw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email, password, displayName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Chat history functions
export const saveChatSession = async (userId, title) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, title }])
    .select()
    .single();
  return { data, error };
};

export const saveMessage = async (sessionId, role, content, model, imageUrl = null) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ 
      session_id: sessionId, 
      role, 
      content, 
      model,
      image_url: imageUrl 
    }])
    .select()
    .single();
  return { data, error };
};

export const getChatSessions = async (userId) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getSessionMessages = async (sessionId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const deleteChatSession = async (sessionId) => {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);
  return { error };
};

// Image upload function
export const uploadImage = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('chat-images')
    .upload(fileName, file);
  
  if (error) return { url: null, error };
  
  const { data: { publicUrl } } = supabase.storage
    .from('chat-images')
    .getPublicUrl(fileName);
  
  return { url: publicUrl, error: null };
};
