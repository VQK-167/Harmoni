/**
 * profile.js
 * Xử lý 3 trang liên quan hồ sơ:
 *  - create-profile.html (PRO-01, PRO-04): onboarding nhiều bước
 *  - profile.html (PRO-02): xem hồ sơ của mình
 *  - edit-profile.html (PRO-03, INT-03): chỉnh sửa hồ sơ + sở thích
 */

(function () {
  "use strict";

  // =======================================================================
  // CREATE PROFILE (onboarding 3 bước)
  // =======================================================================

  async function initCreateProfile() {
    var root = document.getElementById("onboardingRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;

    var uid = HarmoniStore.getCurrentUserId();
    var already = await HarmoniStore.hasProfile(uid);
    if (already) {
      window.location.href = "profile.html";
      return;
    }

    try {
      await HarmoniStore.loadInterests();
    } catch (err) {
      HarmoniApp.showApiError(err, "Không tải được danh sách sở thích.");
      return;
    }

    var currentStep = 1;
    var totalSteps = 3;
    var selectedInterests = [];

    renderInterestChips();
    updateStepUI();

    document.querySelectorAll("[data-step-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!validateStep(currentStep)) return;
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepUI();
        } else {
          submitProfile();
        }
      });
    });

    document.querySelectorAll("[data-step-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (currentStep > 1) {
          currentStep--;
          updateStepUI();
        }
      });
    });

    function updateStepUI() {
      for (var i = 1; i <= totalSteps; i++) {
        var panel = document.getElementById("step-" + i);
        if (panel) panel.classList.toggle("d-none", i !== currentStep);
        var dot = document.querySelector('.step-indicator .dot[data-step-dot="' + i + '"]');
        if (dot) dot.classList.toggle("active", i === currentStep);
      }
      var progressPct = (currentStep - 1) / (totalSteps - 1) * 100;
      document.getElementById("onboardingBar").style.width = progressPct + "%";
      document.getElementById("stepLabel").textContent = "Bước " + currentStep + " / " + totalSteps;

      var backBtn = document.querySelector("[data-step-back]");
      if (backBtn) backBtn.classList.toggle("invisible", currentStep === 1);

      var nextBtn = document.querySelector("[data-step-next]");
      if (nextBtn) nextBtn.textContent = currentStep === totalSteps ? "Hoàn tất" : "Tiếp tục";
    }

    function validateStep(step) {
      clearErrors();
      if (step === 1) {
        var name = document.getElementById("obName").value.trim();
        var dob = document.getElementById("obDob").value;
        var gender = document.querySelector('input[name="obGender"]:checked');
        var city = document.getElementById("obCity").value.trim();
        var ok = true;

        if (!name) { showError("obNameError", "Vui lòng nhập tên hiển thị."); ok = false; }
        if (!dob) {
          showError("obDobError", "Vui lòng chọn ngày sinh.");
          ok = false;
        } else if (!HarmoniStore.isAdultDob(dob)) {
          showError("obDobError", "Bạn phải đủ 18 tuổi để sử dụng Harmoni.");
          ok = false;
        }
        if (!gender) { showError("obGenderError", "Vui lòng chọn giới tính."); ok = false; }
        if (!city) { showError("obCityError", "Vui lòng nhập thành phố."); ok = false; }
        return ok;
      }
      if (step === 2) {
        var bio = document.getElementById("obBio").value.trim();
        var purpose = document.querySelector('input[name="obPurpose"]:checked');
        var ok2 = true;
        if (!bio) { showError("obBioError", "Vui lòng giới thiệu một chút về bản thân."); ok2 = false; }
        if (!purpose) { showError("obPurposeError", "Vui lòng chọn mục đích kết nối."); ok2 = false; }
        return ok2;
      }
      if (step === 3) {
        if (selectedInterests.length < 3) {
          showError("obInterestsError", "Vui lòng chọn ít nhất 3 sở thích.");
          return false;
        }
        return true;
      }
      return true;
    }

    function showError(id, msg) {
      var el = document.getElementById(id);
      if (el) { el.textContent = msg; el.classList.remove("d-none"); }
    }
    function clearErrors() {
      document.querySelectorAll(".ob-error").forEach(function (el) { el.classList.add("d-none"); });
    }

    function renderInterestChips() {
      var wrap = document.getElementById("interestChipList");
      var interests = HarmoniStore.getAllInterests();
      wrap.innerHTML = interests.map(function (it) {
        return '<span class="interest-chip" data-interest-id="' + it.id + '"><i class="bi ' + it.icon + '"></i> ' + HarmoniApp.escapeHtml(it.name) + '</span>';
      }).join("");

      wrap.querySelectorAll(".interest-chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          var id = parseInt(chip.getAttribute("data-interest-id"), 10);
          var idx = selectedInterests.indexOf(id);
          if (idx === -1) {
            selectedInterests.push(id);
            chip.classList.add("selected");
          } else {
            selectedInterests.splice(idx, 1);
            chip.classList.remove("selected");
          }
          renderSelectedSummary();
        });
      });
      renderSelectedSummary();
    }

    function renderSelectedSummary() {
      var box = document.getElementById("selectedInterestSummary");
      var countEl = document.getElementById("selectedInterestCount");
      if (countEl) countEl.textContent = selectedInterests.length;
      if (!box) return;
      if (!selectedInterests.length) {
        box.innerHTML = '<span class="text-secondary-hm small">Chưa chọn sở thích nào.</span>';
        return;
      }
      var names = HarmoniStore.getInterestsByIds(selectedInterests).map(function (i) { return i.name; });
      box.innerHTML = names.map(function (n) {
        return '<span class="interest-chip static selected">' + HarmoniApp.escapeHtml(n) + '</span>';
      }).join("");
    }

    function submitProfile() {
      var gender = document.querySelector('input[name="obGender"]:checked').value;
      var purpose = document.querySelector('input[name="obPurpose"]:checked').value;
      var profile = {
        displayName: document.getElementById("obName").value.trim(),
        dob: document.getElementById("obDob").value,
        gender: gender,
        city: document.getElementById("obCity").value.trim(),
        bio: document.getElementById("obBio").value.trim(),
        purpose: purpose,
        interestIds: selectedInterests.slice(),
        avatar: HarmoniApp.DEFAULT_AVATAR
      };
      HarmoniStore.upsertProfile(profile)
        .then(function () {
          HarmoniApp.showToast("Tạo hồ sơ thành công! Cùng khám phá nào.", "success");
          setTimeout(function () { window.location.href = "discover.html"; }, 700);
        })
        .catch(function (err) { HarmoniApp.showApiError(err, "Không thể tạo hồ sơ."); });
    }
  }

  // =======================================================================
  // VIEW PROFILE (hồ sơ cá nhân)
  // =======================================================================

  async function initProfileView() {
    var root = document.getElementById("profileViewRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var uid = HarmoniStore.getCurrentUserId();
    var profile;
    try {
      await HarmoniStore.loadInterests();
      profile = await HarmoniStore.getProfile(uid);
    } catch (err) {
      HarmoniApp.showApiError(err, "Không tải được hồ sơ của bạn.");
      return;
    }

    var age = HarmoniStore.calcAge(profile.dob);
    var interests = HarmoniStore.getInterestsByIds(profile.interestIds);

    document.getElementById("pvAvatar").src = profile.avatar || HarmoniApp.DEFAULT_AVATAR;
    document.getElementById("pvNameAge").textContent = profile.displayName + ", " + age + " tuổi";
    document.getElementById("pvCity").textContent = profile.city;
    document.getElementById("pvBio").textContent = profile.bio;
    document.getElementById("pvPurpose").textContent = HarmoniApp.purposeLabel(profile.purpose);
    document.getElementById("pvGender").textContent = HarmoniApp.genderLabel(profile.gender);

    var interestWrap = document.getElementById("pvInterests");
    interestWrap.innerHTML = interests.length
      ? interests.map(function (i) { return '<span class="interest-chip static"><i class="bi ' + i.icon + '"></i> ' + HarmoniApp.escapeHtml(i.name) + '</span>'; }).join("")
      : '<span class="text-secondary-hm small">Chưa có sở thích nào.</span>';
  }

  // =======================================================================
  // EDIT PROFILE
  // =======================================================================

  async function initEditProfile() {
    var root = document.getElementById("editProfileRoot");
    if (!root) return;
    if (!HarmoniApp.requireAuth()) return;
    if (!(await HarmoniApp.requireProfile())) return;

    var uid = HarmoniStore.getCurrentUserId();
    var profile;
    try {
      await HarmoniStore.loadInterests();
      profile = await HarmoniStore.getProfile(uid);
    } catch (err) {
      HarmoniApp.showApiError(err, "Không tải được hồ sơ của bạn.");
      return;
    }

    var selectedInterests = profile.interestIds.slice();

    document.getElementById("epName").value = profile.displayName;
    document.getElementById("epDob").value = profile.dob;
    document.querySelector('input[name="epGender"][value="' + profile.gender + '"]').checked = true;
    document.getElementById("epCity").value = profile.city;
    document.getElementById("epBio").value = profile.bio;
    document.querySelector('input[name="epPurpose"][value="' + profile.purpose + '"]').checked = true;

    var wrap = document.getElementById("epInterestChipList");
    var interests = HarmoniStore.getAllInterests();
    wrap.innerHTML = interests.map(function (it) {
      var sel = selectedInterests.indexOf(it.id) !== -1 ? " selected" : "";
      return '<span class="interest-chip' + sel + '" data-interest-id="' + it.id + '"><i class="bi ' + it.icon + '"></i> ' + HarmoniApp.escapeHtml(it.name) + '</span>';
    }).join("");
    wrap.querySelectorAll(".interest-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var id = parseInt(chip.getAttribute("data-interest-id"), 10);
        var idx = selectedInterests.indexOf(id);
        if (idx === -1) { selectedInterests.push(id); chip.classList.add("selected"); }
        else { selectedInterests.splice(idx, 1); chip.classList.remove("selected"); }
      });
    });

    document.getElementById("editProfileForm").addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("epName").value.trim();
      var dob = document.getElementById("epDob").value;
      var city = document.getElementById("epCity").value.trim();
      var bio = document.getElementById("epBio").value.trim();
      var genderInput = document.querySelector('input[name="epGender"]:checked');
      var purposeInput = document.querySelector('input[name="epPurpose"]:checked');

      var alertBox = document.getElementById("editProfileAlert");
      alertBox.classList.add("d-none");

      if (!name || !dob || !city || !bio || !genderInput || !purposeInput) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent = "Vui lòng điền đầy đủ thông tin bắt buộc.";
        alertBox.classList.remove("d-none");
        return;
      }
      if (!HarmoniStore.isAdultDob(dob)) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent = "Ngày sinh không hợp lệ. Bạn phải đủ 18 tuổi để sử dụng Harmoni.";
        alertBox.classList.remove("d-none");
        return;
      }
      if (selectedInterests.length < 3) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent = "Vui lòng chọn ít nhất 3 sở thích.";
        alertBox.classList.remove("d-none");
        return;
      }

      HarmoniStore.upsertProfile({
        displayName: name,
        dob: dob,
        gender: genderInput.value,
        city: city,
        bio: bio,
        purpose: purposeInput.value,
        interestIds: selectedInterests,
        avatar: profile.avatar || HarmoniApp.DEFAULT_AVATAR
      })
        .then(function () {
          HarmoniApp.showToast("Lưu thay đổi hồ sơ thành công!", "success");
          setTimeout(function () { window.location.href = "profile.html"; }, 700);
        })
        .catch(function (err) {
          alertBox.className = "alert alert-danger";
          alertBox.textContent = err.message || "Không thể lưu hồ sơ. Vui lòng thử lại.";
          alertBox.classList.remove("d-none");
        });
    });

    document.getElementById("editProfileCancelBtn").addEventListener("click", function () {
      window.location.href = "profile.html";
    });
  }

  window.HarmoniProfile = {
    initCreateProfile: initCreateProfile,
    initProfileView: initProfileView,
    initEditProfile: initEditProfile
  };
})();
