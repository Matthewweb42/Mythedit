import { useState } from 'react';
import { Login } from '../components/auth/Login';
import { Register } from '../components/auth/Register';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <>
      {mode === 'login' ? (
        <Login onSwitchToRegister={() => setMode('register')} />
      ) : (
        <Register onSwitchToLogin={() => setMode('login')} />
      )}
    </>
  );
}
