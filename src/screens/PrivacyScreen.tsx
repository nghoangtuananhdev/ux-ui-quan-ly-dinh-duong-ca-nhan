import React, { useState } from "react";
import Header from "../components/layout/Header";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Field from "../components/ui/Field";

export interface PrivacyScreenProps {
  counts: { meals: number; water: number; custom: number };
  email: string;
  hasBody: boolean;
  onBack: () => void;
  onClearAll: () => void;
}

/** Màn 16 — Quyền riêng tư & dữ liệu (FR-10, SAF-01). */
export default function PrivacyScreen({ counts, email, hasBody, onBack, onClearAll }: PrivacyScreenProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const ok = confirmText.trim().toUpperCase() === "XÓA";

  return (
    <>
      <Header title="Quyền riêng tư & dữ liệu" back={onBack} />
      <main className="screen pad">
        <div className="mb-4 flex gap-3 rounded-lg bg-brand-50 p-3.5">
          <Icon name="shield" size={22} className="shrink-0 text-brand-text-soft" />
          <p className="m-0 text-label text-brand-text">
            Thông tin của <b>{email}</b> chỉ dùng để gợi ý món cho riêng bạn và không chia sẻ với ai khác.
          </p>
        </div>

        <section className="profile-card !p-4">
          <h2 className="mb-3">Chúng tôi lưu</h2>
          <ul className="m-0 grid gap-2 p-0 list-none text-body text-ink">
            <li className="flex justify-between"><span>Bữa ăn đã ghi</span><b className="tabular-nums">{counts.meals} món</b></li>
            <li className="flex justify-between"><span>Lần ghi nước uống</span><b className="tabular-nums">{counts.water} lần</b></li>
            <li className="flex justify-between"><span>Món tự đặt</span><b className="tabular-nums">{counts.custom} món</b></li>
            <li className="flex justify-between"><span>Chiều cao, cân nặng, tuổi (để tính BMI)</span><b>{hasBody ? "Có" : "Chưa nhập"}</b></li>
            <li className="flex justify-between"><span>Mục tiêu, thực đơn, nhắc nhở</span><b>Có</b></li>
          </ul>
        </section>

        <section className="profile-card !p-4">
          <h2 className="mb-3">Chúng tôi không lưu</h2>
          <ul className="m-0 grid gap-1.5 pl-5 text-body text-ink">
            <li>Bệnh lý, thuốc, thông tin y tế</li>
            <li>Số điện thoại, vị trí, danh bạ</li>
            <li>Mật khẩu của bạn (không ai đọc được)</li>
          </ul>
        </section>

        <div className="mb-4 flex gap-3 rounded-lg border border-line bg-surface p-3.5">
          <Icon name="info" size={20} className="shrink-0 text-ink-muted" />
          <p className="m-0 text-label text-ink-muted">
            NutriDaily không chẩn đoán bệnh và không thay thế tư vấn của bác sĩ hoặc chuyên gia dinh dưỡng. Nếu bạn có nhu cầu ăn uống đặc biệt vì sức khỏe, hãy hỏi ý kiến chuyên gia.
          </p>
        </div>

        <Button variant="danger" icon="trash" onClick={() => setOpen(true)}>
          Xóa tài khoản và dữ liệu
        </Button>
      </main>

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setConfirmText("");
        }}
        title="Xóa tài khoản?"
      >
        <div className="space-y-3 text-left">
          <p className="text-body text-ink-muted text-center">
            Tài khoản cùng nhật ký, chỉ số cơ thể, món tự đặt, thực đơn và món yêu thích của bạn sẽ mất hẳn. <b>Không thể hoàn tác.</b>
          </p>
          <Field label="Gõ XÓA để xác nhận" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoComplete="off" />
          <Button
            variant="danger"
            disabled={!ok}
            onClick={() => {
              setOpen(false);
              onClearAll();
            }}
          >
            Xóa vĩnh viễn
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Giữ lại dữ liệu
          </Button>
        </div>
      </Modal>
    </>
  );
}
