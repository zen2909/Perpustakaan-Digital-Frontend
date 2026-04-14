import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import TextField from "../../components/ui/TextField";
import PasswordField from "../../components/ui/PasswordField";
import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import AuthCard from "../../components/ui/AuthCard";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login({ email, password });
      const user = response.data.user || response.data;
      const role = user.role;
      if (role === "admin") navigate("/dashboard");
      else if (role === "librarian") navigate("/librarian/dashboard");
      else navigate("/member/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface flex items-center justify-center min-h-screen p-4 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-secondary-container blur-[120px]"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[30%] h-[30%] rounded-full bg-primary-fixed-dim blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[440px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 archival-gradient rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
              <span className="material-symbols-outlined text-white text-3xl">
                library_books
              </span>
            </div>
          </div>
          <h1 className="font-headline font-extrabold text-3xl tracking-tight text-primary mb-2">
            NusantaraReads
          </h1>
          <p className="font-label uppercase tracking-[0.1em] text-xs font-semibold text-on-surface-variant">
            Library Management System
          </p>
        </div>

        <AuthCard
          title="Administrative Access"
          subtitle="Enter your credentials to manage the library."
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <TextField
              id="email"
              label="Email Address"
              type="email"
              placeholder="curator@archival.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="mail"
              required
              autoComplete="email"
            />
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              forgotPasswordLink
              required
            />
            <Checkbox
              id="remember"
              label="Remember this device"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <Button type="submit" loading={loading} icon="login">
              Secure Sign In
            </Button>
          </form>
        </AuthCard>

        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-on-surface-variant/60">
            <span className="material-symbols-outlined text-sm">shield</span>
            <span className="text-[11px] font-medium uppercase tracking-widest">
              End-to-End Encrypted Session
            </span>
          </div>
          <div className="pt-4 border-t border-on-surface-variant/10">
            <p className="text-xs text-on-surface-variant/80">
              Problems logging in?{" "}
              <a href="#" className="text-primary font-bold hover:underline">
                Contact System Administrator
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
