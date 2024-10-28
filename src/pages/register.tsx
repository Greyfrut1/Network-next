//pages/register.tsx
import React, { useState } from "react";
import { registerUser } from "@/untils/auth";

const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL as string;


export default function Register() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await registerUser(name, email, password, API_URL);
        alert("Registered successfully");
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required/>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    );
  }