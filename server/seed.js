const mongoose = require('mongoose');
const Constituent = require('./model/Constituent'); // Update the path

// Sample data
const seedData = [
    {
        email: 'john@example.com',
        name: 'John Doe',
        address: '123 Main St',
        signUpTime: new Date('2022-01-01T08:00:00Z')
    },
    {
        email: 'jane@example.com',
        name: 'Jane Smith',
        address: '456 Oak St',
        signUpTime: new Date('2022-01-02T10:30:00Z')
    },
    {
        email: 'bob@example.com',
        name: 'Bob Johnson',
        address: '789 Pine St',
        signUpTime: new Date('2022-01-03T12:15:00Z')
    },
    {
        email: 'susan@example.com',
        name: 'Susan Anderson',
        address: '101 Elm St',
        signUpTime: new Date('2022-01-04T14:45:00Z')
    },
    {
        email: 'mike@example.com',
        name: 'Mike Wilson',
        address: '222 Birch St',
        signUpTime: new Date('2022-01-05T16:30:00Z')
    },
    // Add more sample records as needed
];


// Seed the database
async function seedDatabase() {
    try {
        await Constituent.deleteMany({})
        // Insert seed data
        await Constituent.insertMany(seedData);

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

main().catch(err => console.log(err))
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/constituent_database');
    console.log("connected");
}

// Run the seed function
seedDatabase();