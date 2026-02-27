import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants & Data ────────────────────────────────────────────
const RATING_CATEGORIES = [
  { key: "appearance", label: "Appearance", icon: "👁️" },
  { key: "construction", label: "Construction", icon: "🔧" },
  { key: "preLight", label: "Pre-Light Draw", icon: "💨" },
  { key: "firstThird", label: "First Third", icon: "1️⃣" },
  { key: "secondThird", label: "Second Third", icon: "2️⃣" },
  { key: "finalThird", label: "Final Third", icon: "3️⃣" },
  { key: "burnLine", label: "Burn & Ash", icon: "🔥" },
  { key: "flavor", label: "Flavor Profile", icon: "🍂" },
  { key: "strength", label: "Strength", icon: "💪" },
  { key: "overall", label: "Overall Experience", icon: "⭐" },
];

const WRAPPER_TYPES = ["Connecticut", "Habano", "Maduro", "Oscuro", "Corojo", "Cameroon", "Sumatra", "Candela"];
const SHAPES = ["Robusto", "Toro", "Churchill", "Corona", "Lancero", "Torpedo", "Belicoso", "Gordo", "Petit Corona", "Lonsdale"];
const STRENGTH_LEVELS = ["Mild", "Mild-Medium", "Medium", "Medium-Full", "Full"];

const SAMPLE_CIGARS = [
  { id: "s1", name: "Padrón 1964 Anniversary", brand: "Padrón", wrapper: "Maduro", shape: "Torpedo", strength: "Medium-Full", ringGauge: 52, length: '6"', origin: "Nicaragua", price: 18.50 },
  { id: "s2", name: "Arturo Fuente Opus X", brand: "Arturo Fuente", wrapper: "Habano", shape: "Robusto", strength: "Full", ringGauge: 50, length: '5.25"', origin: "Dominican Republic", price: 35.00 },
  { id: "s3", name: "Oliva Serie V Melanio", brand: "Oliva", wrapper: "Habano", shape: "Toro", strength: "Medium-Full", ringGauge: 50, length: '6"', origin: "Nicaragua", price: 14.00 },
  { id: "s4", name: "My Father Le Bijou 1922", brand: "My Father", wrapper: "Oscuro", shape: "Torpedo", strength: "Full", ringGauge: 52, length: '6.125"', origin: "Nicaragua", price: 13.50 },
  { id: "s5", name: "Davidoff Winston Churchill", brand: "Davidoff", wrapper: "Connecticut", shape: "Churchill", strength: "Medium", ringGauge: 48, length: '7"', origin: "Dominican Republic", price: 28.00 },
  { id: "s6", name: "Liga Privada No. 9", brand: "Drew Estate", wrapper: "Oscuro", shape: "Robusto", strength: "Full", ringGauge: 54, length: '5"', origin: "Nicaragua", price: 16.00 },
  { id: "s7", name: "Ashton VSG", brand: "Ashton", wrapper: "Cameroon", shape: "Toro", strength: "Medium-Full", ringGauge: 50, length: '6"', origin: "Dominican Republic", price: 15.00 },
  { id: "s8", name: "Romeo y Julieta 1875", brand: "Romeo y Julieta", wrapper: "Connecticut", shape: "Churchill", strength: "Mild-Medium", ringGauge: 47, length: '7"', origin: "Honduras", price: 7.50 },
  { id: "s9", name: "Montecristo No. 2", brand: "Montecristo", wrapper: "Habano", shape: "Torpedo", strength: "Medium", ringGauge: 52, length: '6.125"', origin: "Cuba", price: 22.00 },
  { id: "s10", name: "Cohiba Robusto", brand: "Cohiba", wrapper: "Habano", shape: "Robusto", strength: "Medium-Full", ringGauge: 50, length: '4.875"', origin: "Cuba", price: 30.00 },
];

const BARCODE_DATABASE = {
  "0-71610-00203": SAMPLE_CIGARS[0],
  "0-71610-93520": SAMPLE_CIGARS[1],
  "0-28695-01210": SAMPLE_CIGARS[2],
  "8-52111-00691": SAMPLE_CIGARS[3],
  "0-75699-50170": SAMPLE_CIGARS[4],
  "0-47557-00009": SAMPLE_CIGARS[5],
  "6-70741-00050": SAMPLE_CIGARS[6],
  "0-74837-81847": SAMPLE_CIGARS[7],
  "5-601144-10020": SAMPLE_CIGARS[8],
  "5-601144-10010": SAMPLE_CIGARS[9],
};

const SAMPLE_FRIENDS = [
  { id: "f1", name: "Marcus Bell", avatar: "MB", humidorCount: 24, ratingCount: 87, joinDate: "2024" },
  { id: "f2", name: "James Thornton", avatar: "JT", humidorCount: 15, ratingCount: 42, joinDate: "2025" },
  { id: "f3", name: "Victor Reyes", avatar: "VR", humidorCount: 31, ratingCount: 103, joinDate: "2023" },
];

