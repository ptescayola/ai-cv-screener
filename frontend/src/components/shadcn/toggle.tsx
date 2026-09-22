import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'role' | 'type' | 'onChange'
> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const iconClass =
  'size-[1.125rem] shrink-0 opacity-40 transition-[opacity,color] duration-150'

function Toggle({
  checked,
  onCheckedChange,
  className,
  id,
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      data-checked={checked ? '' : undefined}
      className={cn(
        'group/toggle relative isolate inline-flex cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-3 py-2 text-muted-foreground transition-colors outline-none',
        'before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-foreground before:opacity-0 before:transition-opacity hover:before:opacity-[0.07]',
        'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <SunIcon
        className={cn(
          iconClass,
          'group-not-data-checked/toggle:opacity-100 group-not-data-checked/toggle:text-foreground',
        )}
      />
      <span
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full bg-border transition-colors duration-200',
          'group-data-checked/toggle:bg-primary',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-4 rounded-full bg-card shadow-sm transition-transform duration-200',
            'group-data-checked/toggle:translate-x-4',
          )}
        />
      </span>
      <MoonIcon
        className={cn(
          iconClass,
          'group-data-checked/toggle:opacity-100 group-data-checked/toggle:text-foreground',
        )}
      />
    </button>
  )
}

export { Toggle }
