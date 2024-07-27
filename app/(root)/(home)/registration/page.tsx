'use client'

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
}

interface Student {
  id: number;
  studentId: string;
  department: {
    id: number;
  };
}

const Registration: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const storedStudentData = localStorage.getItem("studentData");
    if (storedStudentData) {
      const studentData = JSON.parse(storedStudentData);
      setStudent(studentData);
      setCourses(studentData.department.courses);
    }
  }, []);



  const handleAddCourse = async (course: Course) => {
    if (!student) return;

    try {
      const response = await axios.post('http://localhost:8001/api/student-courses', {
        studentDto: {id: student.id},
        courseDto:{id: course.id}
      });
      setSelectedCourses([...selectedCourses, response.data]);
    } catch (error) {
      console.error("Error adding course", error);
    }
  };

  const handleRemoveCourse = async (course: Course) => {
    if (!student) return;

    try {
      await axios.delete('http://localhost:8001/api/student-courses', {
        params: {
          studentId: student.id,
          courseId: course.id
        }
      });
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } catch (error) {
      console.error("Error removing course", error);
    }
  };

  const isCourseSelected = (course: Course) => {
    return selectedCourses.some(c => c.id === course.id);
  };

  return (
    <div>
      <div className='mb-[20px]'>Registration</div>

      <Table>
        <TableCaption>Available Courses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Course ID</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.courseCode}</TableCell>
              <TableCell>{course.courseName}</TableCell>
              <TableCell className="text-right">
                {isCourseSelected(course) ? (
                  <button onClick={() => handleRemoveCourse(course)}>Remove</button>
                ) : (
                  <button onClick={() => handleAddCourse(course)}>Add</button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Registration;
