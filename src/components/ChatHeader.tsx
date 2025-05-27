import React from 'react';
import styled from 'styled-components';
import { FaRobot, FaTimes } from 'react-icons/fa';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
  border-radius: 24px 24px 0 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const Avatar = styled.div`
  background: rgba(255, 255, 255, 0.9);
  color: #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-right: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  letter-spacing: 0.2px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => (
  <Header>
    <Title>
    <Avatar>
        {FaRobot({ size: 24 })}
    </Avatar>
    Bedrock ChatBot Goda Dev Assistant
    </Title>
    <CloseButton onClick={onClose} aria-label="Close chat">
    {FaTimes({ size: 24 })}
    </CloseButton>
  </Header>
);

export default ChatHeader; 