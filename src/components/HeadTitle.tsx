import React from "react";

interface HeadTitleProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export const HeadTitle: React.FC<HeadTitleProps> = ({
  title,
  subtitle,
  rightSlot,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
};
