const asyncHandler = require('../utilities/CatchAsync')
const User = require('../model/user')
const AppError = require('../utilities/AppError')
const generateToken = require('../utilities/GetToken')
const matchPass = require('../utilities/MatchPassword')
const bcrypt = require('bcrypt')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new AppError("Enter all the required fields", 201)
    }

    const user = await User.findOne({ email: email });

    if (user) {
        throw new AppError("User Already Registered", 201)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userAccount = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    })
    if (userAccount) {
        return res.status(200).json({
            success: true,
            message: 'User registered sucessfully',
            user: {
                name: userAccount.name,
                email: userAccount.email
            }
        });
    } else {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userAccount = await User.findOne({ email: email });
    if (userAccount) {
        if (await matchPass(password, userAccount.password)) {
            res.status(201).json({
                success: true,
                message: "Login sucessfully",
                data: {
                    _id: userAccount._id,
                    name: userAccount.name,
                    email: userAccount.email,
                    token: generateToken({ _id: userAccount._id, name: userAccount.name, email: userAccount.email })
                }
            });
        } else {
            res.status(201).json({
                success: false,
                message: "Wrong email or password",
                data: {
                }
            });
        }
    } else {
        res.status(201).json({
            sucess: false,
            message: "Account not found",
            data: {}
        });
    }
});

const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed in the request parameters
    const { email, name } = req.body;

    if (!name || !email) {
        throw new AppError("Enter all the required fields", 201)
    }
    // Check if the user with the given ID exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Update user's email and name
    user.email = email || user.email;
    user.name = name || user.name;

    // Save the updated user
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed in the request parameters
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new AppError("Enter all the required fields", 201)
    }
    // Check if the user with the given ID exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    // Check if the old password matches the stored password
    if (!(await matchPass(oldPassword, user.password))) {
        res.status(200).json({
            success: false,
            message: 'Old password not correct'
        });
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update user's password with the new password
        user.password = hashedPassword;

        // Save the updated user
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }

});

const getProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed in the request parameters
    // Check if the user with the given ID exists
    const user = await User.findById(userId).populate('recipes');
    if (!user) {
        throw new AppError("User not found", 404);
    }
    console.log(user);
    // Return user's profile details (email and name)
    res.status(200).json({
        success: true,
        data: user
    });
});


module.exports = {
    registerUser,
    loginUser,
    updateProfile,
    changePassword,
    getProfile
}