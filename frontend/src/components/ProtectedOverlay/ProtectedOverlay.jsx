import { Lock, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProtectedOverlay({ message = "Sign in to access this content" }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-background/50 z-50 flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl p-10 max-w-lg mx-4 text-center shadow-2xl relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-3">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {message}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signUp"
              className="px-8 py-3 border border-border rounded-xl hover:bg-secondary transition-colors font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
  );
}
