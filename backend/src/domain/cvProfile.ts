export interface WorkExperience {
  company: string
  role: string
  period: string
  highlights: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  period: string
}

export interface CvProfile {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  language: string
  seniority: string
  summary: string
  skills: string[]
  experience: WorkExperience[]
  education: EducationEntry[]
  photoDescription: string
}

export interface GeneratedCv {
  id: string
  fileName: string
  filePath: string
  profile: CvProfile
  createdAt: string
}
