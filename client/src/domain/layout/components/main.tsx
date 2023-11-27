import React from 'react';

interface MainProps {
  children?: React.ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main className="flex flex-col flex-1 overflow-hidden relative border-b border-t px-4">
      {children}
    </main>
  );
}
