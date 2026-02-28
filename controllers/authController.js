const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

// Register User
exports.register = async (req, res) => {
  try {

    const { fullName, phone, email, password, role } = req.body;

    // ✅ Validation
    if (!fullName || !phone || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // ✅ Check duplicate email OR phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone already exists"
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Validate role
    const safeRole =
      role === "blindUser"
        ? "blindUser"
        : role === "caregiver"
          ? "caregiver"
          : null;

    if (!safeRole) {
      return res.status(400).json({
        message: "Invalid role selected"
      });
    }

    //  Family Group ID Logic (VERY IMPORTANT FOR YOU)
    let familyGroupId = null;

    // If blindUser to create group
    if (safeRole === "blindUser") {
      familyGroupId = uuidv4();
    }

    // Save user
    const newUser = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role: safeRole,
      familyGroupId
    });

    res.json({
      message: "User registered successfully",
      userId: newUser._id,
      role: newUser.role,
      familyGroupId
    });

  } catch (err) {
    console.error("REGISTER API ERROR:", err);

    res.status(500).json({
      message: err?.message || "Server error"
    });
  }
};


// Login (NO CHANGE)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 🔥 ONE LINE FIX
  const user = await User.findOne({ email }).select('+role');

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (user.isBlocked) {
    return res.status(403).json({ message: "Your account is blocked" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role }, // ✅ Now defined!
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    role: user.role  // ✅ Now "blindUser"!
  });
};

