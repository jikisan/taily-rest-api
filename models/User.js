const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  
  // Personal information
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Contact information
  phone: { 
    type: String,
    trim: true
  },

  // Profile information
  profilePicture: { type: String },
  dateOfBirth: { type: Date },
  
  // Account status
  isActive: { 
    type: Boolean, 
    default: true 
  },
//   isVerified: { 
//     type: Boolean, 
//     default: false 
//   },
  
  // Role and permissions
  role: { 
    type: String, 
    enum: ['user', 'admin', 'veterinarian'], 
    default: 'user' 
  },
  
  // Timestamps
  lastLogin: { type: Date },
//   emailVerifiedAt: { type: Date }
}, { 
  timestamps: true 
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
