interface Props {
  className?: string
  style?: React.CSSProperties
}

export default function CrossIcon({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 10 14"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-block', ...style }}
    >
      <rect x="4" y="0" width="2" height="14" />
      <rect x="0" y="4" width="10" height="2" />
    </svg>
  )
}
