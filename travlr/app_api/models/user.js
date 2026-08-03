const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        enum: [
            'customer',
            'admin'
        ],
        default: 'customer',
            required: true
    },

    hash: {
        type: String,
        required: true
    },

    salt: {
        type: String,
        required: true
    }
});

// Method to set the password on this record.
userSchema.methods.setPassword = function(password) {
    this.salt = crypto
    .randomBytes(16)
    .toString('hex');

    this.hash = crypto
    .pbkdf2Sync(
        password,
        this.salt,
        100000,
        64,
        'sha512'
    )
    .toString('hex');
};

// Method to compare an entered password against the stored hash.
userSchema.methods.validPassword = function(password) {
    const hash = crypto
    .pbkdf2Sync(
        password,
        this.salt,
        100000,
        64,
        'sha512'
    )
    .toString('hex');

    return crypto.timingSafeEqual(
        Buffer.from(this.hash, 'hex'),
                                  Buffer.from(hash, 'hex')
    );
};

// Method to generate a JSON Web Token for the current record.
userSchema.methods.generateJWT = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role || 'customer'
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );
};

const User = mongoose.model(
    'users',
    userSchema
);

module.exports = User;
