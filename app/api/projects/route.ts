import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT id, link, date, tags, created_at 
      FROM projects 
      ORDER BY date DESC
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error GET /api/projects:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
