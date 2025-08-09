import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    setError("");
    // ضع هنا منطق تسجيل الدخول الحقيقي (API)
    alert("تم تسجيل الدخول بنجاح (مثال)");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20, direction: "rtl" }}>
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
            placeholder="ادخل بريدك الإلكتروني"
          />
        </div>
        <div>
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
            placeholder="ادخل كلمة المرور"
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ width: "100%" }}>تسجيل الدخول</button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          onClick={() => navigate("/register")}
          style={{ margin: "8px 0", width: "100%" }}
        >
          إنشاء حساب جديد
        </button>
        <button
          onClick={() => navigate("/forgot-password")}
          style={{ margin: "8px 0", width: "100%" }}
        >
          نسيت كلمة المرور؟
        </button>
      </div>
    </div>
  );
};

export default Login;