import { Request } from "express";
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
  LICENSE_REQUIRED: 'Driver license is required',
  VEHICLE_INFO_REQUIRED: 'Vehicle information is required',
  INVALID_LICENSE_NUMBER: 'Please provide a valid license number',
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

// Driver specific field names
export const DRIVER_FIELDS = {
  USER: 'user',
  LICENSE: 'license',
  VEHICLE: 'vehicle',
  AVAILABILITY: 'availability',
  RATINGS: 'ratings',
  DOCUMENTS: 'documents',
  EARNINGS: 'earnings',
  SERVICE_AREAS: 'serviceAreas',
  ACCOUNT_DETAILS: 'accountDetails',
  STATS: 'stats',
};

// Vehicle types
export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  BIKE = 'bike',
  AUTO = 'auto'
}

// Document types
export enum DocumentType {
  LICENSE = 'license',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  INSURANCE = 'insurance',
  PROFILE_PHOTO = 'profile_photo',
  BACKGROUND_CHECK = 'background_check'
}

// Document verification status
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

// Driver availability status
export enum AvailabilityStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
  ON_TRIP = 'on_trip'
}

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

// Driver interface for driver-specific data
export interface IDriver extends Document {
  user: string | IUser; // Reference to user document
  license: {
    number: string;
    expiryDate: Date;
    state: string;
  };
  vehicle: {
    type: VehicleType;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  availability: {
    status: AvailabilityStatus;
    lastStatusChange: Date;
    schedule?: Array<{
      day: number; // 0-6 for Sunday-Saturday
      startTime: string;
      endTime: string;
    }>;
  };
  documents: Array<{
    type: DocumentType;
    url: string;
    uploadedAt: Date;
    expiryDate?: Date;
    status: VerificationStatus;
    rejectionReason?: string;
  }>;
  ratings: {
    average: number;
    count: number;
    reviews?: Array<{
      rating: number;
      comment?: string;
      riderName?: string;
      createdAt: Date;
    }>;
  };
  earnings: {
    total: number;
    withdrawn: number;
    available: number;
    currency: string;
    transactions?: Array<{
      amount: number;
      type: 'credit' | 'debit';
      description: string;
      timestamp: Date;
      tripId?: string;
    }>;
  };
  serviceAreas: Array<{
    name: string;
    coordinates: number[][];
  }>;
  accountDetails: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
  stats: {
    totalTrips: number;
    totalDistance: number;
    cancelledTrips: number;
    joinedDate: Date;
    lastActiveDate: Date;
    onlineHours: number;
  };
}


export interface UserRegistrationRequest extends Request{
  name: string;
  email: string;
  phone?: string;
  password: string;
  location:{
    coordinates : [number, number]
  }
}