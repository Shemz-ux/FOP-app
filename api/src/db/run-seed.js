import seed from "./seed.js";
import db from "../db/db.js";

const runSeed = () => {
    return seed().then(() => db.end());
};

runSeed();