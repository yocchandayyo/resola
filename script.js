// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Header scroll state =====
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ===== Mobile nav =====
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  navToggle.classList.toggle("open");
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
  })
);

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll(
  ".section__title, .section__lead, .problem__card, .service-card, .reason, .flow__step, .faq__item, .profile__photo, .profile__body, .contact-form, .hero__stats"
);
revealTargets.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);
revealTargets.forEach((el) => io.observe(el));

// ===== Contact form (Formspree) =====
const form = document.getElementById("contactForm");

function showSuccess(message) {
  form.querySelectorAll(".field, .contact-form__note").forEach((el) => (el.style.display = "none"));
  const btn = form.querySelector("button[type=submit]");
  if (btn) btn.style.display = "none";
  const ok = document.createElement("div");
  ok.className = "form-success";
  ok.textContent = message;
  form.appendChild(ok);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;
  ["name", "email", "message"].forEach((id) => {
    const input = document.getElementById(id);
    const field = input.closest(".field");
    const empty = !input.value.trim();
    const badEmail = id === "email" && input.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
    field.classList.toggle("field--error", empty || badEmail);
    if (empty || badEmail) valid = false;
  });
  if (!valid) return;

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "送信中…";

  // 送信先URLがまだ未設定（プレースホルダ）の場合はデモ表示
  if (form.action.includes("REPLACE_WITH_YOUR_ID")) {
    setTimeout(() => showSuccess("送信ありがとうございます！(※現在はデモ表示です。フォームの送信先URLを設定すると実際にメールが届きます)"), 600);
    return;
  }

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      showSuccess("送信ありがとうございます！担当より2営業日以内にご返信します。");
    } else {
      throw new Error("送信に失敗しました");
    }
  } catch (err) {
    btn.disabled = false;
    btn.textContent = "送信する";
    alert("申し訳ありません。送信に失敗しました。お手数ですが dk.jbd.10112@gmail.com まで直接ご連絡ください。");
  }
});
