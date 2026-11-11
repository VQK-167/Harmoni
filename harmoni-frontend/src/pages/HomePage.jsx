import { Link } from "react-router-dom";

// Trang chu. Nhan prop user tu App.jsx
// chua dang nhap -> Dang ky / Dang nhap
// da dang nhap   -> Vao kham pha, hoac Tao ho so neu chua co
function HomePage({ user }) {
  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <p
        className="text-uppercase fw-bold small text-secondary mb-2"
        style={{ letterSpacing: "0.14em" }}
      >
        Kết nối &amp; tìm bạn đồng hành
      </p>

      <h1 className="mb-3">Tìm người đồng điệu, không chỉ người ở gần.</h1>

      <p className="fs-5 text-secondary mb-4">
        Harmoni ghép bạn theo sở thích chung và mục đích kết nối, rồi xếp người
        giống bạn nhất lên đầu.
      </p>

      <div className="d-flex flex-wrap gap-3">
        {user ? (
          <Link
            className="btn btn-primary btn-lg"
            to={user.hasProfile ? "/discover" : "/profile/create"}
          >
            {user.hasProfile ? "Vào khám phá" : "Tạo hồ sơ"}
          </Link>
        ) : (
          <>
            <Link className="btn btn-primary btn-lg" to="/register">
              Đăng ký
            </Link>
            <Link className="btn btn-outline-primary btn-lg" to="/login">
              Đăng nhập
            </Link>
          </>
        )}
      </div>

      <hr className="my-5" />

      <div className="row g-4">
        <div className="col-md-4">
          <h2 className="h5">Ghép theo sở thích chung</h2>
          <p className="text-secondary small mb-0">
            Chọn trong 15 sở thích. Harmoni tính phần trăm tương đồng và chỉ rõ
            hai bạn giống nhau ở đâu.
          </p>
        </div>
        <div className="col-md-4">
          <h2 className="h5">Nói rõ mục đích</h2>
          <p className="text-secondary small mb-0">
            Kết bạn, hẹn hò, hay một mối quan hệ lâu dài. Bạn chọn, và người
            khác đọc được ngay trên hồ sơ.
          </p>
        </div>
        <div className="col-md-4">
          <h2 className="h5">Bạn giữ quyền kiểm soát</h2>
          <p className="text-secondary small mb-0">
            Chặn hoặc báo cáo bất cứ lúc nào. Người bị chặn không còn thấy hồ sơ
            của bạn.
          </p>
        </div>
      </div>

      <p className="text-secondary small mt-5 mb-0">
        Harmoni dành cho người từ 18 tuổi trở lên.
      </p>
    </div>
  );
}

export default HomePage;
