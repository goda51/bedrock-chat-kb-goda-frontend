import React, { useState } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import ChatBody, { Message } from './ChatBody';
import ChatInput from './ChatInput';

const WindowContainer = styled.div`
  width: 900px;
  max-width: 98vw;
  height: 750px;
  background: #fff;
  border-radius: 18px 18px 8px 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 12px;
  animation: fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1);

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [typing, setTyping] = useState(false);
  const [apiMessages, setApiMessages] = useState<any[]>([]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: Date.now() + '-user', sender: 'user', text };
    setMessages((msgs) => [...msgs, userMsg]);
    setTyping(true);

    try {
      const response = await fetch('https://iimvj6vkh7.execute-api.us-west-2.amazonaws.com/bedrock-chatbot-kb-dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          messages: apiMessages
        }),
      });
      const result = await response.json();
      const botResponse = result.data.internal_answer || result.data.external_answer || 'Sorry, I could not process your request.';
      setMessages((msgs) => [
        ...msgs,
        { 
          id: Date.now() + '-bot', 
          sender: 'bot', 
          text: botResponse,
          table: result.data.table || undefined
        }
      ]);
      if ((result.data.internal_answer && result.data.internal_answer !== "") || 
          (result.data.external_answer && result.data.external_answer !== "")) {
        setApiMessages(result.data.messages || []);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      setMessages((msgs) => [
        ...msgs,
        { id: Date.now() + '-bot', sender: 'bot', text: 'Sorry, there was an error processing your request.' }
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleClose = () => {
    setApiMessages([]);
    onClose();
  };

  return (
    <WindowContainer>
      <ChatHeader onClose={handleClose} />
      <ChatBody messages={messages} typing={typing} />
      <ChatInput onSend={handleSend} disabled={typing} />
    </WindowContainer>
  );
};

export default ChatWindow; 