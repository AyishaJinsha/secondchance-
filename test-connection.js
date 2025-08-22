const mongoose = require('mongoose');
const config = require('./config/config');

async function testConnection() {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', config.mongodb.url);
    
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 1,
        retryWrites: true,
        w: 'majority'
    };

    try {
        console.log('Attempting to connect...');
        const connection = await mongoose.connect(config.mongodb.url, options);
        console.log('✅ Connection successful!');
        console.log('Database name:', connection.connection.name);
        console.log('Host:', connection.connection.host);
        console.log('Port:', connection.connection.port);
        
        // Test a simple query
        console.log('Testing database query...');
        const collections = await connection.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Test completed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.error('💡 Solution: Check if MongoDB is running and accessible');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Solution: Check your connection string and DNS resolution');
        } else if (error.message.includes('authentication failed')) {
            console.error('💡 Solution: Check your username and password');
        } else if (error.message.includes('whitelist')) {
            console.error('💡 Solution: Add your current IP to MongoDB Atlas whitelist');
            console.error('   Go to: https://cloud.mongodb.com/ → Network Access → Add IP Address');
        } else if (error.message.includes('timeout')) {
            console.error('💡 Solution: Check your internet connection and firewall settings');
        }
        
        process.exit(1);
    }
}

testConnection();
