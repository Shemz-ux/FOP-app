import { createSociety, fetchSocieties, fetchSocietyById, updateSociety, removeSociety, fetchSocietyNames } from "../models/societies.js";
import bcrypt from "bcrypt";
import { Parser } from 'json2csv';

export const getSocietyNames = (req, res, next) => {
    fetchSocietyNames().then((societies) => {
        res.status(200).send({societies: societies});
    }).catch((err) => {
        next(err);
    });
};

export const postSociety = async (req, res, next) => {
    try {
        const newSociety = req.body;
        
        // Validate password requirements
        if (!newSociety.password) {
            return res.status(400).json({ message: "Password is required" });
        }
        
        if (newSociety.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        
        // Hash the password
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(newSociety.password, saltRounds);
        
        // Replace password with hash
        const societyData = {
            ...newSociety,
            password_hash,
        };
        delete societyData.password; // Remove plaintext password
        
        const society = await createSociety(societyData);
        res.status(201).send({newSociety: society});
    } catch (err) {
        next(err);
    }
};

export const getSocieties = (req, res, next) => {
    fetchSocieties().then((societies) => {
        res.status(200).send({societies: societies});
    }).catch((err) => {
        next(err);
    });
};

export const getSociety = (req, res, next) => {
    const {society_id} = req.params;
    fetchSocietyById(society_id).then((society) => {
        res.status(200).send({society: society});
    }).catch((err) => {
        next(err);
    });
};

export const patchSociety = async (req, res, next) => {
    try {
        const updatedSociety = req.body;
        const {society_id} = req.params;
        
        // If password is being updated, hash it
        if (updatedSociety.password) {
            if (updatedSociety.password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            }
            
            const saltRounds = 12;
            updatedSociety.password_hash = await bcrypt.hash(updatedSociety.password, saltRounds);
            delete updatedSociety.password; // Remove plaintext password
        }
        
        const society = await updateSociety(updatedSociety, society_id);
        res.status(200).send({society: society});
    } catch (err) {
        next(err);
    }
};

export const deleteSociety = (req, res, next) => {
    const {society_id} = req.params;
    removeSociety(society_id).then((msg) => {
        res.status(200).send({msg});
    }).catch((err) => {
        next(err);
    });
};

export const exportSocietiesCSV = async (req, res, next) => {
    try {
        const societies = await fetchSocieties();
        
        if (societies.length === 0) {
            return res.status(404).send({ 
                message: 'No societies found' 
            });
        }
        
        // Transform data for CSV
        const csvData = societies.map(soc => ({
            'Society ID': soc.society_id,
            'Institution Name': soc.name || 'N/A',
            'Email': soc.email || 'N/A',
            'Description': soc.description || 'N/A',
            'Member Count': soc.member_count || 0,
            'Created At': new Date(soc.created_at).toLocaleDateString('en-GB')
        }));
        
        // Define CSV fields
        const fields = [
            'Society ID',
            'Institution Name',
            'Email',
            'Description',
            'Member Count',
            'Created At'
        ];
        
        // Create CSV parser
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(csvData);
        
        // Generate filename: Societies_List_DD_MM_YYYY.csv
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}_${String(today.getMonth() + 1).padStart(2, '0')}_${today.getFullYear()}`;
        const filename = `Societies_List_${dateStr}.csv`;
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};