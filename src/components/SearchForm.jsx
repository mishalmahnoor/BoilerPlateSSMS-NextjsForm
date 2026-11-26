"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const options = [
  { value: "regNo", label: "Student Registration Number", placeholder: "e.g. 231001" },
  { value: "department", label: "Department", placeholder: "e.g. Computer Science" },
  { value: "courseCode", label: "Course Code", placeholder: "e.g. CS330" },
  { value: "session", label: "Academic Session", placeholder: "e.g. Fall 2026" },
];

export default function SearchForm() {
  const [type, setType] = useState("regNo");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const current = options.find((o) => o.value === type);

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/search?type=${type}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setRows(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Registrations</CardTitle>
        <CardDescription>Find student course registration records.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={search} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="type">Search by</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="q">Value</Label>
            <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={current.placeholder} required />
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
        </form>

        {rows && (
          rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Sem</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.RegistrationID}>
                    <TableCell>{r.RegistrationNo}</TableCell>
                    <TableCell>{r.StudentName}</TableCell>
                    <TableCell>{r.Department}</TableCell>
                    <TableCell>{r.Semester}</TableCell>
                    <TableCell>{r.CourseCode}</TableCell>
                    <TableCell>{r.CourseName}</TableCell>
                    <TableCell>{r.CreditHours}</TableCell>
                    <TableCell>{r.AcademicSession}</TableCell>
                    <TableCell>{r.RegistrationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </CardContent>
    </Card>
  );
}