// ─── localStorage Helpers ────────────────────────────────────────
const storage = {
  get: (key, fallback) => {
    try {
      const item = localStorage.getItem(`cigarlounge_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(`cigarlounge_${key}`, JSON.stringify(value)); }
    catch (e) { console.warn("Storage full or unavailable", e); }
  }
};

// ─── Utility Helpers ─────────────────────────────────────────────
const getAvgRating = (ratings) => {
  if (!ratings) return 0;
  const vals = Object.values(ratings).filter((v) => typeof v === "number" && v > 0);
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// ─── Star Rating Component ──────────────────────────────────────
const StarRating = ({ value = 0, onChange, size = 20, readonly = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2, cursor: readonly ? "default" : "pointer" }}>
      {[...Array(10)].map((_, i) => {
        const starVal = i + 1;
        const filled = starVal <= (hover || value);
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#D4A754" : "none"}
            stroke={filled ? "#D4A754" : "#5a5040"}
            strokeWidth="1.5"
            onClick={() => !readonly && onChange?.(starVal)}
            onMouseEnter={() => !readonly && setHover(starVal)}
            onMouseLeave={() => !readonly && setHover(0)}
            style={{ transition: "all 0.15s ease", transform: filled && !readonly ? "scale(1.1)" : "scale(1)" }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
};

// ─── Tab Bar Component ───────────────────────────────────────────
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    display: "flex",
    background: "#1a1510",
    borderTop: "1px solid #2a2318",
    padding: "6px 0 env(safe-area-inset-bottom, 6px)",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          flex: 1, background: "none", border: "none",
          color: active === tab.id ? "#D4A754" : "#6b5e4f",
          fontSize: 10, fontFamily: "'Cormorant Garamond', serif",
          fontWeight: active === tab.id ? 700 : 400,
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 3, padding: "6px 0", cursor: "pointer",
          transition: "color 0.2s", letterSpacing: "0.05em", textTransform: "uppercase",
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </div>
);

// ─── Header Component ────────────────────────────────────────────
const Header = ({ title, subtitle, rightAction }) => (
  <div style={{
    padding: "calc(env(safe-area-inset-top, 12px) + 12px) 20px 12px",
    background: "linear-gradient(180deg, #1a1510 0%, #0f0c08 100%)",
    borderBottom: "1px solid #2a2318",
    position: "sticky", top: 0, zIndex: 50,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 24,
          color: "#D4A754", margin: 0, fontWeight: 700, letterSpacing: "0.02em",
        }}>{title}</h1>
        {subtitle && <p style={{ color: "#6b5e4f", fontSize: 12, margin: "2px 0 0", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{subtitle}</p>}
      </div>
      {rightAction}
    </div>
  </div>
);

const Tag = ({ label }) => (
  <span style={{
    background: "#2a2318", color: "#a0927e", fontSize: 11,
    padding: "3px 8px", borderRadius: 6, fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600, letterSpacing: "0.05em",
  }}>{label}</span>
);

// ─── Share Modal Component ───────────────────────────────────────
const ShareModal = ({ cigar, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(null);
  const avg = getAvgRating(cigar.ratings);

  const shareText = `🔥 Just ${cigar.inHumidor === false ? "smoked" : "added to my humidor"}: ${cigar.name} by ${cigar.brand}${avg > 0 ? ` — Rated ${avg}/10 ⭐` : ""}${cigar.notes ? `\n\n"${cigar.notes.slice(0, 120)}${cigar.notes.length > 120 ? "..." : ""}"` : ""}\n\n📱 Shared via Cigar Lounge`;

  const handleShare = async (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?text=${encodedText}`,
      sms: `sms:?body=${encodedText}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({ title: `${cigar.name} — Cigar Lounge`, text: shareText });
        setShareSuccess("Shared!");
        setTimeout(() => setShareSuccess(null), 2000);
      } catch {}
      return;
    }

    window.open(urls[platform], "_blank", "width=600,height=400");
    setShareSuccess(`Opening ${platform}...`);
    setTimeout(() => setShareSuccess(null), 2000);
  };

  const platforms = [
    { id: "native", label: "Share", icon: "📤", color: "#D4A754" },
    { id: "twitter", label: "X / Twitter", icon: "𝕏", color: "#1DA1F2" },
    { id: "facebook", label: "Facebook", icon: "f", color: "#1877F2" },
    { id: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366" },
    { id: "telegram", label: "Telegram", icon: "✈️", color: "#0088cc" },
    { id: "sms", label: "Messages", icon: "💬", color: "#34C759" },
    { id: "copy", label: "Copy", icon: "📋", color: "#8a7b69" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0f0c08", border: "1px solid #2a2318", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 500, padding: "20px 20px calc(env(safe-area-inset-bottom, 20px) + 10px)",
        animation: "slideUp 0.3s ease-out",
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <div style={{ width: 36, height: 4, background: "#2a2318", borderRadius: 2, margin: "0 auto 16px" }} />

        <div style={{
          background: "linear-gradient(135deg, #1e1a14, #16120d)",
          border: "1px solid #2a2318", borderRadius: 12, padding: 14, marginBottom: 20,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {cigar.photo ? (
              <img src={cigar.photo} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 8, background: "#2a2318", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔥</div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 15, margin: 0, fontWeight: 600 }}>{cigar.name}</p>
              <p style={{ color: "#6b5e4f", fontSize: 12, margin: "2px 0 0", fontFamily: "'Cormorant Garamond', serif" }}>
                {cigar.brand}{avg > 0 ? ` • ${avg}/10` : ""}
              </p>
            </div>
          </div>
          {cigar.notes && (
            <p style={{ color: "#8a7b69", fontSize: 12, fontStyle: "italic", margin: "10px 0 0", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.5 }}>
              "{cigar.notes.slice(0, 100)}{cigar.notes.length > 100 ? "..." : ""}"
            </p>
          )}
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 16, margin: "0 0 14px" }}>Share to</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          {platforms.map((p) => (
            <button key={p.id} onClick={() => handleShare(p.id)} style={{
              background: "#1a1510", border: "1px solid #2a2318", borderRadius: 12,
              padding: "14px 6px", cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6, transition: "all 0.2s",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: `${p.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: p.id === "twitter" || p.id === "facebook" ? 18 : 20,
                color: p.color, fontWeight: 900,
              }}>{p.icon}</div>
              <span style={{ color: "#a0927e", fontSize: 10, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {p.id === "copy" && copied ? "Copied!" : p.label}
              </span>
            </button>
          ))}
        </div>

        {shareSuccess && (
          <div style={{
            background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8,
            padding: "8px 14px", textAlign: "center", color: "#7ab87a",
            fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
          }}>✓ {shareSuccess}</div>
        )}
      </div>
    </div>
  );
};

