import mongoose from "mongoose";
async function connectToDatabase() {

    const databaseUrl = process.env.DATABASE_URL;
    const maxConnectionTries = 3;
    const serverSelectionTimeoutMS = 5000;

    // SEED REVIEWS ALSO
    console.log(`Connecting to the database at ${databaseUrl}`);
    for (let i = 1; i <= maxConnectionTries; ++i) {
        console.log(`Trying to connect to the database ${i}/${maxConnectionTries}`);
        try {
            await mongoose.connect(databaseUrl, {
                serverSelectionTimeoutMS
            });
            console.log(`Connected to the Mongoose database!`);
            break;
        } catch (e) {
            if (i === maxConnectionTries) {
                throw new Error(`Failed to connect to the database after ${maxConnectionTries} tries`);
            }
        }
    }

}
export default connectToDatabase;