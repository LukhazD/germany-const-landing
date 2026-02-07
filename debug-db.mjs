import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
            const parts = line.split('=');
            return [parts[0].trim(), parts.slice(1).join('=').trim()];
        })
);

const uri = envVars.MONGODB_URI;

console.log('Testing MongoDB Connection...');
console.log(`URI: ${uri?.replace(/:([^:@]+)@/, ':****@')}`); // log masked URI

if (!uri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connection Successful!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('ReplicaSetNoPrimary')) {
            console.error('\n--> HINT: This error usually means you are connecting to a standalone MongoDB instance but the client expects a Replica Set.');
            console.error('--> TRY: Appending "?directConnection=true" to your MONGODB_URI in .env');
        }
        process.exit(1);
    });
