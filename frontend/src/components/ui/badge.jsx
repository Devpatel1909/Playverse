import React from 'react';
export const Badge = ({ variant='default', className='', ...props }) => {
  const styles = {
    default: 'bg-slate-900 text-white',
    secondary: 'bg-slate-200 text-slate-700',
    outline: 'border border-slate-300 text-slate-700'
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]||styles.default} ${className}`} {...props} />;
};
export default Badge;