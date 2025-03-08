import { Schema, model } from "mongoose";
import {
  IDriver,
  DRIVER_FIELDS,
  VehicleType,
  DocumentType,
  VerificationStatus,
  AvailabilityStatus,
  VALIDATION_MESSAGES,
  GEO_JSON
} from "../../types";

const driverSchema = new Schema({
  // Reference to the user document
  [DRIVER_FIELDS.USER]: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // License information
  [DRIVER_FIELDS.LICENSE]: {
    number: {
      type: String,
      required: [true, VALIDATION_MESSAGES.LICENSE_REQUIRED],
      validate: {
        validator: (value: string) => /^[A-Z0-9-]+$/i.test(value),
        message: VALIDATION_MESSAGES.INVALID_LICENSE_NUMBER
      }
    },
    expiryDate: {
      type: Date,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },

  // Vehicle information
  [DRIVER_FIELDS.VEHICLE]: {
    type: {
      type: String,
      enum: Object.values(VehicleType),
      required: [true, VALIDATION_MESSAGES.VEHICLE_INFO_REQUIRED]
    },
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true
    }
  },

  // Availability information
  [DRIVER_FIELDS.AVAILABILITY]: {
    status: {
      type: String,
      enum: Object.values(AvailabilityStatus),
      default: AvailabilityStatus.OFFLINE
    },
    lastStatusChange: {
      type: Date,
      default: Date.now
    },
    schedule: [{
      day: {
        type: Number,
        min: 0,
        max: 6
      }, // 0-6 for Sunday-Saturday
      startTime: String,
      endTime: String
    }]
  },

  // Documents
  [DRIVER_FIELDS.DOCUMENTS]: [{
    type: {
      type: String,
      enum: Object.values(DocumentType),
      required: true
    },
    number: {
      type: String,
      required: true
    },
    url: {
      type: String,
      /* required: true */
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    expiryDate: Date,
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING
    },
    rejectionReason: String
  }],

  // Ratings and reviews
  [DRIVER_FIELDS.RATINGS]: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: String,
      riderName: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Earnings
  [DRIVER_FIELDS.EARNINGS]: {
    total: {
      type: Number,
      default: 0
    },
    withdrawn: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    transactions: [{
      amount: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
      },
      description: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      tripId: {
        type: Schema.Types.ObjectId,
        ref: 'Trip'
      }
    }]
  },

  // Service areas
  [DRIVER_FIELDS.SERVICE_AREAS]: [{
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: [[Number]], // Array of [longitude, latitude] pairs forming a polygon
      required: true
    }
  }],

  // Account details for payments
  [DRIVER_FIELDS.ACCOUNT_DETAILS]: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String
  },

  // Stats
  [DRIVER_FIELDS.STATS]: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    }, // in km
    cancelledTrips: {
      type: Number,
      default: 0
    },
    joinedDate: {
      type: Date,
      default: Date.now
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    onlineHours: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
driverSchema.index({ [DRIVER_FIELDS.USER]: 1 }); // For user lookups
driverSchema.index({ [`${DRIVER_FIELDS.VEHICLE}.licensePlate`]: 1 }); // For vehicle lookups
driverSchema.index({ [`${DRIVER_FIELDS.AVAILABILITY}.status`]: 1 }); // For availability queries
driverSchema.index({ [`${DRIVER_FIELDS.LICENSE}.number`]: 1 }); // For license lookups
driverSchema.index({ [`${DRIVER_FIELDS.RATINGS}.average`]: -1 }); // For sorting by ratings
driverSchema.index({ [`${DRIVER_FIELDS.SERVICE_AREAS}.coordinates`]: '2dsphere' }); // For geospatial queries

// Virtual for full name from the referenced user document
driverSchema.virtual('fullName').get(function () {
  const user = this.populated('user') ? this?.user : null;
  return user ?? 'Driver';
});

// Method to update driver availability
driverSchema.methods.updateAvailability = async function (status: AvailabilityStatus) {
  this.availability.status = status;
  this.availability.lastStatusChange = new Date();
  return this.save();
};

// Method to calculate earnings
driverSchema.methods.calculateEarnings = function () {
  return {
    total: this.earnings.total,
    available: this.earnings.available,
    withdrawn: this.earnings.withdrawn
  };
};

// Static method to find nearby drivers
driverSchema.statics.findNearbyDrivers = async function (
  coordinates: [number, number],
  maxDistance: number = 5000, // 5km by default
  availabilityStatus: AvailabilityStatus = AvailabilityStatus.ONLINE
) {
  return this.find({
    [`${DRIVER_FIELDS.AVAILABILITY}.status`]: availabilityStatus,
    // Assuming we're using the user's location for this query
    'user.location': {
      $near: {
        $geometry: {
          type: GEO_JSON.POINT,
          coordinates,
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  }).populate('user');
};

const Driver = model<IDriver>('Driver', driverSchema);

export default Driver; 