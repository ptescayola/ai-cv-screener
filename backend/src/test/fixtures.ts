import type { CvProfile } from '../domain/cvProfile.js'

export const sampleCvProfile: CvProfile = {
  fullName: 'Ada Lovelace',
  headline: 'Software Engineer',
  email: 'ada@example.com',
  phone: '+34 600 000 000',
  location: 'Madrid, Spain',
  language: 'English',
  seniority: 'senior',
  summary: 'Backend engineer with experience building data pipelines.',
  skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
  experience: [
    {
      company: 'Example Corp',
      role: 'Senior Engineer',
      period: '2021–Present',
      highlights: ['Led API redesign', 'Reduced latency by 30%'],
    },
  ],
  education: [
    {
      institution: 'Example University',
      degree: 'BSc Computer Science',
      period: '2014–2018',
    },
  ],
  photoDescription: 'Professional woman, neutral background',
}
