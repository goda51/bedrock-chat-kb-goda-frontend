import React, { useState, ChangeEvent, useRef } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';

const ImagePreview = styled.div`
  position: relative;
  margin: 8px 0;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PreviewImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: #f3f4f6;
  border-radius: 22px;
  padding: 12px 18px;
  font-size: 1rem;
  margin-right: 10px;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  &:focus {
    background: #f0f2f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
  
  &:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ImageButton = styled.label`
  background: #f3f4f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.2s;
  &:hover {
    background: #e0e7ff;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ModelSelect = styled.select`
  margin-right: 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  font-size: 0.95rem;
  background: #f3f4f6;
`;

const CaptionInput = styled.input`
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.95rem;
  margin-right: 8px;
  outline: none;
  width: 160px;
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

interface ChatInputProps {
  onSend: (text: string) => void;
  onSendImage?: (file: File, model: string, caption?: string) => void;
  disabled?: boolean;
}

const modelOptions = [
  { value: '1', label: 'Claude 3.7 Sonnet' },
  { value: '2', label: 'Claude 3.5 Sonnet' },
  { value: '3', label: 'Claude 3.5 Sonnet v2' },
  { value: '6', label: 'Claude 4 Opus' },
  { value: '7', label: 'Claude 4 Sonnet' },
  { value: '4', label: 'Amazon Nova Pro' },
  { value: '5', label: 'Llama 4 Maverick 17B Instruct' },
];

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onSendImage, disabled }) => {
  const [value, setValue] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [model, setModel] = useState('2');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image && onSendImage) {
      onSendImage(image, model, value.trim() ? value.trim() : undefined);
      setImage(null);
      setPreviewUrl(null);
      setValue('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    if (value.trim()) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreviewClick = () => {
    if (previewUrl) {
      setShowModal(!showModal);
    }
  };

  return (
    <>
      <InputContainer onSubmit={handleSubmit}>
        {previewUrl && (
          <ImagePreview>
            <PreviewImage 
              src={previewUrl} 
              alt="Preview" 
              onClick={handlePreviewClick}
              style={{ cursor: 'pointer' }}
            />
            <RemoveImageButton onClick={handleRemoveImage} aria-label="Remove image">
              {FaTimes({ size: 12 })}
            </RemoveImageButton>
          </ImagePreview>
        )}
        <InputWrapper>
          <ImageButton>
            {FaImage({ size: 20 })}
            <HiddenInput 
              ref={fileInputRef}
              type="file" 
              accept="image/png,image/jpg,image/jpeg" 
              onChange={handleImageChange} 
            />
          </ImageButton>
          {image && (
            <ModelSelect value={model} onChange={e => setModel(e.target.value)}>
              {modelOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </ModelSelect>
          )}
          <Input
            type="text"
            placeholder="Type your message..."
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={disabled}
            aria-label="Type your message"
          />
          <SendButton type="submit" disabled={disabled || (!value.trim() && !image)} aria-label="Send message">
            {FaPaperPlane({ size: 20 })}
          </SendButton>
        </InputWrapper>
      </InputContainer>
      {showModal && previewUrl && (
        <ModalOverlay>
          <ModalContent>
            <CloseModalButton onClick={() => setShowModal(false)} aria-label="Close preview">
              {FaTimes({ size: 16 })}
            </CloseModalButton>
            <ModalImage 
              src={previewUrl} 
              alt="Image preview" 
              onClick={() => setShowModal(false)}
              style={{ cursor: 'pointer' }}
            />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ChatInput; 