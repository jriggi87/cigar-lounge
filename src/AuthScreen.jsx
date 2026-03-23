import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "./database";

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // login, signup, forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const name = displayName.trim() || "Aficionado";
        const avatar = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        await createUserProfile(cred.user.uid, {
          name,
          avatar,
          email: cred.user.email,
        });
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
        setLoading(false);
        return;
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const msg = err.code === "auth/user-not-found" ? "No account found with this email"
        : err.code === "auth/wrong-password" ? "Incorrect password"
        : err.code === "auth/email-already-in-use" ? "An account with this email already exists"
        : err.code === "auth/invalid-email" ? "Please enter a valid email address"
        : err.code === "auth/invalid-credential" ? "Invalid email or password"
        : err.code === "auth/too-many-requests" ? "Too many attempts. Please try again later"
        : err.message || "Something went wrong";
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Check if user profile exists, if not create one
      const existing = await getUserProfile(result.user.uid);
      if (!existing) {
        const name = result.user.displayName || "Aficionado";
        const avatar = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        await createUserProfile(result.user.uid, {
          name,
          avatar,
          email: result.user.email,
          photo: result.user.photoURL || null,
        });
      }
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign-in failed");
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10,
    padding: "14px 16px", color: "#e8dcc8", fontSize: 15, fontFamily: "'Cormorant Garamond', serif",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      background: "#0f0c08", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "20px",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Logo / Branding */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #D4A754, #8B6914)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", fontSize: 36,
          boxShadow: "0 8px 32px rgba(212, 167, 84, 0.2)",
        }}>🔥</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", color: "#D4A754",
          fontSize: 32, margin: 0, fontWeight: 700, letterSpacing: "0.02em",
        }}>Cigar Lounge</h1>
        <p style={{ color: "#6b5e4f", fontSize: 14, margin: "6px 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Rate • Collect • Share
        </p>
      </div>

      {/* Auth Card */}
      <div style={{
        width: "100%", maxWidth: 380,
        background: "linear-gradient(135deg, #1e1a14, #16120d)",
        border: "1px solid #2a2318", borderRadius: 16, padding: "28px 24px",
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", color: "#e8dcc8",
          fontSize: 22, margin: "0 0 20px", textAlign: "center",
        }}>
          {mode === "signup" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Welcome Back"}
        </h2>

        {/* Google Sign In */}
        {mode !== "forgot" && (
          <>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%", background: "#fff", border: "none", borderRadius: 10,
                padding: "12px 16px", fontSize: 15, fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700, cursor: loading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                color: "#333", transition: "all 0.2s", opacity: loading ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14, margin: "20px 0",
            }}>
              <div style={{ flex: 1, height: 1, background: "#2a2318" }} />
              <span style={{ color: "#5a5040", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#2a2318" }} />
            </div>
          </>
        )}

        {/* Email Form */}
        <div style={{ display: "grid", gap: 12 }}>
          {mode === "signup" && (
            <input
              style={inputStyle}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              type="text"
            />
          )}
          <input
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            autoComplete="email"
          />
          {mode !== "forgot" && (
            <input
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          )}
          {mode === "signup" && (
            <input
              style={inputStyle}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              type="password"
              autoComplete="new-password"
            />
          )}
        </div>

        {/* Forgot password link */}
        {mode === "login" && (
          <button
            onClick={() => { setMode("forgot"); setError(null); }}
            style={{
              background: "none", border: "none", color: "#D4A754", fontSize: 13,
              fontFamily: "'Cormorant Garamond', serif", cursor: "pointer",
              padding: "8px 0 0", display: "block", marginLeft: "auto",
            }}
          >
            Forgot password?
          </button>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#2a1515", border: "1px solid #4a2020", borderRadius: 8,
            padding: "10px 14px", marginTop: 12, color: "#c87a7a", fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Reset sent success */}
        {resetSent && (
          <div style={{
            background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8,
            padding: "10px 14px", marginTop: 12, color: "#7ab87a", fontSize: 13,
          }}>
            ✓ Password reset email sent! Check your inbox.
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{
            width: "100%", background: "linear-gradient(135deg, #D4A754, #B8943F)",
            border: "none", borderRadius: 10, padding: 14, color: "#0f0c08",
            fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: 700,
            cursor: loading ? "wait" : "pointer", marginTop: 16,
            letterSpacing: "0.05em", textTransform: "uppercase",
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
          }}
        >
          {loading ? "..." : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Email" : "Sign In"}
        </button>

        {/* Toggle mode */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          {mode === "forgot" ? (
            <button
              onClick={() => { setMode("login"); setError(null); setResetSent(false); }}
              style={{ background: "none", border: "none", color: "#6b5e4f", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", cursor: "pointer" }}
            >
              ← Back to Sign In
            </button>
          ) : (
            <p style={{ color: "#6b5e4f", fontSize: 14, margin: 0 }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                style={{
                  background: "none", border: "none", color: "#D4A754", fontSize: 14,
                  fontFamily: "'Cormorant Garamond', serif", cursor: "pointer", fontWeight: 700,
                }}
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: "#3a3228", fontSize: 11, marginTop: 24, textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Cigar Lounge © {new Date().getFullYear()}
      </p>
    </div>
  );
}
