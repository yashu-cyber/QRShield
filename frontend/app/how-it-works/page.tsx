import Link from "next/link";

const flowSteps = [
  { number: "01", title: "Submit", description: "Provide a QR code, URL, SMS, phone number, email, or screenshot." },
  { number: "02", title: "Analyze", description: "QRShield processes the submitted content and examines relevant signals." },
  { number: "03", title: "Identify Indicators", description: "Look for suspicious patterns such as phishing, impersonation, URLs, and social engineering signals." },
  { number: "04", title: "Explain the Risk", description: "See a risk score, risk level, threat type, indicators, and explanation." },
  { number: "05", title: "Decide Safely", description: "Use the recommendation to proceed, avoid, or investigate further." },
];

const analyzableTypes = [
  { symbol: "QR", title: "QR Codes", description: "Inspect QR-based destinations and payment-related QR content." },
  { symbol: "URL", title: "URLs", description: "Examine suspicious links and URL-related indicators." },
  { symbol: "SMS", title: "SMS", description: "Analyze suspicious messages and social-engineering patterns." },
  { symbol: "TEL", title: "Phone", description: "Review phone-related risk signals without assuming an unknown number is malicious." },
  { symbol: "@", title: "Email", description: "Analyze sender and message information for suspicious indicators." },
  { symbol: "IMG", title: "Screenshots", description: "Analyze uploaded screenshots containing potentially suspicious content." },
];

const resultFields = [
  { label: "Risk Score", description: "A clear score that summarizes the available signals." },
  { label: "Risk Level", description: "A simple LOW, SUSPICIOUS, or HIGH risk classification." },
  { label: "Threat Type", description: "The kind of suspicious pattern represented by the response." },
  { label: "Indicators", description: "The specific signals that contributed to the explanation." },
  { label: "Analysis", description: "A concise explanation of what the available signals mean." },
  { label: "Recommendation", description: "Practical guidance for deciding what to do next." },
];

export default function HowItWorksPage() {
  return (
    <main className="how-page page-width">
      <section className="how-hero">
        <div>
          <p className="eyebrow"><span className="status-dot" /> How it works</p>
          <h1>How QRShield Works<span>.</span></h1>
          <p className="hero-description">Submit suspicious content, analyze its signals, and understand the risk before you interact with it.</p>
          <Link className="primary-button" href="/analyze">Analyze Something <span aria-hidden="true">-&gt;</span></Link>
        </div>
        <div className="how-hero-aside"><span className="shield-mark">QS</span><p>Clarity before<br />you click.</p></div>
      </section>

      <section className="how-section flow-section" aria-labelledby="flow-heading">
        <div className="how-section-heading"><div><p className="eyebrow">The analysis flow</p><h2 id="flow-heading">From uncertainty to a safer decision.</h2></div><span className="section-count">5 steps</span></div>
        <div className="flow-grid">
          {flowSteps.map((step) => <article className="flow-step" key={step.number}><div className="flow-number">{step.number}</div><div><h3>{step.title}</h3><p>{step.description}</p></div></article>)}
        </div>
      </section>

      <section className="how-section" aria-labelledby="capabilities-heading">
        <div className="how-section-heading"><div><p className="eyebrow">Input types</p><h2 id="capabilities-heading">What QRShield can analyze.</h2></div></div>
        <div className="how-card-grid">
          {analyzableTypes.map((item) => <article className="how-card" key={item.title}><span className="how-card-symbol" aria-hidden="true">{item.symbol}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}
        </div>
      </section>

      <section className="how-section" aria-labelledby="result-heading">
        <div className="how-section-heading"><div><p className="eyebrow">The result</p><h2 id="result-heading">Everything you need to make a clearer call.</h2></div></div>
        <div className="result-field-grid">
          {resultFields.map((field, index) => <article className="result-field" key={field.label}><span className="result-field-index">0{index + 1}</span><div><h3>{field.label}</h3><p>{field.description}</p></div></article>)}
        </div>
      </section>

      <aside className="limitations-note" aria-labelledby="limitations-heading"><p className="eyebrow">Important limitations</p><h2 id="limitations-heading">Use the result as guidance, not a guarantee.</h2><p>QRShield provides risk analysis based on available signals. A result is not a guarantee that content is safe or malicious. Users should avoid sharing credentials, payment information, or sensitive data with suspicious sources.</p></aside>

      <section className="how-final-cta" aria-labelledby="final-cta-heading"><p className="eyebrow"><span className="status-dot" /> Ready when you are</p><h2 id="final-cta-heading">Have something suspicious?</h2><p>Analyze it before you trust it.</p><Link className="primary-button" href="/analyze">Start Analysis <span aria-hidden="true">-&gt;</span></Link></section>
    </main>
  );
}