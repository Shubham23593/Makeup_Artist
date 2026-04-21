import React from 'react';

export default function Heading({ 
  as: Component = 'h2', 
  title, 
  subtitle, 
  className = '', 
  titleClassName = 'text-4xl sm:text-5xl lg:text-6xl', 
  subtitleClassName = '', 
  align = 'left', 
  ...props 
}) {
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} ${className}`} {...props}>
      {subtitle && <span className={`label-xs ${subtitleClassName}`}>{subtitle}</span>}
      <Component className={`font-serif tracking-tighter leading-[0.95] font-light mt-4 ${titleClassName}`} dangerouslySetInnerHTML={{__html: title}} />
    </div>
  );
}
