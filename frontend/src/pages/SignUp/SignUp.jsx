import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Check,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import CustomSelect from "../../components/Ui/CustomSelect";

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('select-type');
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [jobSeekerData, setJobSeekerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    ethnicity: '',
    school_meal_eligible: false,
    first_gen_to_go_uni: false,
    education_level: '',
    institution_name: '',
    uni_year: '',
    degree_type: '',
    area_of_study: '',
    role_interest_option_one: '',
    role_interest_option_two: '',
    society: '',
  });

  const [societyData, setSocietyData] = useState({
    name: '',
    university: '',
    description: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    if (type === 'jobseeker') {
      setCurrentStep('personal-details');
    } else if (type === 'society') {
      setCurrentStep('society-details');
    }
  };

  const handlePersonalDetailsNext = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (jobSeekerData.password !== jobSeekerData.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setCurrentStep('education-details');
  };

  const handleEducationDetailsNext = (e) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handleSocietySubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (societyData.password !== societyData.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    console.log('Society Registration:', societyData);
    navigate('/');
  };

  const handleFinalSubmit = () => {
    console.log('Job Seeker Registration:', jobSeekerData);
    navigate('/');
  };

  /* ---------------- RENDER SECTIONS ---------------- */

  const renderSelectType = () => (
    <div className="max-w-4xl mx-auto mt-12">
      <Link
        to="/login"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4 text-foreground">Create Your Account</h1>
        <p className="text-muted-foreground text-lg">Choose your account type to get started</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Job Seeker Card */}
        <button
          onClick={() => handleUserTypeSelect('jobseeker')}
          className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all hover:shadow-lg"
        >
          <div className="w-16 h-16 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-2xl mb-3 text-foreground">Job Seeker</h2>
          <p className="text-muted-foreground mb-4">
            Looking for opportunities? Create a profile to discover jobs, events, and resources tailored to your interests.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Browse job listings
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Attend career events
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Access learning resources
            </li>
          </ul>
        </button>

        {/* Society Card */}
        <button
          onClick={() => handleUserTypeSelect('society')}
          className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all hover:shadow-lg"
        >
          <div className="w-16 h-16 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl mb-3 text-foreground">Society</h2>
          <p className="text-muted-foreground mb-4">
            Represent your secondary school or university society. Share opportunities, forward events, and connect with students.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Share job opportunities
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Forward events
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Manage society profile
            </li>
          </ul>
        </button>
      </div>
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => setCurrentStep('select-type')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to account type
        </button>
        <h1 className="text-3xl mb-2 text-foreground">Personal Details</h1>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 text-left">
        <form onSubmit={handlePersonalDetailsNext} className="space-y-6">
          {/* Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm mb-2 text-foreground">
                First Name *
              </label>
              <input
                id="first_name"
                type="text"
                value={jobSeekerData.first_name}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, first_name: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm mb-2 text-foreground">
                Last Name *
              </label>
              <input
                id="last_name"
                type="text"
                value={jobSeekerData.last_name}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, last_name: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-foreground">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={jobSeekerData.email}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm mb-2 text-foreground">
                Phone Number *
              </label>
              <input
                id="phone_number"
                type="tel"
                value={jobSeekerData.phone_number}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, phone_number: e.target.value })}
                placeholder="+44 7XXX XXXXXX"
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-foreground">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={jobSeekerData.password}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, password: e.target.value })}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm_password" className="block text-sm mb-2 text-foreground">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={jobSeekerData.confirm_password}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, confirm_password: e.target.value })}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 pr-12 bg-input-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  passwordError ? 'border-red-500' : 'border-input'
                }`}
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
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date_of_birth" className="block text-sm mb-2 text-foreground">
                Date of Birth *
              </label>
              <input
                id="date_of_birth"
                type="date"
                value={jobSeekerData.date_of_birth}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, date_of_birth: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm mb-2 text-foreground">
                Gender *
              </label>
              <CustomSelect
                id="gender"
                value={jobSeekerData.gender}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, gender: e.target.value })}
                placeholder="Select gender"
                required
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "non_binary", label: "Non-binary" },
                  { value: "prefer_not_to_say", label: "Prefer not to say" }
                ]}
              />
            </div>
          </div>

          {/* Ethnicity */}
          <div>
            <label htmlFor="ethnicity" className="block text-sm mb-2 text-foreground">
              Ethnicity *
            </label>
            <CustomSelect
              id="ethnicity"
              value={jobSeekerData.ethnicity}
              onChange={(e) => setJobSeekerData({ ...jobSeekerData, ethnicity: e.target.value })}
              placeholder="Select ethnicity"
              required
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

          {/* Background Questions */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Background Information (Optional)</p>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="school_meal_eligible"
                checked={jobSeekerData.school_meal_eligible}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, school_meal_eligible: e.target.checked })}
                className="w-4 h-4 rounded border-input bg-input-background"
              />
              <label htmlFor="school_meal_eligible" className="text-sm text-foreground">
                I was eligible for free school meals
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="first_gen_to_go_uni"
                checked={jobSeekerData.first_gen_to_go_uni}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, first_gen_to_go_uni: e.target.checked })}
                className="w-4 h-4 rounded border-input bg-input-background"
              />
              <label htmlFor="first_gen_to_go_uni" className="text-sm text-foreground">
                I am the first generation in my family to attend university
              </label>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              Continue to Education
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEducationDetails = () => (
    <div className="max-w-3xl mx-auto text-left">
      <div className="mb-8">
        <button
          onClick={() => setCurrentStep('personal-details')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to personal details
        </button>
        <h1 className="text-3xl mb-2 text-foreground">Education & Career Interests</h1>
        <p className="text-muted-foreground">Tell us about your education and career goals</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8">
        <form onSubmit={handleEducationDetailsNext} className="space-y-6">
          {/* Education Level */}
          <div>
            <label htmlFor="education_level" className="block text-sm mb-2 text-foreground">
              Education Level *
            </label>
            <CustomSelect
              id="education_level"
              value={jobSeekerData.education_level}
              onChange={(e) => setJobSeekerData({ ...jobSeekerData, education_level: e.target.value })}
              placeholder="Select education level"
              required
              options={[
                { value: "gcse", label: "GCSE" },
                { value: "a_level", label: "A-Level" },
                { value: "btec", label: "BTEC" },
                { value: "undergraduate", label: "Undergraduate" },
                { value: "postgraduate", label: "Postgraduate" },
                { value: "doctorate", label: "Doctorate" },
              ]}
            />
          </div>

          {/* Institution Name */}
          <div>
            <label htmlFor="institution_name" className="block text-sm mb-2 text-foreground">
              Institution Name *
            </label>
            <input
              id="institution_name"
              type="text"
              value={jobSeekerData.institution_name}
              onChange={(e) => setJobSeekerData({ ...jobSeekerData, institution_name: e.target.value })}
              placeholder="e.g. University of London - King's College"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* University Year and Degree Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="uni_year" className="block text-sm mb-2 text-foreground">
                Year of Study *
              </label>
              <CustomSelect
                id="uni_year"
                value={jobSeekerData.uni_year}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, uni_year: e.target.value })}
                placeholder="Select year"
                required
                options={[
                  { value: "1st", label: "1st Year" },
                  { value: "2nd", label: "2nd Year" },
                  { value: "3rd", label: "3rd Year" },
                  { value: "4th", label: "4th Year" },
                  { value: "final", label: "Final Year" }
                ]}
              />
            </div>
            <div>
              <label htmlFor="degree_type" className="block text-sm mb-2 text-foreground">
                Degree Type *
              </label>
              <CustomSelect
                id="degree_type"
                value={jobSeekerData.degree_type}
                onChange={(e) => setJobSeekerData({ ...jobSeekerData, degree_type: e.target.value })}
                placeholder="Select degree type"
                required
                options={[
                  { value: "bsc", label: "BSc" },
                  { value: "ba", label: "BA" },
                  { value: "beng", label: "BEng" },
                  { value: "msc", label: "MSc" },
                  { value: "ma", label: "MA" },
                  { value: "meng", label: "MEng" },
                  { value: "phd", label: "PhD" }
                ]}
              />
            </div>
          </div>

          {/* Area of Study */}
          <div>
            <label htmlFor="area_of_study" className="block text-sm mb-2 text-foreground">
              Area of Study *
            </label>
            <input
              id="area_of_study"
              type="text"
              value={jobSeekerData.area_of_study}
              onChange={(e) => setJobSeekerData({ ...jobSeekerData, area_of_study: e.target.value })}
              placeholder="e.g. Computer Science"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Career Interests */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm mb-4 text-muted-foreground">Career Interests</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="role_interest_option_one" className="block text-sm mb-2 text-foreground">
                  Primary Role Interest *
                </label>
                <input
                  id="role_interest_option_one"
                  type="text"
                  value={jobSeekerData.role_interest_option_one}
                  onChange={(e) => setJobSeekerData({ ...jobSeekerData, role_interest_option_one: e.target.value })}
                  placeholder="e.g. Software Developer"
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="role_interest_option_two" className="block text-sm mb-2 text-foreground">
                  Secondary Role Interest
                </label>
                <input
                  id="role_interest_option_two"
                  type="text"
                  value={jobSeekerData.role_interest_option_two}
                  onChange={(e) => setJobSeekerData({ ...jobSeekerData, role_interest_option_two: e.target.value })}
                  placeholder="e.g. Data Scientist"
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Society Membership */}
          <div>
            <label htmlFor="society" className="block text-sm mb-2 text-foreground">
              Society Membership
            </label>
            <input
              id="society"
              type="text"
              value={jobSeekerData.society}
              onChange={(e) => setJobSeekerData({ ...jobSeekerData, society: e.target.value })}
              placeholder="e.g. Tech Society"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              Review & Submit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSocietyDetails = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => setCurrentStep('select-type')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to account type
        </button>
        <h1 className="text-3xl mb-2 text-foreground">Society Details</h1>
        <p className="text-muted-foreground">Tell us about your society</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 text-left">
        <form onSubmit={handleSocietySubmit} className="space-y-6">
          {/* Society Name */}
          <div>
            <label htmlFor="society_name" className="block text-sm mb-2 text-foreground">
              Society Name *
            </label>
            <input
              id="society_name"
              type="text"
              value={societyData.name}
              onChange={(e) => setSocietyData({ ...societyData, name: e.target.value })}
              placeholder="e.g. Tech Society"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* University */}
          <div>
            <label htmlFor="university" className="block text-sm mb-2 text-foreground">
              University *
            </label>
            <input
              id="university"
              type="text"
              value={societyData.university}
              onChange={(e) => setSocietyData({ ...societyData, university: e.target.value })}
              placeholder="e.g. University of London - King's College"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm mb-2 text-foreground">
              Society Description *
            </label>
            <textarea
              id="description"
              value={societyData.description}
              onChange={(e) => setSocietyData({ ...societyData, description: e.target.value })}
              placeholder="Tell us about your society, its mission, and activities..."
              rows={5}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="society_email" className="block text-sm mb-2 text-foreground">
              Society Email *
            </label>
            <input
              id="society_email"
              type="email"
              value={societyData.email}
              onChange={(e) => setSocietyData({ ...societyData, email: e.target.value })}
              placeholder="society@university.ac.uk"
              className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="society_password" className="block text-sm mb-2 text-foreground">
              Password *
            </label>
            <div className="relative">
              <input
                id="society_password"
                type={showPassword ? 'text' : 'password'}
                value={societyData.password}
                onChange={(e) => setSocietyData({ ...societyData, password: e.target.value })}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 pr-12 bg-input-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="society_confirm_password" className="block text-sm mb-2 text-foreground">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="society_confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={societyData.confirm_password}
                onChange={(e) => setSocietyData({ ...societyData, confirm_password: e.target.value })}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 pr-12 bg-input-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  passwordError ? 'border-red-500' : 'border-input'
                }`}
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
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Create Society Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => setCurrentStep('education-details')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to education details
        </button>
        <h1 className="text-3xl mb-2 text-foreground">Review Your Information</h1>
        <p className="text-muted-foreground">Please review your details before submitting</p>
      </div>

      <div className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-card border border-border rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-foreground">Personal Details</h2>
            <button
              onClick={() => setCurrentStep('personal-details')}
              className="flex items-center gap-2 text-primary hover:opacity-80"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Name</p>
              <p className="text-foreground">{jobSeekerData.first_name} {jobSeekerData.last_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Email</p>
              <p className="text-foreground">{jobSeekerData.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Phone Number</p>
              <p className="text-foreground">{jobSeekerData.phone_number}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Date of Birth</p>
              <p className="text-foreground">{jobSeekerData.date_of_birth}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Gender</p>
              <p className="text-foreground capitalize">{jobSeekerData.gender.replace(/-/g, ' ')}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Ethnicity</p>
              <p className="text-foreground">{jobSeekerData.ethnicity}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-1">Background</p>
              <div className="flex flex-wrap gap-2">
                {jobSeekerData.school_meal_eligible && (
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                    Free school meals eligible
                  </span>
                )}
                {jobSeekerData.first_gen_to_go_uni && (
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                    First generation university student
                  </span>
                )}
                {!jobSeekerData.school_meal_eligible && !jobSeekerData.first_gen_to_go_uni && (
                  <span className="text-foreground">Not specified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Education Details Section */}
        <div className="bg-card border border-border rounded-2xl p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-foreground">Education & Career</h2>
            <button
              onClick={() => setCurrentStep('education-details')}
              className="flex items-center gap-2 text-primary hover:opacity-80"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Education Level</p>
              <p className="text-foreground capitalize">{jobSeekerData.education_level}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Institution</p>
              <p className="text-foreground">{jobSeekerData.institution_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Year of Study</p>
              <p className="text-foreground">{jobSeekerData.uni_year} Year</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Degree Type</p>
              <p className="text-foreground uppercase">{jobSeekerData.degree_type}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground mb-1">Area of Study</p>
              <p className="text-foreground">{jobSeekerData.area_of_study}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Primary Role Interest</p>
              <p className="text-foreground">{jobSeekerData.role_interest_option_one}</p>
            </div>
            {jobSeekerData.role_interest_option_two && (
              <div>
                <p className="text-muted-foreground mb-1">Secondary Role Interest</p>
                <p className="text-foreground">{jobSeekerData.role_interest_option_two}</p>
              </div>
            )}
            {jobSeekerData.society && (
              <div className="md:col-span-2">
                <p className="text-muted-foreground mb-1">Society Membership</p>
                <p className="text-foreground">{jobSeekerData.society}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-card border border-border rounded-2xl p-6 text-left">
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="terms_review"
              className="mt-1 w-4 h-4 rounded border-input bg-input-background"
              required
            />
            <label htmlFor="terms_review" className="text-sm text-foreground">
              I confirm that all information provided is accurate and I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          <button
            onClick={handleFinalSubmit}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            <Check className="w-5 h-5" />
            Create My Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-6">
      {currentStep === 'select-type' && renderSelectType()}
      {currentStep === 'personal-details' && renderPersonalDetails()}
      {currentStep === 'education-details' && renderEducationDetails()}
      {currentStep === 'society-details' && renderSocietyDetails()}
      {currentStep === 'review' && renderReview()}
    </div>
  );
}