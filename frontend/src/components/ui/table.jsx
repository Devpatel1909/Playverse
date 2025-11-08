import React from 'react';
export const Table = ({ className='', ...props }) => <table className={`w-full text-sm ${className}`} {...props} />;
export const TableHeader = ({ className='', ...props }) => <thead className={className} {...props} />;
export const TableBody = ({ className='', ...props }) => <tbody className={className} {...props} />;
export const TableRow = ({ className='', ...props }) => <tr className={`border-b last:border-0 ${className}`} {...props} />;
export const TableHead = ({ className='', ...props }) => <th className={`text-left font-medium px-2 py-1 ${className}`} {...props} />;
export const TableCell = ({ className='', ...props }) => <td className={`px-2 py-1 ${className}`} {...props} />;
export default Table;