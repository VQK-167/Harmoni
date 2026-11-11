import { useEffect, useState } from "react";
import { getBlocks, unblockUser } from "../api";

// SAF-02
function BlockListPage() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const res = await getBlocks();
      setBlocks(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnblock(userId) {
    if (
      !window.confirm(
        "Bỏ chặn người này? Họ sẽ có thể thấy hồ sơ của bạn trở lại."
      )
    ) {
      return;
    }
    try {
      await unblockUser(userId);
      // Cap nhat state tai cho, khong can goi lai API
      setBlocks((prev) => prev.filter((b) => b.userId !== userId));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="container py-5">Đang tải danh sách...</div>;
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 680 }}>
      <h2 className="mb-1">Đã chặn</h2>
      <p className="text-secondary mb-4">
        Người bị chặn không xuất hiện trong Khám phá, không thấy hồ sơ của bạn
        và không thể nhắn tin. Bỏ chặn không khôi phục kết nối cũ — hai bên
        phải thích lại nhau.
      </p>

      {blocks.length === 0 ? (
        <p className="text-secondary">Bạn chưa chặn ai.</p>
      ) : (
        <ul className="list-group">
          {blocks.map((b) => (
            <li
              key={b.userId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-semibold">
                  {b.displayName || "Người dùng đã xóa"}
                </div>
                <small className="text-secondary">
                  Chặn ngày {new Date(b.blockedAt).toLocaleDateString("vi-VN")}
                </small>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleUnblock(b.userId)}
              >
                Bỏ chặn
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BlockListPage;
