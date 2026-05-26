'use server'

import { sql } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function registerUser(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')
  const upi_id = formData.get('upi_id')

  if (!name || !email || !password) {
    return { error: 'Missing required fields' }
  }

  try {
    const password_hash = await bcrypt.hash(password, 10)
    
    await sql`
      INSERT INTO users (name, email, password_hash, upi_id)
      VALUES (${name}, ${email}, ${password_hash}, ${upi_id || null})
    `
    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Failed to register user (email might already exist)' }
  }
}
