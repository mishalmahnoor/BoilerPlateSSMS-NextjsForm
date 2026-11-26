"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postJson } from "@/lib/client";

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

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await postJson("/api/students", form);
      toast.success("Student saved successfully.");
      setForm(empty);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>Enter new student information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className="grid gap-2">
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                {...f}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Student"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}