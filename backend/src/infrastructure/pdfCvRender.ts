import PDFDocument from 'pdfkit'
import type { CvProfile } from '@/domain/cvProfile.js'

type PdfDocumentInstance = InstanceType<typeof PDFDocument>

const MARGIN = 48
const PHOTO_SIZE = 92
const COLUMN_GAP = 20
const BODY_FONT_SIZE = 10
const SECTION_GAP = 14

function renderToBuffer(doc: PdfDocumentInstance): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    doc.end()
  })
}

function writeSectionTitle(
  doc: PdfDocumentInstance,
  title: string,
  width: number,
): void {
  doc.moveDown(0.8)
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#111111')
    .text(title.toUpperCase(), doc.x, doc.y, { width, characterSpacing: 0.6 })
  doc.moveDown(0.15)
  const lineY = doc.y
  doc
    .strokeColor('#dddddd')
    .moveTo(doc.x, lineY)
    .lineTo(doc.x + width, lineY)
    .stroke()
  doc.moveDown(0.45)
}

export async function renderCvPdf(
  profile: CvProfile,
  photo: Buffer,
): Promise<Buffer> {
  const doc = new PDFDocument({ margin: MARGIN, size: 'A4' })
  const pageWidth = doc.page.width
  const contentWidth = pageWidth - MARGIN * 2
  const headerTextWidth = contentWidth - PHOTO_SIZE - COLUMN_GAP
  const photoX = pageWidth - MARGIN - PHOTO_SIZE
  const headerTop = MARGIN

  doc.image(photo, photoX, headerTop, {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    fit: [PHOTO_SIZE, PHOTO_SIZE],
  })

  doc.font('Helvetica-Bold').fontSize(24).fillColor('#111111')
  doc.text(profile.fullName, MARGIN, headerTop, { width: headerTextWidth })

  doc.font('Helvetica').fontSize(12).fillColor('#444444')
  doc.text(profile.headline, { width: headerTextWidth })

  doc.moveDown(0.35)
  doc.fontSize(9.5).fillColor('#555555')
  doc.text(
    [profile.email, profile.phone, profile.location].join('  ·  '),
    { width: headerTextWidth },
  )

  const headerBottom = Math.max(doc.y, headerTop + PHOTO_SIZE)
  doc.y = headerBottom + SECTION_GAP
  doc.x = MARGIN

  doc
    .strokeColor('#e5e5e5')
    .moveTo(MARGIN, doc.y - 8)
    .lineTo(pageWidth - MARGIN, doc.y - 8)
    .stroke()

  writeSectionTitle(doc, 'Summary', contentWidth)
  doc
    .font('Helvetica')
    .fontSize(BODY_FONT_SIZE)
    .fillColor('#222222')
    .text(profile.summary, { width: contentWidth, align: 'justify' })

  writeSectionTitle(doc, 'Skills', contentWidth)
  doc.text(profile.skills.join('  ·  '), { width: contentWidth })

  writeSectionTitle(doc, 'Experience', contentWidth)
  for (const job of profile.experience) {
    doc
      .font('Helvetica-Bold')
      .fontSize(BODY_FONT_SIZE)
      .fillColor('#111111')
      .text(job.role, { width: contentWidth, continued: false })
    doc
      .font('Helvetica')
      .fillColor('#555555')
      .text(`${job.company}  ·  ${job.period}`, { width: contentWidth })
    doc.fillColor('#222222')
    for (const highlight of job.highlights) {
      doc.text(`• ${highlight}`, { width: contentWidth, indent: 10 })
    }
    doc.moveDown(0.35)
  }

  writeSectionTitle(doc, 'Education', contentWidth)
  for (const entry of profile.education) {
    doc
      .font('Helvetica-Bold')
      .fontSize(BODY_FONT_SIZE)
      .fillColor('#111111')
      .text(entry.degree, { width: contentWidth })
    doc
      .font('Helvetica')
      .fillColor('#555555')
      .text(`${entry.institution}  ·  ${entry.period}`, { width: contentWidth })
    doc.moveDown(0.35)
  }

  return renderToBuffer(doc)
}
