"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import { GoldCurve, BotanicalCorner, BotanicalCornerSmall } from "@/components/admin/ui/Decorative";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-scope relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <GoldCurve className="pointer-events-none absolute -right-10 -top-16 h-[420px] w-[560px] text-admin-champagne opacity-[0.08]" />
      <BotanicalCorner className="pointer-events-none absolute -right-6 -top-10 h-[380px] w-[440px] text-admin-sage opacity-[0.1]" />
      <BotanicalCornerSmall className="pointer-events-none absolute -bottom-8 -left-8 h-64 w-64 rotate-180 text-admin-sage opacity-[0.08]" />

      <div className="admin-page-enter relative z-10 w-full max-w-[420px]">
        {/* Logo/Title */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-admin-primary p-3 shadow-[var(--shadow-admin-card)]">
            <Image
              src="/logo/Logo3-removebg-preview.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-admin-text">
            Admin Access
          </h1>
          <p className="mt-2 text-[15px] text-admin-text-secondary">
            Enter your credentials to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-admin-lg border border-admin-border bg-admin-card p-8 shadow-[var(--shadow-admin-card)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="password"
              type="password"
              label="Password"
              icon={<Lock className="h-4 w-4" strokeWidth={2} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-admin-sm border-l-4 border-admin-danger bg-admin-danger-bg px-4 py-3 text-[14px] text-admin-danger">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="w-full group"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-[14px] text-admin-text-secondary transition-colors hover:text-admin-primary"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
