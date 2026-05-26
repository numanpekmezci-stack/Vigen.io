const form = document.querySelector("#briefForm");
const briefInput = document.querySelector("#brief");
const platformInput = document.querySelector("#platform");
const inputTypeInput = document.querySelector("#inputType");
const platformLabel = document.querySelector("#platformLabel");
const outputTitle = document.querySelector("#outputTitle");
const scriptSteps = document.querySelector("#scriptSteps");

const templates = {
  idea: {
    title: "Virales Creator-Konzept",
    steps: [
      "Starte mit einem klaren Schmerzpunkt und einer provokanten Frage.",
      "Zeige drei schnelle Tipps, die direkt visuell demonstriert werden koennen.",
      "Schliesse mit einem CTA fuer Kommentar, Follow oder Demo-Anfrage.",
    ],
    tags: ["#idee", "#shorts", "#aivideo"],
  },
  youtube: {
    title: "YouTube-Highlight zu Short",
    steps: [
      "Finde die staerkste Aussage aus dem Video als Hook fuer die ersten 2 Sekunden.",
      "Verdichte den Kontext in schnelle Schnitte mit grossen Captions.",
      "Fuege eine klare These und einen CTA fuer das komplette Video hinzu.",
    ],
    tags: ["#youtube", "#shorts", "#repurpose"],
  },
  product: {
    title: "Produkt-Video Briefing",
    steps: [
      "Beginne mit dem konkreten Problem, das das Produkt loest.",
      "Zeige Vorher-Nachher, Social Proof und ein einzelnes Kernfeature.",
      "Ende mit einem direkten Kauf-, Test- oder Lead-Magnet-CTA.",
    ],
    tags: ["#ugc", "#productvideo", "#ads"],
  },
};

function summarizeBrief(text) {
  const cleanText = text.trim().replace(/\s+/g, " ");

  if (!cleanText) {
    return "Dein Short-Video Konzept";
  }

  return cleanText.length > 58 ? `${cleanText.slice(0, 58)}...` : cleanText;
}

function renderConcept(event) {
  event.preventDefault();

  const selectedType = inputTypeInput.value;
  const template = templates[selectedType];
  const briefSummary = summarizeBrief(briefInput.value);

  platformLabel.textContent = platformInput.value;
  outputTitle.textContent = `${template.title}: ${briefSummary}`;

  scriptSteps.innerHTML = "";
  template.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    scriptSteps.appendChild(item);
  });

  const metadata = document.querySelector(".metadata");
  metadata.innerHTML = "";
  template.tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    metadata.appendChild(item);
  });
}

form.addEventListener("submit", renderConcept);
platformInput.addEventListener("change", () => {
  platformLabel.textContent = platformInput.value;
});
