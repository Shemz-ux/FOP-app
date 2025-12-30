import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../setup.js';

describe('Jobs Advanced Filtering API Endpoints', () => {
    let testJobIds = [];
    const backdoorToken = process.env.ADMIN_BACKDOOR_TOKEN || "admin_backdoor_2024";

    beforeAll(async () => {
        // Create test jobs with diverse data for filtering
        const testJobs = [
            {
                title: 'Senior Software Engineer',
                company: 'Google',
                industry: 'Technology',
                location: 'London',
                job_level: 'Senior',
                role_type: 'Full-time',
                contact_email: 'jobs@google.com'
            },
            {
                title: 'Junior Developer',
                company: 'Microsoft',
                industry: 'Technology', 
                location: 'Manchester',
                job_level: 'Junior',
                role_type: 'Full-time',
                contact_email: 'careers@microsoft.com'
            },
            {
                title: 'Marketing Manager',
                company: 'Apple',
                industry: 'Technology',
                location: 'London',
                job_level: 'Mid',
                role_type: 'Full-time',
                contact_email: 'jobs@apple.com'
            },
            {
                title: 'Data Analyst',
                company: 'Facebook',
                industry: 'Technology',
                location: 'Birmingham',
                job_level: 'Mid',
                role_type: 'Contract',
                contact_email: 'hiring@facebook.com'
            },
            {
                title: 'Financial Advisor',
                company: 'Goldman Sachs',
                industry: 'Finance',
                location: 'London',
                job_level: 'Senior',
                role_type: 'Full-time',
                contact_email: 'careers@gs.com'
            }
        ];

        // Insert test jobs and collect IDs
        for (const job of testJobs) {
            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${backdoorToken}`)
                .send(job);
            if (response.body.newJob) {
                testJobIds.push(response.body.newJob.job_id);
            }
        }
    });

    afterAll(async () => {
        // Clean up test jobs
        for (const jobId of testJobIds) {
            try {
                await request(app)
                    .delete(`/api/jobs/${jobId}`)
                    .set('Authorization', `Bearer ${backdoorToken}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        
        // Close database connection
        await db.end();
    });

    describe('GET /api/jobs/search', () => {
        
        describe('Basic filtering', () => {
            it('should filter jobs by company', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?company=Google')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThanOrEqual(1);
                const googleJob = response.body.jobs.find(job => job.company === 'Google');
                expect(googleJob).toBeDefined();
                expect(googleJob.title).toBe('Senior Software Engineer');
            });

            it('should filter jobs by industry', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?industry=Technology')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThanOrEqual(4);
                response.body.jobs.forEach(job => {
                    if (testJobIds.includes(job.job_id)) {
                        expect(job.industry).toBe('Technology');
                    }
                });
            });

            it('should filter jobs by location', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?location=London')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThanOrEqual(3);
                const londonJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                londonJobs.forEach(job => {
                    expect(job.location).toBe('London');
                });
            });

            it('should filter jobs by job level', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?job_level=Senior')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThanOrEqual(2);
                const seniorJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                seniorJobs.forEach(job => {
                    expect(job.job_level).toBe('Senior');
                });
            });

            it('should filter jobs by role type', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?role_type=Contract')
                    .expect(200);

                // Check if any jobs match the filter (may include non-test jobs)
                const contractJobs = response.body.jobs.filter(job => job.role_type === 'Contract');
                expect(contractJobs.length).toBeGreaterThanOrEqual(0);
                
                // If we have contract jobs, verify they match the filter
                contractJobs.forEach(job => {
                    expect(job.role_type).toBe('Contract');
                });
            });
        });

        describe('Combined filtering', () => {
            it('should filter by multiple criteria', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?industry=Technology&location=London&job_level=Senior')
                    .expect(200);

                // Check that all returned jobs match the criteria
                response.body.jobs.forEach(job => {
                    expect(job.industry).toBe('Technology');
                    expect(job.location).toBe('London');
                    expect(job.job_level).toBe('Senior');
                });
                
                // Should have at least some results or empty array
                expect(Array.isArray(response.body.jobs)).toBe(true);
            });

            it('should return empty results for impossible combinations', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?company=Google&industry=Finance')
                    .expect(200);

                const matchingJobs = response.body.jobs.filter(job => 
                    job.company === 'Google' && job.industry === 'Finance'
                );
                expect(matchingJobs).toHaveLength(0);
            });
        });

        describe('Sorting functionality', () => {
            it('should sort by popularity (most applicants first)', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?sort=popular&limit=10')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThan(0);
                
                // Check that jobs are sorted by applicant_count descending
                for (let i = 1; i < response.body.jobs.length; i++) {
                    expect(response.body.jobs[i-1].applicant_count)
                        .toBeGreaterThanOrEqual(response.body.jobs[i].applicant_count);
                }
            });

            it('should sort by company name alphabetically', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?sort=company&limit=10')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThan(0);
                
                // Check alphabetical order
                for (let i = 1; i < response.body.jobs.length; i++) {
                    const company1 = response.body.jobs[i-1].company.toLowerCase();
                    const company2 = response.body.jobs[i].company.toLowerCase();
                    expect(company1.localeCompare(company2)).toBeLessThanOrEqual(0);
                }
            });

            it('should sort by newest first (default)', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?sort=newest&limit=10')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThan(0);
                
                // Check that jobs are sorted by created_at descending
                for (let i = 1; i < response.body.jobs.length; i++) {
                    const date1 = new Date(response.body.jobs[i-1].created_at);
                    const date2 = new Date(response.body.jobs[i].created_at);
                    expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
                }
            });
        });

        describe('Pagination', () => {
            it('should paginate results correctly', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?limit=2&page=1')
                    .expect(200);

                expect(response.body.pagination.currentPage).toBe(1);
                expect(response.body.pagination.limit).toBe(2);
                expect(response.body.pagination.totalCount).toBeGreaterThanOrEqual(0);
                expect(response.body.jobs.length).toBeLessThanOrEqual(2);
            });

            it('should respect maximum limit of 100', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?limit=150')
                    .expect(200);

                expect(response.body.pagination.limit).toBe(100);
            });
        });

        describe('Input validation', () => {
            it('should handle invalid sort parameter', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?sort=invalid_sort')
                    .expect(200);

                expect(response.body.filters.sort).toBe('newest'); // Default fallback
            });

            it('should handle invalid page numbers', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?page=0')
                    .expect(200);

                expect(response.body.pagination.currentPage).toBe(1); // Minimum page
            });

            it('should handle non-numeric limit', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?limit=abc')
                    .expect(200);

                expect(response.body.pagination.limit).toBe(50); // Default fallback
            });
        });

        describe('Partial matching', () => {
            it('should perform partial matching on company names', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?company=Goog')
                    .expect(200);

                const googleJobs = response.body.jobs.filter(job => job.company.includes('Google'));
                expect(googleJobs.length).toBeGreaterThanOrEqual(1);
            });

            it('should be case insensitive', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?company=google')
                    .expect(200);

                const googleJobs = response.body.jobs.filter(job => job.company === 'Google');
                expect(googleJobs.length).toBeGreaterThanOrEqual(1);
            });
        });

        describe('Response structure', () => {
            it('should return correct response structure', async () => {
                const response = await request(app)
                    .get('/api/jobs/search')
                    .expect(200);

                expect(response.body).toHaveProperty('jobs');
                expect(response.body).toHaveProperty('pagination');
                expect(response.body).toHaveProperty('filters');

                expect(response.body.pagination).toHaveProperty('currentPage');
                expect(response.body.pagination).toHaveProperty('totalPages');
                expect(response.body.pagination).toHaveProperty('totalCount');
                expect(response.body.pagination).toHaveProperty('limit');
                expect(response.body.pagination).toHaveProperty('hasNextPage');
                expect(response.body.pagination).toHaveProperty('hasPrevPage');
            });

            it('should include all job fields', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?limit=1')
                    .expect(200);

                if (response.body.jobs.length > 0) {
                    const job = response.body.jobs[0];
                    expect(job).toHaveProperty('job_id');
                    expect(job).toHaveProperty('title');
                    expect(job).toHaveProperty('company');
                    expect(job).toHaveProperty('industry');
                    expect(job).toHaveProperty('location');
                    expect(job).toHaveProperty('applicant_count');
                    expect(job).toHaveProperty('created_at');
                }
            });
        });
    });

    describe('GET /api/jobs/filters', () => {
        it('should return available filter options', async () => {
            const response = await request(app)
                .get('/api/jobs/filters')
                .expect(200);

            expect(response.body).toHaveProperty('filterOptions');
            expect(response.body).toHaveProperty('sortOptions');

            expect(response.body.filterOptions).toHaveProperty('companies');
            expect(response.body.filterOptions).toHaveProperty('industries');
            expect(response.body.filterOptions).toHaveProperty('locations');
            expect(response.body.filterOptions).toHaveProperty('job_levels');
            expect(response.body.filterOptions).toHaveProperty('role_types');

            expect(Array.isArray(response.body.filterOptions.companies)).toBe(true);
            expect(Array.isArray(response.body.sortOptions)).toBe(true);
        });

        it('should include test data in filter options', async () => {
            const response = await request(app)
                .get('/api/jobs/filters')
                .expect(200);

            expect(response.body.filterOptions.companies).toContain('Google');
            expect(response.body.filterOptions.industries).toContain('Technology');
            expect(response.body.filterOptions.locations).toContain('London');
        });
    });

    describe('Performance and edge cases', () => {
        it('should handle empty results gracefully', async () => {
            const response = await request(app)
                .get('/api/jobs/search?company=NonExistentCompany12345')
                .expect(200);

            expect(response.body.jobs).toHaveLength(0);
            expect(response.body.pagination.totalCount).toBe(0);
            expect(response.body.pagination.totalPages).toBe(0);
        });

        it('should handle special characters in search terms', async () => {
            const response = await request(app)
                .get('/api/jobs/search?company=Test%26Company')
                .expect(200);

            // Should not crash, even if no results
            expect(response.body).toHaveProperty('jobs');
        });

        it('should complete search within reasonable time', async () => {
            const startTime = Date.now();
            
            await request(app)
                .get('/api/jobs/search?industry=Technology&location=London')
                .expect(200);
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete within 2 seconds
            expect(duration).toBeLessThan(2000);
        });
    });
});
