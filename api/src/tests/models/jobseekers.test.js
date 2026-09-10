import {
    createJobseeker,
    fetchJobseekerById,
    updateJobseeker,
    removeJobseeker
} from '../../models/jobseekers.js';
import '../utils/setup.js';

// Manual cleanup pattern (models use the regular db pool, not a test transaction client
// - see src/tests/models/webinars.test.js / WEBINAR_TESTS_README.md for why).
describe('Jobseekers Model - Right to Work / Sponsorship fields', () => {
    let testJobseekerIds = [];

    const baseJobseeker = (overrides = {}) => {
        const timestamp = Date.now() + Math.random();
        return {
            first_name: 'Test',
            last_name: 'RTW',
            email: `rtw.model.${timestamp}@test.com`,
            password_hash: 'hashed_password',
            education_level: 'other',
            ...overrides
        };
    };

    afterAll(async () => {
        for (const id of testJobseekerIds) {
            try {
                await removeJobseeker(id);
            } catch (error) {
                // Already deleted by a test (e.g. delete test) - ignore
            }
        }
    });

    describe('Legacy jobseekers (created before this feature existed)', () => {
        test('createJobseeker without right-to-work fields stores them as NULL', async () => {
            const jobseeker = await createJobseeker(baseJobseeker());
            testJobseekerIds.push(jobseeker.jobseeker_id);

            expect(jobseeker.has_right_to_work_uk).toBeNull();
            expect(jobseeker.requires_sponsorship).toBeNull();
        });

        test('fetchJobseekerById reflects NULL for a legacy-style record', async () => {
            const created = await createJobseeker(baseJobseeker());
            testJobseekerIds.push(created.jobseeker_id);

            const fetched = await fetchJobseekerById(created.jobseeker_id);

            expect(fetched.has_right_to_work_uk).toBeNull();
            expect(fetched.requires_sponsorship).toBeNull();
        });

        test('a legacy jobseeker can later fill the fields in via update (Settings flow)', async () => {
            const created = await createJobseeker(baseJobseeker());
            testJobseekerIds.push(created.jobseeker_id);
            expect(created.has_right_to_work_uk).toBeNull();

            const updated = await updateJobseeker(
                { has_right_to_work_uk: true, requires_sponsorship: false },
                created.jobseeker_id
            );

            expect(updated.has_right_to_work_uk).toBe(true);
            expect(updated.requires_sponsorship).toBe(false);
        });
    });

    describe('New jobseekers (set explicit yes/no at sign-up)', () => {
        test('createJobseeker persists an explicit "yes" (has right to work, no sponsorship needed)', async () => {
            const jobseeker = await createJobseeker(baseJobseeker({
                has_right_to_work_uk: true,
                requires_sponsorship: false
            }));
            testJobseekerIds.push(jobseeker.jobseeker_id);

            expect(jobseeker.has_right_to_work_uk).toBe(true);
            expect(jobseeker.requires_sponsorship).toBe(false);
        });

        test('createJobseeker persists an explicit "no" (no right to work, sponsorship required)', async () => {
            const jobseeker = await createJobseeker(baseJobseeker({
                has_right_to_work_uk: false,
                requires_sponsorship: true
            }));
            testJobseekerIds.push(jobseeker.jobseeker_id);

            expect(jobseeker.has_right_to_work_uk).toBe(false);
            expect(jobseeker.requires_sponsorship).toBe(true);
        });

        test('explicit false is preserved as false, not coerced to NULL/absent', async () => {
            // Regression guard: false is a meaningful, distinct answer from "not provided" (NULL).
            const jobseeker = await createJobseeker(baseJobseeker({
                has_right_to_work_uk: false,
                requires_sponsorship: false
            }));
            testJobseekerIds.push(jobseeker.jobseeker_id);

            const fetched = await fetchJobseekerById(jobseeker.jobseeker_id);
            expect(fetched.has_right_to_work_uk).toBe(false);
            expect(fetched.requires_sponsorship).toBe(false);
        });
    });

    describe('updateJobseeker - allow-list coverage', () => {
        test('updates has_right_to_work_uk alone without touching requires_sponsorship', async () => {
            const created = await createJobseeker(baseJobseeker({
                has_right_to_work_uk: false,
                requires_sponsorship: true
            }));
            testJobseekerIds.push(created.jobseeker_id);

            const updated = await updateJobseeker({ has_right_to_work_uk: true }, created.jobseeker_id);

            expect(updated.has_right_to_work_uk).toBe(true);
            expect(updated.requires_sponsorship).toBe(true); // unchanged
        });

        test('rejects update for a non-existent jobseeker', async () => {
            await expect(
                updateJobseeker({ has_right_to_work_uk: true }, 999999999)
            ).rejects.toMatchObject({ status: 404 });
        });
    });
});
