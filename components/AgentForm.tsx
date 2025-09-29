'use client';
import { useState } from 'react';

export default function AgentForm() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const ask = async () => {
    setBusy(true);
    setResponse('');
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });
    const data = await res.json();
    setBusy(false);
    setResponse(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} style={{ width: '100%' }} placeholder="Ask your faculty assistant..."/>
      <button onClick={ask} disabled={busy || !prompt} style={{ marginTop: 8 }}>Ask</button>
      <pre style={{ marginTop: 12, padding: 12, background: '#f6f8fa', whiteSpace: 'pre-wrap' }}>{response}</pre>
    </div>
  );
}
