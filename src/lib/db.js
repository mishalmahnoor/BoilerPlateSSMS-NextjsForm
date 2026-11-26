import sql from "mssql";
import { NextResponse } from "next/server";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: { encrypt: false, trustServerCertificate: true },
};

// One shared connection pool (survives hot reloads in dev)
export function getPool() {
  if (!globalThis._sqlPool) {
    globalThis._sqlPool = new sql.ConnectionPool(config).connect().catch((err) => {
      globalThis._sqlPool = undefined;
      throw err;
    });
  }
  return globalThis._sqlPool;
}

export { sql };

export function fail(error, status) {
  return NextResponse.json({ error }, { status });
}

export function handleError(err) {
  console.error(err);
  const msg = err.message || "";
  if (err.number === 2627 || err.number === 2601) {
    if (msg.includes("UQ_Students_RegNo")) return fail("A student with this registration number already exists.", 409);
    if (msg.includes("UQ_Students_Email")) return fail("This email is already used by another student.", 409);
    if (msg.includes("UQ_Courses_Code")) return fail("A course with this code already exists.", 409);
    if (msg.includes("UQ_Registration")) return fail("This student is already registered for this course in this academic session.", 409);
  }
  if (err.number === 547) return fail("Selected student or course does not exist.", 400);
  return fail("Database error. Check the terminal running npm run dev.", 500);
}