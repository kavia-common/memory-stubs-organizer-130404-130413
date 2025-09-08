import React from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Router from './router/Router';
import './App.css';
import './theme.css';

/**
 * Root App wraps providers and renders Router.
 * Provides global theme, auth, and app state.
 */
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
