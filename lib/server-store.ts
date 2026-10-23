import { database, checkDatabase } from './auth-server'
// Contact persistence never reports success for process-local mock storage.
export const serverStore = {
  async addContact(data: { name: string; email: string; subject: string; message: string }) {
    const { data: row, error } = await database().from('contacts').insert({ ...data, read: false }).select('id').single()
    checkDatabase(error)
    if (!row) throw new Error('Contact was not persisted')
    return { id: row.id, message: 'Message received. We will get back to you within 24 hours.' }
  },
  async getContacts() {
    const { data, error } = await database().from('contacts').select('*').order('created_at', { ascending: false })
    checkDatabase(error)
    return data || []
  },
}
