import { NextResponse } from "next/server";
import { getPool, sql, fail, handleError } from "@/lib/db";

export const dynamic = "force-dynamic";

// Whitelisted filters (values are always passed as parameters, never concatenated)
const filters = {
  regNo: "s.RegistrationNo = @q",
  department: "s.Department LIKE '%' + @q + '%'",
  courseCode: "c.CourseCode = @q",
  session: "r.AcademicSession = @q",
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const q = (searchParams.get("q") || "").trim();

    if (!Object.hasOwn(filters, type) || !q) {
      return fail("Choose a search option and enter a value.", 400);
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("q", sql.VarChar(100), q)
      .query(`SELECT r.RegistrationID, s.RegistrationNo, s.StudentName, s.Department, s.Semester,
                     c.CourseCode, c.CourseName, c.CreditHours, r.AcademicSession,
                     CONVERT(VARCHAR(10), r.RegistrationDate, 120) AS RegistrationDate
              FROM dbo.Registrations r
              JOIN dbo.Students s ON s.StudentID = r.StudentID
              JOIN dbo.Courses  c ON c.CourseID  = r.CourseID
              WHERE ${filters[type]}
              ORDER BY r.AcademicSession DESC, s.RegistrationNo, c.CourseCode`);

    return NextResponse.json(result.recordset);
  } catch (err) {
    return handleError(err);
  }
}