import React, { useContext, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import { useAuth } from '../../context/AuthContext'
import ModelSwitcher from '../ModelSwitcher/ModelSwitcher'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import PromptTemplates from '../PromptTemplates/PromptTemplates'
import AuthModal from '../Auth/AuthModal'
import UserMenu from '../Auth/UserMenu'
import { uploadImage } from '../../config/supabase'

const Main = () => {
  const { 
    onSent, 
    recentPrompt, 
    showResult, 
    loading, 
    resultData, 
    setInput, 
    input,
    selectedModel,
    showTemplates,
    setShowTemplates,
    imagePreview,
    handleImageSelect,
    clearImage
  } = useContext(Context);
  
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      handleImageSelect(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !imagePreview) return;
    
    let imageUrl = null;
    
    // Upload image if user is logged in and has an image
    if (user && imagePreview && fileInputRef.current?.files?.[0]) {
      const { url, error } = await uploadImage(fileInputRef.current.files[0], user.id);
      if (!error) {
        imageUrl = url;
      }
    }
    
    onSent(undefined, imageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportChat = () => {
    const chatText = `Prompt: ${recentPrompt}\n\nResponse:\n${resultData}\n\nModel: ${selectedModel.name}\nDate: ${new Date().toLocaleString()}`;
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-ai-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='main'>
      <AuthModal />
      {showTemplates && <PromptTemplates />}
      <div className="nav">
        <div className="nav-left">
          <p className="brand-name">🎓 Nexus AI</p>
          <ModelSwitcher />
        </div>
        <div className="nav-right">
          <ThemeToggle />
          <button 
            className="templates-btn" 
            onClick={() => setShowTemplates(true)}
            title="View Prompt Templates"
          >
            ✨ Templates
          </button>
          {showResult && (
            <button 
              className="export-btn" 
              onClick={exportChat}
              title="Export Chat"
            >
              💾 Export
            </button>
          )}
          <UserMenu />
        </div>
      </div>
      <div className="main-container">
        {!showResult
          ? <>
            <div className="greet">
              <p><span>Hello, Explorer!</span></p>
              <p>Welcome to Nexus AI - Your Free AI Companion</p>
              <p className="greet-subtitle">
                Powered by {selectedModel.name}
              </p>
            </div>
          </>
          : <div className='result'>
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <div className="model-badge">
                <span>{selectedModel.icon}</span>
                <span>{selectedModel.name}</span>
              </div>
              {loading
                ? <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
                : <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {resultData}
                    </ReactMarkdown>
                  </div>
              }
            </div>
          </div>
        }
        <div className="main-bottom">
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button className="remove-image-btn" onClick={clearImage}>×</button>
            </div>
          )}
          <div className="search-box">
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text"  
              placeholder={imagePreview ? "Add a prompt for this image..." : "Enter a prompt here"} 
              onKeyDown={handleKeyDown} 
            />
            <div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <img 
                src={assets.gallery_icon} 
                alt="Upload image" 
                onClick={handleImageClick}
                className="upload-icon"
                title="Upload image"
              />
              <img src={assets.mic_icon} alt="" />
              {(input || imagePreview) ? (
                <img onClick={handleSend} src={assets.send_icon} alt="Send" className="send-icon" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            {user 
              ? "Your chats are being saved. Upload images and chat with AI!" 
              : "Sign in to save your chat history and upload images."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main
