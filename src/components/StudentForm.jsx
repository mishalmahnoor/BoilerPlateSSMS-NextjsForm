"use client";
import { useState } from "react";
import { postJson } from "@/lib/client";
import { Card, Field, Message, inputClass, buttonClass } from "@/components/Common";

const fields = [
  { name: "studentName", label: "Student Name", type: "text", maxLength: 100, placeholder: "Ali Raza" },
  { name: "registrationNo", label: "Registration Number", type: "text", maxLength: 20, placeholder: "231001" },
  { name: "department", label: "Department", type: "text", maxLength: 50, placeholder: "Computer Science" },
  { name: "semester", label: "Semester", type: "number", min: 1, max: 12, placeholder: "5" },
  { name: "email", label: "Email", type: "email", maxLength: 100, placeholder: "ali@example.com" },
];
const empty = { studentName: "", registrationNo: "", department: "", semester: "", email: "" };

export default function StudentForm() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await postJson("/api/students", form);
      setMessage({ type: "success", text: "Student saved successfully." });
      setForm(empty);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Student Registration" description="Enter new student information.">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ label, ...props }) => (
          <Field key={props.name} label={label} htmlFor={props.name}>
            <input
              id={props.name}
              {...props}
              className={inputClass}
              value={form[props.name]}
              onChange={(e) => setForm({ ...form, [props.name]: e.target.value })}
              required
            />
          </Field>
        ))}
        <Message message={message} />
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Saving..." : "Save Student"}
          </button>
        </div>
      </form>
    </Card>
  );
}