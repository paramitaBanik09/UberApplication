import { Schema, Types } from "mongoose"
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
    required: true
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
  paymentMode: {
    type: ModeOfPayment,
    required: true
  }
})