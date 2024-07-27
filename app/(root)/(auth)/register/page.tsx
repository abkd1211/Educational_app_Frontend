"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

// Define the type for department keys
type DepartmentKey = "aren" | "bmen" | "cpen" | "fpen" | "mten";

const departmentMap: Record<DepartmentKey, number> = {
  "aren": 1,
  "bmen": 2,
  "cpen": 3,
  "fpen": 4,
  "mten": 5
};
interface StudentResponse {
  id: number;
  studentId: number;
  pin: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  department: {
    id: number;
    name: string | null;
    courses: any; // Adjust this type based on the actual structure of the courses
  };
  email: string;
  studentCourses: any; // Adjust this type based on the actual structure of studentCourses
}
export default function Component() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [department, setDepartment] = useState<DepartmentKey | "">("");
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName || !lastName || !dateOfBirth || !department || !id || !pin) {
      alert("Please fill all the inputs");
      return;
    }

    //const email = `${firstName.toLowerCase()}.${lastName[0].toLowerCase()}@st.ug.edu.gh`;
    const departmentId = departmentMap[department as DepartmentKey];

    const studentData = {
      firstName,
      lastName,
      dateOfBirth,
      department: { id: departmentId },
      studentId: id,
      pin,
      email,
    };

    try {
      const response = await fetch("http://localhost:8001/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }
      const responseData = await response.json();
      const studentId = responseData.id;
      router.push(`/dashboard?studentId=${studentId}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the account.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 border border-gray-300 rounded-md p-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to create a new account.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-of-birth">Date of Birth</Label>
          <Input id="date-of-birth" type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select onValueChange={(value) => setDepartment(value as DepartmentKey)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aren">Agric Engineering</SelectItem>
              <SelectItem value="bmen">Biomedical Engineering</SelectItem>
              <SelectItem value="cpen">Computer Engineering</SelectItem>
              <SelectItem value="fpen">Food Process Engineering</SelectItem>
              <SelectItem value="mten">Materials Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="id">ID</Label>
          <Input id="id" placeholder="Enter your ID" required value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin">PIN</Label>
          <Input id="pin" type="password" placeholder="Enter your PIN" required value={pin} onChange={(e) => setPin(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
