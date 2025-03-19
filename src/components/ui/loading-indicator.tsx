interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator = ({ message }: LoadingIndicatorProps) => {
  return <p className="text-center text-lg">{message}</p>;
};

export default LoadingIndicator;
