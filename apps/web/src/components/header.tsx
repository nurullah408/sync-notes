import type { ReactNode } from 'react';

export function Header({ children, className }: { children?: ReactNode, className?: string }) {
  return (
    <header className={`flex w-full items-center ${className}`}>
      {children}
    </header>
  )
}