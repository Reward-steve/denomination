// Loader.tsx
interface LoaderProps {
  size?: number;
}

export function Loader({ size = 20 }: LoaderProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-t-2 border-t-transparent animate-spin border-accent"
    />
  );
}
