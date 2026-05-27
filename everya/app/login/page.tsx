"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn.email({ email, password });
    setLoading(false);
    if (res.error) {
      setError(res.error.message || "Invalid credentials");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-sm font-semibold tracking-tight mb-4 inline-block">
            EVERYA
          </Link>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your technical knowledge workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            No account?{" "}
            <Link href="/signup" className="text-foreground font-medium hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: alex@everya.dev / demo12345
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
