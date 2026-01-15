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

export default function ForgotPassword({ trigger, triggerClassName }) {
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // TODO: Call API to send password reset email
    setResetEmailSent(true);
    setTimeout(() => {
      setResetEmailSent(false);
      setResetEmail("");
    }, 5000);
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
            <span className="text-green-500 text-sm">Password reset email sent! Check your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword}>
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
                className="h-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                Send Link
              </button>
            </AlertDialogFooter>
          </form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
