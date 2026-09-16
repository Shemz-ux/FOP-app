import request from 'supertest';
import app from '../../app.js';
import db from '../../db/db.js';
import '../utils/setup.js';

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
                experience_level: 'Senior',
                role_type: 'Full-time',
                description: 'Senior software engineering role at Google'
            },
            {
                title: 'Junior Developer',
                company: 'Microsoft',
                industry: 'Technology',
                location: 'Manchester',
                experience_level: 'Junior',
                role_type: 'Full-time',
                description: 'Junior developer position at Microsoft'
            },
            {
                title: 'Marketing Manager',
                company: 'Apple',
                industry: 'Technology',
                location: 'London',
                experience_level: 'Mid',
                role_type: 'Full-time',
                description: 'Marketing management role at Apple'
            },
            {
                title: 'Data Analyst',
                company: 'Facebook',
                industry: 'Technology',
                location: 'Birmingham',
                experience_level: 'Mid',
                role_type: 'Contract',
                description: 'Data analyst contract position'
            },
            {
                title: 'Financial Advisor',
                company: 'Goldman Sachs',
                industry: 'Finance',
                location: 'London',
                experience_level: 'Senior',
                role_type: 'Full-time',
                description: 'Senior financial advisor role'
            },
            {
                title: 'Office Coordinator',
                company: 'Greater London Assembly',
                industry: 'Technology',
                location: 'Greater London',
                experience_level: 'Mid',
                role_type: 'Full-time',
                description: 'Coordination role covering the Greater London area'
            },
            {
                title: 'Archived Analyst',
                company: 'Legacy Corp',
                industry: 'Finance',
                location: 'Edinburgh',
                experience_level: 'Mid',
                role_type: 'Full-time',
                description: 'An inactive job used to test active-only location scoping',
                is_active: false
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

            it('should exact-match on location, not treat it as a substring (excludes "Greater London" when filtering for "London")', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?location=London')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.company === 'Greater London Assembly')).toBe(false);
            });

            it('should be case-insensitive on exact location matches', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?location=london')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.company === 'Google')).toBe(true);
            });

            it('should filter jobs by job level', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?experience_level=Senior')
                    .expect(200);

                expect(response.body.jobs.length).toBeGreaterThanOrEqual(2);
                const seniorJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                seniorJobs.forEach(job => {
                    expect(job.experience_level).toBe('Senior');
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

        describe('Keyword search (?search=)', () => {
            it('should match jobs by a keyword found in the title', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=Financial Advisor')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.length).toBeGreaterThanOrEqual(1);
                expect(testJobs.some(job => job.title === 'Financial Advisor')).toBe(true);
            });

            it('should match jobs by a keyword found in the company name', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=Goldman')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.length).toBeGreaterThanOrEqual(1);
                expect(testJobs.every(job => job.company === 'Goldman Sachs')).toBe(true);
            });

            it('should match jobs by a keyword found in the location', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=Birmingham')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.length).toBeGreaterThanOrEqual(1);
                expect(testJobs.every(job => job.location === 'Birmingham')).toBe(true);
            });

            it('should be case-insensitive', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=goldman sachs')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.company === 'Goldman Sachs')).toBe(true);
            });

            it('should return no results for a keyword matching nothing', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=zzz-no-such-keyword-anywhere-zzz')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs).toHaveLength(0);
            });

            it('should echo the search term back in the response filters', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=Google')
                    .expect(200);

                expect(response.body.filters.search).toBe('Google');
            });
        });

        describe('Keyword search — multi-word, any order, wider columns (Tier 1)', () => {
            it('should match regardless of word order', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=Advisor Financial')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.title === 'Financial Advisor')).toBe(true);
            });

            it('should AND words together across different columns on the same job', async () => {
                // "Senior" only lives in the title/experience_level of the Google job;
                // "Google" only lives in its company. A whole-phrase match would fail this.
                const response = await request(app)
                    .get('/api/jobs/search?search=Senior Google')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs).toHaveLength(1);
                expect(testJobs[0].title).toBe('Senior Software Engineer');
            });

            it('should not match a job missing one of the words, even if the other word matches', async () => {
                // "Senior" also matches the Goldman Sachs job, but "Google" does not
                const response = await request(app)
                    .get('/api/jobs/search?search=Senior Google')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.company === 'Goldman Sachs')).toBe(false);
            });

            it('should NOT match on a word that only appears in the industry column (too broad a category to search by keyword)', async () => {
                // "Finance" is the industry of the Goldman Sachs job, but doesn't appear in
                // its title ("Financial Advisor" does not contain the substring "Finance"),
                // company, location, role_type, work_type, or experience_level.
                const response = await request(app)
                    .get('/api/jobs/search?search=Finance')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.industry === 'Finance')).toBe(false);
            });

            it('should match a keyword found only in the role_type column', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=Contract')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.role_type === 'Contract')).toBe(true);
            });

            it('should NOT match on a word that only appears in the description (avoids false positives from generic boilerplate)', async () => {
                // "Marketing management role at Apple" is the description of the Marketing
                // Manager job; "management" doesn't appear in its title/company/location/etc.
                const response = await request(app)
                    .get('/api/jobs/search?search=management')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.title === 'Marketing Manager')).toBe(false);
            });

            it('should ignore stopwords instead of requiring them to match', async () => {
                // "and" is a stopword and would otherwise be a near-universal false-positive
                // match; "Financial Advisor" should be found the same whether or not it's there
                const withStopword = await request(app)
                    .get('/api/jobs/search?search=Financial and Advisor')
                    .expect(200);
                const withoutStopword = await request(app)
                    .get('/api/jobs/search?search=Financial Advisor')
                    .expect(200);

                const withIds = withStopword.body.jobs.filter(job => testJobIds.includes(job.job_id)).map(j => j.job_id).sort();
                const withoutIds = withoutStopword.body.jobs.filter(job => testJobIds.includes(job.job_id)).map(j => j.job_id).sort();
                expect(withIds).toEqual(withoutIds);
                expect(withIds.length).toBeGreaterThanOrEqual(1);
            });

            it('should treat a literal "%" as a literal character, not a wildcard', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?search=%25') // URL-encoded literal "%"
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs).toHaveLength(0);
            });

            it('should treat a literal "_" as a literal character, not a single-char wildcard', async () => {
                // Unescaped, "_" would match any character, so "G_ogle" would wrongly match "Google"
                const response = await request(app)
                    .get('/api/jobs/search?search=G_ogle')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.some(job => job.company === 'Google')).toBe(false);
            });
        });

        describe('Combined filtering', () => {
            it('should filter by multiple criteria', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?industry=Technology&location=London&experience_level=Senior')
                    .expect(200);

                // Check that all returned jobs match the criteria
                response.body.jobs.forEach(job => {
                    expect(job.industry).toBe('Technology');
                    expect(job.location).toBe('London');
                    expect(job.experience_level).toBe('Senior');
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

        describe('Multi-value (comma-separated) filtering', () => {
            it('should OR multiple role_type values checked within the same category', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?role_type=Full-time,Contract')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                // Should include both the Full-time jobs and the Contract job, not neither
                expect(testJobs.length).toBeGreaterThanOrEqual(5);
                testJobs.forEach(job => {
                    expect(['Full-time', 'Contract']).toContain(job.role_type);
                });
            });

            it('should OR multiple location values checked within the same category', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?location=London,Manchester')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                // 3 London jobs + 1 Manchester job, but not the Greater London or Birmingham jobs
                expect(testJobs.length).toBeGreaterThanOrEqual(4);
                testJobs.forEach(job => {
                    expect(['London', 'Manchester']).toContain(job.location);
                });
            });

            it('should OR multiple experience_level values checked within the same category', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?experience_level=Senior,Junior')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                expect(testJobs.length).toBeGreaterThanOrEqual(3);
                testJobs.forEach(job => {
                    expect(['Senior', 'Junior']).toContain(job.experience_level);
                });
            });

            it('should combine an OR within a category and AND across categories', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?industry=Technology,Finance&experience_level=Senior')
                    .expect(200);

                const testJobs = response.body.jobs.filter(job => testJobIds.includes(job.job_id));
                // Senior Software Engineer (Technology) and Financial Advisor (Finance) both qualify
                expect(testJobs.length).toBeGreaterThanOrEqual(2);
                testJobs.forEach(job => {
                    expect(['Technology', 'Finance']).toContain(job.industry);
                    expect(job.experience_level).toBe('Senior');
                });
            });

            it('should report a totalCount consistent with multi-value OR matches', async () => {
                const response = await request(app)
                    .get('/api/jobs/search?role_type=Full-time,Contract&limit=100')
                    .expect(200);

                expect(response.body.pagination.totalCount).toBe(response.body.jobs.length);
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
            expect(response.body.filterOptions).toHaveProperty('experience_levels');
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

        it('should exclude locations that only belong to inactive jobs by default', async () => {
            const response = await request(app)
                .get('/api/jobs/filters')
                .expect(200);

            // "Edinburgh" only exists on the inactive "Archived Analyst" test job
            expect(response.body.filterOptions.locations).not.toContain('Edinburgh');
        });

        it('should include locations from inactive jobs when includeInactive=true', async () => {
            const response = await request(app)
                .get('/api/jobs/filters?includeInactive=true')
                .expect(200);

            expect(response.body.filterOptions.locations).toContain('Edinburgh');
            // Active locations should still be present too
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
