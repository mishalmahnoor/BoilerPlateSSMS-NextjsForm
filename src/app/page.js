"use client";
import { useState } from "react";
import StudentForm from "@/components/StudentForm";
import CourseForm from "@/components/CourseForm";
import RegistrationForm from "@/components/RegistrationForm";
import SearchForm from "@/components/SearchForm";

const tabs = [
  { id: "students", label: "Students" },
  { id: "courses", label: "Courses" },
  { id: "registration", label: "Registration" },
  { id: "search", label: "Search" },
];

export default function Home() {
  const [active, setActive] = useState("students");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Student Course Registration System</h1>
      <p className="mb-6 text-sm text-slate-500">Air University, Kharian Campus · CS330L Assignment 2</p>

      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-200 p-1 sm:grid-cols-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              active === t.id
                ? "bg-white text-indigo-700 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "students" && <StudentForm />}
      {active === "courses" && <CourseForm />}
      {active === "registration" && <RegistrationForm />}
      {active === "search" && <SearchForm />}
    </main>
  );
}