import { NextResponse } from "next/server";
import { getPool, sql, fail, handleError } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT CourseID, CourseCode, CourseName, CreditHours FROM dbo.Courses ORDER BY CourseCode"
    );
    return NextResponse.json(result.recordset);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req) {
  try {
    const { courseCode, courseName, creditHours } = await req.json();

    if (!courseCode?.trim() || !courseName?.trim()) {
      return fail("Course code and course name are required.", 400);
    }
    const hrs = Number(creditHours);
    if (!Number.isInteger(hrs) || hrs < 1 || hrs > 6) {
      return fail("Credit hours must be a number between 1 and 6.", 400);
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("code", sql.VarChar(20), courseCode.trim())
      .input("name", sql.VarChar(100), courseName.trim())
      .input("hrs", sql.Int, hrs)
      .query(`INSERT INTO dbo.Courses (CourseCode, CourseName, CreditHours)
              OUTPUT INSERTED.CourseID
              VALUES (@code, @name, @hrs)`);

    return NextResponse.json({ courseId: result.recordset[0].CourseID }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}