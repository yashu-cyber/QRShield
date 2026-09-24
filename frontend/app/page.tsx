import Link from "next/link";
import InputTypeCard from "@/components/InputTypeCard";

const inputTypes = [
  { label: "QR Code", detail: "Scan an image", symbol: "QR", href: "/analyze?type=qr" },
  { label: "URL", detail: "Inspect a link", symbol: "URL", href: "/analyze?type=url" },
  { label: "SMS", detail: "Review a message", symbol: "SMS", href: "/analyze?type=sms" },
  { label: "Phone", detail: "Check a number", symbol: "TEL", href: "/analyze?type=phone" },
  { label: "Email", detail: "Screen an address", symbol: "@", href: "/analyze?type=email" },
  { label: "Screenshot", detail: "Upload an image", symbol: "IMG", href: "/analyze?type=screenshot" },
];

export default function Home() {
  return (
    <main className="site-main">
      <section className="hero-shell page-width">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Security analysis workspace</p>
          <h1>Don&apos;t trust it.<br /><span>Analyze it.</span></h1>
          <p className="hero-description">
            Analyze suspicious QR codes, links, messages, phone numbers, emails, and screenshots before you interact with them.
          </p>
          <Link className="primary-button" href="/analyze">
            Analyze Something <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
        <div className="hero-aside" aria-label="QRShield protection status">
          <div className="shield-mark">QS</div>
          <div>
            <p className="aside-label">QRShield protection</p>
            <p className="aside-value">Ready when you are</p>
          </div>
        </div>
      </section>

      <section className="input-section page-width" aria-labelledby="input-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Choose an input</p>
            <h2 id="input-heading">What would you like to check?</h2>
          </div>
          <p className="section-note">Select a starting point. Analysis tools are coming next.</p>
        </div>
        <div className="input-grid">
          {inputTypes.map((inputType) => <InputTypeCard key={inputType.label} {...inputType} />)}
        </div>
      </section>
    </main>
  );
}
