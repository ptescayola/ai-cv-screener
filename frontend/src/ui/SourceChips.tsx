import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { cvDownloadUrl } from '../modules/chat/infrastructure/cvDownloadUrl'
import { stripPdfExtension } from '../utils/string'
import './SourceChips.css'

type SourceChipsProps = {
  sources: string[]
}

export function SourceChips({ sources }: SourceChipsProps) {
  if (sources.length === 0) {
    return null
  }

  return (
    <div className="source-chips">
      <span className="source-chips__label">Sources</span>
      <ul className="source-chips__list">
        {sources.map((fileName) => (
          <li key={fileName}>
            <a
              className="source-chip"
              href={cvDownloadUrl(fileName)}
              download={fileName}
              title={fileName}
              aria-label={`Download CV ${fileName}`}
            >
              <DocumentTextIcon className="source-chip__icon" aria-hidden />
              <span className="source-chip__name">
                {stripPdfExtension(fileName)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
