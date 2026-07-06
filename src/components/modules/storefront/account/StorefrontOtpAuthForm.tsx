"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Store } from "@/types/store.types";
import {
  sendStorefrontOtpAction,
  verifyStorefrontOtpAction,
} from "@/actions/storefront-customer.actions";
import { useStorefrontCustomer } from "@/components/modules/storefront/StorefrontCustomerContext";

const OTP_EXPIRY_SECONDS = 15 * 60;

type OtpAuthMode = "login" | "register";

interface StorefrontOtpAuthFormProps {
  store: Store;
  mode: OtpAuthMode;
  nextPath?: string;
}

export function StorefrontOtpAuthForm({ store, mode, nextPath }: StorefrontOtpAuthFormProps) {
  const router = useRouter();
  const { setCustomer } = useStorefrontCustomer();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const base = `/store/${store.slug}`;

  useEffect(() => {
    if (step !== "otp" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const redirectAfterAuth = () => {
    const destination = nextPath
      ? `${base}${nextPath.startsWith("/") ? nextPath : `/${nextPath}`}`
      : mode === "register"
        ? `${base}/account/wishlist`
        : `${base}/account/orders`;
    router.push(destination);
    router.refresh();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendStorefrontOtpAction(store.slug, {
        email,
        purpose: mode,
        ...(mode === "register" ? { name } : {}),
      });
      setStep("otp");
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setOtp("");
      toast.success("Verification code sent to your email");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      toast.error("Code expired. Please request a new one.");
      return;
    }
    setLoading(true);
    try {
      const customer = await verifyStorefrontOtpAction(store.slug, { email, otp });
      setCustomer(customer);
      toast.success(mode === "register" ? "Account created!" : "Welcome back!");
      redirectAfterAuth();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendStorefrontOtpAction(store.slug, {
        email,
        purpose: mode,
        ...(mode === "register" ? { name } : {}),
      });
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setOtp("");
      toast.success("New code sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-5">
        <p className="sf-muted-fg text-center text-sm">
          Enter the 6-digit code sent to{" "}
          <span className="sf-fg font-medium break-all">{email}</span>
        </p>

        <div className="flex flex-col items-center gap-2">
          <Label className="sf-muted-fg text-xs">Verification code</Label>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="sf-input" />
              <InputOTPSlot index={1} className="sf-input" />
              <InputOTPSlot index={2} className="sf-input" />
              <InputOTPSlot index={3} className="sf-input" />
              <InputOTPSlot index={4} className="sf-input" />
              <InputOTPSlot index={5} className="sf-input" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="sf-muted-fg text-center text-xs">
          {timeLeft > 0 ? (
            <>Code expires in {formatTime(timeLeft)}</>
          ) : (
            <span className="text-[var(--sf-destructive)]">Code expired</span>
          )}
        </p>

        <Button
          type="submit"
          className="sf-btn-primary h-11 w-full rounded-full"
          disabled={loading || otp.length !== 6 || timeLeft <= 0}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "register" ? "Create account" : "Log in"}
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="sf-muted-fg"
            disabled={loading}
            onClick={() => {
              setStep("details");
              setOtp("");
            }}
          >
            Change email
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="sf-muted-fg gap-1"
            disabled={loading || timeLeft > OTP_EXPIRY_SECONDS - 30}
            onClick={handleResend}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Resend code
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            className="sf-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className="sf-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="sf-btn-primary h-11 w-full rounded-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send verification code
      </Button>
      <p className="sf-muted-fg text-center text-xs">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href={`${base}/account/register`} className="sf-link underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={`${base}/account/login`} className="sf-link underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
