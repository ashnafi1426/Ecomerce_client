/**
 * CHAT WINDOW
 * 
 * Main chat interface with conversation list and message thread
 */

import { useState } from 'react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import UserSearch from './UserSearch';

const ChatWindow = ({ isOpen, onClose }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowUserSearch(false);
  };

  const handleBack = () => {
    if (showUserSearch) {
      setShowUserSearch(false);
    } else {
      setSelectedConversation(null);
    }
  };

  const handleNewChat = () => {
    setShowUserSearch(true);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed right-6 left-0 z-40 max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 sm:left-auto sm:w-[500px] md:w-[650px] lg:w-[800px]"
      style={{ 
        top: '20px',
        bottom: '0px',
        height: 'calc(100vh - 20px)',
        maxHeight: '600px',
        margin: 0,
        marginBottom: 0,
        padding: 0,
        paddingBottom: 0
      }}
    >
      {/* Header - Proper Size with Padding */}
      <div 
        className="bg-blue-600 text-white px-3 py-2 flex items-center justify-between flex-shrink-0"
        style={{ 
          minHeight: '48px',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem'
        }}
      >
        <div className="flex items-center space-x-2">
          {(selectedConversation || showUserSearch) && (
            <button
              onClick={handleBack}
              className="hover:bg-blue-700 rounded p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h3 className="font-semibold text-base">
            {selectedConversation ? 'Chat' : showUserSearch ? 'New Chat' : 'Messages'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {!selectedConversation && !showUserSearch && (
            <button
              onClick={handleNewChat}
              className="hover:bg-blue-700 rounded p-1"
              title="New conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="hover:bg-blue-700 rounded p-1"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-hidden min-h-0"
        style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}
      >
        {showUserSearch ? (
          <UserSearch 
            onSelectUser={handleSelectConversation}
            onClose={() => setShowUserSearch(false)}
          />
        ) : selectedConversation ? (
          <MessageThread conversation={selectedConversation} />
        ) : (
          <ConversationList onSelectConversation={handleSelectConversation} />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
