// Combines the up-to-four subject columns (GCSE/A-Level/BTEC students) into one
// comma-separated value, e.g. "Maths, Physics, Chemistry, Further Maths".
// Filters out the 'N/A' placeholder some jobseekers have when no subjects were collected.
export const formatSubjects = (subjectOne, subjectTwo, subjectThree, subjectFour) => {
    const subjects = [subjectOne, subjectTwo, subjectThree, subjectFour].filter(s => s && s !== 'N/A');
    return subjects.length > 0 ? subjects.join(', ') : 'N/A';
};
