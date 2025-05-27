import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  table?: {
    reportTitle: string;
    columns: string[];
    rows: Record<string, string>[];
  };
}

interface ChatBodyProps {
  messages: Message[];
  typing: boolean;
}

const Body = styled.div`
  flex: 1;
  padding: 20px 16px 14px 16px;
  background: #f5f7fa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: #a5b4fc #f3f4f6;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a5b4fc;
    border-radius: 6px;
  }
`;

const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Bubble = styled.div<{ sender: 'user' | 'bot' }>`
  align-self: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
  background: ${({ sender }) => (sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : '#fff')};
  color: ${({ sender }) => (sender === 'user' ? '#fff' : '#333')};
  border-radius: ${({ sender }) => (sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px')};
  padding: 12px 18px;
  max-width: 78%;
  font-size: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  margin-bottom: 2px;
  animation: ${bubbleIn} 0.3s cubic-bezier(0.15, 1, 0.3, 1);
  white-space: pre-wrap;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Typing = styled.div`
  align-self: flex-start;
  color: #6d7280;
  font-size: 1rem;
  padding: 8px 18px;
  background: #e0e7ff;
  border-radius: 18px 18px 18px 4px;
  margin-bottom: 2px;
  min-width: 65px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
`;

const Dot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #6366f1;
  border-radius: 50%;
  animation: blink 1.2s infinite both;
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
`;

const TableContainer = styled.div`
  margin-top: 12px;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.9rem;
  overflow: hidden;
`;

const TableTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #4f46e5;
  font-weight: 600;
`;

const Th = styled.th`
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
  padding: 10px 14px;
  text-align: left;
  border: 1px solid #e5e7eb;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  text-align: left;
  transition: background-color 0.15s ease;
  
  tr:hover & {
    background-color: #f5f7fa;
  }
`;

const renderMarkdown = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const ChatBody: React.FC<ChatBodyProps> = ({ messages, typing }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  return (
    <Body>
      {messages.map((msg) => (
        <Bubble key={msg.id} sender={msg.sender}>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
          {msg.table && (
            <TableContainer>
              <TableTitle>{msg.table.reportTitle}</TableTitle>
              <Table>
                <thead>
                  <tr>
                    {msg.table.columns.map((col, i) => (
                      <Th key={i}>{col}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {msg.table.rows.map((row, i) => (
                    <tr key={i}>
                      {msg.table!.columns.map((col, j) => (
                        <Td key={j}>{row[col]}</Td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}
        </Bubble>
      ))}
      {typing && (
        <Typing>
          <Dot /> <Dot /> <Dot />
        </Typing>
      )}
      <div ref={bottomRef} />
    </Body>
  );
};

export default ChatBody; 