"use client";
import { useState } from "react";
import { postJson } from "@/lib/client";
import { Card, Field, Message, inputClass, buttonClass } from "@/components/Common";

const fields = [
  { name: "courseCode", label: "Course Code", type: "text", maxLength: 20, placeholder: "CS330" },
  { name: "courseName", label: "Course Name", type: "text", maxLength: 100, placeholder: "Advanced Database Management Systems" },
  { name: "creditHours", label: "Credit Hours", type: "number", min: 1, max: 6, placeholder: "3" },
];
const empty = { courseCode: "", courseName: "", creditHours: "" };

export default function CourseForm() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await postJson("/api/courses", form);
      setMessage({ type: "success", text: "Course saved successfully." });
      setForm(empty);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Course Management" description="Enter new course information.">
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
            {loading ? "Saving..." : "Save Course"}
          </button>
        </div>
      </form>
    </Card>
  );
}