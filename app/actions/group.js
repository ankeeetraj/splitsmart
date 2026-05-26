'use server'

import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function createGroup(formData) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'Unauthorized' }

  const name = formData.get('name')
  const type = formData.get('type')
  const userId = session.user.id

  if (!name || !type) return { error: 'Missing fields' }

  try {
    const groups = await sql`
      INSERT INTO groups (name, type, created_by)
      VALUES (${name}, ${type}, ${userId})
      RETURNING id
    `
    const groupId = groups[0].id

    await sql`
      INSERT INTO group_members (group_id, user_id)
      VALUES (${groupId}, ${userId})
    `

    return { success: true, groupId }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to create group' }
  }
}

export async function addMemberByEmail(groupId, email) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'Unauthorized' }

  try {
    const users = await sql`SELECT id FROM users WHERE email = ${email}`
    if (users.length === 0) return { error: 'User not found with that email' }
    
    const userId = users[0].id

    const existing = await sql`
      SELECT id FROM group_members WHERE group_id = ${groupId} AND user_id = ${userId}
    `
    if (existing.length > 0) return { error: 'User is already in the group' }

    await sql`
      INSERT INTO group_members (group_id, user_id)
      VALUES (${groupId}, ${userId})
    `
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to add member' }
  }
}

export async function getGroupMembers(groupId) {
  return await sql`
    SELECT u.id, u.name, u.email 
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    WHERE gm.group_id = ${groupId}
  `
}
