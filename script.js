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
const revealTargets = document.querySelectorAll("[data-reveal]");
revealTargets.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
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

// フォールバック: 初期表示時点で画面内にある要素は即座に表示する
// (IntersectionObserver が動かない環境でも最初の画面が見えるように)
const revealInView = () => {
  revealTargets.forEach((el) => {
    if (el.classList.contains("in")) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.95) {
      el.classList.add("in");
      io.unobserve(el);
    }
  });
};
revealInView();
window.addEventListener("load", revealInView);

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
