import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    setError("");
    // ضع هنا منطق إرسال طلب الاستعادة الحقيقي (API)
    setSuccess(true);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20, direction: "rtl" }}>
      <h2>استعادة كلمة المرور</h2>
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
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {success && (
          <div style={{ color: "green", marginBottom: 8 }}>
            تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
          </div>
        )}
        <button type="submit" style={{ width: "100%" }}>استعادة كلمة المرور</button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          onClick={() => navigate("/login")}
          style={{ margin: "8px 0", width: "100%" }}
        >
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;