document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // BAGIAN 1: COVER OPEN INVITATION & AUDIO PLAYER
  // =========================================================
  const coverOverlay = document.getElementById("cover-overlay");
  const openInvitationBtn = document.getElementById("open-invitation-btn");
  const bgMusic = document.getElementById("bg-music");
  const musicToggleBtn = document.getElementById("music-toggle");
  const musicIcon = document.getElementById("music-icon");
  const musicLabel = document.getElementById("music-label");

  let isPlaying = false;

  if (coverOverlay && openInvitationBtn) {
    openInvitationBtn.addEventListener("click", () => {
      coverOverlay.classList.add("opened");
      document.body.classList.remove("no-scroll");

      if (musicToggleBtn) {
        musicToggleBtn.classList.remove("hidden");
      }

      if (bgMusic) {
        bgMusic.volume = 0.45;
        bgMusic
          .play()
          .then(() => {
            isPlaying = true;
            updateMusicUI(true);
          })
          .catch(() => {
            isPlaying = false;
            updateMusicUI(false);
          });
      }
    });
  }

  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        updateMusicUI(false);
      } else {
        bgMusic.play();
        isPlaying = true;
        updateMusicUI(true);
      }
    });
  }

  function updateMusicUI(playing) {
    if (!musicIcon || !musicLabel) return;
    if (playing) {
      musicIcon.textContent = "🔊";
      musicLabel.textContent = "Musik Aktif";
    } else {
      musicIcon.textContent = "🔇";
      musicLabel.textContent = "Musik Dijeda";
    }
  }

  // =========================================================
  // BAGIAN 2: COUNTDOWN TIMER MENUJU ACARA (12 DESEMBER 2026)
  // =========================================================
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");

  if (cdDays && cdHours && cdMinutes && cdSeconds) {
    const eventDate = new Date("December 12, 2026 08:00:00").getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance <= 0) {
        cdDays.textContent = "00";
        cdHours.textContent = "00";
        cdMinutes.textContent = "00";
        cdSeconds.textContent = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      cdDays.textContent = String(days).padStart(2, "0");
      cdHours.textContent = String(hours).padStart(2, "0");
      cdMinutes.textContent = String(minutes).padStart(2, "0");
      cdSeconds.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // =========================================================
  // BAGIAN 3: PERSONALISASI URL PARAMETER (COVER + HERO + RSVP)
  // =========================================================
  const guestNameEl = document.getElementById("guest-name");
  const guestCategoryEl = document.getElementById("guest-category");
  const coverGuestNameEl = document.getElementById("cover-guest-name");
  const coverGuestCategoryEl = document.getElementById("cover-guest-category");
  const guestInstansiEl = document.getElementById("guest-instansi");
  const coverGuestInstansiEl = document.getElementById("cover-guest-instansi");
  const urlParams = new URLSearchParams(window.location.search);
  const namaParam = urlParams.get("nama")?.trim() || "";
  const instansi = urlParams.get("to")?.trim() || "";
  const kategori = urlParams.get("kategori")?.trim() || "Umum";
  const nama = namaParam || "Tamu Undangan Kehormatan";

  if (guestNameEl) guestNameEl.textContent = nama;
  if (coverGuestNameEl) coverGuestNameEl.textContent = nama;

  [guestInstansiEl, coverGuestInstansiEl].forEach((element) => {
    if (element) {
      element.textContent = instansi;
      element.hidden = !instansi;
    }
  });

  if (guestCategoryEl) guestCategoryEl.textContent = `Kategori: ${kategori}`;
  if (coverGuestCategoryEl) coverGuestCategoryEl.textContent = `Kategori: ${kategori}`;

  const rsvpPicInput = document.getElementById("rsvp-pic");
  if (rsvpPicInput && namaParam) rsvpPicInput.value = namaParam;

  const rsvpInstansiInput = document.getElementById("rsvp-instansi");
  if (rsvpInstansiInput) rsvpInstansiInput.value = instansi;

  const rsvpKategoriSelect = document.getElementById("rsvp-kategori");
  if (rsvpKategoriSelect) {
    const matchingOption = Array.from(rsvpKategoriSelect.options).find(
      (option) => option.value.toLowerCase() === kategori.toLowerCase()
    );

    if (matchingOption) {
      rsvpKategoriSelect.value = matchingOption.value;
    } else {
      const option = document.createElement("option");
      option.value = kategori;
      option.textContent = kategori;
      rsvpKategoriSelect.appendChild(option);
      rsvpKategoriSelect.value = kategori;
    }
  }

  // Penanganan Submit Form RSVP
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpFeedback = document.getElementById("rsvp-feedback");

  if (rsvpForm && rsvpFeedback) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const instansi = document.getElementById("rsvp-instansi").value;
      const pic = document.getElementById("rsvp-pic").value;
      const kategori = document.getElementById("rsvp-kategori").value;
      const status = document.getElementById("rsvp-status").value;
      const jumlah = document.getElementById("rsvp-jumlah").value;

      rsvpFeedback.innerHTML = `
        <strong>Terima kasih, ${escapeHTML(pic)}!</strong><br/>
        Konfirmasi kehadiran untuk <strong>${escapeHTML(instansi)}</strong> (${escapeHTML(kategori)}) 
        dengan status <strong>"${escapeHTML(status)}"</strong> (${escapeHTML(jumlah)} orang) telah berhasil dicatat.
      `;
      rsvpFeedback.classList.remove("hidden");
      rsvpForm.reset();
    });
  }

  // =========================================================
  // BAGIAN 4: LOGIKA HALAMAN ADMIN & BLAST CSV (admin.html)
  // =========================================================
  const csvInput = document.getElementById("csv-file-input");
  const baseUrlInput = document.getElementById("base-url-input");
  const tableBody = document.getElementById("guest-table-body");
  const uploadStatus = document.getElementById("upload-status");
  const guestCountBadge = document.getElementById("guest-count");

  let parsedGuests = [];

  if (csvInput && baseUrlInput && tableBody) {
    const currentUrl = window.location.href.split("?")[0];
    const defaultIndexUrl = currentUrl.endsWith("admin.html")
      ? currentUrl.replace("admin.html", "index.html")
      : currentUrl.replace(/\/[^\/]*$/, "/index.html");
    baseUrlInput.value = defaultIndexUrl;

    baseUrlInput.addEventListener("input", () => {
      if (parsedGuests.length > 0) {
        renderGuestTable(parsedGuests);
      }
    });

    csvInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        parsedGuests = parseCSV(csvText);

        if (parsedGuests.length > 0) {
          uploadStatus.textContent = `Berhasil memuat ${parsedGuests.length} data tamu dari "${file.name}".`;
          guestCountBadge.textContent = `${parsedGuests.length} Tamu`;
          renderGuestTable(parsedGuests);
        } else {
          uploadStatus.textContent = "File CSV kosong atau format kolom tidak sesuai.";
          guestCountBadge.textContent = "0 Tamu";
        }
      };
      reader.readAsText(file);
    });
  }

  function parseCSV(text) {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");

    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());

    const guests = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map((v) => v.trim());
      if (values.length < 5) continue;

      const rowObj = {};
      headers.forEach((header, idx) => {
        rowObj[header] = values[idx] || "";
      });

      guests.push({
        id: rowObj.id || i,
        nama_tamu: rowObj.nama_tamu || "-",
        instansi: rowObj.instansi || "-",
        kategori: rowObj.kategori || "Umum",
        no_whatsapp: formatWhatsAppNumber(rowObj.no_whatsapp || "")
      });
    }
    return guests;
  }

  function formatWhatsAppNumber(phone) {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    return clean;
  }

  function generatePersonalLink(guest) {
    const baseUrl = baseUrlInput.value.trim() || "index.html";
    const params = new URLSearchParams({
      nama: guest.nama_tamu,
      to: guest.instansi,
      kategori: guest.kategori,
    });
    const url = new URL(baseUrl, window.location.href);
    url.search = params.toString();
    return url.href;
  }

  function generateWhatsAppBlastUrl(guest, personalLink) {
    const message =
      `Yth. Bapak/Ibu *${guest.nama_tamu}*\n` +
      `Perwakilan dari *${guest.instansi}* (${guest.kategori})\n\n` +
      `Dengan hormat, kami Panitia *Edu Fair & Career Day 2026* mengundang instansi Anda untuk berpartisipasi dalam ajang pameran pendidikan dan karir tahunan sekolah kami.\n\n` +
      `📅 *Hari/Tanggal:* Sabtu, 12 Desember 2026\n` +
      `⏰ *Waktu:* 08.00 – 15.30 WIB\n` +
      `📍 *Tempat:* SMKN 6 Tangerang Selatan (Jl. Magnolia VI No.6, Jelupang, Serpong Utara)\n\n` +
      `Silakan buka tautan undangan digital khusus instansi Anda beserta form konfirmasi kehadiran (RSVP) di bawah ini:\n` +
      `${personalLink}\n\n` +
      `Atas perhatian dan kehadirannya, kami ucapkan terima kasih.`;

    return `https://wa.me/${guest.no_whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function renderGuestTable(guests) {
    tableBody.innerHTML = "";

    guests.forEach((guest) => {
      const personalLink = generatePersonalLink(guest);
      const waBlastUrl = generateWhatsAppBlastUrl(guest, personalLink);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHTML(String(guest.id))}</td>
        <td><strong>${escapeHTML(guest.nama_tamu)}</strong></td>
        <td>${escapeHTML(guest.instansi)}</td>
        <td><span class="badge-cat">${escapeHTML(guest.kategori)}</span></td>
        <td>+${escapeHTML(guest.no_whatsapp)}</td>
        <td>
          <a href="${personalLink}" target="_blank" style="color: #1e40af; font-size: 0.82rem; word-break: break-all;">
            Buka Link ↗
          </a>
        </td>
        <td>
          <div class="action-group">
            <a href="${waBlastUrl}" target="_blank" class="btn btn-wa">
              Kirim Undangan WhatsApp
            </a>
            <button type="button" class="btn btn-copy" data-link="${escapeHTML(personalLink)}">
              Salin Link
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll(".btn-copy").forEach((btn) => {
      btn.addEventListener("click", () => {
        const link = btn.getAttribute("data-link");
        navigator.clipboard.writeText(link).then(() => {
          const originalText = btn.textContent;
          btn.textContent = "Tersalin!";
          setTimeout(() => {
            btn.textContent = originalText;
          }, 1500);
        });
      });
    });
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});