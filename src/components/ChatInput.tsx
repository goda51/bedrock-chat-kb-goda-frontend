import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: #f3f4f6;
  border-radius: 16px;
  padding: 10px 14px;
  font-size: 1rem;
  margin-right: 8px;
  outline: none;
`;

const SendButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #6366f1;
  }
`;

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue('');
    }
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        aria-label="Type your message"
      />
        <SendButton type="submit" disabled={disabled || !value.trim()} aria-label="Send message">
        {FaPaperPlane({ size: 20 })}
        </SendButton>
    </InputContainer>
  );
};

export default ChatInput; 