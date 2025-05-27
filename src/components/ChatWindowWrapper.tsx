import styled, { keyframes, css } from 'styled-components';

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0) translateY(35px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const popOut = keyframes`
  0% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0) translateY(35px); }
`;


const ChatWindowWrapper = styled.div<{ isClosing: boolean }>`
  animation: ${({ isClosing }) => isClosing ? css`${popOut} 0.3s forwards` : css`${popIn} 0.3s forwards`};
  transform-origin: bottom right;
  position: absolute;
  bottom: 80px;
  right: 0;
  will-change: transform, opacity;
`;

export default ChatWindowWrapper;
