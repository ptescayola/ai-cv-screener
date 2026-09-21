import { pickRandom } from '../utils/random.js'

export interface CvGenerationBlueprint {
  role: string
  seniority: 'junior' | 'mid' | 'senior' | 'lead'
  language: 'English' | 'Spanish' | 'German' | 'French'
  industry: string
}

const ROLES = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer',
  'Marketing Manager',
  'Backend Developer',
  'Frontend Developer',
] as const

const SENIORITIES = ['junior', 'mid', 'senior', 'lead'] as const

const LANGUAGES = ['English', 'Spanish', 'German', 'French'] as const

const INDUSTRIES = [
  'fintech',
  'healthcare',
  'e-commerce',
  'SaaS',
  'education',
  'logistics',
] as const

export function createRandomCvBlueprint(): CvGenerationBlueprint {
  return {
    role: pickRandom(ROLES),
    seniority: pickRandom(SENIORITIES),
    language: pickRandom(LANGUAGES),
    industry: pickRandom(INDUSTRIES),
  }
}
