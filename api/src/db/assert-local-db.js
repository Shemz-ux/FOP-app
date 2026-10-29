import dotenv from 'dotenv';

dotenv.config();

// Hosts that are unambiguously this machine. A URL with no host at all is a
// unix-socket connection, which is also local by definition.
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0']);

// Escape hatch for the rare case of legitimately rebuilding a remote database.
// Deliberately verbose: it has to be typed on purpose, not reached by habit.
const OVERRIDE_VAR = 'ALLOW_REMOTE_DB';

const mask = (url) => url.replace(/:[^:@/]*@/, ':***@');

/**
 * Refuse to run a data-destroying script against anything but a local database.
 *
 * Exists because .env carries a commented-out production connection string, so
 * one uncommented line is all that separates `npm run reset` from dropping the
 * live tables, and `npm run seed` from inserting test accounts with a password
 * that is published in TEST_CREDENTIALS.md.
 *
 * Fails closed: an unparseable DATABASE_URL is refused rather than assumed safe.
 * Exits the process directly instead of throwing, so a caller's try/catch cannot
 * swallow it and carry on.
 *
 * @param {string} action - what the script is about to do, for the message.
 */
const assertLocalDatabase = (action) => {
    const raw = process.env.DATABASE_URL;

    // Unset means pg falls back to its own local defaults, so there is nothing
    // remote to protect against.
    if (!raw) {
        console.log(`ℹ️  DATABASE_URL is not set - using pg's local defaults.`);
        return;
    }

    let url;
    try {
        url = new URL(raw);
    } catch {
        console.error(`\n❌ Refusing to ${action}: DATABASE_URL could not be parsed.\n`);
        console.error(`   Fix DATABASE_URL in api/.env, then try again.\n`);
        process.exit(1);
    }

    const host = url.hostname;
    const database = url.pathname.replace(/^\//, '') || '(default)';

    if (host === '' || LOCAL_HOSTS.has(host)) {
        console.log(`🎯 Target: ${database} @ ${host || 'unix socket'}`);
        return;
    }

    if (process.env[OVERRIDE_VAR] === '1') {
        console.warn(`\n⚠️  ${OVERRIDE_VAR}=1 - proceeding against a REMOTE database.`);
        console.warn(`   Host: ${host}`);
        console.warn(`   Database: ${database}\n`);
        return;
    }

    console.error(`\n❌ Refusing to ${action}: DATABASE_URL is not local.\n`);
    console.error(`   Host:     ${host}`);
    console.error(`   Database: ${database}`);
    console.error(`   URL:      ${mask(raw)}\n`);
    console.error(`   This script changes data destructively and is only allowed`);
    console.error(`   against localhost. Check DATABASE_URL in api/.env - it should`);
    console.error(`   point at fop_dev for local work (npm run db:which).\n`);
    console.error(`   If you genuinely mean to target this remote database:`);
    console.error(`     ${OVERRIDE_VAR}=1 npm run <script>\n`);
    process.exit(1);
};

export default assertLocalDatabase;
