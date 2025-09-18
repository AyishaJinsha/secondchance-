// Database configuration
// Choose one of the following options:

// Option 1: MongoDB Atlas (Cloud)
// Replace these values with your actual MongoDB Atlas credentials
// const mongodb_url = 'mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database_name?retryWrites=true&w=majority'

// Option 2: Local MongoDB (Recommended for development)
// Use environment variable for all environments; do not hardcode secrets.
const mongodb_url = ''

const config = {
    mongodb: {
        url: process.env.MONGODB_URL || mongodb_url
    }
};

module.exports = config;
