import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { generateCv, type GenerateCvDeps } from '@/application/generateCv.js'
import type { CvGenerationBlueprint } from '@/domain/cvBlueprint.js'
import type { CvProfile, GeneratedCv } from '@/domain/cvProfile.js'

const blueprint: CvGenerationBlueprint = {
  role: 'Backend Developer',
  seniority: 'senior',
  language: 'English',
  industry: 'SaaS',
}

const profile: CvProfile = {
  fullName: 'Ada Lovelace',
  headline: 'Backend Developer',
  email: 'ada@example.com',
  phone: '+1',
  location: 'London',
  language: 'English',
  seniority: 'senior',
  summary: 'Summary',
  skills: ['TypeScript'],
  experience: [],
  education: [],
  photoDescription: 'Professional headshot',
}

const savedCv: GeneratedCv = {
  id: 'cv-id',
  fileName: 'ada-lovelace-cv-id.pdf',
  filePath: '/tmp/ada-lovelace-cv-id.pdf',
  profile,
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('generateCv', () => {
  it('runs the CV generation pipeline in order', async () => {
    const steps: string[] = []
    const pdf = Buffer.from('pdf')
    const photo = Buffer.from('photo')

    const deps: GenerateCvDeps = {
      outputDir: '/cvs',
      createBlueprint: () => {
        steps.push('blueprint')
        return blueprint
      },
      generateProfile: async (input) => {
        steps.push('profile')
        assert.deepEqual(input, blueprint)
        return profile
      },
      generatePhoto: async (input) => {
        steps.push('photo')
        assert.deepEqual(input, profile)
        return photo
      },
      renderPdf: async (inputProfile, inputPhoto) => {
        steps.push('render')
        assert.deepEqual(inputProfile, profile)
        assert.equal(inputPhoto, photo)
        return pdf
      },
      savePdf: async (inputPdf, inputProfile, outputDir) => {
        steps.push('save')
        assert.equal(inputPdf, pdf)
        assert.deepEqual(inputProfile, profile)
        assert.equal(outputDir, '/cvs')
        return savedCv
      },
    }

    const result = await generateCv(deps)

    assert.deepEqual(steps, [
      'blueprint',
      'profile',
      'photo',
      'render',
      'save',
    ])
    assert.equal(result, savedCv)
  })
})
