/**
 * auth.js
 * Xử lý Đăng ký (AUTH-01) và Đăng nhập (AUTH-02, AUTH-03) qua API thật (xem HarmoniStore trong app.js).
 */

(function () {
  "use strict";

  function setFieldError(inputEl, message) {
    inputEl.classList.add("is-invalid");
    inputEl.classList.remove("is-valid");
    // .form-group-hm bao ngoài cả input thường và input có nút hiện/ẩn mật khẩu (.password-field)
    var group = inputEl.closest(".form-group-hm");
    var feedback = group ? group.querySelector(".invalid-feedback") : null;
    if (feedback) feedback.textContent = message;
  }

  function clearFieldError(inputEl) {
    inputEl.classList.remove("is-invalid");
    inputEl.classList.add("is-valid");
  }

  function initRegisterForm() {
    var form = document.getElementById("registerForm");
    if (!form) return;

    HarmoniApp.wirePasswordToggles();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var emailInput = document.getElementById("regEmail");
      var passwordInput = document.getElementById("regPassword");
      var confirmInput = document.getElementById("regConfirmPassword");
      var termsInput = document.getElementById("regTerms");
      var alertBox = document.getElementById("registerAlert");
      alertBox.classList.add("d-none");

      var valid = true;

      if (!HarmoniApp.isValidEmail(emailInput.value)) {
        setFieldError(emailInput, "Email không đúng định dạng. Ví dụ: ten@email.com");
        valid = false;
      } else {
        clearFieldError(emailInput);
      }

      if (!passwordInput.value || passwordInput.value.length < 6) {
        setFieldError(passwordInput, "Mật khẩu cần có ít nhất 6 ký tự.");
        valid = false;
      } else {
        clearFieldError(passwordInput);
      }

      if (confirmInput.value !== passwordInput.value || !confirmInput.value) {
        setFieldError(confirmInput, "Mật khẩu xác nhận không khớp.");
        valid = false;
      } else {
        clearFieldError(confirmInput);
      }

      if (!termsInput.checked) {
        document.getElementById("termsError").classList.remove("d-none");
        valid = false;
      } else {
        document.getElementById("termsError").classList.add("d-none");
      }

      if (!valid) return;

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      HarmoniStore.registerUser(emailInput.value.trim(), passwordInput.value)
        .then(function () {
          alertBox.className = "alert alert-success";
          alertBox.textContent = "Tạo tài khoản thành công! Đang chuyển sang trang đăng nhập...";
          alertBox.classList.remove("d-none");
          form.reset();

          setTimeout(function () {
            window.location.href = "login.html?registered=1&email=" + encodeURIComponent(emailInput.value.trim());
          }, 1200);
        })
        .catch(function (err) {
          if (err.status === 409) {
            setFieldError(emailInput, "Email này đã được sử dụng để đăng ký.");
          } else {
            alertBox.className = "alert alert-danger";
            alertBox.textContent = err.message || "Đăng ký thất bại. Vui lòng thử lại.";
            alertBox.classList.remove("d-none");
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function initLoginForm() {
    var form = document.getElementById("loginForm");
    if (!form) return;

    HarmoniApp.wirePasswordToggles();

    // Nếu vừa đăng ký xong, hiện thông báo + điền sẵn email
    var params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") {
      var infoBox = document.getElementById("loginAlert");
      infoBox.className = "alert alert-success";
      infoBox.textContent = "Đăng ký thành công! Hãy đăng nhập để tiếp tục.";
      infoBox.classList.remove("d-none");
      var presetEmail = params.get("email");
      if (presetEmail) document.getElementById("loginEmail").value = presetEmail;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var emailInput = document.getElementById("loginEmail");
      var passwordInput = document.getElementById("loginPassword");
      var alertBox = document.getElementById("loginAlert");

      var valid = true;
      if (!HarmoniApp.isValidEmail(emailInput.value)) {
        setFieldError(emailInput, "Vui lòng nhập email hợp lệ.");
        valid = false;
      } else {
        clearFieldError(emailInput);
      }
      if (!passwordInput.value) {
        setFieldError(passwordInput, "Vui lòng nhập mật khẩu.");
        valid = false;
      } else {
        clearFieldError(passwordInput);
      }
      if (!valid) return;

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      HarmoniStore.login(emailInput.value.trim(), passwordInput.value)
        .then(function (user) {
          return HarmoniStore.hasProfile(user.id);
        })
        .then(function (hasProfile) {
          window.location.href = hasProfile ? "discover.html" : "create-profile.html";
        })
        .catch(function (err) {
          alertBox.className = "alert alert-danger";
          alertBox.textContent = err.status === 401
            ? "Email hoặc mật khẩu không đúng. Vui lòng thử lại."
            : (err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
          alertBox.classList.remove("d-none");
          var loginCard = document.getElementById("loginCard");
          if (loginCard) {
            loginCard.classList.remove("shake-no");
            void loginCard.offsetWidth;
            loginCard.classList.add("shake-no");
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  window.HarmoniAuth = {
    initRegisterForm: initRegisterForm,
    initLoginForm: initLoginForm
  };
})();
