import React from 'react';
export const Card = ({ className = '', ...props }) => <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props} />;
export const CardHeader = ({ className='', ...props }) => <div className={`p-4 pb-0 ${className}`} {...props} />;
export const CardTitle = ({ className='', children }) => <h3 className={`font-semibold leading-tight ${className}`}>{children}</h3>;
export const CardContent = ({ className='', ...props }) => <div className={`p-4 pt-2 ${className}`} {...props} />;
export const CardFooter = ({ className='', ...props }) => <div className={`p-4 pt-0 ${className}`} {...props} />;
export default Card;