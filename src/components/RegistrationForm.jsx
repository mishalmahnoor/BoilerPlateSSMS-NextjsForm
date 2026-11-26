"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postJson } from "@/lib/client";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function RegistrationForm() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ studentId: "", courseId: "", academicSession: "", registrationDate: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/courses").then((r) => r.json()),
    ])
      .then(([s, c]) => {
        setStudents(Array.isArray(s) ? s : []);
        setCourses(Array.isArray(c) ? c : []);
      })
      .catch(() => toast.error("Could not load students and courses."));
  }, []);

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await postJson("/api/registrations", form);
      toast.success("Course registration saved successfully.");
      setForm({ ...form, courseId: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Registration</CardTitle>
        <CardDescription>Register a student in a course for an academic session.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="studentId">Student</Label>
            <select id="studentId" className={selectClass} value={form.studentId} onChange={set("studentId")} required>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.StudentID} value={s.StudentID}>
                  {s.RegistrationNo} - {s.StudentName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="courseId">Course</Label>
            <select id="courseId" className={selectClass} value={form.courseId} onChange={set("courseId")} required>
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.CourseID} value={c.CourseID}>
                  {c.CourseCode} - {c.CourseName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="academicSession">Academic Session</Label>
            <Input id="academicSession" maxLength={20} placeholder="Fall 2026" value={form.academicSession} onChange={set("academicSession")} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="registrationDate">Registration Date</Label>
            <Input id="registrationDate" type="date" value={form.registrationDate} onChange={set("registrationDate")} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Register Student"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}