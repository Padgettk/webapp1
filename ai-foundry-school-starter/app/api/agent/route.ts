import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json();

  const endpoint = process.env.AI_FOUNDRY_ENDPOINT; // e.g., https://{region}.api.cognitive.microsoft.com/aifoundry/aiagents
  const apiKey = process.env.AI_FOUNDRY_API_KEY;

  if (!endpoint || !apiKey) {
    return NextResponse.json({ error: 'Agent Service not configured' }, { status: 500 });
  }

  // Example: forward payload to your agent/threads/runs endpoint (adjust path to your setup)
  const r = await fetch(`${endpoint}/threads/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
