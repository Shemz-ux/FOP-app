import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Trash2, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { profileService } from "../../services";
import CustomSelect from "../../components/Ui/CustomSelect";
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
import ForgotPassword from "../../components/ui/ForgotPassword";

export default function Settings() {
  const { user, isJobseeker } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    ethnicity: "",
    school_meal_eligible: false,
    first_gen_to_go_uni: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const profile = await profileService.getUserProfile(user.userId, user.userType);
        
        if (isJobseeker() && profile.jobseeker) {
          setPersonalInfo({
            firstName: profile.jobseeker.first_name ?? "",
            lastName: profile.jobseeker.last_name ?? "",
            email: profile.jobseeker.email ?? "",
            phone: profile.jobseeker.phone_number ?? "",
            gender: profile.jobseeker.gender ?? "",
            ethnicity: profile.jobseeker.ethnicity ?? "",
            school_meal_eligible: profile.jobseeker.school_meal_eligible ?? false,
            first_gen_to_go_uni: profile.jobseeker.first_gen_to_go_uni ?? false,
          });
        } else if (profile.society) {
          setPersonalInfo({
            firstName: profile.society.name ?? profile.society.society_name ?? "",
            lastName: "",
            email: profile.society.email ?? "",
            phone: profile.society.phone_number ?? "",
            gender: "",
            ethnicity: "",
            school_meal_eligible: false,
            first_gen_to_go_uni: false,
          });
        } else if (profile.admin_user) {
          setPersonalInfo({
            firstName: profile.admin_user.first_name ?? "",
            lastName: profile.admin_user.last_name ?? "",
            email: profile.admin_user.email ?? "",
            phone: profile.admin_user.phone_number ?? "",
            gender: profile.admin_user.gender ?? "",
            ethnicity: profile.admin_user.ethnicity ?? "",
            school_meal_eligible: false,
            first_gen_to_go_uni: false,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, isJobseeker]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        email: personalInfo.email,
        phone_number: personalInfo.phone,
      };
      
      if (user.userType === 'society') {
        updateData.name = personalInfo.firstName;
      } else {
        updateData.first_name = personalInfo.firstName;
        updateData.last_name = personalInfo.lastName;
        updateData.gender = personalInfo.gender;
        updateData.ethnicity = personalInfo.ethnicity;
      }
      
      if (isJobseeker()) {
        updateData.school_meal_eligible = personalInfo.school_meal_eligible;
        updateData.first_gen_to_go_uni = personalInfo.first_gen_to_go_uni;
      }
      
      await profileService.updateUserProfile(user.userId, user.userType, updateData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

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
            {user.userType === 'society' ? (
              <div>
                <label htmlFor="firstName" className="block text-sm mb-2 text-foreground">
                  Society Name
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
            ) : (
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
            )}

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

            {user.userType !== 'society' && (
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
            )}

            {user.userType !== 'society' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm mb-2 text-foreground">
                    Gender
                  </label>
                  <CustomSelect
                    id="gender"
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    placeholder="Select gender"
                    options={[
                      { value: "prefer_not_to_say", label: "Prefer not to say" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "non_binary", label: "Non-binary" },
                      { value: "other", label: "Other" }
                    ]}
                  />
                </div>

                <div>
                  <label htmlFor="ethnicity" className="block text-sm mb-2 text-foreground">
                    Ethnicity
                  </label>
                  <CustomSelect
                    id="ethnicity"
                    value={personalInfo.ethnicity}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, ethnicity: e.target.value })}
                    placeholder="Select ethnicity"
                    options={[
                        { value: "White British", label: "White British" },
                        { value: "White Irish", label: "White Irish" },
                        { value: "White Other", label: "White Other" },
                        { value: "Mixed White and Black Caribbean", label: "Mixed White and Black Caribbean" },
                        { value: "Mixed White and Black African", label: "Mixed White and Black African" },
                        { value: "Mixed White and Asian", label: "Mixed White and Asian" },
                        { value: "Mixed Other", label: "Mixed Other" },
                        { value: "Asian or Asian British Indian", label: "Asian or Asian British Indian" },
                        { value: "Asian or Asian British Pakistani", label: "Asian or Asian British Pakistani" },
                        { value: "Asian or Asian British Bangladeshi", label: "Asian or Asian British Bangladeshi" },
                        { value: "Asian Other", label: "Asian Other" },
                        { value: "Black or Black British Caribbean", label: "Black or Black British Caribbean" },
                        { value: "Black or Black British African", label: "Black or Black British African" },
                        { value: "Black Other", label: "Black Other" },
                        { value: "Chinese", label: "Chinese" },
                        { value: "Other", label: "Other" },
                        { value: "Prefer not to say", label: "Prefer not to say" }
                    ]}
                  />
                </div>
              </div>
            )}

            {isJobseeker() && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">Background Information</h3>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="school_meal_eligible"
                    checked={personalInfo.school_meal_eligible}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, school_meal_eligible: e.target.checked })}
                    className="w-4 h-4 rounded border-input bg-input-background cursor-pointer"
                  />
                  <label htmlFor="school_meal_eligible" className="text-sm text-foreground cursor-pointer">
                    I was eligible for free school meals
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="first_gen_to_go_uni"
                    checked={personalInfo.first_gen_to_go_uni}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, first_gen_to_go_uni: e.target.checked })}
                    className="w-4 h-4 rounded border-input bg-input-background cursor-pointer"
                  />
                  <label htmlFor="first_gen_to_go_uni" className="text-sm text-foreground cursor-pointer">
                    I am the first generation in my family to attend university
                  </label>
                </div>
              </div>
            )}

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
            <ForgotPassword
              trigger={
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              }
            />
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
