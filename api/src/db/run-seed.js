import seed from "./tables.js";
import db from "../db/db.js";

const runSeed = () => {
    return seed().then(() => db.end());
};

runSeed();