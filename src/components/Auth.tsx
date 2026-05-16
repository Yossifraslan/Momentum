interface AuthProps {
  authMode: "login" | "register";
  authErr: string;
  authForm: { email: string; password: string };
  setAuthForm: (form: { email: string; password: string }) => void;
  handleAuth: () => void;
  switchMode: () => void;
}

export default function Auth({
  authMode,
  authErr,
  authForm,
  setAuthForm,
  handleAuth,
  switchMode,
}: AuthProps) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">
          <span>Momentum</span>
        </div>
        <div className="auth-sub">Smart Habit Tracker</div>

        {authErr && <div className="error-msg">{authErr}</div>}

        <div className="field">
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          />
        </div>
        <div className="field">
          <input
            type="password"
            placeholder="Password (min 4 chars)"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          />
        </div>

        <button className="btn-primary" onClick={handleAuth}>
          {authMode === "login" ? "Log In" : "Create Account"}
        </button>
        <button className="btn-ghost" onClick={switchMode}>
          {authMode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
}
