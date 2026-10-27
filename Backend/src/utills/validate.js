const validator = require("validator");

const validateSignUpData = async (req, User) => {
    const {firstName, lastName, email, password} = req.body;
    
    if(!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }
    if(!validator.isEmail(email)) {
        throw new Error("Invalid email format " + email);
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'password', 'age', 'gender', 'photoUrl', 'about'];
    const requestFields = Object.keys(req.body || {});

    if (requestFields.length === 0) {
        throw new Error("No fields provided for profile update");
    }

    const isEditAllowed = requestFields.every(field => allowedEditFields.includes(field));
    if (!isEditAllowed) {
        throw new Error("Invalid edit request");
    }
    return isEditAllowed;
};

module.exports = { 
    validateSignUpData,
    validateEditProfileData
};
