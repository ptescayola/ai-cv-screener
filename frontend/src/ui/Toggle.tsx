import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import type { ButtonHTMLAttributes } from 'react'
import './Toggle.css'

type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'role' | 'type' | 'onChange'
> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}

export function Toggle({
  checked,
  onCheckedChange,
  label = 'Toggle color theme',
  className,
  id,
  ...props
}: ToggleProps) {
  const classes = ['toggle', className].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={classes}
      data-checked={checked ? '' : undefined}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <SunIcon className="toggle__icon toggle__icon--sun" aria-hidden="true" />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <MoonIcon className="toggle__icon toggle__icon--moon" aria-hidden="true" />
    </button>
  )
}
