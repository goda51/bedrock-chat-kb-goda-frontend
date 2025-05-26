import React from 'react';
import styled from 'styled-components';
import ChatbotWidget from './components/ChatbotWidget';

const AppContainer = styled.div`
  min-height: 100vh;
  background: url('./bg.png') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <ChatbotWidget />
    </AppContainer>
  );
};

export default App;
