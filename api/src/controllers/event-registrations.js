import { fetchEventRegistrations } from "../models/event-registrations.js";
import { Parser } from 'json2csv';
import db from "../db/db.js";

export const getEventRegistrations = (req, res, next) => {
    const { event_id } = req.params;
    
    fetchEventRegistrations(event_id)
        .then((registrations) => {
            res.status(200).send({ registrations });
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

export const exportEventRegistrationsCSV = async (req, res, next) => {
    const { event_id } = req.params;
    
    try {
        // Fetch event details for filename and CSV title
        const eventResult = await db.query(
            'SELECT title, organiser, created_at FROM events WHERE event_id = $1',
            [event_id]
        );
        
        const event = eventResult.rows[0];
        const eventTitle = event ? event.title : 'Event';
        const createdAt = event ? new Date(event.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '_') : 'N/A';
        
        // Fetch registrations
        const registrations = await fetchEventRegistrations(event_id);
        
        if (registrations.length === 0) {
            return res.status(404).send({ 
                message: 'No registrations found for this event' 
            });
        }
        
        // Transform data for CSV
        const csvData = registrations.map(reg => ({
            'Jobseeker ID': reg.jobseeker_id,
            'First Name': reg.jobseeker.first_name || 'N/A',
            'Last Name': reg.jobseeker.last_name || 'N/A',
            'Email': reg.jobseeker.email || 'N/A',
            'Phone Number': reg.jobseeker.phone_number || 'N/A',
            'Education Level': formatEducationLevel(reg.jobseeker.education_level),
            'Institution': reg.jobseeker.institution_name || 'N/A',
            'University Year': formatUniYear(reg.jobseeker.uni_year),
            'Degree Type': formatDegreeType(reg.jobseeker.degree_type),
            'Area of Study': reg.jobseeker.area_of_study || 'N/A',
            'Subject': reg.jobseeker.subject_one || 'N/A',
            'First Generation to University': formatBoolean(reg.jobseeker.first_gen_to_go_uni),
            'Free School Meals Eligible': formatBoolean(reg.jobseeker.school_meal_eligible),
            'Registration Status': reg.status || 'registered',
            'Registered At': new Date(reg.registered_at).toLocaleString('en-GB', {
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
            'Registration Status',
            'Registered At'
        ];
        
        // Create CSV parser
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(csvData);
        
        // Generate filename: EventTitle_CreatedDate.csv
        const sanitizeFilename = (str) => {
            return str
                .replace(/[^a-z0-9]/gi, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '')
                .substring(0, 50);
        };
        
        const filename = `${sanitizeFilename(eventTitle)}_Attendees_${createdAt}.csv`;
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};
