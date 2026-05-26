document.addEventListener("DOMContentLoaded", () => {
  const ctaForm = document.getElementById("ctaForm");
  if (ctaForm) {
    ctaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = ctaForm.querySelector("input");
      const btn = ctaForm.querySelector("button");
      if (input.value.trim()) {
        input.value = "";
        btn.textContent = "You're in! 🎉";
        btn.style.pointerEvents = "none";
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
