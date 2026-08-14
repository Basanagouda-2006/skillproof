const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, default: '' },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract'],
      default: 'full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior'],
      default: 'entry',
    },
    requiredSkills: [{ type: String, trim: true }],
    preferredSkills: [{ type: String, trim: true }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

jobSchema.index({ recruiterId: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
