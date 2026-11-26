"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postJson } from "@/lib/client";

const fields = [
  { name: "courseCode", label: "Course Code", type: "text", maxLength: 20, placeholder: "CS330" },
  { name: "courseName", label: "Course Name", type: "text", maxLength: 100, placeholder: "Advanced Database Management Systems" },
  { name: "creditHours", label: "Credit Hours", type: "number", min: 1, max: 6, placeholder: "3" },
];
const empty = { courseCode: "", courseName: "", creditHours: "" };

export default function CourseForm() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await postJson("/api/courses", form);
      toast.success("Course saved successfully.");
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
        <CardTitle>Course Management</CardTitle>
        <CardDescription>Enter new course information.</CardDescription>
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
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Course"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}