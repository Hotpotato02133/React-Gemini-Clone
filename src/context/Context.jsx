import { createContext, useState, useEffect, useContext } from "react";
import runAIChat from "../config/aiService";
import { AI_MODELS, DEFAULT_MODEL } from "../config/models";
import { AuthContext } from "./AuthContext";
import { 
  saveChatSession, 
  saveMessage, 
  getSessionMessages,
  getChatSessions 
} from "../config/supabase";

export const Context = createContext();

const ContextProvider = (props) => {
    // Get auth context
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const refreshSessions = authContext?.refreshSessions;

    // Enhanced state management for Nexus AI
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    
    // New features state
    const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
    const [theme, setTheme] = useState('light');
    const [chatHistory, setChatHistory] = useState([]);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    // Supabase session tracking
    const [currentSessionId, setCurrentSessionId] = useState(null);
    
    // Image upload state
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    // any variable or function we can use anywhere in the project
  const delayPara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);//75 millisecond with 0 index then 75 millisecond for 1 index and so on
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('nexusai-theme') || 'light';
    const savedHistory = JSON.parse(localStorage.getItem('nexusai-history') || '[]');
    setTheme(savedTheme);
    setChatHistory(savedHistory);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Save theme to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nexusai-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Switch AI model
  const switchModel = (model) => {
    setSelectedModel(model);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setCurrentSessionId(null);
    setUploadedImage(null);
    setImagePreview(null);
    setResultData("");
    setRecentPrompt("");
  };

  // Clear image
  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  // Handle image selection
  const handleImageSelect = (file) => {
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Enhanced onSent with model support, history tracking, and Supabase integration
  const onSent = async (prompt, imageUrl = null) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    const actualPrompt = prompt !== undefined ? prompt : input;
    
    if (prompt !== undefined) {
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
    }
    
    try {
      // If there's an image, include it in the prompt context
      let promptWithImage = actualPrompt;
      if (imagePreview && selectedModel.id.includes('gemini')) {
        promptWithImage = `[Image attached] ${actualPrompt}`;
      }
      
      response = await runAIChat(promptWithImage, selectedModel.id);
      
      // Save to Supabase if user is logged in
      if (user) {
        try {
          let sessionId = currentSessionId;
          
          // Create new session if needed
          if (!sessionId) {
            const title = actualPrompt.slice(0, 50) + (actualPrompt.length > 50 ? '...' : '');
            const { data: sessionData, error: sessionError } = await saveChatSession(user.id, title);
            if (!sessionError && sessionData) {
              sessionId = sessionData.id;
              setCurrentSessionId(sessionId);
            }
          }
          
          // Save messages to Supabase
          if (sessionId) {
            await saveMessage(sessionId, 'user', actualPrompt, selectedModel.id, imageUrl);
            await saveMessage(sessionId, 'assistant', response, selectedModel.id);
            // Refresh sessions list
            if (refreshSessions) refreshSessions();
          }
        } catch (supabaseError) {
          console.error('Error saving to Supabase:', supabaseError);
        }
      }
      
      // Save to local chat history
      const chatEntry = {
        id: Date.now(),
        prompt: actualPrompt,
        response: response,
        model: selectedModel.name,
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl,
      };
      const updatedHistory = [chatEntry, ...chatHistory].slice(0, 50);
      setChatHistory(updatedHistory);
      localStorage.setItem('nexusai-history', JSON.stringify(updatedHistory));
    } catch (error) {
      response = `Error: ${error.message}`;
    }
    
    // Clear image after sending
    clearImage();
    
    // logic for response to be used as useful response
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };

  // Load a saved session from Supabase
  const loadSession = async (sessionId) => {
    if (!user) return;
    
    try {
      const { data: messages, error } = await getSessionMessages(sessionId);
      if (error) throw error;
      
      if (messages && messages.length > 0) {
        setCurrentSessionId(sessionId);
        setShowResult(true);
        
        // Get the last user message and assistant response
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
        
        if (lastUserMsg) setRecentPrompt(lastUserMsg.content);
        if (lastAssistantMsg) setResultData(lastAssistantMsg.content);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };
  // Enhanced context value with all new features
  const contextValue = {
    // Original features
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    // New features
    selectedModel,
    switchModel,
    theme,
    toggleTheme,
    chatHistory,
    setChatHistory,
    showTemplates,
    setShowTemplates,
    showSettings,
    setShowSettings,
    AI_MODELS,
    // Image upload
    uploadedImage,
    imagePreview,
    handleImageSelect,
    clearImage,
    // Supabase session
    currentSessionId,
    loadSession,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
