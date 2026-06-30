"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage("An error occurred during verification.");
      });
  }, [token]);

  return (
    <div style={{ padding: "6rem 2rem", display: "flex", justifyContent: "center", minHeight: "calc(100vh - 80px)" }}>
      <div className="glass-panel" style={{ maxWidth: "450px", width: "100%", height: "fit-content", textAlign: "center" }}>
        
        <div style={{ marginBottom: "2rem" }}>
          {status === "loading" && (
            <div style={{ width: "48px", height: "48px", border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          )}
          {status === "success" && <CheckCircle size={48} color="#22c55e" style={{ margin: "0 auto" }} />}
          {status === "error" && <XCircle size={48} color="#ef4444" style={{ margin: "0 auto" }} />}
        </div>
        
        <h2 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
          {status === "loading" ? "Verifying..." : status === "success" ? "Email Verified" : "Verification Failed"}
        </h2>
        
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{message}</p>

        {status === "success" ? (
          <Link href="/login" className="btn-primary" style={{ display: "inline-block", width: "100%", padding: "1rem" }}>
            Proceed to Login
          </Link>
        ) : status === "error" ? (
          <Link href="/register" className="btn-secondary" style={{ display: "inline-block", width: "100%", padding: "1rem" }}>
            Return to Sign Up
          </Link>
        ) : null}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
