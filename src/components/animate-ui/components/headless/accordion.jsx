import * as React from 'react';
import { ArrowUpRight, ChevronDownIcon } from 'lucide-react';

import {
  Disclosure as DisclosurePrimitive,
  DisclosureButton as DisclosureButtonPrimitive,
  DisclosurePanel as DisclosurePanelPrimitive,
} from '@/components/animate-ui/primitives/headless/disclosure';
import { cn } from '@/lib/utils';

function Accordion(
  {
    as: Component = 'div',
    ...props
  }
) {
  return <Component data-slot="accordion" {...props} />;
}

function AccordionItem(
  {
    className,
    children,
    ...props
  }
) {
  return (
    <DisclosurePrimitive {...props}>
      {(bag) => (
        <div className={cn('border-b border-[#A17E3C] last:border-b-0', className)}>
          {typeof children === 'function' ? children(bag) : children}
        </div>
      )}
    </DisclosurePrimitive>
  );
}

function AccordionButton({
  className,
  children,
  showArrow = true,
  ...props
}) {
  return (
    <DisclosureButtonPrimitive
      className={cn(
        'focus-visible:border-ring ] focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 w-full rounded-md py-8 text-black font-["IvyMode"] text-left text-4xl font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-open]>svg]:rotate-90 [&[data-open]>svg]:bg-white [&[data-open]>svg]:text-[#A17E3C] [&[data-open]>svg]:border [&[data-open]>svg]:border-[#A17E3C] cursor-pointer',
        className
      )}
      {...props}>
      {(bag) => (
        <>
          <div className="flex items-center gap-3">
            <div className='size-3 aspect-square rounded-full bg-[#A17E3C]' />
            {typeof children === 'function' ? children(bag) : children}
          </div>
          {showArrow && (
            <ArrowUpRight
              className="text-[#fff] bg-[#A17E3C] rounded-full  pointer-events-none size-12 p-2.5 shrink-0 translate-y-0.5 transition-transform duration-200" />
          )}
        </>
      )}
    </DisclosureButtonPrimitive>
  );
}

function AccordionPanel(
  {
    className,
    children,
    ...props
  }
) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DisclosurePanelPrimitive {...props}>
      {(bag) => (
        <div className={cn('text-sm font-["Verdana"] text-[#59595B] pt-0 pb-8', className)}>
          {typeof children === 'function' ? children(bag) : children}
        </div>
      )}
    </DisclosurePanelPrimitive>
  );
}

export { Accordion, AccordionItem, AccordionButton, AccordionPanel };
