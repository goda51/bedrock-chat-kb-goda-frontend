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
  padding: 18px 14px 12px 14px;
  background: #f3f4f6;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  background: ${({ sender }) => (sender === 'user' ? '#4f46e5' : '#fff')};
  color: ${({ sender }) => (sender === 'user' ? '#fff' : '#222')};
  border-radius: 18px;
  padding: 10px 16px;
  max-width: 75%;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 2px;
  animation: ${bubbleIn} 0.22s cubic-bezier(0.4,0,0.2,1);
  white-space: pre-wrap;
`;

const Typing = styled.div`
  align-self: flex-start;
  color: #6d7280;
  font-size: 0.98rem;
  padding: 6px 16px;
  background: #e0e7ff;
  border-radius: 18px;
  margin-bottom: 2px;
  min-width: 60px;
  display: flex;
  align-items: center;
  gap: 6px;
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
  margin-top: 8px;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.9rem;
`;

const TableTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #4f46e5;
`;

const Th = styled.th`
  background: #4f46e5;
  color: #fff;
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
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