'use client';
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  const onUpload = async () => {
    if (!file) return;
    setStatus('Requesting SAS...');
    const res = await fetch(`/api/upload/sas?filename=${encodeURIComponent(file.name)}`);
    if (!res.ok) { setStatus('Failed to get SAS'); return; }
    const { uploadUrl } = await res.json();
    setStatus('Uploading to Blob Storage...');
    const put = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'x-ms-blob-type': 'BlockBlob' },
      body: file,
    });
    setStatus(put.ok ? 'Upload complete ✅' : 'Upload failed ❌');
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={onUpload} disabled={!file} style={{ marginLeft: 8 }}>Upload</button>
      <div style={{ marginTop: 8, color: '#555' }}>{status}</div>
    </div>
  );
}
