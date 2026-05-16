import { useState, useEffect } from "react";
import { useAuth, useHabits, useSettings } from "./hooks/useHabits";
import { THEMES } from "./data/constants";
import type { Page } from "./types/index";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import Onboarding from "./components/Onboarding";
import SkeletonLoader from "./components/SkeletonLoader";

const NAV = [
  { page: "dashboard", icon: "🏠", label: "Dashboard" },
  { page: "calendar", icon: "📅", label: "Calendar" },
  { page: "settings", icon: "⚙️", label: "Settings" },
] as const;

export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState<Page>("dashboard");
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);

  const {
    authed,
    authMode,
    currentUser,
    authErr,
    authForm,
    setAuthForm,
    handleAuth,
    logout,
    switchMode,
  } = useAuth();

  const { settings, toggleSetting, setTheme, completeOnboarding } =
    useSettings();

  const {
    habits,
    quote,
    form,
    setForm,
    addHabit,
    editHabit,
    toggleComplete,
    deleteHabit,
    clearAllHabits,
    applySuggestion,
  } = useHabits(settings.soundEffects);

  useEffect(() => {
    const t = THEMES[settings.theme];
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent-light", t.light);
  }, [settings.theme]);

  useEffect(() => {
    const splash = setTimeout(() => setShowSplash(false), 2200);
    const loading = setTimeout(() => setLoading(false), 2600);
    return () => {
      clearTimeout(splash);
      clearTimeout(loading);
    };
  }, []);

  document.body.className = dark ? "" : "light";

  if (showSplash) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          gap: "16px",
          padding: "24px 18px",
          textAlign: "center",
        }}
      >
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: .35; }
          }
          .splash-title {
            font-family: 'Syne', sans-serif;
            font-size: clamp(2rem, 9vw, 3rem);
            font-weight: 800;
            letter-spacing: -.04em;
            line-height: 1;
            background: linear-gradient(135deg, #ffffff 40%, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline-block;
            width: auto;
            white-space: nowrap;
            overflow: visible;
            animation: fadeInUp .7s ease both;
          }
          .splash-sub {
            color: var(--muted);
            font-size: .95rem;
            max-width: 100%;
            animation: fadeInUp .7s ease .2s both, pulse 1.6s ease .9s infinite;
          }
          .splash-dots {
            display: flex;
            gap: 8px;
            animation: fadeInUp .7s ease .4s both;
          }
          @media (max-width: 420px) {
            .splash-title {
              font-size: clamp(2.2rem, 12vw, 3.2rem);
            }
            .splash-sub {
              font-size: .85rem;
            }
          }
        `}</style>

        <div className="splash-title">Momentum</div>
        <div className="splash-sub">Building habits, one day at a time.</div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
            animation: "fadeInUp .7s ease .4s both",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent)",
                animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <Auth
        authMode={authMode}
        authErr={authErr}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
        switchMode={switchMode}
      />
    );
  }

  if (!settings.onboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const renderPage = () => {
    if (loading) return <SkeletonLoader />;
    if (page === "dashboard")
      return (
        <Dashboard
          habits={habits}
          quote={quote}
          form={form}
          showStreak={settings.showStreak}
          setForm={setForm}
          onAdd={addHabit}
          onToggle={toggleComplete}
          onDelete={deleteHabit}
          onEdit={editHabit}
          onApplySuggestion={applySuggestion}
        />
      );
    if (page === "calendar") return <Calendar habits={habits} />;
    if (page === "settings")
      return (
        <Settings
          settings={settings}
          toggleSetting={toggleSetting}
          setTheme={setTheme}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          currentUser={currentUser}
          onLogout={logout}
          onClearHabits={clearAllHabits}
        />
      );
  };

  return (
    <div className="app-shell">
      {/* Desktop sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span>Momentum</span>
        </div>
        {NAV.map((n) => (
          <button
            key={n.page}
            className={`nav-item ${page === n.page ? "active" : ""}`}
            onClick={() => setPage(n.page)}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div
            style={{
              padding: "8px 14px",
              fontSize: ".78rem",
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            👤 {currentUser}
          </div>
          <button className="nav-item" onClick={() => setDark((d) => !d)}>
            <span className="nav-icon">{dark ? "☀️" : "🌙"}</span>
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">{renderPage()}</div>

      {/* Mobile bottom nav */}
      <div className="bottom-nav">
        {NAV.map((n) => (
          <button
            key={n.page}
            className={`bottom-nav-item ${page === n.page ? "active" : ""}`}
            onClick={() => setPage(n.page)}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
