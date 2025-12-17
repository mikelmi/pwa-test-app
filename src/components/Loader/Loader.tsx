import "./Loader.css";

type Props = {
  size?: number;
};

export default function Loader({ size }: Props) {
  return (
    <div
      className="loader"
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
    />
  );
}
