import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/loading.json';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export function LoadingAnimation({ size = 'md', className = '' }: LoadingAnimationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={sizeMap[size]}>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
} 