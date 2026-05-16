import type { Settings as SettingsType, Theme } from "../types/index";
import { THEMES } from "../data/constants";

interface SettingsProps {
  settings: SettingsType;
  toggleSetting: (key: keyof Omit<SettingsType, "theme" | "onboarded">) => void;
  setTheme: (theme: Theme) => void;
  dark: boolean;
  onToggleDark: () => void;
  currentUser: string | null;
  onLogout: () => void;
  onClearHabits: () => void;
}

function ToggleSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={`toggle-switch ${on ? "on" : ""}`} onClick={onClick} />
  );
}

function SettingsRow({
  label,
  sub,
  right,
}: {
  label: string;
  sub?: string;
  right: React.ReactNode;
}) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export default function Settings({
  settings,
  toggleSetting,
  setTheme,
  dark,
  onToggleDark,
  currentUser,
  onLogout,
  onClearHabits,
}: SettingsProps) {
  return (
    <div>
      <div className="page-title">Settings</div>

      <div className="settings-section">
        <div className="settings-section-title">Account</div>
        <SettingsRow
          label="Logged in as"
          sub={currentUser ?? "Unknown"}
          right={
            <button className="danger-btn" onClick={onLogout}>
              Log Out
            </button>
          }
        />
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Appearance</div>
        <SettingsRow
          label="Dark Mode"
          sub="Switch between dark and light theme"
          right={<ToggleSwitch on={dark} onClick={onToggleDark} />}
        />
        <div
          className="settings-row"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div>
            <div className="settings-row-label">Accent Theme</div>
            <div className="settings-row-sub">Choose your app colour</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {(
              Object.entries(THEMES) as [
                Theme,
                (typeof THEMES)[keyof typeof THEMES],
              ][]
            ).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  border: `2px solid ${settings.theme === key ? t.accent : "var(--border)"}`,
                  background:
                    settings.theme === key ? t.accent : "var(--surface)",
                  color: settings.theme === key ? "#fff" : "var(--muted)",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: ".85rem",
                  cursor: "pointer",
                  transition: "all .2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.accent,
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Preferences</div>
        <SettingsRow
          label="Notifications"
          sub="Enable habit reminder notifications"
          right={
            <ToggleSwitch
              on={settings.notifications}
              onClick={() => toggleSetting("notifications")}
            />
          }
        />
        <SettingsRow
          label="Sound Effects"
          sub="Play a sound when completing a habit"
          right={
            <ToggleSwitch
              on={settings.soundEffects}
              onClick={() => toggleSetting("soundEffects")}
            />
          }
        />
        <SettingsRow
          label="Week Starts on Monday"
          sub="Changes the calendar start day"
          right={
            <ToggleSwitch
              on={settings.weekStartsMonday}
              onClick={() => toggleSetting("weekStartsMonday")}
            />
          }
        />
        <SettingsRow
          label="Show Streak Badges"
          sub="Display streak info on each habit"
          right={
            <ToggleSwitch
              on={settings.showStreak}
              onClick={() => toggleSetting("showStreak")}
            />
          }
        />
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Data</div>
        <SettingsRow
          label="Clear All Habits"
          sub="Permanently delete all your habits"
          right={
            <button
              className="danger-btn"
              onClick={() => {
                if (window.confirm("Are you sure? This cannot be undone."))
                  onClearHabits();
              }}
            >
              Clear All
            </button>
          }
        />
      </div>

      <div className="settings-section">
        <div className="settings-section-title">About</div>
        <SettingsRow
          label="App"
          right={
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              Momentum
            </span>
          }
        />
        <SettingsRow
          label="Version"
          right={
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              1.0.0
            </span>
          }
        />
        <SettingsRow
          label="Built with"
          right={
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              React + TypeScript + Vite
            </span>
          }
        />
      </div>
    </div>
  );
}
