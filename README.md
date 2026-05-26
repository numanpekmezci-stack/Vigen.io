# Vigen.io

Vigen.io ist ein MVP-Prototyp fuer eine webbasierte KI-Video-Plattform wie
Remakeit.io. Ziel ist es, Ideen, YouTube-Links oder Produktseiten in kurze,
social-ready Videos fuer TikTok, Instagram Reels und YouTube Shorts zu
verwandeln.

Der aktuelle Stand ist eine statische, sofort lauffaehige Produkt-Demo mit:

- Landingpage fuer Positionierung und Value Proposition
- Interaktivem Creator-Studio fuer Video-Briefings
- Ergebnisvorschau fuer Hook, Skriptstruktur und Hashtags
- Produkt-Roadmap fuer den spaeteren AI/Video-Workflow

## Lokal starten

Da der Prototyp keine Build-Abhaengigkeiten hat, reicht ein statischer Server:

```bash
python3 -m http.server 8000
```

Danach im Browser oeffnen:

```text
http://localhost:8000
```

Alternativ kann `index.html` direkt im Browser geoeffnet werden.

## Produktumfang fuer einen echten Launch

### MVP

1. Account-System mit Login und Nutzerprofilen
2. Creator-Studio mit Input-Typen:
   - Idee / Prompt
   - YouTube-Link
   - Produkt- oder Landingpage-URL
3. KI-Generierung fuer Hook, Skript, Szenenplan, Voiceover und Hashtags
4. Rendering-Pipeline fuer 9:16-Videos mit Captions
5. Export als MP4
6. Credit- oder Abo-Modell fuer Monetarisierung

### Naechste technische Schritte

Eine produktionsreife Version sollte aus diesen Komponenten bestehen:

- Frontend: Next.js oder Remix fuer App-Routing, Auth-Views und Dashboard
- Backend/API: Node.js, Python FastAPI oder Supabase Edge Functions
- Datenbank: Postgres fuer Nutzer, Jobs, Credits und Video-Metadaten
- Storage: S3/R2 fuer Uploads, gerenderte Videos und Thumbnails
- Queue: Redis/BullMQ oder Cloud Tasks fuer lange Video-Jobs
- AI: LLM fuer Skripte, Speech-to-Text fuer Videoanalyse, TTS fuer Voiceover
- Rendering: FFmpeg oder Remotion fuer Captions, Crops und Final Exports
- Billing: Stripe Subscriptions und usage-based Credits
- Publishing: TikTok, YouTube und Instagram APIs fuer Scheduling/Posten

## Dateien

```text
index.html   # Produktseite und Creator-Studio
styles.css   # Responsive UI, Landingpage und Dashboard Styling
app.js       # Interaktive Konzept-Generierung im Prototyp
README.md    # Produkt- und technische Dokumentation
```

## Wichtiger Hinweis

Dieser Stand simuliert die KI-Ergebnisse clientseitig. Fuer echte Videoerzeugung
muessen API-Keys, Auth, eine Job-Queue, Storage und ein Rendering-Service
angebunden werden.
