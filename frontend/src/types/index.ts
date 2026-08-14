export type Role = 'candidate' | 'recruiter';
export type EvidenceLevel = 'STRONG' | 'MODERATE' | 'WEAK' | 'NO_EVIDENCE';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  profile: {
    bio: string;
    location: string;
    linkedin: string;
    portfolio: string;
    resumeLink: string;
    companyName?: string;
  };
  githubUsername: string;
  claimedSkills: string[];
  isPublic: boolean;
}

export interface Repository {
  _id: string;
  name: string;
  owner: string;
  url: string;
  description: string;
  languages: string[];
  topics: string[];
  detectedTechnologies: string[];
  repoUpdatedAt: string;
  stargazersCount: number;
}

export interface EvidenceItem {
  type: string;
  description: string;
  repositoryId?: string;
}

export interface SkillEvidence {
  _id: string;
  skill: string;
  evidenceLevel: EvidenceLevel;
  evidenceItems: EvidenceItem[];
  repositoryReferences: Repository[] | string[];
  strengths: string[];
  gaps: string[];
  limitations: string;
}

export interface EvidenceReport {
  _id: string;
  skills: { skill: string; evidenceLevel: EvidenceLevel; evidenceSummary: string }[];
  summary: string;
  aiExplanation: string;
  aiAvailable: boolean;
  createdAt: string;
}

export interface Job {
  _id: string;
  recruiterId: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  requiredSkills: string[];
  preferredSkills: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CandidateJobMatch {
  _id: string;
  jobId: string;
  candidateId: string | User;
  matchedSkills: { skill: string; evidenceLevel: EvidenceLevel }[];
  missingSkills: string[];
  evidenceSummary: string;
  matchScore: number;
  status: 'new' | 'reviewed' | 'needs_review' | 'shortlisted' | 'rejected';
}
