export default function Logo({ size = 20 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center border border-text-primary font-display font-bold tracking-wider text-text-primary uppercase text-[9px] leading-none w-5 h-5"
      aria-hidden="true"
    >
      D4
    </div>
  )
}
