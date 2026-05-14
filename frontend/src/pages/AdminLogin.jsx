import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { adminLogin, adminRegister } from "../services/api";
import { saveAdminSession } from "../lib/adminSession";

const loginDefaults = {
  identifier: "",
  password: ""
};

const registerDefaults = {
  username: "",
  email: "",
  password: ""
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginValues, setLoginValues] = useState(loginDefaults);
  const [registerValues, setRegisterValues] = useState(registerDefaults);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginValues((current) => ({ ...current, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterValues((current) => ({ ...current, [name]: value }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await adminLogin(loginValues);
      saveAdminSession({ token: result.token, admin: result.admin });
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await adminRegister(registerValues);
      saveAdminSession({ token: result.token, admin: result.admin });
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_38%),linear-gradient(180deg,#020617_0%,#000814_60%,#000000_100%)] px-4 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-cyan-300/15 bg-slate-950/70 p-8 shadow-[0_0_60px_rgba(14,165,233,0.08)] backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
            <ShieldCheck size={16} />
            Secure Admin Access
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight">Admin authentication for manual disaster operations</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Login unlocks admin-only create, edit, and delete actions. External API data remains read-only, while manual events stay fully manageable with protected JWT-backed requests.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200">
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">POST, PUT, and DELETE event routes now require a valid admin token.</p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">The database also blocks hard-deleting external rows even if someone bypasses the UI.</p>
          </div>
          <div className="mt-8">
            <Link to="/dashboard">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-black/50 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mb-5 flex gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <Button className="flex-1" onClick={() => setMode("login")} type="button" variant={mode === "login" ? "primary" : "ghost"}>
              Login
            </Button>
            <Button className="flex-1" onClick={() => setMode("register")} type="button" variant={mode === "register" ? "primary" : "ghost"}>
              Register
            </Button>
          </div>

          {message && (
            <div className="mb-4 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              {message}
            </div>
          )}

          {mode === "login" ? (
            <form className="grid gap-4" onSubmit={submitLogin}>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">Username or email</p>
                <Input name="identifier" onChange={handleLoginChange} placeholder="admin_username or admin@example.com" value={loginValues.identifier} />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">Password</p>
                <Input name="password" onChange={handleLoginChange} placeholder="Enter password" type="password" value={loginValues.password} />
              </div>
              <Button disabled={loading} type="submit">
                {loading ? "Signing in..." : "Login as Admin"}
              </Button>
            </form>
          ) : (
            <form className="grid gap-4" onSubmit={submitRegister}>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">Username</p>
                <Input name="username" onChange={handleRegisterChange} placeholder="admin_username" value={registerValues.username} />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">Email</p>
                <Input name="email" onChange={handleRegisterChange} placeholder="admin@example.com" type="email" value={registerValues.email} />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-200">Password</p>
                <Input name="password" onChange={handleRegisterChange} placeholder="At least 8 characters" type="password" value={registerValues.password} />
              </div>
              <Button disabled={loading} type="submit">
                {loading ? "Creating admin..." : "Create Admin Account"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
