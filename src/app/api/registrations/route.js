import { NextResponse } from "next/server";
import { getPool, sql, fail, handleError } from "@/lib/db";

export async function POST(req) {
  try {
    const { studentId, courseId, academicSession, registrationDate } = await req.json();

    if (!studentId || !courseId || !academicSession?.trim()) {
      return fail("Student, course and academic session are required.", 400);
    }

    const pool = await getPool();
    await pool
      .request()
      .input("studentId", sql.Int, Number(studentId))
      .input("courseId", sql.Int, Number(courseId))
      .input("session", sql.VarChar(20), academicSession.trim())
      .input("regDate", sql.VarChar(10), registrationDate || null)
      .query(`INSERT INTO dbo.Registrations (StudentID, CourseID, RegistrationDate, AcademicSession)
              VALUES (@studentId, @courseId,
                      ISNULL(CAST(@regDate AS DATE), CAST(GETDATE() AS DATE)),
                      @session)`);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}