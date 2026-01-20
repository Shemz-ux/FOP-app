import { 
    fetchJobApplicationStats, 
    fetchJobApplicationsByJobId,
    fetchEventApplicationStats,
    fetchEventApplicationsByEventId,
    fetchStudentsByGender,
    fetchStudentsByUniversity,
    fetchStudentsBySociety,
    fetchStudentsEligibleForFreeMeals,
    fetchFirstGenStudents,
    fetchStudentsByEducationStatus,
    fetchUserByName,
    fetchAnalyticsSummary
} from "../models/admin-analytics.js";

// Job application analytics
export const getJobApplicationStats = (req, res, next) => {
    fetchJobApplicationStats().then((stats) => {
        res.status(200).send({ job_application_stats: stats });
    }).catch((err) => {
        next(err);
    });
};

export const getJobApplicationsByJobId = (req, res, next) => {
    const { job_id } = req.params;
    fetchJobApplicationsByJobId(job_id).then((applications) => {
        res.status(200).send({ job_applications: applications });
    }).catch((err) => {
        next(err);
    });
};

// Event application analytics
export const getEventApplicationStats = (req, res, next) => {
    fetchEventApplicationStats().then((stats) => {
        res.status(200).send({ event_application_stats: stats });
    }).catch((err) => {
        next(err);
    });
};

export const getEventApplicationsByEventId = (req, res, next) => {
    const { event_id } = req.params;
    fetchEventApplicationsByEventId(event_id).then((applications) => {
        res.status(200).send({ event_applications: applications });
    }).catch((err) => {
        next(err);
    });
};

// Student filtering endpoints
export const getStudentsByGender = (req, res, next) => {
    const { gender } = req.params;
    const validGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    
    if (!validGenders.includes(gender)) {
        return res.status(400).send({ msg: 'Invalid gender parameter' });
    }
    
    fetchStudentsByGender(gender).then((students) => {
        res.status(200).send({ students, count: students.length });
    }).catch((err) => {
        next(err);
    });
};

export const getStudentsByUniversity = (req, res, next) => {
    const { university } = req.params;
    
    if (!university || university.trim() === '') {
        return res.status(400).send({ msg: 'University parameter is required' });
    }
    
    fetchStudentsByUniversity(university).then((students) => {
        res.status(200).send({ students, count: students.length });
    }).catch((err) => {
        next(err);
    });
};

export const getStudentsBySociety = (req, res, next) => {
    const { society } = req.params;
    
    if (!society || society.trim() === '') {
        return res.status(400).send({ msg: 'Society parameter is required' });
    }
    
    fetchStudentsBySociety(society).then((students) => {
        res.status(200).send({ students, count: students.length });
    }).catch((err) => {
        next(err);
    });
};

export const getStudentsEligibleForFreeMeals = (req, res, next) => {
    fetchStudentsEligibleForFreeMeals().then((students) => {
        res.status(200).send({ students, count: students.length });
    }).catch((err) => {
        next(err);
    });
};

export const getFirstGenStudents = (req, res, next) => {
    fetchFirstGenStudents().then((students) => {
        res.status(200).send({ students, count: students.length });
    }).catch((err) => {
        next(err);
    });
};

export const getStudentsByEducationStatus = (req, res, next) => {
    const { education_level } = req.params;
    const validLevels = ['gcse', 'a_level', 'btec', 'undergraduate', 'postgraduate', 'phd', 'other'];
    
    if (!validLevels.includes(education_level)) {
        return res.status(400).send({ msg: 'Invalid education level parameter' });
    }
    
    fetchStudentsByEducationStatus(education_level).then((students) => {
        res.status(200).send({ students, count: students.length });
    }).catch((err) => {
        next(err);
    });
};

export const getUserByName = (req, res, next) => {
    const { name } = req.params;
    
    if (!name || name.trim() === '') {
        return res.status(400).send({ msg: 'Name parameter is required' });
    }
    
    fetchUserByName(name).then((users) => {
        res.status(200).send({ users, count: users.length });
    }).catch((err) => {
        next(err);
    });
};

// Summary analytics
export const getAnalyticsSummary = (req, res, next) => {
    fetchAnalyticsSummary().then((summary) => {
        res.status(200).send({ analytics_summary: summary });
    }).catch((err) => {
        next(err);
    });
};
