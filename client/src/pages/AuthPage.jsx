import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setMode('login')} className={`btn-outline ${mode==='login' ? 'ring-2 ring-brand-500' : ''}`}>Login</button>
        <button onClick={() => setMode('signup')} className={`btn-outline ${mode==='signup' ? 'ring-2 ring-brand-500' : ''}`}>Signup</button>
      </div>
      <div className="card">
        <h1 className="text-xl font-semibold mb-4 capitalize">{mode}</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Auth form placeholder. Will integrate with backend.</p>
      </div>
    </div>
  );
}
