"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const endpoint = setupMode ? "/api/auth/setup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Logged in successfully!");
        if (setupMode) {
          setSetupMode(false);
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        toast.error(data.error || "Failed to authenticte");
      }
    } catch (err) {
      toast.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F3EBE5] p-4 text-[#2A2522]">
      <div className="bg-white p-8 md:p-12 shadow-xl w-full max-w-md border border-[rgba(42,37,34,0.1)] text-center">
        <h1 className="font-serif text-3xl mb-2 text-[#2A2522]">
          Deepali
        </h1>
        <p className="label-xs mb-8">{setupMode ? "Initial Setup" : "Admin Authentication"}</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div>
            <label className="field-label">Username</label>
            <input name="username" type="text" required className="editorial-input" placeholder="admin" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input name="password" type="password" required className="editorial-input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? "Processing..." : (setupMode ? "Initialize Admin" : "Sign In")}
          </button>
        </form>

        <button 
          onClick={() => setSetupMode(!setupMode)} 
          className="mt-6 text-xs text-gray-400 hover:text-[#C8A97E] transition-colors"
        >
          {setupMode ? "Back to Login" : "Or Initial Setup (One time)"}
        </button>
      </div>
    </div>
  );
}
