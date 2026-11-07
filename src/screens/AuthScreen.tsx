import React, { useState } from "react";
import Header, { Logo } from "../components/layout/Header";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Icon from "../components/ui/Icon";
import { isValidEmail, signIn, signUp } from "../lib/auth";

export interface AuthScreenProps {
  mode: "login" | "signup";
  onSwitchMode: (mode: "login" | "signup") => void;
  onBack: () => void;
  onDone: (isNew: boolean) => void;
}

export default function AuthScreen({ mode, onSwitchMode, onBack, onDone }: AuthScreenProps) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = {
    name: isSignup && !name.trim() ? "Hãy cho NutriDaily biết tên của bạn." : undefined,
    email: !isValidEmail(email) ? "Email chưa đúng định dạng, ví dụ: ban@gmail.com" : undefined,
    password: password.length < 6 ? "Mật khẩu cần ít nhất 6 ký tự." : undefined,
  };
  const ok = !errors.name && !errors.email && !errors.password;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");
    if (!ok) return;
    setLoading(true);
    const err = isSignup ? await signUp(name, email, password) : await signIn(email, password);
    setLoading(false);
    if (err) setFormError(err);
    else onDone(isSignup);
  };

  return (
    <>
      <Header title={isSignup ? "Tạo tài khoản" : "Đăng nhập"} back={onBack} />
      <main className="screen pad">
        <div className="mb-5 mt-2">
          <Logo />
          <h1 className="!mt-4">{isSignup ? "Bắt đầu cùng NutriDaily" : "Chào mừng trở lại"}</h1>
          <p className="muted">
            {isSignup ? "Chỉ mất 30 giây để bắt đầu ghi lại bữa ăn của bạn." : "Đăng nhập để tiếp tục nhật ký ăn uống của bạn."}
          </p>
        </div>

        <form onSubmit={submit} noValidate>
          {isSignup && (
            <Field label="Tên của bạn" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ví dụ: Minh Hoàng" error={submitted ? errors.name : undefined} />
          )}
          <Field label="Email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="ban@gmail.com" error={submitted ? errors.email : undefined} />
          <div className="relative">
            <Field
              label="Mật khẩu"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
              hint={isSignup ? "Ít nhất 6 ký tự." : undefined}
              error={submitted ? errors.password : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-[30px] min-h-[40px] px-2 text-caption font-bold text-brand-text-soft cursor-pointer"
              aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {formError && (
            <p className="mb-3 flex items-center gap-2 rounded-md bg-danger-tint px-3 py-2.5 text-label text-danger" role="alert">
              <Icon name="info" size={16} /> {formError}
            </p>
          )}

          <Button type="submit" loading={loading} className="mt-2">
            {isSignup ? "Tạo tài khoản" : "Đăng nhập"}
          </Button>
        </form>

        <p className="mt-5 text-center text-body text-ink-muted">
          {isSignup ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormError("");
              onSwitchMode(isSignup ? "login" : "signup");
            }}
            className="min-h-[44px] font-bold text-brand-text-soft underline underline-offset-4 cursor-pointer"
          >
            {isSignup ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </p>

        <p className="mt-2 flex items-start gap-2 text-caption text-ink-muted">
          <Icon name="shield" size={16} className="shrink-0 mt-0.5" />
          Thông tin của bạn được giữ riêng tư. Bạn có thể xóa tài khoản bất cứ lúc nào.
        </p>
      </main>
    </>
  );
}
