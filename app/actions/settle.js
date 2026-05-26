'use server'

import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function markAsSettled(groupId, fromUserId, toUserId, amount) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'Unauthorized' }

  try {
    await sql`
      INSERT INTO settlements (group_id, from_user_id, to_user_id, amount, is_settled, settled_at)
      VALUES (${groupId}, ${fromUserId}, ${toUserId}, ${amount}, TRUE, NOW())
    `
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to settle debt' }
  }
}
