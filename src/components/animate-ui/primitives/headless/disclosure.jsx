'use client';;
import * as React from 'react';
import {
  Disclosure as DisclosurePrimitive,
  DisclosureButton as DisclosureButtonPrimitive,
  DisclosurePanel as DisclosurePanelPrimitive,
} from '@headlessui/react';
import { motion, AnimatePresence } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';

const [DisclosureProvider, useDisclosure] =
  getStrictContext('DisclosureContext');

function Disclosure(
  {
    children,
    ...props
  }
) {
  return (
    <DisclosurePrimitive data-slot="disclosure" {...props}>
      {(bag) => (
        <DisclosureProvider value={{ isOpen: bag.open }}>
          {typeof children === 'function' ? children(bag) : children}
        </DisclosureProvider>
      )}
    </DisclosurePrimitive>
  );
}

function DisclosureButton(props) {
  return <DisclosureButtonPrimitive data-slot="disclosure-button" {...props} />;
}

function DisclosurePanel(props) {
  const {
    children,
    transition = { type: 'spring', stiffness: 150, damping: 22 },
    as = motion.div,
    unmount,
    keepRendered = false,
    ...rest
  } = props;
  const { isOpen } = useDisclosure();

  return (
    <AnimatePresence>
      {keepRendered ? (
        <DisclosurePanelPrimitive static as={as} unmount={unmount}>
          {(bag) => (
            <motion.div
              key="disclosure-panel"
              data-slot="disclosure-panel"
              initial={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
              animate={
                isOpen
                  ? { height: 'auto', opacity: 1, '--mask-stop': '100%' }
                  : { height: 0, opacity: 0, '--mask-stop': '0%' }
              }
              transition={transition}
              style={{
                maskImage:
                  'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
                WebkitMaskImage:
                  'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
                overflow: 'hidden',
              }}
              {...rest}>
              {typeof children === 'function' ? children(bag) : children}
            </motion.div>
          )}
        </DisclosurePanelPrimitive>
      ) : (
        isOpen && (
          <DisclosurePanelPrimitive static as={as} unmount={unmount}>
            {(bag) => (
              <motion.div
                key="disclosure-panel"
                data-slot="disclosure-panel"
                initial={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
                animate={{ height: 'auto', opacity: 1, '--mask-stop': '100%' }}
                exit={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
                transition={transition}
                style={{
                  maskImage:
                    'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
                  WebkitMaskImage:
                    'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
                  overflow: 'hidden',
                }}
                {...rest}>
                {typeof children === 'function' ? children(bag) : children}
              </motion.div>
            )}
          </DisclosurePanelPrimitive>
        )
      )}
    </AnimatePresence>
  );
}

export { Disclosure, DisclosureButton, DisclosurePanel, useDisclosure };
