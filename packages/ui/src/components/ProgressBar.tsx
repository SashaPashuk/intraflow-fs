interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="w-full bg-gray-200 h-2 rounded">
    <div
      className="h-2 bg-blue-500 rounded transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);
