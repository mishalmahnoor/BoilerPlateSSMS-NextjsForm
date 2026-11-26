import { NextResponse } from "next/server";
import { getPool, sql, fail, handleError } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT StudentID, StudentName, RegistrationNo FROM dbo.Students ORDER BY StudentName"
    );
    return NextResponse.json(result.recordset);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req) {
  try {
    const { studentName, registrationNo, department, semester, email } = await req.json();

    if (!studentName?.trim() || !registrationNo?.trim() || !department?.trim() || !email?.trim()) {
      return fail("All fields are required.", 400);
    }
    const sem = Number(semester);
    if (!Number.isInteger(sem) || sem < 1 || sem > 12) {
      return fail("Semester must be a number between 1 and 12.", 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return fail("Please enter a valid email address.", 400);
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", sql.VarChar(100), studentName.trim())
      .input("regNo", sql.VarChar(20), registrationNo.trim())
      .input("dept", sql.VarChar(50), department.trim())
      .input("sem", sql.Int, sem)
      .input("email", sql.VarChar(100), email.trim())
      .query(`INSERT INTO dbo.Students (StudentName, RegistrationNo, Department, Semester, Email)
              OUTPUT INSERTED.StudentID
              VALUES (@name, @regNo, @dept, @sem, @email)`);

    return NextResponse.json({ studentId: result.recordset[0].StudentID }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}