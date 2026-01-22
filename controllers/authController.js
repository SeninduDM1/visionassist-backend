const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// Register
exports.register = async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body; // ✅ UPDATED

    // ✅ UPDATED: Basic validation
    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ UPDATED: Check duplicate email OR phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Only allow "admin" or default to "user"
    const safeRole = role === "admin" ? "admin" : "user";

    // ✅ UPDATED: Save fullName & phone
    const newUser = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role: safeRole
    });

    res.json({
      message: "User registered successfully",
      userId: newUser._id,
      role: newUser.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Login (NO CHANGE)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
};
