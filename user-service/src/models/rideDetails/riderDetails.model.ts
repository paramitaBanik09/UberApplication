import { model, Schema, Types } from "mongoose"
import { GEO_JSON, ModeOfPayment } from "../../types"

const RideDetailsSchema = new Schema({
  rider: {
    type: Types?.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: Types?.ObjectId,
    ref: 'Driver',
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  pickupLocation: {
    type: { type: String, enum: [GEO_JSON.POINT], default: GEO_JSON.POINT },
    coordinates: {
      type: [Number, Number],
      required: true,
    },
  },
  dropOffLocation: {
    type: { type: String, enum: [GEO_JSON.POINT], default: GEO_JSON.POINT },
    coordinates: {
      type: [Number, Number],
      required: true,
    },
  },
  requestId: {
    type: String,
    required: true,
    unique: true // This ensures uniqueness for idempotency
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },
  paymentMode: {
    type: String,
    enum: ModeOfPayment, 
  }
})

export const Ride = model("Ride", RideDetailsSchema);