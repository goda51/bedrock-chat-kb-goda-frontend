import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ChatWindow from './ChatWindow';
import { FaComments } from 'react-icons/fa';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const ToggleButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  cursor: pointer;
  font-size: 1.8rem;
  transition: background 0.2s;
  animation: ${pulse} 0.5s infinite ease-in-out;
  &:hover {
    background: #6366f1;
  }
`;

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <WidgetContainer>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <ToggleButton onClick={() => setOpen((prev) => !prev)} aria-label="Open chat">
        {FaComments({ size: 24 })}
        </ToggleButton>
    </WidgetContainer>
  );
};

export default ChatbotWidget; 