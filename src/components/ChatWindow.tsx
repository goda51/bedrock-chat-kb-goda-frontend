import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import ChatBody, { Message } from './ChatBody';
import ChatInput from './ChatInput';

const MIN_WIDTH = 520;
const MIN_HEIGHT = 400;
const MAX_WIDTH = 1300;
const MAX_HEIGHT = 800;

const WindowContainer = styled.div<{ width: number; height: number; isResizing: boolean }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  max-width: 98vw;
  max-height: 98vh;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease, width 0.1s, height 0.1s;
  position: relative;
  user-select: ${({ isResizing }) => (isResizing ? 'none' : 'auto')};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 600px) {
    width: calc(100vw - 24px) !important;
    height: calc(100vh - 24px) !important;
    min-width: unset;
    min-height: unset;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 12px;
    margin-bottom: 12px;
    margin-left: 12px;
    margin-right: 12px;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(60px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  cursor: nwse-resize;
  z-index: 10;
  background: linear-gradient(135deg, #e5e7eb 60%, #6366f1 100%);
  border-radius: 0 0 12px 0;
  display: none;

  @media (min-width: 601px) {
    display: block;
  }
`;

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', sender: 'bot', text: '您好！请问有什么可以帮您吗？' }
  ]);
  const [typing, setTyping] = useState(false);
  const [apiMessages, setApiMessages] = useState<any[]>([]);
  const [width, setWidth] = useState(MIN_WIDTH);
  const [height, setHeight] = useState(650);
  const [isResizing, setIsResizing] = useState(false);
  const startPos = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: Date.now() + '-user', sender: 'user', text, timestamp: getCurrentTime() };
    setMessages((msgs) => [...msgs, userMsg]);
    setTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/bedrock-chatbot-kb-dev`, {
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
      const botResponse = result.data.internal_answer || result.data.external_answer || '抱歉，这个问题我无法处理，也许可以帮您转移到人工客服进行咨询【<a href="https://www.baidu.com" target="_blank">联系人工客服</a>】';
      setMessages((msgs) => [
        ...msgs,
        { 
          id: Date.now() + '-bot', 
          sender: 'bot', 
          text: botResponse,
          table: result.data.table || undefined,
          emotional_analysis: result.data.emotional_analysis || undefined,
          timestamp: getCurrentTime(),
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
        { id: Date.now() + '-bot', sender: 'bot', text: '抱歉，这个问题我无法处理，也许可以帮您转移到人工客服进行咨询【<a href="https://www.baidu.com" target="_blank">联系人工客服</a>】', timestamp: getCurrentTime() }
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
      image: imageUrl,
      timestamp: getCurrentTime(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('model', model);
      formData.append('messages', JSON.stringify(apiMessages));
      if (caption) formData.append('user_message', caption);
      const response = await fetch(`${API_BASE_URL}/bedrock-chatbot-image-processing-test`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      const botResponse = result.data?.internal_answer || result.data?.external_answer || '抱歉，这个问题我无法处理，也许可以帮您转移到人工客服进行咨询【<a href="https://www.baidu.com" target="_blank">联系人工客服</a>】';
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + '-bot-img',
          sender: 'bot',
          text: botResponse,
          table: result.data?.table || undefined,
          emotional_analysis: result.data?.emotional_analysis || undefined,
          timestamp: getCurrentTime(),
        },
      ]);
      if ((result.data?.internal_answer && result.data.internal_answer !== "") || 
          (result.data?.external_answer && result.data.external_answer !== "")) {
        setApiMessages(result.data.messages || []);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { id: Date.now() + '-bot-img', sender: 'bot', text: '抱歉，这个问题我无法处理，也许可以帮您转移到人工客服进行咨询【<a href="https://www.baidu.com" target="_blank">联系人工客服</a>】', timestamp: getCurrentTime() },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleClose = () => {
    setApiMessages([]);
    onClose();
  };

  // Resize logic
  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height,
    };
    window.addEventListener('mousemove', onResizeMouseMove);
    window.addEventListener('mouseup', onResizeMouseUp);
  };

  const onResizeMouseMove = (e: MouseEvent) => {
    if (!startPos.current) return;
    const dx = startPos.current.x - e.clientX;
    const dy = startPos.current.y - e.clientY;
    setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startPos.current.width + dx)));
    setHeight(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startPos.current.height + dy)));
  };

  const onResizeMouseUp = () => {
    setIsResizing(false);
    window.removeEventListener('mousemove', onResizeMouseMove);
    window.removeEventListener('mouseup', onResizeMouseUp);
  };

  return (
    <WindowContainer width={width} height={height} isResizing={isResizing}>
      <ChatHeader onClose={handleClose} />
      <ChatBody messages={messages} typing={typing} />
      <ChatInput onSend={handleSend} onSendImage={handleSendImage} disabled={typing} />
      <ResizeHandle onMouseDown={onResizeMouseDown} />
    </WindowContainer>
  );
};

export default ChatWindow; 