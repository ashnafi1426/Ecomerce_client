/**
 * MESSAGE THREAD
 * 
 * Displays messages in a conversation with status indicators, file attachments,
 * reactions, replies, edit/delete functionality
 */

import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useSelector } from 'react-redux';
import { formatMessageTime } from '../../utils/timeFormat';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import MessageStatusIndicator from './MessageStatusIndicator';
import FileAttachment from './FileAttachment';
import MessageActions from './MessageActions';
import EmojiPicker from './EmojiPicker';
import ReactionList from './ReactionList';
import ReplyPreview from './ReplyPreview';
import EditedIndicator from './EditedIndicator';
import DeleteConfirmModal from './DeleteConfirmModal';
import EditHistoryModal from './EditHistoryModal';

// Memoized Message Bubble Component - prevents re-renders of existing messages
const MessageBubble = memo(({ 
  message, 
  isOwnMessage, 
  user,
  conversation,
  formatTime,
  showActionsFor,
  setShowActionsFor,
  showEmojiPickerFor,
  setShowEmojiPickerFor,
  handleEdit,
  handleDelete,
  handleReply,
  handleReact,
  handleEmojiSelect,
  handleRemoveReaction,
  handleViewHistory
}) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const isDeleted = message.is_deleted;

  return (
    <div
      className={isOwnMessage ? 'message-own' : 'message-other'}
      style={{ 
        width: '100%',
        marginBottom: '4px',
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start'
      }}
    >
      <div
        className={`rounded-lg p-3 relative group ${
          isOwnMessage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
        style={{
          maxWidth: '70%',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          minWidth: '60px',
          textAlign: 'left',
          position: 'relative'
        }}
        onMouseEnter={() => !isDeleted && setShowActionsFor(message.id)}
        onMouseLeave={() => setShowActionsFor(null)}
      >
        {/* Reply Context */}
        {message.reply_to && (
          <div className="mb-2">
            <ReplyPreview replyTo={message.reply_to} compact={true} />
          </div>
        )}

        {/* Message Text */}
        {isDeleted ? (
          <p className="text-sm italic opacity-70">
            {message.deletion_type === 'for_everyone' 
              ? 'This message was deleted' 
              : 'You deleted this message'}
          </p>
        ) : (
          <>
            {message.message_text && (
              <p className="text-sm break-words">{message.message_text}</p>
            )}

            {/* File Attachments */}
            {hasAttachments && (
              <div className="space-y-2 mt-2">
                {message.attachments.map((attachment, index) => (
                  <FileAttachment
                    key={index}
                    attachment={attachment}
                    isOwnMessage={isOwnMessage}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Reactions */}
        {!isDeleted && message.reactions && message.reactions.length > 0 && (
          <ReactionList
            reactions={message.reactions}
            messageId={message.id}
            onReactionClick={handleEmojiSelect}
            onRemoveReaction={handleRemoveReaction}
          />
        )}

        {/* Timestamp, Status, and Edited Indicator */}
        <div
          className={`flex items-center justify-between gap-2 mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <div className="flex items-center gap-1">
            <span className="text-xs">
              {formatTime(message.created_at)}
            </span>
            {!isDeleted && message.is_edited && (
              <EditedIndicator 
                message={message} 
                onViewHistory={() => handleViewHistory(message)}
              />
            )}
          </div>
          {!isDeleted && (
            <MessageStatusIndicator 
              message={message}
              conversationParticipants={conversation.participant_ids || []}
            />
          )}
        </div>

        {/* Message Actions Menu */}
        {!isDeleted && showActionsFor === message.id && (
          <div className="absolute top-0 right-0 transform translate-x-full ml-2">
            <MessageActions
              message={message}
              isOwnMessage={isOwnMessage}
              onEdit={() => handleEdit(message)}
              onDelete={() => handleDelete(message)}
              onReply={() => handleReply(message)}
              onReact={() => handleReact(message.id)}
              onClose={() => setShowActionsFor(null)}
            />
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPickerFor === message.id && (
          <div className="absolute top-full right-0 z-50">
            <EmojiPicker
              onSelectEmoji={(emoji) => handleEmojiSelect(message.id, emoji)}
              onClose={() => setShowEmojiPickerFor(null)}
              position="top"
            />
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if these specific props change
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.message_text === nextProps.message.message_text &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.is_edited === nextProps.message.is_edited &&
    prevProps.message.is_deleted === nextProps.message.is_deleted &&
    prevProps.showActionsFor === nextProps.showActionsFor &&
    prevProps.showEmojiPickerFor === nextProps.showEmojiPickerFor &&
    JSON.stringify(prevProps.message.reactions) === JSON.stringify(nextProps.message.reactions)
  );
});

MessageBubble.displayName = 'MessageBubble';

const MessageThread = ({ conversation }) => {
  const { messages, fetchMessages, markAsRead, addReaction, removeReaction, deleteMessage } = useChat();
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  
  // Memoize messages array to prevent unnecessary re-renders
  const conversationMessages = useMemo(() => {
    return messages[conversation.id] || [];
  }, [messages, conversation.id]);

  // UI State
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, message: null });
  const [editHistoryModal, setEditHistoryModal] = useState({ isOpen: false, messageId: null, currentText: '' });

  useEffect(() => {
    if (conversation?.id) {
      fetchMessages(conversation.id);
      markAsRead(conversation.id);
    }
  }, [conversation?.id, fetchMessages, markAsRead]);

  useEffect(() => {
    // Scroll to bottom instantly using useLayoutEffect timing
    if (containerRef.current) {
      // Direct scroll without any animation or delay
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [conversationMessages.length]); // Only trigger on message count change

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    // Ensure we're working with a valid date
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn('[MessageThread] Invalid timestamp:', timestamp);
      return '';
    }
    
    // Format using the utility function
    return formatMessageTime(timestamp);
  };

  // Action Handlers
  const handleEdit = (message) => {
    setEditingMessage(message);
    setShowActionsFor(null);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleDelete = (message) => {
    setDeleteConfirmModal({ isOpen: true, message });
    setShowActionsFor(null);
  };

  const handleConfirmDelete = (deletionType) => {
    if (deleteConfirmModal.message) {
      deleteMessage(deleteConfirmModal.message.id, deletionType, conversation.id);
    }
    setDeleteConfirmModal({ isOpen: false, message: null });
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    setShowActionsFor(null);
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  const handleReact = (messageId) => {
    setShowEmojiPickerFor(messageId);
    setShowActionsFor(null);
  };

  const handleEmojiSelect = (messageId, emoji) => {
    addReaction(messageId, emoji, conversation.id);
    setShowEmojiPickerFor(null);
  };

  const handleRemoveReaction = (messageId, emoji) => {
    removeReaction(messageId, emoji, conversation.id);
  };

  const handleViewHistory = (message) => {
    setEditHistoryModal({
      isOpen: true,
      messageId: message.id,
      currentText: message.message_text
    });
  };

  return (
    <div className="h-full flex flex-col min-h-0" style={{ margin: 0, padding: 0 }}>
      {/* Force disable all transitions globally for chat messages */}
      <style>{`
        .message-own, .message-other, .message-own *, .message-other * {
          transition: none !important;
          animation: none !important;
          transform: none !important;
        }
        /* Disable React's default layout animations */
        .message-own, .message-other {
          contain: layout style paint;
        }
      `}</style>
      
      {/* Messages */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ 
          padding: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
          marginTop: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          scrollBehavior: 'auto',
          transition: 'none',
          willChange: 'auto'
        }}
      >
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                user={user}
                conversation={conversation}
                formatTime={formatTime}
                showActionsFor={showActionsFor}
                setShowActionsFor={setShowActionsFor}
                showEmojiPickerFor={showEmojiPickerFor}
                setShowEmojiPickerFor={setShowEmojiPickerFor}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleReply={handleReply}
                handleReact={handleReact}
                handleEmojiSelect={handleEmojiSelect}
                handleRemoveReaction={handleRemoveReaction}
                handleViewHistory={handleViewHistory}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <TypingIndicator conversationId={conversation.id} />

      {/* Message Input */}
      <MessageInput 
        conversationId={conversation.id}
        editingMessage={editingMessage}
        onCancelEdit={handleCancelEdit}
        replyToMessage={replyToMessage}
        onCancelReply={handleCancelReply}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => setDeleteConfirmModal({ isOpen: false, message: null })}
        onConfirm={handleConfirmDelete}
        isOwnMessage={deleteConfirmModal.message?.sender_id === user?.id}
      />

      {/* Edit History Modal */}
      <EditHistoryModal
        isOpen={editHistoryModal.isOpen}
        onClose={() => setEditHistoryModal({ isOpen: false, messageId: null, currentText: '' })}
        messageId={editHistoryModal.messageId}
        currentText={editHistoryModal.currentText}
      />
    </div>
  );
};

export default MessageThread;
