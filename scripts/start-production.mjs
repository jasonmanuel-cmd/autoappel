import { cp } from 'node:fs/promises'
import { resolve } from 'node:path'
// Next standalone output does not copy public/static assets automatically.
await cp('public','.next/standalone/public',{ recursive:true,force:true })
await cp('.next/static','.next/standalone/.next/static',{ recursive:true,force:true })
process.env.HOSTNAME = '0.0.0.0'
process.env.PORT ||= '3000'
await import(resolve('.next/standalone/server.js'))
