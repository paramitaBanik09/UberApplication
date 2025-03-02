import {Schema,model} from "mongoose"

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['rider', 'driver'], 
    default: 'rider' 
  },

  // Location data stored in GeoJSON format
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number],  // Array of [longitude, latitude]
      required: true,
    },
  },
})

const User = model("User",userSchema)