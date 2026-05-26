import { sql } from './db'

export async function getGroupBalances(groupId) {
  const members = await sql`
    SELECT u.id, u.name, u.email, u.upi_id
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    WHERE gm.group_id = ${groupId}
  `
  
  const balances = {}
  members.forEach(m => {
    balances[m.id] = { ...m, balance: 0 }
  })

  const expenses = await sql`
    SELECT e.id, e.paid_by_user_id, es.user_id as split_user_id, es.amount_owed
    FROM expenses e
    JOIN expense_splits es ON e.id = es.expense_id
    WHERE e.group_id = ${groupId}
  `

  expenses.forEach(e => {
    if (balances[e.paid_by_user_id] && balances[e.split_user_id]) {
      if (e.paid_by_user_id !== e.split_user_id) {
        balances[e.paid_by_user_id].balance += parseFloat(e.amount_owed)
        balances[e.split_user_id].balance -= parseFloat(e.amount_owed)
      }
    }
  })

  const settlements = await sql`
    SELECT from_user_id, to_user_id, amount
    FROM settlements
    WHERE group_id = ${groupId} AND is_settled = TRUE
  `

  settlements.forEach(s => {
    if (balances[s.from_user_id] && balances[s.to_user_id]) {
      balances[s.from_user_id].balance += parseFloat(s.amount)
      balances[s.to_user_id].balance -= parseFloat(s.amount)
    }
  })

  return Object.values(balances)
}