// ─── Barcode Scanner Modal ───────────────────────────────────────
const BarcodeScanner = ({ onClose, onCigarFound }) => {
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [useManual, setUseManual] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (scanning && !useManual) {
      const interval = setInterval(() => {
        setScanProgress((p) => (p >= 100 ? 0 : p + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scanning, useManual]);

  useEffect(() => {
    if (!useManual) startCamera();
    return () => stopCamera();
  }, [useManual]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {}
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const simulateScan = () => {
    setScanning(true);
    setScanError(null);
    setScanResult(null);
    setTimeout(() => {
      const barcodes = Object.keys(BARCODE_DATABASE);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      const found = BARCODE_DATABASE[randomBarcode];
      setScanning(false);
      setScanResult({ barcode: randomBarcode, cigar: found });
    }, 2000 + Math.random() * 1500);
  };

  const handleManualLookup = () => {
    setScanError(null);
    const code = manualCode.trim();
    if (!code) return;
    const found = BARCODE_DATABASE[code];
    if (found) {
      setScanResult({ barcode: code, cigar: found });
      setScanning(false);
    } else {
      const partialMatch = Object.entries(BARCODE_DATABASE).find(([k]) => k.includes(code) || code.includes(k));
      if (partialMatch) {
        setScanResult({ barcode: partialMatch[0], cigar: partialMatch[1] });
        setScanning(false);
      } else {
        setScanError("Barcode not found in database. Try scanning again or add the cigar manually.");
      }
    }
  };

  const handleAddScanned = (destination) => {
    if (scanResult?.cigar) {
      onCigarFound({ ...scanResult.cigar, id: generateId(), inHumidor: destination === "humidor" }, destination);
    }
  };

  useEffect(() => {
    if (!useManual) simulateScan();
  }, [useManual]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 300, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "calc(env(safe-area-inset-top, 16px) + 4px) 20px 12px", flexShrink: 0 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 20, margin: 0 }}>
          {useManual ? "Enter Barcode" : "Scan Barcode"}
        </h2>
        <button onClick={() => { stopCamera(); onClose(); }} style={{ background: "none", border: "none", color: "#6b5e4f", fontSize: 24, cursor: "pointer" }}>✕</button>
      </div>

      {!useManual && !scanResult && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: 280, height: 280, borderRadius: 20, position: "relative", background: "#0a0806", overflow: "hidden", border: "2px solid #2a2318" }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
            <div style={{ position: "absolute", inset: 0 }}>
              {[["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]].map(([v, h]) => (
                <div key={`${v}-${h}`} style={{
                  position: "absolute", [v]: 30, [h]: 30, width: 30, height: 30,
                  borderColor: "#D4A754", borderStyle: "solid", borderWidth: 0,
                  [`border${v.charAt(0).toUpperCase() + v.slice(1)}Width`]: 3,
                  [`border${h.charAt(0).toUpperCase() + h.slice(1)}Width`]: 3,
                  [`border${v.charAt(0).toUpperCase() + v.slice(1)}${h.charAt(0).toUpperCase() + h.slice(1)}Radius`]: 8,
                }} />
              ))}
              {scanning && (
                <div style={{
                  position: "absolute", left: 40, right: 40,
                  top: `${30 + (scanProgress / 100) * 200}px`, height: 2,
                  background: "linear-gradient(90deg, transparent, #D4A754, #D4A754, transparent)",
                  boxShadow: "0 0 12px #D4A754, 0 0 30px rgba(212,167,84,0.3)",
                }} />
              )}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.2 }}>
                <svg width="60" height="40" viewBox="0 0 60 40" fill="#D4A754">
                  {[0, 4, 7, 10, 15, 18, 20, 24, 28, 31, 34, 38, 41, 44, 48, 52, 56].map((x, i) => (
                    <rect key={i} x={x} y={0} width={i % 3 === 0 ? 3 : 2} height={40} />
                  ))}
                </svg>
              </div>
            </div>
          </div>
          <p style={{ color: scanning ? "#D4A754" : "#6b5e4f", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, marginTop: 20, textAlign: "center", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {scanning ? "Scanning..." : "Position barcode in frame"}
          </p>
          {scanning && (
            <div style={{ width: 200, height: 3, background: "#1a1510", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${scanProgress}%`, height: "100%", background: "linear-gradient(90deg, #8B6914, #D4A754)", borderRadius: 2 }} />
            </div>
          )}
          <button onClick={simulateScan} style={{
            marginTop: 20, background: "transparent", border: "1px solid #2a2318",
            borderRadius: 10, padding: "10px 20px", color: "#8a7b69", fontSize: 13,
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, cursor: "pointer",
          }}>🔄 Scan Again</button>
        </div>
      )}

      {useManual && !scanResult && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20 }}>
          <p style={{ color: "#8a7b69", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, margin: "0 0 16px" }}>
            Enter the barcode number printed on the cigar band or box.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input style={{
              flex: 1, background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10,
              padding: "12px 14px", color: "#e8dcc8", fontSize: 16, fontFamily: "'Cormorant Garamond', serif",
              outline: "none", letterSpacing: "0.1em",
            }} value={manualCode} onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. 0-71610-00203" onKeyDown={(e) => e.key === "Enter" && handleManualLookup()} />
            <button onClick={handleManualLookup} style={{
              background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none", borderRadius: 10,
              padding: "0 20px", color: "#0f0c08", fontSize: 14, fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700, cursor: "pointer",
            }}>Look Up</button>
          </div>
          {scanError && (
            <div style={{ background: "#2a1a1a", border: "1px solid #4a2a2a", borderRadius: 10, padding: 14, marginTop: 14, color: "#c87a7a", fontSize: 13, fontFamily: "'Cormorant Garamond', serif" }}>
              ⚠️ {scanError}
            </div>
          )}
          <div style={{ marginTop: 24 }}>
            <p style={{ color: "#6b5e4f", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10 }}>Demo barcodes to try:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(BARCODE_DATABASE).slice(0, 5).map(([code]) => (
                <button key={code} onClick={() => setManualCode(code)} style={{
                  background: "#1a1510", border: "1px solid #2a2318", borderRadius: 8,
                  padding: "6px 10px", color: "#a0927e", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", cursor: "pointer",
                }}>{code}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {scanResult && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #2a4a2a, #1a3a1a)",
              border: "2px solid #3a6a3a", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 10px", animation: "popIn 0.3s ease-out",
            }}>✓</div>
            <style>{`@keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }`}</style>
            <p style={{ color: "#7ab87a", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Cigar Found!</p>
            <p style={{ color: "#4a4035", fontSize: 11, fontFamily: "'Cormorant Garamond', serif" }}>Barcode: {scanResult.barcode}</p>
          </div>

          <div style={{ background: "linear-gradient(135deg, #1e1a14, #16120d)", border: "1px solid #2a2318", borderRadius: 14, padding: 18, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #D4A754, transparent)" }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 20, margin: "0 0 4px" }}>{scanResult.cigar.name}</h3>
            <p style={{ color: "#8a7b69", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, margin: "0 0 12px" }}>{scanResult.cigar.brand}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Wrapper", value: scanResult.cigar.wrapper },
                { label: "Shape", value: scanResult.cigar.shape },
                { label: "Strength", value: scanResult.cigar.strength },
                { label: "Ring Gauge", value: scanResult.cigar.ringGauge },
                { label: "Length", value: scanResult.cigar.length },
                { label: "Origin", value: scanResult.cigar.origin },
              ].map((item) => (
                <div key={item.label} style={{ padding: "6px 0" }}>
                  <p style={{ color: "#5a5040", fontSize: 10, fontFamily: "'Cormorant Garamond', serif", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 2px" }}>{item.label}</p>
                  <p style={{ color: "#a0927e", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
            {scanResult.cigar.price && (
              <div style={{ marginTop: 12, padding: "8px 12px", background: "#0f0c08", borderRadius: 8, display: "inline-block" }}>
                <span style={{ color: "#D4A754", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>${scanResult.cigar.price.toFixed(2)}</span>
                <span style={{ color: "#5a5040", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", marginLeft: 6 }}>MSRP</span>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <button onClick={() => handleAddScanned("humidor")} style={{
              background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none", borderRadius: 12,
              padding: 15, color: "#0f0c08", fontSize: 15, fontFamily: "'Playfair Display', serif",
              fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase",
            }}>🗄️ Add to Humidor</button>
            <button onClick={() => handleAddScanned("favorites")} style={{
              background: "transparent", border: "1px solid #D4A754", borderRadius: 12,
              padding: 15, color: "#D4A754", fontSize: 15, fontFamily: "'Playfair Display', serif",
              fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase",
            }}>★ Add to Favorites</button>
            <button onClick={() => { setScanResult(null); setScanning(true); simulateScan(); }} style={{
              background: "transparent", border: "1px solid #2a2318", borderRadius: 12,
              padding: 12, color: "#6b5e4f", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600, cursor: "pointer",
            }}>Scan Another</button>
          </div>
        </div>
      )}

      {!scanResult && (
        <div style={{ padding: "12px 20px calc(env(safe-area-inset-bottom, 20px) + 4px)", flexShrink: 0 }}>
          <button onClick={() => { setUseManual(!useManual); setScanError(null); }} style={{
            width: "100%", background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10,
            padding: 12, color: "#8a7b69", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em",
          }}>{useManual ? "📷 Use Camera Scanner" : "⌨️ Enter Barcode Manually"}</button>
        </div>
      )}
    </div>
  );
};

// ─── Cigar Card Component ────────────────────────────────────────
const CigarCard = ({ cigar, onTap, onFavorite, onSmoke, onShare, showSmoke, isFavorite }) => {
  const avg = getAvgRating(cigar.ratings);
  return (
    <div onClick={() => onTap?.(cigar)} style={{
      background: "linear-gradient(135deg, #1e1a14 0%, #16120d 100%)",
      border: "1px solid #2a2318", borderRadius: 12, padding: 16,
      cursor: "pointer", transition: "all 0.25s ease", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #D4A754, transparent)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 16, margin: "0 0 2px", fontWeight: 600 }}>{cigar.name}</h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8a7b69", fontSize: 13, margin: 0 }}>{cigar.brand}</p>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {onShare && (
            <button onClick={(e) => { e.stopPropagation(); onShare(cigar); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "2px 4px", color: "#4a4035" }}>↗</button>
          )}
          {onFavorite && (
            <button onClick={(e) => { e.stopPropagation(); onFavorite(cigar.id); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: isFavorite ? "#D4A754" : "#3a3228" }}>
              {isFavorite ? "★" : "☆"}
            </button>
          )}
          {showSmoke && onSmoke && (
            <button onClick={(e) => { e.stopPropagation(); onSmoke(cigar.id); }} style={{
              background: "linear-gradient(135deg, #8B2500, #A0522D)", border: "1px solid #D4A754",
              borderRadius: 8, color: "#D4A754", fontSize: 10, padding: "4px 10px", cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>🔥 Smoke</button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {cigar.wrapper && <Tag label={cigar.wrapper} />}
        {cigar.shape && <Tag label={cigar.shape} />}
        {cigar.strength && <Tag label={cigar.strength} />}
      </div>
      {cigar.ratings && avg > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <StarRating value={Math.round(avg)} readonly size={14} />
          <span style={{ color: "#D4A754", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700 }}>{avg}</span>
        </div>
      )}
      {cigar.photo && (
        <div style={{ marginTop: 10, borderRadius: 8, overflow: "hidden", maxHeight: 120 }}>
          <img src={cigar.photo} alt={cigar.name} style={{ width: "100%", objectFit: "cover", borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
};

// ─── Add/Rate Cigar Modal ────────────────────────────────────────
const CigarModal = ({ cigar, onClose, onSave, mode = "add" }) => {
  const [form, setForm] = useState({
    name: cigar?.name || "", brand: cigar?.brand || "", wrapper: cigar?.wrapper || "",
    shape: cigar?.shape || "", strength: cigar?.strength || "", ringGauge: cigar?.ringGauge || "",
    length: cigar?.length || "", origin: cigar?.origin || "", price: cigar?.price || "",
    notes: cigar?.notes || "", photo: cigar?.photo || null, ratings: cigar?.ratings || {},
    inHumidor: cigar?.inHumidor ?? true,
  });
  const fileRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, id: cigar?.id || generateId(), ratings: form.ratings });
  };

  const inputStyle = {
    width: "100%", background: "#1a1510", border: "1px solid #2a2318", borderRadius: 8,
    padding: "10px 12px", color: "#e8dcc8", fontSize: 14, fontFamily: "'Cormorant Garamond', serif",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = {
    color: "#8a7b69", fontSize: 11, fontFamily: "'Cormorant Garamond', serif",
    textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4, display: "block",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", justifyContent: "center", overflowY: "auto", padding: "20px 0" }}>
      <div style={{ background: "#0f0c08", border: "1px solid #2a2318", borderRadius: 16, width: "100%", maxWidth: 500, margin: "auto", maxHeight: "90vh", overflowY: "auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 22, margin: 0 }}>
            {mode === "rate" ? "Rate Cigar" : mode === "edit" ? "Edit Cigar" : "Add to Humidor"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b5e4f", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>

        <div onClick={() => fileRef.current?.click()} style={{
          border: "2px dashed #2a2318", borderRadius: 12, padding: form.photo ? 0 : 30,
          textAlign: "center", cursor: "pointer", marginBottom: 20, overflow: "hidden", background: "#1a1510",
        }}>
          {form.photo ? (
            <img src={form.photo} alt="Cigar" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
          ) : (
            <div><span style={{ fontSize: 32 }}>📷</span><p style={{ color: "#6b5e4f", fontFamily: "'Cormorant Garamond', serif", margin: "8px 0 0", fontSize: 13 }}>Tap to add photo</p></div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />

        <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
          <div><label style={labelStyle}>Cigar Name *</label><input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Padrón 1964 Anniversary" /></div>
          <div><label style={labelStyle}>Brand</label><input style={inputStyle} value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} placeholder="e.g. Padrón" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Wrapper</label><select style={inputStyle} value={form.wrapper} onChange={(e) => setForm((f) => ({ ...f, wrapper: e.target.value }))}><option value="">Select...</option>{WRAPPER_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}</select></div>
            <div><label style={labelStyle}>Shape</label><select style={inputStyle} value={form.shape} onChange={(e) => setForm((f) => ({ ...f, shape: e.target.value }))}><option value="">Select...</option>{SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Strength</label><select style={inputStyle} value={form.strength} onChange={(e) => setForm((f) => ({ ...f, strength: e.target.value }))}><option value="">Select...</option>{STRENGTH_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label style={labelStyle}>Ring Gauge</label><input style={inputStyle} type="number" value={form.ringGauge} onChange={(e) => setForm((f) => ({ ...f, ringGauge: e.target.value }))} placeholder="52" /></div>
            <div><label style={labelStyle}>Length</label><input style={inputStyle} value={form.length} onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))} placeholder='6"' /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Origin</label><input style={inputStyle} value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} placeholder="Nicaragua" /></div>
            <div><label style={labelStyle}>Price ($)</label><input style={inputStyle} type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="15.00" /></div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 16, marginBottom: 14 }}>Rating System</h3>
          <div style={{ display: "grid", gap: 14 }}>
            {RATING_CATEGORIES.map((cat) => (
              <div key={cat.key} style={{ background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: "#a0927e", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}>{cat.icon} {cat.label}</span>
                  <span style={{ color: "#D4A754", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700 }}>{form.ratings[cat.key] || "—"}/10</span>
                </div>
                <StarRating value={form.ratings[cat.key] || 0} onChange={(val) => setForm((f) => ({ ...f, ratings: { ...f.ratings, [cat.key]: val } }))} size={18} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Tasting Notes</label>
          <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Describe the flavor profile, aroma, draw quality, burn characteristics..." />
        </div>

        <button onClick={handleSave} style={{
          width: "100%", background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none",
          borderRadius: 10, padding: 14, color: "#0f0c08", fontSize: 15, fontFamily: "'Playfair Display', serif",
          fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase",
        }}>{mode === "rate" ? "Save Rating" : mode === "edit" ? "Update" : "Add to Humidor"}</button>
      </div>
    </div>
  );
};

// ─── Cigar Detail View ───────────────────────────────────────────
const CigarDetail = ({ cigar, onClose, onEdit, onFavorite, onShare, isFavorite }) => {
  const avg = getAvgRating(cigar.ratings);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200, overflowY: "auto", padding: "20px 0" }}>
      <div style={{ background: "#0f0c08", border: "1px solid #2a2318", borderRadius: 16, maxWidth: 500, margin: "auto", overflow: "hidden" }}>
        {cigar.photo && <div style={{ maxHeight: 220, overflow: "hidden" }}><img src={cigar.photo} alt={cigar.name} style={{ width: "100%", objectFit: "cover" }} /></div>}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 22, margin: 0 }}>{cigar.name}</h2>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8a7b69", fontSize: 14, margin: "4px 0 0" }}>{cigar.brand}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b5e4f", fontSize: 24, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {cigar.wrapper && <Tag label={`Wrapper: ${cigar.wrapper}`} />}
            {cigar.shape && <Tag label={cigar.shape} />}
            {cigar.strength && <Tag label={cigar.strength} />}
            {cigar.origin && <Tag label={cigar.origin} />}
            {cigar.ringGauge && <Tag label={`${cigar.ringGauge} RG`} />}
            {cigar.length && <Tag label={cigar.length} />}
            {cigar.price && <Tag label={`$${Number(cigar.price).toFixed(2)}`} />}
          </div>
          {avg > 0 && (
            <div style={{ background: "linear-gradient(135deg, #1e1a14, #16120d)", border: "1px solid #2a2318", borderRadius: 12, padding: 16, marginTop: 16, textAlign: "center" }}>
              <p style={{ color: "#6b5e4f", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>Overall Rating</p>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: "#D4A754", fontWeight: 700 }}>{avg}</span>
              <span style={{ color: "#6b5e4f", fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>/10</span>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}><StarRating value={Math.round(avg)} readonly size={18} /></div>
            </div>
          )}
          {cigar.ratings && Object.keys(cigar.ratings).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 14, marginBottom: 10 }}>Breakdown</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {RATING_CATEGORIES.map((cat) => {
                  const val = cigar.ratings[cat.key];
                  if (!val) return null;
                  return (
                    <div key={cat.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1e1a14" }}>
                      <span style={{ color: "#a0927e", fontSize: 13, fontFamily: "'Cormorant Garamond', serif" }}>{cat.icon} {cat.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: "#1e1a14", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${val * 10}%`, height: "100%", background: "linear-gradient(90deg, #8B6914, #D4A754)", borderRadius: 2 }} />
                        </div>
                        <span style={{ color: "#D4A754", fontSize: 13, fontFamily: "'Playfair Display', serif", fontWeight: 700, minWidth: 24, textAlign: "right" }}>{val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {cigar.notes && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 14, marginBottom: 8 }}>Tasting Notes</h3>
              <p style={{ color: "#a0927e", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{cigar.notes}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button onClick={() => onFavorite?.(cigar.id)} style={{
              flex: 1, background: isFavorite ? "#2a2318" : "transparent", border: "1px solid #2a2318",
              borderRadius: 10, padding: 12, color: isFavorite ? "#D4A754" : "#6b5e4f",
              fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, cursor: "pointer",
            }}>{isFavorite ? "★ Favorited" : "☆ Favorite"}</button>
            <button onClick={() => onShare?.(cigar)} style={{
              flex: 1, background: "transparent", border: "1px solid #2a2318", borderRadius: 10,
              padding: 12, color: "#6b5e4f", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700, cursor: "pointer",
            }}>↗ Share</button>
            <button onClick={() => onEdit?.(cigar)} style={{
              flex: 1, background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none",
              borderRadius: 10, padding: 12, color: "#0f0c08", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700, cursor: "pointer",
            }}>✎ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Friend Profile View ─────────────────────────────────────────
const FriendProfile = ({ friend, friendCigars, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200, overflowY: "auto", padding: "20px" }}>
    <div style={{ background: "#0f0c08", border: "1px solid #2a2318", borderRadius: 16, maxWidth: 500, margin: "auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg, #D4A754, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#0f0c08", fontWeight: 700 }}>{friend.avatar}</div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 20, margin: 0 }}>{friend.name}</h2>
            <p style={{ color: "#6b5e4f", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, margin: "2px 0 0" }}>Member since {friend.joinDate}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b5e4f", fontSize: 24, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1, background: "#1a1510", borderRadius: 10, padding: 14, textAlign: "center", border: "1px solid #2a2318" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 24, margin: 0, fontWeight: 700 }}>{friend.humidorCount}</p>
          <p style={{ color: "#6b5e4f", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>In Humidor</p>
        </div>
        <div style={{ flex: 1, background: "#1a1510", borderRadius: 10, padding: 14, textAlign: "center", border: "1px solid #2a2318" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 24, margin: 0, fontWeight: 700 }}>{friend.ratingCount}</p>
          <p style={{ color: "#6b5e4f", fontFamily: "'Cormorant Garamond', serif", fontSize: 11, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ratings</p>
        </div>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 15, marginBottom: 12 }}>{friend.name.split(" ")[0]}'s Humidor</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {friendCigars.map((c) => (
          <div key={c.id} style={{ background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10, padding: 12 }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 14, margin: "0 0 2px" }}>{c.name}</h4>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#6b5e4f", fontSize: 12, margin: 0 }}>{c.brand} • {c.wrapper} • {c.shape}</p>
            {c.ratings && getAvgRating(c.ratings) > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <StarRating value={Math.round(getAvgRating(c.ratings))} readonly size={12} />
                <span style={{ color: "#D4A754", fontSize: 12, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{getAvgRating(c.ratings)}</span>
              </div>
            )}
            {c.notes && <p style={{ color: "#8a7b69", fontFamily: "'Cormorant Garamond', serif", fontSize: 12, margin: "6px 0 0", fontStyle: "italic" }}>"{c.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═════════════════════════════════════════════════════════════════
// ─── MAIN APP ────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════
export default function CigarLounge() {
  // Persistent state with localStorage
  const [activeTab, setActiveTab] = useState("humidor");
  const [cigars, setCigars] = useState(() => storage.get("cigars", null));
  const [favorites, setFavorites] = useState(() => new Set(storage.get("favorites", [])));
  const [friends, setFriends] = useState(() => storage.get("friends", SAMPLE_FRIENDS));
  const [profile, setProfile] = useState(() => storage.get("profile", { name: "Aficionado", avatar: "AF", joinDate: "2025", bio: "Life is too short for bad cigars." }));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [shareCigar, setShareCigar] = useState(null);
  const [editCigar, setEditCigar] = useState(null);
  const [viewCigar, setViewCigar] = useState(null);
  const [viewFriend, setViewFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");
  const [scanToast, setScanToast] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize with sample data on first ever load
  useEffect(() => {
    if (cigars === null) {
      const initial = SAMPLE_CIGARS.slice(0, 3).map((c, idx) => ({
        ...c, id: generateId(), inHumidor: true,
        ratings: {
          appearance: 7 + Math.floor(Math.random() * 3), construction: 7 + Math.floor(Math.random() * 3),
          firstThird: 6 + Math.floor(Math.random() * 4), secondThird: 7 + Math.floor(Math.random() * 3),
          finalThird: 7 + Math.floor(Math.random() * 3), flavor: 7 + Math.floor(Math.random() * 3),
          overall: 8 + Math.floor(Math.random() * 2),
        },
        notes: ["Rich cocoa and leather with a pepper finish. Excellent draw and even burn throughout.",
          "Complex layers of cedar, coffee, and dark chocolate. One of the finest smokes I've had.",
          "Creamy with notes of vanilla and toasted nuts. Medium body with a beautiful oily wrapper."][idx],
        dateAdded: new Date().toISOString(),
      }));
      setCigars(initial);
      setFavorites(new Set([initial[0]?.id]));
    }
    setInitialized(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => { if (initialized && cigars !== null) storage.set("cigars", cigars); }, [cigars, initialized]);
  useEffect(() => { if (initialized) storage.set("favorites", [...favorites]); }, [favorites, initialized]);
  useEffect(() => { if (initialized) storage.set("friends", friends); }, [friends, initialized]);
  useEffect(() => { if (initialized) storage.set("profile", profile); }, [profile, initialized]);

  const cigarList = cigars || [];
  const humidorCigars = cigarList.filter((c) => c.inHumidor);
  const allRated = cigarList.filter((c) => c.ratings && Object.keys(c.ratings).length > 0);
  const favoriteCigars = cigarList.filter((c) => favorites.has(c.id));

  const handleAddCigar = (cigar) => {
    setCigars((prev) => {
      const list = prev || [];
      const existing = list.find((c) => c.id === cigar.id);
      if (existing) return list.map((c) => (c.id === cigar.id ? { ...c, ...cigar, dateModified: new Date().toISOString() } : c));
      return [...list, { ...cigar, dateAdded: new Date().toISOString() }];
    });
    setShowAddModal(false); setEditCigar(null);
  };

  const handleScannedCigar = (cigar, destination) => {
    const newCigar = { ...cigar, dateAdded: new Date().toISOString() };
    setCigars((prev) => [...(prev || []), newCigar]);
    if (destination === "favorites") setFavorites((prev) => new Set([...prev, newCigar.id]));
    setShowScanner(false);
    setScanToast(`${cigar.name} added to ${destination === "favorites" ? "Favorites" : "Humidor"}!`);
    setTimeout(() => setScanToast(null), 3000);
  };

  const handleSmoke = (id) => {
    setCigars((prev) => (prev || []).map((c) => (c.id === id ? { ...c, inHumidor: false, smokedDate: new Date().toISOString() } : c)));
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const filtered = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((c) => c.name.toLowerCase().includes(q) || c.brand?.toLowerCase().includes(q) || c.wrapper?.toLowerCase().includes(q));
  };

  const friendCigarsForFriend = (friend) => {
    return SAMPLE_CIGARS.slice(0, friend.humidorCount > 20 ? 4 : 2).map((c) => ({
      ...c, id: generateId(),
      ratings: { appearance: 6 + Math.floor(Math.random() * 4), construction: 6 + Math.floor(Math.random() * 4), overall: 7 + Math.floor(Math.random() * 3) },
      notes: ["Smooth and complex", "A daily go-to stick", "Special occasion cigar", "Great value"][Math.floor(Math.random() * 4)],
    }));
  };

  const tabs = [
    { id: "humidor", label: "Humidor", icon: "🗄️" },
    { id: "ratings", label: "Ratings", icon: "⭐" },
    { id: "favorites", label: "Favorites", icon: "❤️" },
    { id: "friends", label: "Friends", icon: "👥" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div style={{ background: "#0f0c08", minHeight: "100vh", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#e8dcc8", maxWidth: 500, margin: "0 auto", paddingBottom: 70, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {scanToast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #2a4a2a, #1a3a1a)", border: "1px solid #3a6a3a",
          borderRadius: 12, padding: "12px 20px", color: "#7ab87a", fontSize: 14,
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, zIndex: 400,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)", animation: "slideDown 0.3s ease-out",
        }}>
          <style>{`@keyframes slideDown { from { transform: translateX(-50%) translateY(-100%); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }`}</style>
          ✓ {scanToast}
        </div>
      )}

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* ═══ HUMIDOR ═══ */}
        {activeTab === "humidor" && (
          <>
            <Header title="My Humidor" subtitle={`${humidorCigars.length} cigar${humidorCigars.length !== 1 ? "s" : ""}`}
              rightAction={
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setShowScanner(true)} style={{
                    background: "transparent", border: "1px solid #D4A754", borderRadius: 10,
                    padding: "8px 12px", color: "#D4A754", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A754" strokeWidth="2">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                      <line x1="7" y1="8" x2="7" y2="16" /><line x1="11" y1="8" x2="11" y2="16" />
                      <line x1="15" y1="8" x2="15" y2="16" /><line x1="19" y1="8" x2="19" y2="16" />
                    </svg>Scan
                  </button>
                  <button onClick={() => setShowAddModal(true)} style={{
                    background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none", borderRadius: 10,
                    padding: "8px 16px", color: "#0f0c08", fontSize: 13, fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>+ Add</button>
                </div>
              }
            />
            <div style={{ padding: "12px 20px" }}>
              <input style={{
                width: "100%", background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10,
                padding: "10px 14px", color: "#e8dcc8", fontSize: 14, fontFamily: "'Cormorant Garamond', serif",
                outline: "none", boxSizing: "border-box",
              }} placeholder="🔍 Search your humidor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10, padding: "0 20px 16px" }}>
              {[{ label: "Total", value: humidorCigars.length }, { label: "Smoked", value: cigarList.filter(c => !c.inHumidor).length }, { label: "Rated", value: allRated.length }].map((s) => (
                <div key={s.label} style={{ flex: 1, background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 22, margin: 0, fontWeight: 700 }}>{s.value}</p>
                  <p style={{ color: "#6b5e4f", fontSize: 10, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 20px", display: "grid", gap: 12 }}>
              {filtered(humidorCigars).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <span style={{ fontSize: 48 }}>🗄️</span>
                  <p style={{ color: "#6b5e4f", fontSize: 15, marginTop: 12 }}>{searchQuery ? "No cigars match your search" : "Your humidor is empty"}</p>
                  {!searchQuery && <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
                    <button onClick={() => setShowScanner(true)} style={{ background: "transparent", border: "1px solid #D4A754", borderRadius: 10, padding: "10px 20px", color: "#D4A754", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, cursor: "pointer" }}>📷 Scan</button>
                    <button onClick={() => setShowAddModal(true)} style={{ background: "transparent", border: "1px solid #2a2318", borderRadius: 10, padding: "10px 20px", color: "#6b5e4f", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, cursor: "pointer" }}>Add Manually</button>
                  </div>}
                </div>
              ) : filtered(humidorCigars).map((c) => (
                <CigarCard key={c.id} cigar={c} onTap={setViewCigar} onFavorite={handleToggleFavorite} onSmoke={handleSmoke} onShare={setShareCigar} showSmoke isFavorite={favorites.has(c.id)} />
              ))}
            </div>
          </>
        )}

        {/* ═══ RATINGS ═══ */}
        {activeTab === "ratings" && (
          <>
            <Header title="All Ratings" subtitle={`${allRated.length} rated`} />
            <div style={{ padding: "12px 20px" }}>
              <input style={{ width: "100%", background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10, padding: "10px 14px", color: "#e8dcc8", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", outline: "none", boxSizing: "border-box" }} placeholder="🔍 Search ratings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div style={{ padding: "0 20px", display: "grid", gap: 12 }}>
              {filtered(allRated).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}><span style={{ fontSize: 48 }}>⭐</span><p style={{ color: "#6b5e4f", fontSize: 15 }}>No ratings yet</p></div>
              ) : filtered(allRated).sort((a, b) => getAvgRating(b.ratings) - getAvgRating(a.ratings)).map((c) => (
                <CigarCard key={c.id} cigar={c} onTap={setViewCigar} onFavorite={handleToggleFavorite} onShare={setShareCigar} isFavorite={favorites.has(c.id)} />
              ))}
            </div>
          </>
        )}

        {/* ═══ FAVORITES ═══ */}
        {activeTab === "favorites" && (
          <>
            <Header title="Favorites" subtitle={`${favoriteCigars.length} cigar${favoriteCigars.length !== 1 ? "s" : ""}`} />
            <div style={{ padding: "0 20px", display: "grid", gap: 12, marginTop: 12 }}>
              {favoriteCigars.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}><span style={{ fontSize: 48 }}>❤️</span><p style={{ color: "#6b5e4f", fontSize: 15 }}>No favorites yet</p><p style={{ color: "#4a4035", fontSize: 13 }}>Tap the star on any cigar</p></div>
              ) : favoriteCigars.map((c) => (
                <CigarCard key={c.id} cigar={c} onTap={setViewCigar} onFavorite={handleToggleFavorite} onShare={setShareCigar} isFavorite />
              ))}
            </div>
          </>
        )}

        {/* ═══ FRIENDS ═══ */}
        {activeTab === "friends" && (
          <>
            <Header title="Cigar Circle" subtitle={`${friends.length} friends`} />
            <div style={{ padding: "12px 20px" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <input style={{ flex: 1, background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10, padding: "10px 14px", color: "#e8dcc8", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", outline: "none" }} placeholder="Search by username..." value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)} />
                <button onClick={() => { if (friendSearch.trim()) { setFriends((prev) => [...prev, { id: generateId(), name: friendSearch.trim(), avatar: friendSearch.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2), humidorCount: Math.floor(Math.random() * 30) + 5, ratingCount: Math.floor(Math.random() * 80) + 10, joinDate: "2025" }]); setFriendSearch(""); } }} style={{ background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none", borderRadius: 10, padding: "0 18px", color: "#0f0c08", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, cursor: "pointer" }}>Add</button>
              </div>
            </div>
            <div style={{ padding: "0 20px", marginBottom: 16 }}>
              <div style={{ background: "linear-gradient(135deg, #1e1a14, #16120d)", border: "1px solid #2a2318", borderRadius: 12, padding: 16 }}>
                <p style={{ color: "#6b5e4f", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px", fontWeight: 700 }}>Friend Activity</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3a5a3a, #2a4a2a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔥</div>
                  <div><p style={{ color: "#a0927e", fontSize: 13, margin: 0 }}><strong style={{ color: "#e8dcc8" }}>Marcus</strong> just smoked an Opus X</p><p style={{ color: "#4a4035", fontSize: 11, margin: "2px 0 0" }}>2 hours ago</p></div>
                </div>
              </div>
            </div>
            <div style={{ padding: "0 20px", display: "grid", gap: 10 }}>
              {friends.map((f) => (
                <div key={f.id} onClick={() => setViewFriend(f)} style={{ background: "linear-gradient(135deg, #1e1a14, #16120d)", border: "1px solid #2a2318", borderRadius: 12, padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #D4A754, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#0f0c08", fontWeight: 700, flexShrink: 0 }}>{f.avatar}</div>
                  <div style={{ flex: 1 }}><h3 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 15, margin: 0 }}>{f.name}</h3><p style={{ color: "#6b5e4f", fontSize: 12, margin: "2px 0 0" }}>{f.humidorCount} in humidor • {f.ratingCount} ratings</p></div>
                  <span style={{ color: "#3a3228", fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══ PROFILE ═══ */}
        {activeTab === "profile" && (
          <>
            <Header title="Profile" />
            <div style={{ padding: "20px" }}>
              <div style={{ background: "linear-gradient(135deg, #1e1a14, #16120d)", border: "1px solid #2a2318", borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: "linear-gradient(135deg, #2a2014, #1a1510)" }} />
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #D4A754, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#0f0c08", fontWeight: 700, margin: "0 auto 12px", position: "relative", border: "3px solid #0f0c08" }}>{profile.avatar}</div>
                {editProfile ? (
                  <div style={{ display: "grid", gap: 10, textAlign: "left" }}>
                    <input style={{ width: "100%", background: "#0f0c08", border: "1px solid #2a2318", borderRadius: 8, padding: "8px 12px", color: "#e8dcc8", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", outline: "none", boxSizing: "border-box" }} value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value, avatar: e.target.value.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "AF" }))} />
                    <textarea style={{ width: "100%", background: "#0f0c08", border: "1px solid #2a2318", borderRadius: 8, padding: "8px 12px", color: "#e8dcc8", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", outline: "none", minHeight: 60, resize: "vertical", boxSizing: "border-box" }} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
                    <button onClick={() => setEditProfile(false)} style={{ background: "linear-gradient(135deg, #D4A754, #B8943F)", border: "none", borderRadius: 8, padding: 10, color: "#0f0c08", fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, cursor: "pointer" }}>Save</button>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e8dcc8", fontSize: 22, margin: "0 0 4px" }}>{profile.name}</h2>
                    <p style={{ color: "#6b5e4f", fontSize: 12, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Member since {profile.joinDate}</p>
                    <p style={{ color: "#8a7b69", fontSize: 14, fontStyle: "italic", margin: "0 0 12px" }}>"{profile.bio}"</p>
                    <button onClick={() => setEditProfile(true)} style={{ background: "transparent", border: "1px solid #2a2318", borderRadius: 8, padding: "6px 16px", color: "#6b5e4f", fontSize: 12, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, cursor: "pointer" }}>Edit Profile</button>
                  </>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[{ icon: "🗄️", label: "In Humidor", value: humidorCigars.length }, { icon: "🔥", label: "Smoked", value: cigarList.filter(c => !c.inHumidor).length }, { icon: "⭐", label: "Total Rated", value: allRated.length }, { icon: "❤️", label: "Favorites", value: favoriteCigars.length }].map((s) => (
                  <div key={s.label} style={{ background: "#1a1510", border: "1px solid #2a2318", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <p style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 24, margin: "4px 0 2px", fontWeight: 700 }}>{s.value}</p>
                    <p style={{ color: "#6b5e4f", fontSize: 10, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{s.label}</p>
                  </div>
                ))}
              </div>
              {allRated.length > 0 && (
                <div style={{ background: "linear-gradient(135deg, #1e1a14, #16120d)", border: "1px solid #2a2318", borderRadius: 12, padding: 16 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 15, margin: "0 0 12px" }}>🏆 Top Rated</h3>
                  {[...allRated].sort((a, b) => getAvgRating(b.ratings) - getAvgRating(a.ratings)).slice(0, 3).map((c, i) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid #1e1a14" : "none" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", color: i === 0 ? "#D4A754" : "#6b5e4f", fontSize: 18, fontWeight: 700, minWidth: 24 }}>#{i + 1}</span>
                      <div style={{ flex: 1 }}><p style={{ color: "#e8dcc8", fontSize: 14, margin: 0, fontFamily: "'Playfair Display', serif" }}>{c.name}</p><p style={{ color: "#6b5e4f", fontSize: 12, margin: "2px 0 0" }}>{c.brand}</p></div>
                      <span style={{ fontFamily: "'Playfair Display', serif", color: "#D4A754", fontSize: 16, fontWeight: 700 }}>{getAvgRating(c.ratings)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {(showAddModal || editCigar) && <CigarModal cigar={editCigar} mode={editCigar ? "edit" : "add"} onClose={() => { setShowAddModal(false); setEditCigar(null); }} onSave={handleAddCigar} />}
      {viewCigar && !editCigar && <CigarDetail cigar={viewCigar} onClose={() => setViewCigar(null)} onEdit={(c) => { setViewCigar(null); setEditCigar(c); }} onFavorite={handleToggleFavorite} onShare={(c) => { setViewCigar(null); setShareCigar(c); }} isFavorite={favorites.has(viewCigar.id)} />}
      {viewFriend && <FriendProfile friend={viewFriend} friendCigars={friendCigarsForFriend(viewFriend)} onClose={() => setViewFriend(null)} />}
      {showScanner && <BarcodeScanner onClose={() => setShowScanner(false)} onCigarFound={handleScannedCigar} />}
      {shareCigar && <ShareModal cigar={shareCigar} onClose={() => setShareCigar(null)} />}

      <TabBar tabs={tabs} active={activeTab} onChange={(t) => { setActiveTab(t); setSearchQuery(""); }} />
    </div>
  );
}
