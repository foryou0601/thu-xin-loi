(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const config = window.SITE_CONFIG || {};
  const intro = $("#intro");
  const main = $("#mainContent");
  const audio = $("#backgroundMusic");
  const musicButton = $("#musicButton");
  const musicLabel = $("#musicLabel");
  let musicAvailable = true;

  $("#heroImage").src = config.heroImage || "assets/images/couple-realistic.jpg";
  $("#memoryOne").src = config.memoryOne || "assets/images/memory-01.jpg";
  $("#memoryTwo").src = config.memoryTwo || "assets/images/memory-02.jpg";
  $("#signature").textContent = config.signature || "Anh.";
  audio.src = config.musicFile || "assets/music/our-song.mp3";

  const letterText = window.LETTER_TEXT || "Anh xin lỗi. Mình nói chuyện lại nhé?";
  $("#letterBody").innerHTML = letterText
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const now = new Date();
  $("#letterDate").textContent = `Ngày ${now.getDate()} tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
  $("#footerYear").textContent = now.getFullYear();

  $("#openLetter").addEventListener("click", async () => {
    intro.classList.add("is-open");
    window.setTimeout(() => {
      intro.hidden = true;
      main.classList.add("is-visible");
      main.setAttribute("aria-hidden", "false");
      document.body.classList.add("has-opened");
      revealVisible();
    }, 850);
    await tryPlayMusic();
  });

  audio.addEventListener("error", () => {
    musicAvailable = false;
    musicLabel.textContent = "Thêm nhạc của bạn";
    musicButton.classList.add("is-missing");
  });

  musicButton.addEventListener("click", async () => {
    if (!musicAvailable) {
      alert("Hãy chép bài hát vào assets/music/our-song.mp3 rồi tải lại trang nhé!");
      return;
    }
    if (audio.paused) await tryPlayMusic();
    else {
      audio.pause();
      updateMusicState(false);
    }
  });

  async function tryPlayMusic() {
    if (!musicAvailable) return;
    try {
      audio.volume = 0.42;
      await audio.play();
      updateMusicState(true);
    } catch (_) {
      updateMusicState(false);
    }
  }

  function updateMusicState(isPlaying) {
    musicButton.classList.toggle("is-playing", isPlaying);
    musicLabel.textContent = isPlaying ? (config.musicName || "Đang phát") : "Bật nhạc";
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  function revealVisible() {
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  }

  const notYet = $("#notYetButton");
  const teasingLines = [
    "Anh biết em còn thương mà 🥺",
    "Cho anh cơ hội nhỏ thôi nha?",
    "Anh mời trà sữa nữa nè!",
    "Nút này khó bấm lắm đó 😌"
  ];
  let dodgeCount = 0;

  notYet.addEventListener("pointerenter", dodgeButton);
  notYet.addEventListener("click", () => {
    if (window.matchMedia("(hover: none)").matches) dodgeButton();
  });

  function dodgeButton() {
    const actions = $("#answerActions");
    const maxX = Math.max(0, actions.clientWidth - notYet.offsetWidth);
    const x = Math.random() * maxX - maxX / 2;
    const y = (Math.random() - 0.5) * 110;
    notYet.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random() - 0.5) * 8}deg)`;
    $("#answerSmall").textContent = teasingLines[dodgeCount % teasingLines.length];
    dodgeCount += 1;
  }

  $("#yesButton").addEventListener("click", () => {
    const modal = $("#success");
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-visible"));
    burstHearts();
  });

  $("#closeSuccess").addEventListener("click", () => {
    const modal = $("#success");
    modal.classList.remove("is-visible");
    window.setTimeout(() => { modal.hidden = true; }, 300);
  });

  function burstHearts() {
    for (let i = 0; i < 32; i += 1) {
      const heart = document.createElement("span");
      heart.className = "burst-heart";
      heart.textContent = ["♥", "♡", "✦"][i % 3];
      heart.style.setProperty("--x", `${(Math.random() - 0.5) * 100}vw`);
      heart.style.setProperty("--y", `${-30 - Math.random() * 65}vh`);
      heart.style.setProperty("--r", `${(Math.random() - 0.5) * 720}deg`);
      heart.style.left = `${45 + Math.random() * 10}%`;
      heart.style.top = "75%";
      document.body.appendChild(heart);
      window.setTimeout(() => heart.remove(), 1800);
    }
  }

  function createPetals() {
    const field = $("#petals");
    for (let i = 0; i < 12; i += 1) {
      const petal = document.createElement("i");
      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--delay", `${Math.random() * -16}s`);
      petal.style.setProperty("--duration", `${12 + Math.random() * 12}s`);
      petal.style.setProperty("--size", `${5 + Math.random() * 8}px`);
      field.appendChild(petal);
    }
  }

  function escapeHtml(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span.innerHTML;
  }

  createPetals();
})();
