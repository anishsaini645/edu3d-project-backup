import { useState } from "react";
import { registerUser } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await registerUser({
        username,
        email,
        password,
        role,
      });

      // success → login page
      navigate("/login");
    } catch (err: any) {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <div className="space-y-3">
          <input
            className="w-full h-10 px-3 rounded-lg border border-border"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full h-10 px-3 rounded-lg border border-border"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full h-10 px-3 rounded-lg border border-border"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full h-10 px-3 rounded-lg border border-border"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
