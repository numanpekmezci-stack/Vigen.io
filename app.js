const SUPABASE_URL = "https://tqabpbynvrieorjlngnh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxYWJwYnludnJpZW9yamxuZ25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTA3MzIsImV4cCI6MjA5NTM2NjczMn0.37fMjsPGDvKW28G7ohx1-D3LGO-mIN05u02gsr20G24";

async function saveEmail(email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ email })
  });
  return res.ok;
}

document.addEventListener("DOMContentLoaded", () => {
  const ctaForm = document.getElementById("ctaForm");
  if (ctaForm) {
    ctaForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = ctaForm.querySelector("input");
      const btn = ctaForm.querySelector("button");
      const email = input.value.trim();
      if (email) {
        btn.textContent = "Saving...";
        btn.style.pointerEvents = "none";
        const success = await saveEmail(email);
        input.value = "";
        btn.textContent = success ? "You're in! 🎉" : "You're in! 🎉";
        setTimeout(() => {
          btn.textContent = "Get Early Access";
          btn.style.pointerEvents = "";
        }, 3000);
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(
    ".step, .tool-card, .template-card, .price-card"
  ).forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  const style = document.createElement("style");
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.4s ease, transform 0.4s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);
});
