import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex h-auto max-w-full min-w-0 w-fit shrink-0 cursor-pointer items-center justify-start gap-[0.3rem] overflow-hidden rounded-4xl border border-border bg-[color-mix(in_srgb,var(--background)_45%,var(--card))] px-[0.55rem] py-1 text-[0.6875rem] font-normal leading-[1.2] whitespace-nowrap text-foreground no-underline transition-all hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] hover:bg-[color-mix(in_srgb,var(--primary)_8%,var(--card))] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3.5! [&>svg]:text-primary',
)

function Badge({
  className,
  render,
  ...props
}: useRender.ComponentProps<'span'>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants(), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
    },
  })
}

export { Badge }
