"use client";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import { CreditCard } from "lucide-react";
import Card from "@/components/ui/card";
import BarChart from "@/components/ui/BarChart";
import SalesCard from "@/components/ui/SalesCard";
import axios from 'axios';
import { usePathname, useSearchParams } from 'next/navigation';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
}

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  department: {
    id: number;
  };
  email: string;
  studentCourses?: Course[];
}

const userSalesData = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
  },
  {
    name: "William Kim",
    email: "william.kim@email.com",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
  }
];

const Dashboard: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  let studentIdNumber = typeof studentId === 'string' ? parseInt(studentId, 10) : NaN;
  const [student, setStudent] = useState<Student | null>(null);
  const [studentCourses, setStudentCourses] = useState<Course[]>([]);

  useEffect(() => {

    if (isNaN(studentIdNumber) || studentIdNumber <= 0) {
      const storedStudentData = localStorage.getItem("studentData");
      if (storedStudentData) {
        const studentData = JSON.parse(storedStudentData);
        studentIdNumber=studentData.id;
        setStudent(studentData);
        setStudentCourses(studentData.studentCourses);
        
      }else{
      console.error("Invalid student ID");
      return;}
    
    }else{  const fetchStudentData = async () => {
      try {
        // Fetch student data
        const studentResponse = await axios.get<Student>(`http://localhost:8001/api/students/${studentIdNumber}`);
        const studentData = studentResponse.data;
        setStudent(studentData);
        localStorage.setItem("studentData", JSON.stringify(studentData)); // Save student data to local storage

        // Fetch student courses
        const coursesResponse = await axios.get<Course[]>(`http://localhost:8001/api/student-courses/student/${studentIdNumber}`);
        setStudentCourses(coursesResponse.data);

      } catch (error) {
        console.error("Error fetching student data or courses", error);
      }
    };

    fetchStudentData();}
  }, [studentIdNumber]);

  // if (isNaN(studentIdNumber) || studentIdNumber <= 0 && !localStorage.getItem("studentData")) {
  //   return <div>Invalid Student ID</div>;
  // }

  if (!student) {
    return <div>Loading...</div>;
  }

  const { firstName } = student;

  return (
    <div className="m-20 flex flex-col w-full">
      <h1 className="text-[36px] bg-gradient-to-r from-red-400 via-indigo-500 to-blue-600 inline-block text-transparent bg-clip-text font-bold">
        Hello, {firstName}
      </h1>

      <PageTitle title="Dashboard" className="text-gray-700" />
      <section className="grid mb-10 w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {studentCourses.length > 0 ? (
          studentCourses.map((course) => (
            <Card
              key={course.id}
              course={course.courseName}
              discription=""
              icon={CreditCard} // Change icon as needed
              code={course.courseCode}
            />
          ))
        ) : (
          <p>No registered courses</p>
        )}
      </section>
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <div className="p-4">
          <p className="p-4 font-semibold">Progress</p>
          <BarChart />
        </div>
        <div className="flex justify-between gap-4">
          <section>
            <p>Contact Tutors</p>
            <p className="text-sm text-gray-400">Five Tutors Available</p>
          </section>
          {userSalesData.map((d, i) => (
            <SalesCard key={i} email={d.email} name={d.name} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;