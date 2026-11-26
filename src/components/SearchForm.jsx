"use client";
import { useState } from "react";
import { Card, Field, Message, inputClass, buttonClass } from "@/components/Common";

const options = [
  { value: "regNo", label: "Student Registration Number", placeholder: "e.g. 231001" },
  { value: "department", label: "Department", placeholder: "e.g. Computer Science" },
  { value: "courseCode", label: "Course Code", placeholder: "e.g. CS330" },
  { value: "session", label: "Academic Session", placeholder: "e.g. Fall 2026" },
];

const headers = ["Reg No", "Student", "Department", "Sem", "Course Code", "Course Name", "Credits", "Session", "Date"];

export default function SearchForm() {
  const [type, setType] = useState("regNo");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const current = options.find((o) => o.value === type);

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/search?type=${type}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setRows(data);
    } catch (err) {
      setRows(null);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Search Registrations" description="Find student course registration records.">
      <form onSubmit={search} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Search by" htmlFor="type">
          <select id="type" className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Value" htmlFor="q">
          <input
            id="q"
            className={inputClass}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={current.placeholder}
            required
          />
        </Field>
        <button type="submit" disabled={loading} className={buttonClass}>
          {loading ? "Searching..." : "Search"}
        </button>
        <Message message={message} />
      </form>

      {rows && (
        <div className="mt-6">
          {rows.length === 0 ? (
            <p className="text-sm text-slate-500">No records found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((r) => (
                    <tr key={r.RegistrationID} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-3 py-2">{r.RegistrationNo}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.StudentName}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.Department}</td>
                      <td className="px-3 py-2">{r.Semester}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.CourseCode}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.CourseName}</td>
                      <td className="px-3 py-2">{r.CreditHours}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.AcademicSession}</td>
                      <td className="whitespace-nowrap px-3 py-2">{r.RegistrationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}