'use server'

import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function updateProfile(formData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'Unauthorized' }

  const upiId = formData.get('upi_id')
  const userId = session.user.id

  try {
    await sql`
      UPDATE users 
      SET upi_id = ${upiId || null}
      WHERE id = ${userId}
    `
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update profile' }
  }
}
