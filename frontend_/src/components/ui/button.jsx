import React from 'react';
const variants = {
  default: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border border-slate-300 hover:bg-slate-50',
  ghost: 'hover:bg-slate-100',
  destructive: 'bg-red-600 text-white hover:bg-red-500'
};
export const Button = ({ variant='default', className='', size='md', ...props }) => {
  const sizes = { sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-2', lg: 'text-base px-4 py-2' };
  return <button className={`rounded-md font-medium transition ${variants[variant]||variants.default} ${sizes[size]} ${className}`} {...props} />;
};
export default Button;