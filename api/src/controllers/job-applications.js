import { fetchJobApplications } from "../models/job-applications.js";
import { Parser } from 'json2csv';
import db from "../db/db.js";

export const getJobApplications = (req, res, next) => {
    const { job_id } = req.params;
    
    fetchJobApplications(job_id)
        .then((applications) => {
            res.status(200).send({ applications });
        })
        .catch((err) => {
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

export const exportJobApplicationsCSV = async (req, res, next) => {
    const { job_id } = req.params;
    
    try {
        // Fetch job details for filename and CSV title
        const jobResult = await db.query(
            'SELECT title, company, created_at FROM jobs WHERE job_id = $1',
            [job_id]
        );
        
        const job = jobResult.rows[0];
        const jobTitle = job ? job.title : 'Job';
        const company = job ? job.company : 'Company';
        const createdAt = job ? new Date(job.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '_') : 'N/A';
        
        // Fetch applications
        const applications = await fetchJobApplications(job_id);
        
        if (applications.length === 0) {
            return res.status(404).send({ 
                message: 'No applications found for this job' 
            });
        }
        
        // Transform data for CSV
        const csvData = applications.map(app => ({
            'Jobseeker ID': app.jobseeker_id,
            'First Name': app.jobseeker.first_name || 'N/A',
            'Last Name': app.jobseeker.last_name || 'N/A',
            'Email': app.jobseeker.email || 'N/A',
            'Phone Number': app.jobseeker.phone_number || 'N/A',
            'Education Level': formatEducationLevel(app.jobseeker.education_level),
            'Institution': app.jobseeker.institution_name || 'N/A',
            'University Year': formatUniYear(app.jobseeker.uni_year),
            'Degree Type': formatDegreeType(app.jobseeker.degree_type),
            'Area of Study': app.jobseeker.area_of_study || 'N/A',
            'Subject': app.jobseeker.subject_one || 'N/A',
            'First Generation to University': formatBoolean(app.jobseeker.first_gen_to_go_uni),
            'Free School Meals Eligible': formatBoolean(app.jobseeker.school_meal_eligible),
            'Application Status': app.status || 'pending',
            'Applied At': new Date(app.applied_at).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }));
        
        // Define CSV fields
        const fields = [
            'Jobseeker ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone Number',
            'Education Level',
            'Institution',
            'University Year',
            'Degree Type',
            'Area of Study',
            'Subject',
            'First Generation to University',
            'Free School Meals Eligible',
            'Application Status',
            'Applied At'
        ];
        
        // Create CSV parser
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(csvData);
        
        // Generate filename: JobTitle_CreatedDate.csv
        const sanitizeFilename = (str) => {
            return str
                .replace(/[^a-z0-9]/gi, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '')
                .substring(0, 50);
        };
        
        const filename = `${sanitizeFilename(jobTitle)}_Applicants_${createdAt}.csv`;
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};
