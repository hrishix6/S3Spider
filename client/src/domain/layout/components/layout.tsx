import React from 'react';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';

interface Props {
  children?: React.ReactNode;
}

export function Layout(props: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <Header />
      <Main>{props.children}</Main>
      <Footer />
    </div>
  );
}
