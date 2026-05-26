'use server'

import { sql } from '@/lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function addExpense(groupId, formData, customSplits = null) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'Unauthorized' }

  const title = formData.get('title')
  const amount = parseFloat(formData.get('amount'))
  const paidBy = formData.get('paid_by_user_id')
  const category = formData.get('category')
  const splitType = formData.get('split_type')

  if (!title || !amount || !paidBy || !category || !splitType) {
    return { error: 'Missing required fields' }
  }

  try {
    const expenses = await sql`
      INSERT INTO expenses (group_id, title, amount, paid_by_user_id, split_type, category)
      VALUES (${groupId}, ${title}, ${amount}, ${paidBy}, ${splitType}, ${category})
      RETURNING id
    `
    const expenseId = expenses[0].id

    if (splitType === 'equal') {
      const members = await sql`SELECT user_id FROM group_members WHERE group_id = ${groupId}`
      const splitAmount = amount / members.length
      
      for (const m of members) {
        await sql`
          INSERT INTO expense_splits (expense_id, user_id, amount_owed)
          VALUES (${expenseId}, ${m.user_id}, ${splitAmount})
        `
      }
    } else if (splitType === 'custom' && customSplits) {
      for (const [userId, splitAmount] of Object.entries(customSplits)) {
        await sql`
          INSERT INTO expense_splits (expense_id, user_id, amount_owed)
          VALUES (${expenseId}, ${userId}, ${splitAmount})
        `
      }
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to add expense' }
  }
}
