"use client";
import { useEffect, useState } from "react";
import { postJson } from "@/lib/client";
import { Card, Field, Message, inputClass, buttonClass } from "@/components/Common";

export default function RegistrationForm() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ studentId: "", courseId: "", academicSession: "", registrationDate: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/courses").then((r) => r.json()),
    ])
      .then(([s, c]) => {
        setStudents(Array.isArray(s) ? s : []);
        setCourses(Array.isArray(c) ? c : []);
      })
      .catch(() => setMessage({ type: "error", text: "Could not load students and courses." }));
  }, []);

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await postJson("/api/registrations", form);
      setMessage({ type: "success", text: "Course registration saved successfully." });
      setForm({ ...form, courseId: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Course Registration" description="Register a student in a course for an academic session.">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Student" htmlFor="studentId">
          <select id="studentId" className={inputClass} value={form.studentId} onChange={set("studentId")} required>
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.StudentID} value={s.StudentID}>
                {s.RegistrationNo} - {s.StudentName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Course" htmlFor="courseId">
          <select id="courseId" className={inputClass} value={form.courseId} onChange={set("courseId")} required>
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.CourseID} value={c.CourseID}>
                {c.CourseCode} - {c.CourseName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Academic Session" htmlFor="academicSession">
          <input
            id="academicSession"
            className={inputClass}
            maxLength={20}
            placeholder="Fall 2026"
            value={form.academicSession}
            onChange={set("academicSession")}
            required
          />
        </Field>
        <Field label="Registration Date" htmlFor="registrationDate">
          <input
            id="registrationDate"
            type="date"
            className={inputClass}
            value={form.registrationDate}
            onChange={set("registrationDate")}
          />
        </Field>
        <Message message={message} />
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Saving..." : "Register Student"}
          </button>
        </div>
      </form>
    </Card>
  );
}