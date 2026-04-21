import React from 'react';
import Link from 'next/link';

export default function PrimaryButton({ 
  href, 
  outline = false, 
  children, 
  className = '', 
  as = 'link', 
  onClick, 
  testId, 
  ...props 
}) {
  const baseClass = outline ? 'btn-outline' : 'btn-primary';
  const combinedClass = `${baseClass} ${className}`;

  if (as === 'button') {
    return (
      <button className={combinedClass} onClick={onClick} data-testid={testId} {...props}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={combinedClass} data-testid={testId} {...props}>
        {children}
    </Link>
  );
}
