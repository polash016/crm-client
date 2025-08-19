"use client";
import UserTable from "@/components/Dashboard/users/UserTable";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <UserTable />
      </div>
    </div>
  );
}
