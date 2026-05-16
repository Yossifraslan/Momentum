import { useState } from "react";
import { ONBOARDING_STEPS } from "../data/constants";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "28px",
          padding: "48px 40px",
          textAlign: "center",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Step dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "36px",
          }}
        >
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? "24px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: i === step ? "var(--accent)" : "var(--border)",
                transition: "all .3s",
              }}
            />
          ))}
        </div>

        {/* Emoji */}
        <div style={{ fontSize: "4rem", marginBottom: "20px", lineHeight: 1 }}>
          {current.emoji}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.6rem",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-.02em",
          }}
        >
          {current.title}
        </div>

        {/* Description */}
        <div
          style={{
            color: "var(--muted)",
            fontSize: ".95rem",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          {current.desc}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {step > 0 && (
            <button
              className="btn-ghost"
              onClick={() => setStep((s) => s - 1)}
              style={{ width: "auto", padding: "12px 24px" }}
            >
              ← Back
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => (isLast ? onComplete() : setStep((s) => s + 1))}
            style={{ width: "auto", padding: "12px 32px" }}
          >
            {isLast ? "Let's go 🚀" : "Next →"}
          </button>
        </div>

        {/* Skip */}
        {!isLast && (
          <button
            className="btn-ghost"
            onClick={onComplete}
            style={{ marginTop: "8px" }}
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
