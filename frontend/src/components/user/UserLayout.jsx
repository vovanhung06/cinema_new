import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
