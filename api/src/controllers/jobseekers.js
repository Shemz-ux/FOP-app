import { createJobseeker, fetchJobseekerById, fetchJobseekers, removeJobseeker, updateJobseeker } from "../models/jobseekers.js";
import { incrementSocietyMemberCount } from "../models/societies.js";
import bcrypt from "bcrypt";
import { Parser } from 'json2csv';

export const postJobseeker = async (req, res, next) => {
    try {
        const newJobseeker = req.body;
        
        // Log registration attempt (exclude sensitive data)
        console.log('📝 Jobseeker registration attempt:', {
            email: newJobseeker.email,
            education_level: newJobseeker.education_level,
            has_institution: !!newJobseeker.institution_name,
            has_uni_year: !!newJobseeker.uni_year,
            has_degree_type: !!newJobseeker.degree_type,
            has_area_of_study: !!newJobseeker.area_of_study,
            has_subject_one: !!newJobseeker.subject_one,
            has_society: !!newJobseeker.society,
            has_phone: !!newJobseeker.phone_number,
            has_dob: !!newJobseeker.date_of_birth,
            cv_uploaded: !!newJobseeker.cv_storage_key,
            cv_file_name: newJobseeker.cv_file_name || 'none',
            cv_file_size: newJobseeker.cv_file_size || 'none',
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress
        });
        
        // Validate password requirements
        if (!newJobseeker.password) {
            console.log('❌ Registration failed: Password missing');
            return res.status(400).json({ message: "Password is required" });
        }
        
        if (newJobseeker.password.length < 8) {
            console.log('❌ Registration failed: Password too short');
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        
        // Validate date of birth is not in the future
        if (newJobseeker.date_of_birth) {
            const dob = new Date(newJobseeker.date_of_birth);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
            
            if (dob >= today) {
                console.log('❌ Registration failed: Date of birth in future', { dob: newJobseeker.date_of_birth });
                return res.status(400).json({ message: "Date of birth cannot be in the future" });
            }
        }
        
        // Hash the password
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(newJobseeker.password, saltRounds);
        
        // Replace password with hash
        const jobseekerData = {
            ...newJobseeker,
            password_hash,
        };
        delete jobseekerData.password; // Remove plaintext password
        
        const jobseeker = await createJobseeker(jobseekerData);
        
        console.log('✅ Jobseeker registered successfully:', {
            jobseeker_id: jobseeker.jobseeker_id,
            email: jobseeker.email,
            education_level: jobseeker.education_level
        });
        
        // Increment society member count if society is selected
        if (jobseeker.society && jobseeker.society !== 'None') {
            await incrementSocietyMemberCount(jobseeker.society);
        }
        
        res.status(201).send({newJobseeker: jobseeker});
    } catch (err) {
        console.error('❌ Jobseeker registration error:', {
            message: err.message,
            code: err.code,
            constraint: err.constraint,
            detail: err.detail,
            email: req.body.email,
            education_level: req.body.education_level
        });
        next(err);
    }
};

export const getJobseekers = (req, res, next) => {
    fetchJobseekers().then((jobseekers) => {
        res.status(200).send({jobseekers: jobseekers});
    }).catch((err) => {
        next(err);
    });
};

export const getJobseeker = (req, res, next) => {
    const {jobseeker_id} = req.params;
    fetchJobseekerById(jobseeker_id).then((jobseeker) => {
        res.status(200).send({jobseeker: jobseeker});
    }).catch((err) => {
        next(err);
    });
};

export const patchJobseeker = async (req, res, next) => {
    try {
        const updatedJobseeker = req.body;
        const {jobseeker_id} = req.params;
        
        // If password is being updated, hash it
        if (updatedJobseeker.password) {
            if (updatedJobseeker.password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            
            const saltRounds = 12;
            updatedJobseeker.password_hash = await bcrypt.hash(updatedJobseeker.password, saltRounds);
            delete updatedJobseeker.password; // Remove plaintext password
        }
        
        const jobseeker = await updateJobseeker(updatedJobseeker, jobseeker_id);
        res.status(200).send({jobseeker: jobseeker});
    } catch (err) {
        next(err);
    }
};

export const deleteJobseeker = (req, res, next) => {
    const {jobseeker_id} = req.params;
    removeJobseeker(jobseeker_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};

const formatEducationLevel = (level) => {
    const educationLevelMap = {
        'gcse': 'GCSE',
        'a_level': 'A-Level',
        'btec': 'BTEC',
        'undergraduate': 'Undergraduate',
        'postgraduate': 'Postgraduate',
        'phd': 'PhD',
        'other': 'Other'
    };
    return educationLevelMap[level] || level || 'N/A';
};

const formatUniYear = (year) => {
    const yearMap = {
        'foundation': 'Foundation',
        '1st': '1st Year',
        '2nd': '2nd Year',
        '3rd': '3rd Year',
        '4th': '4th Year',
        '5th': '5th Year',
        'masters': 'Masters',
        'phd_year_1': 'PhD Year 1',
        'phd_year_2': 'PhD Year 2',
        'phd_year_3': 'PhD Year 3',
        'phd_year_4': 'PhD Year 4',
        'graduated': 'Graduated'
    };
    return yearMap[year] || year || 'N/A';
};

const formatDegreeType = (degree) => {
    if (!degree) return 'N/A';
    return degree.toUpperCase();
};

const formatBoolean = (value) => {
    if (value === null || value === undefined) return 'Not Specified';
    return value ? 'Yes' : 'No';
};

const formatGender = (gender) => {
    const genderMap = {
        'male': 'Male',
        'female': 'Female',
        'non_binary': 'Non-Binary',
        'prefer_not_to_say': 'Prefer Not to Say',
        'other': 'Other'
    };
    return genderMap[gender] || gender || 'N/A';
};

export const exportJobseekersCSV = async (req, res, next) => {
    try {
        const jobseekers = await fetchJobseekers();
        
        if (jobseekers.length === 0) {
            return res.status(404).send({ 
                message: 'No jobseekers found' 
            });
        }
        
        // Transform data for CSV
        const csvData = jobseekers.map(js => ({
            'Jobseeker ID': js.jobseeker_id,
            'First Name': js.first_name || 'N/A',
            'Last Name': js.last_name || 'N/A',
            'Email': js.email || 'N/A',
            'Phone Number': js.phone_number || 'N/A',
            'Date of Birth': js.date_of_birth ? new Date(js.date_of_birth).toLocaleDateString('en-GB') : 'N/A',
            'Gender': formatGender(js.gender),
            'Ethnicity': js.ethnicity || 'N/A',
            'Education Level': formatEducationLevel(js.education_level),
            'Institution': js.institution_name || 'N/A',
            'University Year': formatUniYear(js.uni_year),
            'Degree Type': formatDegreeType(js.degree_type),
            'Area of Study': js.area_of_study || 'N/A',
            'Subjects': js.subject_one || 'N/A',
            'Society': js.society || 'None',
            'First Generation to University': formatBoolean(js.first_gen_to_go_uni),
            'Free School Meals Eligible': formatBoolean(js.school_meal_eligible),
            'Role Interest 1': js.role_interest_option_one || 'N/A',
            'Role Interest 2': js.role_interest_option_two || 'N/A',
            'Created At': new Date(js.created_at).toLocaleDateString('en-GB')
        }));
        
        // Define CSV fields
        const fields = [
            'Jobseeker ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone Number',
            'Date of Birth',
            'Gender',
            'Ethnicity',
            'Education Level',
            'Institution',
            'University Year',
            'Degree Type',
            'Area of Study',
            'Subjects',
            'Society',
            'First Generation to University',
            'Free School Meals Eligible',
            'Role Interest 1',
            'Role Interest 2',
            'Created At'
        ];
        
        // Create CSV parser
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(csvData);
        
        // Generate filename: Jobseekers_List_DD_MM_YYYY.csv
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}_${String(today.getMonth() + 1).padStart(2, '0')}_${today.getFullYear()}`;
        const filename = `Jobseekers_List_${dateStr}.csv`;
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};
