import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { forgotPassword } from "../../services/Auth/authService";

export default function ForgotPassword({ trigger, triggerClassName }) {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(resetEmail);
      setResetEmailSent(true);
      setTimeout(() => {
        setResetEmailSent(false);
        setResetEmail("");
      }, 5000);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className={triggerClassName || "text-sm text-primary hover:opacity-80"}
          >
            Forgotten password?
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Reset Your Password</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {resetEmailSent ? (
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-500 text-sm">Password reset email sent! Check your inbox or spam folder.</span>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword}>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="resetEmail" className="block text-sm mb-2 text-foreground">
                Email Address
              </label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-auto px-6 py-3 bg-secondary border border-border text-foreground hover:bg-secondary/80 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <button
                type="submit"
                disabled={loading}
                className="h-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Link'}
              </button>
            </AlertDialogFooter>
          </form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
