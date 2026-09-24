import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="history-page page-width">
      <p className="eyebrow"><span className="status-dot" /> History</p>
      <h1>Scan History<span>.</span></h1>
      <p className="hero-description">Review your previous analyses.</p>
      <HistoryList />
    </main>
  );
}