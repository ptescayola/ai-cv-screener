import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border border-border bg-background hover:bg-muted hover:text-foreground',
        ghost: 'hover:bg-muted hover:text-foreground',
      },
      size: {
        default: 'h-9 px-4',
        xs: 'h-7 gap-1 px-2',
        'icon-xs': 'size-7 [&_svg:not([class*="size-"])]:size-3.5',
      },
    },
    compoundVariants: [
      {
        variant: 'ghost',
        size: 'xs',
        class:
          'h-auto min-h-0 gap-1 rounded-sm bg-transparent px-1.5 py-0.5 !text-[0.6875rem] !font-normal !leading-none !text-muted-foreground shadow-none hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:text-foreground focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 [&_svg:not([class*="size-"])]:!size-3',
      },
      {
        variant: 'outline',
        size: 'xs',
        class:
          'h-auto min-h-0 gap-1 rounded-full px-3 py-1.5 !text-xs !font-medium shadow-sm',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
