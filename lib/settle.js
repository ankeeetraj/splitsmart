import { GoogleGenerativeAI } from "@google/generative-ai";

export function simplifyDebts(balances) {
  const transactions = [];
  
  // Clone balances to avoid mutating the original
  const balancesCopy = balances.map(b => ({...b}));
  
  const credits = balancesCopy.filter(b => b.balance > 0.01).sort((a,b) => b.balance - a.balance);
  const debts = balancesCopy.filter(b => b.balance < -0.01).sort((a,b) => a.balance - b.balance);
  
  let i = 0, j = 0;
  while (i < credits.length && j < debts.length) {
    const amount = Math.min(credits[i].balance, -debts[j].balance);
    
    transactions.push({ 
      from: debts[j], 
      to: credits[i], 
      to_upi_id: credits[i].upi_id,
      amount: parseFloat(amount.toFixed(2)) 
    });
    
    credits[i].balance -= amount;
    debts[j].balance += amount;
    
    if (Math.abs(credits[i].balance) < 0.01) i++;
    if (Math.abs(debts[j].balance) < 0.01) j++;
  }
  return transactions;
}

export async function generateSettlementSummary(transactions) {
  if (transactions.length === 0) return "Everyone is completely settled up! No debts remain."
  if (!process.env.GEMINI_API_KEY) return "AI summary unavailable (missing API key)."
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const plainTransactions = transactions.map(t => ({
      from: t.from.name,
      to: t.to.name,
      amount: t.amount
    }))

    const prompt = `Given these settlements needed: ${JSON.stringify(plainTransactions)}, write a friendly 2-3 sentence plain English summary of who owes whom, using ₹ for currency. Be specific and human.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error)
    return "AI summary is currently unavailable."
  }
}
