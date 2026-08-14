const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['candidate', 'recruiter'],
      required: true,
    },
    profile: {
      bio: { type: String, maxlength: 500, default: '' },
      location: { type: String, maxlength: 120, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      resumeLink: { type: String, default: '' },
      companyName: { type: String, default: '' }, // recruiter-only
    },
    githubUsername: { type: String, trim: true, default: '' },
    claimedSkills: [{ type: String, trim: true }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
