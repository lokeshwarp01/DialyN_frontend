import React from 'react';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
