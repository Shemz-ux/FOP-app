// import mailchimp from '@mailchimp/mailchimp_marketing';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure Mailchimp
// mailchimp.setConfig({
//     apiKey: process.env.MAILCHIMP_API_KEY,
//     server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., 'us1', 'us2', etc.
// });

// // Function to ensure merge fields exist
// const ensureMergeFields = async () => {
//     try {
//         const requiredFields = [
//             { tag: 'PHONE', name: 'Phone Number', type: 'phone' },
//             { tag: 'INDUSTRY', name: 'Industry', type: 'text' },
//             { tag: 'MESSAGE', name: 'Message', type: 'text' }
//         ];

//         for (const field of requiredFields) {
//             try {
//                 await mailchimp.lists.addListMergeField(process.env.MAILCHIMP_AUDIENCE_ID, {
//                     tag: field.tag,
//                     name: field.name,
//                     type: field.type
//                 });
//                 console.log(`Created merge field: ${field.tag}`);
//             } catch (error) {
                
//                 if (error.status !== 400) {
//                     console.log(`Merge field ${field.tag} might already exist or error:`, error.title);
//                 }
//             }
//         }
//     } catch (error) {
//         console.log('Error ensuring merge fields:', error.message);
//     }
// };

// export const addUserToMailchimp = async (userData) => {
//     try {
//         const { firstName, lastName, email, number, industry, message } = userData;
        
//         await ensureMergeFields();
        
//         const subscriberData = {
//             email_address: email,
//             status: 'subscribed',
//             merge_fields: {
//                 FNAME: firstName,
//                 LNAME: lastName,
//                 PHONE: number || '',
//                 INDUSTRY: industry || '',
//                 MESSAGE: message || ''
//             }
//         };

//         const response = await mailchimp.lists.addListMember(
//             process.env.MAILCHIMP_AUDIENCE_ID,
//             subscriberData
//         );

//         console.log('User successfully added to Mailchimp:', response.email_address);
//         return { success: true, data: response };
        
//     } catch (error) {
//         // console.error('Mailchimp API Error:', error.response?.body || error.message);
        
//         // Check for specific validation errors
//         if (error.status === 400) {
//             const errorBody = error.response?.body;
//             if (errorBody?.title === 'Invalid Resource') {
//                 return { 
//                     success: false, 
//                     error: 'Invalid email address provided. Please check the email format.',
//                     details: errorBody.detail 
//                 };
//             }
//             if (errorBody?.title === 'Member Exists') {
//                 return { 
//                     success: false, 
//                     error: 'This email is already subscribed to the mailing list.',
//                     details: errorBody.detail 
//                 };
//             }
//         }
        
//         // Generic error for other issues
//         return { 
//             success: false, 
//             error: 'Failed to subscribe to mailing list. Please try again.',
//             details: error.message 
//         };
//     }
// };

// export const updateMailchimpSubscriber = async (email, userData) => {
//     try {
//         const { firstName, lastName, number, industry, message } = userData;
        
//         const updateData = {
//             merge_fields: {
//                 FNAME: firstName,
//                 LNAME: lastName,
//                 PHONE: number || '',
//                 INDUSTRY: industry || '',
//                 MESSAGE: message || ''
//             }
//         };

//         const response = await mailchimp.lists.updateListMember(
//             process.env.MAILCHIMP_AUDIENCE_ID,
//             email,
//             updateData
//         );

//         console.log('Mailchimp subscriber updated:', response.email_address);
//         return response;
        
//     } catch (error) {
//         console.error('Mailchimp Update Error:', error.response?.body || error.message);
//         return null;
//     }
// };
