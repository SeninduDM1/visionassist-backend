const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["blindUser", "caregiver"],
    default: "blindUser"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Connection ID (VERY IMPORTANT)
  familyGroupId: {
    type: String,
    default: null,
    index: true
  }
},

  {
    timestamps: true
  }

);

module.exports = mongoose.model("User", userSchema);
