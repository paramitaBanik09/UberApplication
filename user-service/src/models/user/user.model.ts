import * as argon2 from "argon2";
import { Schema, model } from "mongoose";
import validator from "validator";
import { IUser, UserRole, VALIDATION_MESSAGES, USER_FIELDS, GEO_JSON, VERIFICATION_FIELDS } from "../../types";

const userSchema = new Schema({
  [USER_FIELDS.NAME]: { 
    type: String, 
    required: [true, VALIDATION_MESSAGES.NAME_REQUIRED],
    trim: true
  },
  [USER_FIELDS.EMAIL]: { 
    type: String, 
    required: [true, VALIDATION_MESSAGES.EMAIL_REQUIRED], 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: VALIDATION_MESSAGES.INVALID_EMAIL
    }
  },
  [USER_FIELDS.PHONE]: { 
    type: String,
    trim: true,
    validate: {
      validator: (value: string) => {
        if (!value) return true; // Optional field
        return validator.isMobilePhone(value);
      },
      message: VALIDATION_MESSAGES.INVALID_PHONE
    }
  },
  [USER_FIELDS.PASSWORD]: {
    type: String,
    required: [true, VALIDATION_MESSAGES.PASSWORD_REQUIRED],
    minlength: [8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH],
    select: false // Don't return password by default in queries
  },
  [USER_FIELDS.ROLE]: { 
    type: String, 
    enum: [UserRole.RIDER, UserRole.DRIVER], 
    default: UserRole.RIDER 
  },
  [USER_FIELDS.IS_ACTIVE]: {
    type: Boolean,
    default: true
  },
  [USER_FIELDS.PROFILE_PICTURE]: {
    type: String
  },
  [USER_FIELDS.VERIFICATION_STATUS]: {
    [VERIFICATION_FIELDS.EMAIL]: {
      type: Boolean,
      default: false
    },
    [VERIFICATION_FIELDS.PHONE]: {
      type: Boolean,
      default: false
    }
  },
  // Location data stored in GeoJSON format
  [USER_FIELDS.LOCATION]: {
    type: { type: String, enum: [GEO_JSON.POINT], default: GEO_JSON.POINT },
    coordinates: {
      type: [Number],  // Array of [longitude, latitude]
      required: true,
    },
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create indexes
userSchema.index({ [USER_FIELDS.EMAIL]: 1 });
userSchema.index({ [USER_FIELDS.LOCATION]: '2dsphere' }); // Geospatial index for location queries

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  const user = this as unknown as IUser;
  
  // Only hash the password if it's modified or new
  if (!user.isModified(USER_FIELDS.PASSWORD)) return next();
  
  try {
    // Using argon2id which balances resistance against side-channel and GPU attacks
    user.password = await argon2.hash(user.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3, // Iterations
      parallelism: 1 // Threads
    });
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return argon2.verify(this.password, candidatePassword);
};

const User = model<IUser>("User", userSchema);

export default User;