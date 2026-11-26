import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentForm from "@/components/StudentForm";
import CourseForm from "@/components/CourseForm";
import RegistrationForm from "@/components/RegistrationForm";
import SearchForm from "@/components/SearchForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Student Course Registration System</h1>
      <p className="mb-6 text-sm text-muted-foreground">Air University, Kharian Campus · CS330L Assignment 2</p>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="students"><StudentForm /></TabsContent>
        <TabsContent value="courses"><CourseForm /></TabsContent>
        <TabsContent value="registration"><RegistrationForm /></TabsContent>
        <TabsContent value="search"><SearchForm /></TabsContent>
      </Tabs>
    </main>
  );
}