const asyncHandler = require('../utilities/CatchAsync')
const Constituent = require('../model/Constituent')
const AppError = require('../utilities/AppError')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const getConstituents = asyncHandler(async (req, res) => {
    // Fetch all constituents from the database
    const constituents = await Constituent.find();
    if (constituents) {
        res.status(200).json({
            success: true,
            data: constituents
        });
    }else{
        throw new AppError("Internal Server Error",400)
    }
})

const generateCsv = asyncHandler(async (req, res) => {
    const { startTime, endTime } = req.query;

    // Create a CSV file writer
    const csvWriter = createCsvWriter({
        path: 'constituents.csv', // Set the desired file name
        header: [
            { id: 'email', title: 'Email' },
            { id: 'name', title: 'Name' },
            { id: 'address', title: 'Address' },
            { id: 'signUpTime', title: 'SignUpTime' }
        ]
    });

    let filter = {};

    // Apply time range filter if provided
    if (startTime && endTime) {
        filter.signUpTime = { $gte: new Date(startTime), $lte: new Date(endTime) };
    }

    // Fetch constituents based on the filter
    const constituents = await Constituent.find(filter);

    // Write constituents to the CSV file
    await csvWriter.writeRecords(constituents);

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=constituents.csv');

    // Pipe the CSV file to the response stream
    const fileStream = require('fs').createReadStream('constituents.csv');
    fileStream.pipe(res);
});

const checkDuplicates = asyncHandler(async (req, res) => {
    // Find constituents with duplicate emails
    const duplicates = await Constituent.aggregate([
        {
            $group: {
                _id: '$email',
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                count: { $gt: 1 }
            }
        }
    ]);

    // Merge duplicate entries
    for (const duplicate of duplicates) {
        const duplicateEmail = duplicate._id;
        const duplicateConstituents = await Constituent.find({ email: duplicateEmail });

        // Skip the first constituent, as it will be considered the main one
        for (let i = 1; i < duplicateConstituents.length; i++) {
            const duplicateConstituent = duplicateConstituents[i];

            // Merge data (you can customize this based on your merging logic)
            duplicateConstituents[0].name = duplicateConstituent.name || duplicateConstituents[0].name;
            duplicateConstituents[0].address = duplicateConstituent.address || duplicateConstituents[0].address;

            // Remove the duplicate constituent
            await duplicateConstituent.remove();
        }
    }

    res.status(200).json({
        success: true,
        message: 'Duplicate constituents merged successfully'
    });
});

const addConstituent = asyncHandler(async (req, res) => {
    const { email, name, address } = req.body;
    // Check if a constituent with the same email exists
    let existingConstituent = await Constituent.findOne({ email });

    if (existingConstituent) {
        // If a constituent with the same email exists, merge data
        existingConstituent.name = name || existingConstituent.name;
        existingConstituent.address = address || existingConstituent.address;

        // Save the updated constituent
        await existingConstituent.save();

        res.status(200).json({
            success: true,
            message: 'Constituent data updated successfully',
            data: existingConstituent
        });
    } else {
        // If no constituent with the same email exists, create a new one
        const newConstituent = new Constituent({
            email,
            name,
            address
        });

        // Save the new constituent
        await newConstituent.save();

        res.status(201).json({
            success: true,
            message: 'Constituent added successfully',
            data: newConstituent
        });
    }
});



module.exports = {
    getConstituents,
    addConstituent,
    checkDuplicates,
    generateCsv
}