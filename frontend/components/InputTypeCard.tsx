import Link from "next/link";

type InputTypeCardProps = {
  label: string;
  detail: string;
  symbol: string;
  href: string;
};

export default function InputTypeCard({ label, detail, symbol, href }: InputTypeCardProps) {
  return (
    <Link className="input-card" href={href}>
      <span className="input-symbol" aria-hidden="true">{symbol}</span>
      <span>
        <h3>{label}</h3>
        <p>{detail}</p>
      </span>
      <span className="card-arrow" aria-hidden="true">-&gt;</span>
    </Link>
  );
}