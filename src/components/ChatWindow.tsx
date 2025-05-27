import React, { useState } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import ChatBody, { Message } from './ChatBody';
import ChatInput from './ChatInput';

const WindowContainer = styled.div`
  width: 900px;
  max-width: 98vw;
  height: 550px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 12px;
  animation: fadeInUp 0.5s cubic-bezier(0.15, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(60px); }
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

  const handleSendImage = async (file: File, model: string, caption?: string) => {
    setTyping(true);
    const imageUrl = URL.createObjectURL(file);
    const userMsg: Message = {
      id: Date.now() + '-user-img',
      sender: 'user',
      text: caption ? caption : '',
      image: imageUrl
    };
    setMessages((msgs) => [...msgs, userMsg]);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('model', model);
      formData.append('messages', JSON.stringify(apiMessages));
      if (caption) formData.append('user_message', caption);
      const response = await fetch('https://iimvj6vkh7.execute-api.us-west-2.amazonaws.com/bedrock-chatbot-image-processing-dev', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      const botResponse = result.data?.internal_answer || result.data?.external_answer || 'Sorry, I could not process your image.';
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + '-bot-img',
          sender: 'bot',
          text: botResponse,
          table: result.data?.table || undefined,
        },
      ]);
      if ((result.data?.internal_answer && result.data.internal_answer !== "") || 
          (result.data?.external_answer && result.data.external_answer !== "")) {
        setApiMessages(result.data.messages || []);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { id: Date.now() + '-bot-img', sender: 'bot', text: 'Sorry, there was an error processing your image.' },
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
      <ChatInput onSend={handleSend} onSendImage={handleSendImage} disabled={typing} />
    </WindowContainer>
  );
};

export default ChatWindow; 