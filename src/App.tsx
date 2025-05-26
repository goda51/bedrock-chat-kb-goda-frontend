import React from 'react';
import styled from 'styled-components';
import ChatbotWidget from './components/ChatbotWidget';

const AppContainer = styled.div`
  min-height: 100vh;
  background: url('https://images.unsplash.com/photo-1555710908-25866c9c0cf6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat;
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
