import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql`
      SELECT DISTINCT UNNEST(tags) as tag 
      FROM projects 
      ORDER BY tag
    `

    const tags = result.map((row) => row.tag)
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error GET /api/tags:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
