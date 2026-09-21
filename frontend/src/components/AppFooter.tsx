import './AppFooter.css'

const LINKEDIN_URL = 'https://www.linkedin.com/in/ptescayola'

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="layout-inner">
        <p className="app-footer__text">
          Pere Torres Escayola ·{' '}
          <a href="mailto:ptescayola@gmail.com">ptescayola@gmail.com</a> ·{' '}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  )
}
