import type { HTMLAttributes, ReactNode } from 'react';

interface TFooterProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export default function Footer({ children, ...props }: TFooterProps) {
  return (
    <footer {...props}>
      {children}
    </footer>
  )
}