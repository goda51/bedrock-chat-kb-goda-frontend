import React from 'react';
import styled from 'styled-components';
import { FaRobot, FaTimes } from 'react-icons/fa';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #4f46e5;
  color: #fff;
  border-radius: 18px 18px 0 0;
`;

const Avatar = styled.div`
  background: #fff;
  color: #4f46e5;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-right: 12px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 8px;
  transition: color 0.2s;
  &:hover {
    color: #a5b4fc;
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