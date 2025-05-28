import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaTimes } from 'react-icons/fa';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  image?: string;
  table?: {
    reportTitle: string;
    columns: string[];
    rows: Record<string, string>[];
  };
  emotional_analysis?: {
    main_emotion: string;
    intensity: number;
    overall_tone: string;
    emoji: string;
  };
  timestamp?: string;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  position: relative;
  width: 900px;
  height: 550px;
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.2s ease-out;

  @keyframes scaleIn {
    from { transform: scale(0.95); }
    to { transform: scale(1); }
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const MessageImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const EmotionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.98rem;
  color: #6366f1;
  margin-top: 4px;
  opacity: 0.85;
`;

const EmotionBlock = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
  font-size: 0.98rem;
  color: #374151;
  box-shadow: 0 1px 4px rgba(99, 102, 241, 0.06);
  line-height: 1.6;
`;

const AnswerBlock = styled.div`
  margin-top: 2px;
  font-size: 1.05rem;
  color: #222;
  font-weight: 500;
  line-height: 1.7;
`;

const renderMarkdown = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const ChatBody: React.FC<ChatBodyProps> = ({ messages, typing }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleImageClick = (imageUrl: string) => {
    if (selectedImage === imageUrl) {
      setSelectedImage(null);
    } else {
      setSelectedImage(imageUrl);
    }
  };

  return (
    <>
      <Body>
        {messages.map((msg) => (
          <Bubble key={msg.id} sender={msg.sender}>
            {msg.image && (
              <MessageImage 
                src={msg.image} 
                alt="Message attachment" 
                onClick={() => handleImageClick(msg.image!)}
              />
            )}
            {msg.sender === 'bot' && msg.emotional_analysis && (
              <EmotionBlock>
                <div>🤖 <b>Emotion Analysis</b></div>
                <div>Main emotion: {msg.emotional_analysis.main_emotion}</div>
                <div>Intensity: {msg.emotional_analysis.intensity}/10</div>
                <div>Overall tone: {msg.emotional_analysis.overall_tone}</div>
                <div>Emoji: {msg.emotional_analysis.emoji}</div>
              </EmotionBlock>
            )}
            {msg.sender === 'bot' ? (
              <AnswerBlock>
                <div>🤖 <b>AI Assistant Answer</b></div>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
              </AnswerBlock>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
            )}
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
      {selectedImage && (
        <ModalOverlay>
          <ModalContent>
            <CloseModalButton onClick={() => setSelectedImage(null)} aria-label="Close preview">
              {FaTimes({ size: 16 })}
            </CloseModalButton>
            <ModalImage 
              src={selectedImage} 
              alt="Image preview" 
              onClick={() => setSelectedImage(null)}
              style={{ cursor: 'pointer' }}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ChatBody; 