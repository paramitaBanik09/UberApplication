import { Document } from "mongoose";

// User roles
export enum UserRole {
  RIDER = 'rider',
  DRIVER = 'driver'
}

// Field validation messages
export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  EMAIL_REQUIRED: 'Email is required',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PHONE: 'Please provide a valid phone number',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
};

// Schema field names
export const USER_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  PASSWORD: 'password',
  ROLE: 'role',
  IS_ACTIVE: 'isActive',
  PROFILE_PICTURE: 'profilePicture',
  VERIFICATION_STATUS: 'verificationStatus',
  LOCATION: 'location',
};

// GeoJSON constants
export const GEO_JSON = {
  POINT: 'Point',
};

// Verification status fields
export const VERIFICATION_FIELDS = {
  EMAIL: 'email',
  PHONE: 'phone',
};

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole.RIDER | UserRole.DRIVER;
  isActive: boolean;
  profilePicture?: string;
  verificationStatus: {
    email: boolean;
    phone: boolean;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}