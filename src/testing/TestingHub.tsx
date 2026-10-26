import React, { useState } from "react";
import Icon from "../components/ui/Icon";
import { Logo } from "../components/layout/Header";

export interface TestingHubProps {
  onBack: () => void;
}

export default function TestingHub({ onBack }: TestingHubProps) {
  const [tab, setTab] = useState<"plan" | "tasks" | "results" | "report">("plan");

  const tasks = [
    [
      "T1 – Ghi bữa trưa",
      "Bạn vừa ăn 150 g cơm trắng trong bữa trưa hôm nay. Hãy ghi lại bữa ăn này.",
      "Hôm nay · dữ liệu mẫu",
      "Nhật ký có Cơm trắng, 150 g, 195 kcal",
    ],
    [
      "T2 – Sửa khẩu phần",
      "Bạn nhận ra mình chỉ ăn 100 g cơm, thay vì lượng vừa ghi. Hãy sửa lại.",
      "Tiếp nối T1",
      "Cơm trắng đổi thành 100 g, tổng giảm 65 kcal",
    ],
    [
      "T3 – Ghi nước uống",
      "Bạn vừa uống 250 ml nước. Hãy cập nhật thông tin này.",
      "Hôm nay · nước 1.250 ml",
      "Tổng nước tăng chính xác 250 ml",
    ],
    [
      "T4 – Đổi món",
      "Bạn muốn thay món trong bữa trưa ngày mai bằng một món khác trong danh sách có sẵn.",
      "Thực đơn · ngày mai",
      "Món mới xuất hiện đúng bữa trưa, đúng ngày",
    ],
    [
      "T5 – Đọc tổng quan",
      "Bạn muốn biết hôm nay đã ghi bao nhiêu năng lượng và bao nhiêu nước. Hãy tìm và giải thích.",
      "Hôm nay · dữ liệu mẫu",
      "Đọc đúng cả năng lượng và nước, kèm đơn vị",
    ],
    [
      "T6 – Sửa mục tiêu",
      "Trong tình huống giả định này, bạn muốn đổi mục tiêu nước từ 2.000 ml thành 2.200 ml.",
      "Cá nhân · mục tiêu mẫu",
      "Hôm nay hiển thị mục tiêu nước 2.200 ml",
    ],
  ];

  return (
    <div className="testing-hub">
      <aside>
        <Logo light />
        <div>
          <span className="doc-label">BỘ BÀN GIAO</span>
          <h1>Kế hoạch kiểm thử khả năng sử dụng</h1>
          <p>NutriDaily · Phiên bản 1.0</p>
        </div>
        <nav>
          {[
            ["plan", "Tổng quan"],
            ["tasks", "Nhiệm vụ kiểm thử"],
            ["results", "Phiếu ghi nhận"],
            ["report", "Dàn ý báo cáo"],
          ].map((x) => (
            <button
              key={x[0]}
              type="button"
              className={tab === x[0] ? "active" : ""}
              onClick={() => setTab(x[0] as typeof tab)}
            >
              <span>{x[1]}</span>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </nav>
        <button type="button" className="back-prototype" onClick={onBack}>
          <Icon name="arrow" size={18} />
          Quay lại prototype
        </button>
      </aside>

      <main>
        <header>
          <div>
            <span>TÀI LIỆU ĐIỀU PHỐI</span>
            <h2>
              {tab === "plan"
                ? "Tổng quan nghiên cứu"
                : tab === "tasks"
                ? "Nhiệm vụ kiểm thử"
                : tab === "results"
                ? "Phiếu ghi nhận kết quả"
                : "Dàn ý báo cáo"}
            </h2>
          </div>
          <div className="status-pill">
            <i /> Chờ kiểm thử thực tế
          </div>
        </header>

        {tab === "plan" && (
          <div className="doc-content">
            <div className="notice">
              <Icon name="help" size={20} />
              <p>
                <b>Lưu ý về tính trung thực nghiên cứu:</b>
                <br />
                Đối tượng 18–35 tuổi và các nhu cầu trong prototype là{" "}
                <strong>giả định thiết kế cần kiểm chứng</strong>. Tài liệu không
                chứa kết quả, thời gian hay trích dẫn được tạo sẵn.
              </p>
            </div>
            <section className="doc-section">
              <span className="doc-number">01</span>
              <div>
                <h3>Mục tiêu kiểm thử</h3>
                <div className="goal-grid">
                  {[
                    "Tìm và ghi món ăn",
                    "Hiểu khẩu phần, đơn vị",
                    "Nhận ra trạng thái lưu",
                    "Sửa hoặc xóa dữ liệu",
                    "Phân biệt kế hoạch và đã ăn",
                    "Đọc đúng tổng quan",
                  ].map((x) => (
                    <div key={x}>
                      <Icon name="check" size={16} />
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="doc-section">
              <span className="doc-number">02</span>
              <div>
                <h3>Thiết lập buổi thử</h3>
                <div className="facts">
                  <div>
                    <span>Người tham gia</span>
                    <b>Tối thiểu 3 người</b>
                    <small>Mã hóa P01, P02, P03</small>
                  </div>
                  <div>
                    <span>Thời lượng</span>
                    <b>20–30 phút</b>
                    <small>Mỗi buổi, có điều phối</small>
                  </div>
                  <div>
                    <span>Phương pháp</span>
                    <b>Think aloud</b>
                    <small>Nói ra suy nghĩ khi thao tác</small>
                  </div>
                </div>
              </div>
            </section>
            <section className="doc-section">
              <span className="doc-number">03</span>
              <div>
                <h3>Lời mở đầu</h3>
                <blockquote>
                  “Cảm ơn bạn đã tham gia. Chúng tôi đang kiểm tra mức độ dễ sử
                  dụng của ứng dụng, không kiểm tra khả năng của bạn. Trong quá
                  trình thao tác, hãy nói ra điều bạn đang nghĩ. Bạn có thể dừng
                  bất cứ lúc nào. Các thông tin ăn uống trong bài thử là dữ liệu
                  giả định.”
                </blockquote>
                <p className="consent">
                  <Icon name="check" size={16} /> Hỏi và ghi nhận đồng ý trước nếu
                  có ghi âm hoặc ghi hình.
                </p>
              </div>
            </section>
            <section className="doc-section">
              <span className="doc-number">04</span>
              <div>
                <h3>Nguyên tắc điều phối</h3>
                <ul>
                  <li>Không chỉ cách thao tác ngay khi người dùng gặp khó khăn.</li>
                  <li>Nếu phải hỗ trợ, ghi rõ thời điểm và nội dung hỗ trợ.</li>
                  <li>Sau mỗi nhiệm vụ, hỏi mức dễ thực hiện từ 1 đến 7.</li>
                  <li>Đặt lại dữ liệu mẫu từ mục Cá nhân giữa các lượt thử.</li>
                </ul>
              </div>
            </section>
          </div>
        )}

        {tab === "tasks" && (
          <div className="doc-content">
            <div className="tasks-grid">
              {tasks.map((t, i) => (
                <article className="task-card" key={t[0]}>
                  <div className="task-title">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{t[0]}</h3>
                      <p>{t[1]}</p>
                    </div>
                  </div>
                  <dl>
                    <div>
                      <dt>Trạng thái bắt đầu</dt>
                      <dd>{t[2]}</dd>
                    </div>
                    <div>
                      <dt>Điều kiện hoàn thành</dt>
                      <dd>{t[3]}</dd>
                    </div>
                    <div>
                      <dt>Tính thời gian</dt>
                      <dd>Từ khi đọc xong nhiệm vụ đến khi người dùng xác nhận đã xong.</dd>
                    </div>
                    <div>
                      <dt>Quan sát</dt>
                      <dd>Đường đi, lần chạm sai, do dự, hỗ trợ đã cung cấp.</dd>
                    </div>
                    <div>
                      <dt>Đặt lại</dt>
                      <dd>
                        {i === 1
                          ? "Hoàn tất T1 trước; sau T2 đặt lại dữ liệu mẫu."
                          : "Cá nhân → Đặt lại dữ liệu mẫu."}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "results" && (
          <div className="doc-content">
            <div className="notice">
              <Icon name="help" size={20} />
              <p>
                <b>Không điền trước dữ liệu.</b>
                <br />
                Chỉ bổ sung thời gian, điểm số, quan sát và phát biểu sau khi đã
                thử với người thật.
              </p>
            </div>
            <section className="result-sheet">
              <h3>Bảng ghi nhận theo nhiệm vụ</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Mã",
                        "Nhiệm vụ",
                        "Kết quả",
                        "Thời gian",
                        "Số lỗi",
                        "Hỗ trợ",
                        "Mức dễ 1–7",
                        "Quan sát / Phát biểu",
                      ].map((x) => (
                        <th key={x}>{x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["P01", "P02", "P03"].flatMap((p) =>
                      ["T1", "T2", "T3", "T4", "T5", "T6"].map((t) => (
                        <tr key={p + t}>
                          <td>{p}</td>
                          <td>{t}</td>
                          {Array(6)
                            .fill(0)
                            .map((_, i) => (
                              <td key={i}>Chờ bổ sung</td>
                            ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="result-sheet">
              <h3>Câu hỏi cuối buổi</h3>
              <ol>
                <li>Bạn thấy phần nào dễ sử dụng nhất?</li>
                <li>Phần nào làm bạn phải dừng lại suy nghĩ?</li>
                <li>Có từ ngữ hoặc số liệu nào khó hiểu không?</li>
                <li>Bạn có phân biệt được món trong kế hoạch và món đã ăn không?</li>
                <li>Nếu chỉ được thay đổi một điều, bạn muốn thay đổi điều gì?</li>
              </ol>
            </section>
          </div>
        )}

        {tab === "report" && (
          <div className="doc-content">
            <div className="report-grid">
              {[
                "Mục tiêu và phạm vi",
                "Người tham gia và cách tuyển chọn",
                "Thiết bị, bối cảnh và phương pháp",
                "Nhiệm vụ kiểm thử",
                "Kết quả thực tế",
                "Vấn đề và mức ưu tiên",
                "Cải tiến trước / sau",
                "Hạn chế và kế hoạch kiểm thử lại",
              ].map((x, i) => (
                <section key={x}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{x}</h3>
                  <p>
                    {i < 4
                      ? "Khung nội dung đã chuẩn bị; cập nhật chi tiết theo bối cảnh buổi thử."
                      : "Chờ bổ sung sau kiểm thử thực tế"}
                  </p>
                </section>
              ))}
            </div>
            <section className="priority-guide">
              <h3>Khung tổng hợp vấn đề</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Vấn đề",
                        "Bằng chứng quan sát",
                        "Người gặp",
                        "Ảnh hưởng",
                        "Ưu tiên",
                        "Nguyên nhân giả định",
                        "Cải tiến",
                        "Kiểm thử lại",
                      ].map((x) => (
                        <th key={x}>{x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {Array(8)
                        .fill(0)
                        .map((_, i) => (
                          <td key={i}>Chờ bổ sung</td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="priority-row">
                <span>
                  <i className="high" />
                  Cao: chặn tác vụ / lưu sai
                </span>
                <span>
                  <i className="medium" />
                  Trung bình: cần hỗ trợ / nhầm lẫn
                </span>
                <span>
                  <i className="low" />
                  Thấp: bất tiện nhỏ
                </span>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
