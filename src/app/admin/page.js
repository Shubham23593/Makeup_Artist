"use client";
import React from 'react';
import Heading from '@/components/Heading';

export default function Admin() {
  return (
    <div className="ed-container py-24 md:py-32">
      <Heading 
         subtitle="Admin"
         title="Studio Administration"
      />
      <div className="mt-8 border border-[#2A2522]/10 p-10 bg-white">
        <p className="font-serif italic text-xl">The administration panel is securely restricted.</p>
      </div>
    </div>
  );
}
