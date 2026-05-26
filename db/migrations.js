const { neon } = require('@neondatabase/serverless');

require('dotenv').config({ path: '.env.local' });

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Please set it in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('Running migrations...');

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        upi_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('Created users table');

    await sql`
      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT CHECK (type IN ('trip','flatmates','outing','other')),
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('Created groups table');

    await sql`
      CREATE TABLE IF NOT EXISTS group_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(group_id, user_id)
      );
    `;
    console.log('Created group_members table');

    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        paid_by_user_id UUID REFERENCES users(id),
        split_type TEXT CHECK (split_type IN ('equal','custom')),
        category TEXT CHECK (category IN ('food','travel','stay','utilities','other')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('Created expenses table');

    await sql`
      CREATE TABLE IF NOT EXISTS expense_splits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id),
        amount_owed NUMERIC(10,2) NOT NULL
      );
    `;
    console.log('Created expense_splits table');

    await sql`
      CREATE TABLE IF NOT EXISTS settlements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
        from_user_id UUID REFERENCES users(id),
        to_user_id UUID REFERENCES users(id),
        amount NUMERIC(10,2) NOT NULL,
        is_settled BOOLEAN DEFAULT FALSE,
        settled_at TIMESTAMP
      );
    `;
    console.log('Created settlements table');

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

runMigrations();
