import { FC, ReactNode } from 'react';

interface IUnseenCountsProps {
  children: ReactNode;
}

const UnseenCounts: FC<IUnseenCountsProps> = ({ children }) => {
  return (
    <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-indigo-600 rounded-full">
      {children}
    </span>
  );
};

export default UnseenCounts;
