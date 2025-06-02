import { LoadingAnimation } from './LoadingAnimation';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <LoadingAnimation size="lg" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
} 