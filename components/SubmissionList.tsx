'use client'
import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase'
export default function SubmissionList({ citationId }: { citationId: string }) {
  const [rows,setRows] = useState<Record<string,any>[]>([])
  const [error,setError] = useState('')
  useEffect(() => {
    const client = createClientSupabase()
    if (!client) { setError('Service unavailable'); return }
    client.from('submissions').select('*').eq('citation_id',citationId).order('created_at',{ ascending:false }).then(({data,error}) => {
      if (error) setError('Unable to load requests'); else setRows(data || [])
    })
  },[citationId])
  return <section className="card my-6"><h2 className="text-xl font-bold mb-3">Support requests</h2>
    {error && <p role="alert">{error}</p>}
    {rows.length===0 && !error && <p>No requests submitted.</p>}
    {rows.map(row => <article key={row.id} className="border-b border-border py-3"><h3 className="font-bold">{row.submission_type} — {row.status}</h3><p>{row.reason}</p><p className="whitespace-pre-wrap">{row.details}</p><time>{new Date(row.created_at).toLocaleString()}</time></article>)}
  </section>
}
