import AnimatedUnderline from "@/components/ui/animated-underline";

export default function Navbar({ activeTab, onTabChange }) {
  return (
    <header className="top-nav">
      <div className="brand-mark">Discounted <span>Cash Flow</span> Model</div>
      <nav className="nav-link-row" role="tablist" aria-label="Page sections">
        <AnimatedUnderline
          label="What is DCF?"
          active={activeTab === "information"}
          onClick={() => onTabChange("information")}
        />
        <AnimatedUnderline
          label="Visualization"
          active={activeTab === "analysis"}
          onClick={() => onTabChange("analysis")}
        />
      </nav>
    </header>
  );
}
