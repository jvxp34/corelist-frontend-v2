interface LogoProps {
  tamanho?: 'sm' | 'md'
}

function Logo({ tamanho = 'md' }: LogoProps) {
  const caixa =
    tamanho === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-9 w-9 rounded-xl'

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center bg-brand-600 text-white ${caixa}`}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
          <path d="m10 10.5 2 2 4-4" />
          <circle cx="10" cy="20" r="1.2" />
          <circle cx="17" cy="20" r="1.2" />
        </svg>
      </div>

      <span className="font-display text-lg font-bold tracking-tight text-ink">
        CompraFácil
      </span>
    </div>
  )
}

export default Logo
