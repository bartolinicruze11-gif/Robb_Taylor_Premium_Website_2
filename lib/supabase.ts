import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  _client = createClient(url, key);
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export type QuoteStatus = 'new' | 'reviewed' | 'quoted' | 'closed';

export interface Quote {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  budget: string;
  timeline: string;
  message: string;
  status: QuoteStatus;
  admin_notes: string;
  created_at: string;
}

export interface QuoteInsert {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  budget: string;
  timeline: string;
  message: string;
}
