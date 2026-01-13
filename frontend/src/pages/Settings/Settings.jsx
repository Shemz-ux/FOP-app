import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Trash2, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // TODO: Replace with actual API calls
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Fintan",
    lastName: "Cabrera",
    email: "fintan.cabrera@example.com",
    phone: "+1 (555) 123-4567",
    gender: "prefer-not-to-say",
    ethnicity: "prefer-not-to-say",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
  };

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
    <div className="min-h-screen">
      {/* Header with Gradient Background */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="text-left">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-3xl mb-2 text-foreground">Account Settings</h1>
            <p className="text-muted-foreground">Manage your personal information and account preferences</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-4xl">

        {saved && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-500">Settings saved successfully</span>
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6 text-left">
          <h2 className="text-foreground mb-6">Personal Information</h2>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm mb-2 text-foreground">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm mb-2 text-foreground">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm mb-2 text-foreground">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm mb-2 text-foreground">
                  Gender
                </label>
                <select
                  id="gender"
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="ethnicity" className="block text-sm mb-2 text-foreground">
                  Ethnicity
                </label>
                <select
                  id="ethnicity"
                  value={personalInfo.ethnicity}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, ethnicity: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="asian">Asian</option>
                  <option value="black">Black / African</option>
                  <option value="hispanic">Hispanic / Latino</option>
                  <option value="white">White / Caucasian</option>
                  <option value="mixed">Mixed / Multiple</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Password */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6 text-left">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-foreground">Change Password</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
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
          </div>
          <p className="text-muted-foreground text-sm mb-6">Update your password to keep your account secure</p>
          
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm mb-2 text-foreground">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm mb-2 text-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm mb-2 text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-left">
          <h2 className="text-destructive mb-2">Danger Zone</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="px-6 py-3 bg-destructive/10 border border-destructive text-destructive rounded-xl hover:bg-destructive/20 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-secondary/80">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
