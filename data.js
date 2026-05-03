// ── Plan constants ──────────────────────────────────────────────────────────
const PLAN_START = new Date(2026, 4, 4); // May 4, 2026

const PHASES = [
  { id: 1, name: 'Foundation',      color: '#3b82f6', weeks: [1,2,3,4],    goal: 'Aerobe Basis, Technik-Fundament, Sehnenaufbau',   intensity: '●●○○○', volume: '●●●●○' },
  { id: 2, name: 'Strength',        color: '#f97316', weeks: [5,6,7,8],    goal: 'Maximale Fingerkraft, Limit Bouldering',           intensity: '●●●●○', volume: '●●●○○' },
  { id: 3, name: 'Power Endurance', color: '#ef4444', weeks: [9,10,11,12], goal: 'Kraftausdauer, Laktattoleranz',                    intensity: '●●●●●', volume: '●●●○○' },
  { id: 4, name: 'Performance',     color: '#a855f7', weeks: [13,14,15],   goal: 'Rotpunkt-Peak, Onsight auf neuem Niveau',         intensity: '●●●○○', volume: '●●○○○' },
  { id: 5, name: 'Deload',          color: '#22c55e', weeks: [16],         goal: 'Vollständige Erholung. Kein Hangboard. Kein Kraft.', intensity: '●○○○○', volume: '●○○○○' },
];

function getPhase(weekNum) {
  if (weekNum <= 4) return PHASES[0];
  if (weekNum <= 8) return PHASES[1];
  if (weekNum <= 12) return PHASES[2];
  if (weekNum <= 15) return PHASES[3];
  return PHASES[4];
}

const DELOAD_WEEKS = new Set([4, 8, 12, 16]);

// ── Exercise / Reference data ────────────────────────────────────────────────
const EXERCISES = {
  'A': {
    id: 'A', emoji: '🔥', label: 'AUFWÄRMEN', name: 'Aufwärmprotokoll (Ref A)',
    category: 'Aufwärmen', duration: '15–25 min',
    note: 'Gilt für JEDE Einheit. Nie überspringen.',
    content: [
      { type: 'section', title: 'Schritt 1 – Mobilisierung (5 min)', items: [
        'Schulterkreisen: 10× vorwärts, 10× rückwärts, beide Arme',
        'Arm Swings (Pendelübungen): 10× horizontal, 10× vertikal pro Arm',
        'Hüftkreisen: 10× links, 10× rechts',
        'Kniekreisen: 10× pro Seite',
        'Sprunggelenk-Rotation: 10× pro Seite (bei Pes planovalgus besonders wichtig)',
        'Wrist Circles: 10× pro Richtung',
        'Thorakale Rotation (BWS): 5× pro Seite',
      ]},
      { type: 'section', title: 'Schritt 2 – Fingeraufwärm-Sequenz (5–8 min)', warning: '⚠️ Nie auf kalten Sehnen trainieren.',
        table: { headers: ['Set','Griffart','Leiste','Dauer','Pause'], rows: [
          ['1','Open Hand','Jug / große Leiste','10 Sek.','60 Sek.'],
          ['2','Open Hand','Jug','10 Sek.','60 Sek.'],
          ['3','Half Crimp','35–40 mm','8 Sek.','90 Sek.'],
          ['4','Half Crimp','30 mm (Linebreaker-Bar)','8 Sek.','90 Sek.'],
        ]},
        note: 'Intensität: 50–60% des Maximums. Kein Schmerz. Kein Kribbeln.',
      },
      { type: 'section', title: 'Schritt 3 – Progressives Klettern (5–10 min)', items: [
        '3–4 Routen / Boulderprobleme sukzessive schwerer (Start: 3–4 Stufen unter Onsight)',
        'Fußarbeit bewusst setzen: Silent Feet aktivieren',
        'Gerade Arme bewusst halten',
        '1 min Pause zwischen Aufwärmrouten',
      ]},
      { type: 'section', title: 'Schritt 4 – Antagonisten-Aktivierung (2–3 min)', items: [
        'Fingerstrecker Theraband: 2×15 Fingeröffnungen',
        'Schulter External Rotation: Theraband 2×12 pro Seite',
        'Scapular Retraktion: 2×10 Face Pulls oder Banded Pull-Aparts',
      ]},
    ],
  },

  'T1': {
    id: 'T1', emoji: '🎯', label: 'TECHNIK T1', name: 'Silent Feet – Stille Füße',
    category: 'Technik-Drill', duration: '15–20 min, 3–5 Routen',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Präzise Fußplatzierung, Bewusstsein für Innen-/Außenkante'],
        ['Wann', 'Jede Session im Warm-up (2–3 Routen/Probleme)'],
        ['Terrain', 'UIAA 4–5 / fb3–4 (so leicht, dass der Kopf frei für die Füße ist)'],
      ]},
      { type: 'text', title: 'Ausführung', text: 'Klettern ohne jedes Geräusch beim Fußaufsetzen. Hört man ein Kratzen oder Aufstampfen → von vorne. Schuhe mit Bewusstsein auf den genauen Punkt der Kante setzen. Volle Konzentration auf Fuß, nicht auf Hand.' },
    ],
  },

  'T2': {
    id: 'T2', emoji: '🎯', label: 'TECHNIK T2', name: 'Gerade Arme – Straight-Arm Climbing',
    category: 'Technik-Drill', duration: '10–15 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Energieeffizienz, Pumpprophylaxe, Ruheposition-Instinkt'],
        ['Wann', 'Foundation-Phase, täglich als Warm-up-Drill'],
        ['Terrain', 'UIAA 5–6'],
      ]},
      { type: 'text', title: 'Ausführung', text: 'Alle Hänger mit vollständig gestreckten Armen. Zwischen Zügen: aktives Strecken zurück in die Gerade. Wer mit gebeugtem Arm hängt → bewusst korrigieren. Ziel: Im Skelett hängen, nicht in der Muskulatur.' },
      { type: 'text', title: 'CLA-Variante', text: 'Partner tippt an, wenn ein Arm gebogen ist. Sofortige Korrektur.' },
    ],
  },

  'T3': {
    id: 'T3', emoji: '🎯', label: 'TECHNIK T3', name: 'Flagging-Pyramide – Fahnendrehen',
    category: 'Technik-Drill', duration: '5 Boulderprobleme',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Innenflagge und Außenflagge automatisieren, Barndoor verhindern'],
        ['Wann', 'Foundation-Phase, 2×/Woche'],
      ]},
      { type: 'text', title: 'Ausführung', text: 'Bei jedem Zug wird bewusst entschieden: Brauche ich Innenflagge (Bein kreuzt hinter) oder Außenflagge (Bein seitlich)? Auch wo kein Flagging nötig wäre, kurz andeuten. 5 Boulderprobleme, jeder Zug mit aktivem Flagging.' },
      { type: 'text', title: 'CLA-Einschränkung', text: '„Kein Zug ohne Flagging oder Kante" – beide Beine müssen immer einen Job haben.' },
    ],
  },

  'T4': {
    id: 'T4', emoji: '🎯', label: 'TECHNIK T4', name: 'Drop Knee Isolierung',
    category: 'Technik-Drill', duration: '5–8 Boulderprobleme oder Routen',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Drop Knee auf Außenkante mit aktivem Knie-Innen-Drehen automatisieren'],
        ['Wann', 'Strength-Phase, 2–3×/Woche'],
        ['Terrain', 'fb5–6a (leicht genug zur Körperpositionsanalyse)'],
      ]},
      { type: 'text', title: 'Ausführung', text: '5–8 Boulderprobleme so geklettert, dass bei jedem 3. Zug ein Drop Knee erzwungen wird (auch wenn optional). Knie aktiv nach innen und unten rotieren, Hüfte öffnet nach außen. Fuß auf Außenkante (Pinky-Seite), Knie rotiert – nicht nur Fuß drehen.' },
      { type: 'warn', text: '⚠️ Knöchel: Bei Schmerz oder Kribbeln im Sprunggelenk sofort stoppen. 3× aufwärmen mit leichtem Drop Knee bevor intensiv.' },
    ],
  },

  'T5': {
    id: 'T5', emoji: '🎯', label: 'TECHNIK T5', name: 'Backstep-Sequenzen',
    category: 'Technik-Drill', duration: '10 Züge auf einer Traverse',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Backstep von Außenkante auf seitwärts-orientiertem Körper (≠ Drop Knee)'],
        ['Wann', 'Strength-Phase'],
      ]},
      { type: 'text', title: 'Ausführung', text: '10 Züge auf einer Traverse, nur Außenkante-Backstep erlaubt. Körper dreht 90° zur Wand. Hüfte bleibt hoch (Unterschied: beim Drop Knee rotiert Knie nach unten, beim Backstep nicht). Side-Pull ist natürlicher Partner des Backstep.' },
      { type: 'text', title: 'CLA-Einschränkung', text: 'Innenkante verboten auf dieser Traverse.' },
    ],
  },

  'T6': {
    id: 'T6', emoji: '🎯', label: 'TECHNIK T6', name: 'Egyptian / Hüfte-an-Wand',
    category: 'Technik-Drill', duration: '1–2×/Woche',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Maximale Reichweite durch Hüft-Extension'],
        ['Wann', 'Strength-Phase, 1–2×/Woche'],
      ]},
      { type: 'text', title: 'Ausführung', text: 'Route mit langen Reaches; bei jedem weiten Zug Hüfte aktiv an Wand pressen (Außenkante, Bein gestreckt). Fühlt sich extrem seitlich an. Reichweite >15 cm gegenüber Front-Klettern.' },
      { type: 'text', title: 'Merkhilfe', text: 'Backstep → Körper 90° → Egyptian → Hüfte kontaktiert Wand → maximale Distanz.' },
    ],
  },

  'T7': {
    id: 'T7', emoji: '🔁', label: 'ARC', name: 'ARC Training – Aerobic Restoration & Capillarization',
    category: 'Technik-Drill / Ausdauer', duration: '20–30 min Dauerklettern',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Kapillarisierung der Unterarmmuskulatur, aerobe Ausdauer, Grundlage für PE'],
        ['Wann', 'Foundation-Phase, 2–3×/Woche'],
        ['Niveau', 'UIAA 4–5 (2–3 Stufen unter Onsight), Puls < 135 bpm'],
      ]},
      { type: 'text', title: 'Ausführung', text: 'Dauerklettern auf niedrigem Niveau. Autobelay oder Toprope: oben anklettern → abseilen → sofort weiterklettern ohne Pause. Route wechseln alle 5 min. Richtige Intensität: leicht gepumpt, aber nie ausgeklinkt.' },
      { type: 'table', title: 'Wochenprogression',
        headers: ['Woche', 'Dauer', 'Struktur'],
        rows: [
          ['1','2 × 20 min','5 min Pause dazwischen'],
          ['2','2 × 25 min','5 min Pause'],
          ['3','3 × 20 min','5 min Pause'],
        ],
      },
    ],
  },

  'T8': {
    id: 'T8', emoji: '🎯', label: 'LIMIT', name: 'Limit Bouldering – Maximalkraft',
    category: 'Technik-Drill / Kraft', duration: '60–90 min inkl. Pausen',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Maximale Kraftrekrutierung, neuronale Aktivierung'],
        ['Wann', 'Strength-Phase, 1–2×/Woche auf frischen Fingern'],
        ['Niveau', 'fb6b–6c+ (an oder über aktueller Grenze)'],
      ]},
      { type: 'list', title: 'Ablauf', items: [
        'Aufwärmen komplett (Ref A)',
        '3–4 Probleme auswählen: 3–6 harte Züge, an/über Grenze (fb6b–6c+)',
        'Pro Problem: max 4–5 Versuche, dann weiter',
        'Pause zwischen Versuchen: 3–5 min (reale Erholung)',
        'Pause zwischen Problemen: 5–8 min',
        'Stopp-Regel: Sobald Kraftausgabe spürbar sinkt → Session beenden',
      ]},
      { type: 'text', title: 'Mentales Protokoll', text: 'Nach jedem Versuch: Warum gescheitert? Kraft, Technik oder Position? Nächster Versuch mit konkreter Hypothese. Beta-Varianten ausprobieren, nicht stumpf wiederholen.' },
    ],
  },

  'T9': {
    id: 'T9', emoji: '⚡', label: 'PE', name: 'Power Endurance Circuits – 4×4',
    category: 'Technik-Drill / Ausdauer', duration: 'ca. 60 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Laktattoleranz, Kraftausdauer für Routen > 15 Züge'],
        ['Wann', 'Power Endurance Phase, 1–2×/Woche'],
        ['Niveau', 'fb5+–6b (2–3 Stufen unter Max), überhängend und sustained'],
      ]},
      { type: 'text', title: 'Classic 4×4', text: '4 Boulderprobleme auswählen (2–3 Stufen unter Max). Alle 4 back-to-back ohne Pause (nur Chalk). 4 min Pause. 4 Runden total (= 16 Probleme). Richtig kalibriert: letzte Runde kaum schaffbar, letztes Problem evtl. Sturz.' },
      { type: 'text', title: 'Routen-Variante', text: '3 min Klettern auf Route UIAA 6+–7 (Autobelay, ohne Stop) → 3 min Pause → 4–6 Wiederholungen.' },
    ],
  },

  'C1': {
    id: 'C1', emoji: '🏋️', label: 'HANGBOARD C1', name: 'Foundation Repeaters',
    category: 'Hangboard · Gerät: 10a Linebreaker 30 mm', duration: 'ca. 20 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Sehnenaufbau, Capillarisierung, Gewöhnung'],
        ['Intensität', '60–70% des Maximums – letzte Reps anstrengend, nie Versagen'],
        ['Leiste', '30 mm 4-Finger-Bar, Half-Crimp, kein Zusatzgewicht'],
      ]},
      { type: 'table', title: 'Protokoll',
        headers: ['Set','Reps','An','Ab','Griffart','Pause nach Set'],
        rows: [
          ['1','6','7 Sek.','3 Sek.','Open Hand','3 min'],
          ['2','6','7 Sek.','3 Sek.','Half Crimp','3 min'],
          ['3','6','7 Sek.','3 Sek.','Half Crimp','—'],
        ],
      },
      { type: 'text', title: 'Progression', text: '3 volle Sets fehlerfrei → nächste Woche 4. Set hinzufügen. Nach Woche 4: Wechsel zu C2.' },
    ],
  },

  'C2': {
    id: 'C2', emoji: '🏋️', label: 'HANGBOARD C2', name: 'Strength Repeaters',
    category: 'Hangboard · Gerät: 10a Linebreaker 30 mm', duration: 'ca. 25 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Fingerkraft-Endurance, Vorbereitung auf MaxHangs'],
        ['Intensität', '70–80%. Letzter Hang pro Set deutlich schwer.'],
        ['Leiste', '30 mm 4-Finger-Bar, noch kein Zusatzgewicht'],
      ]},
      { type: 'table', title: 'Protokoll',
        headers: ['Set','Reps','An','Ab','Griffart','Pause nach Set'],
        rows: [
          ['1','6','7 Sek.','3 Sek.','Half Crimp','3 min'],
          ['2','6','7 Sek.','3 Sek.','Half Crimp','3 min'],
          ['3','6','7 Sek.','3 Sek.','Half Crimp','3 min'],
          ['4','6','7 Sek.','3 Sek.','Half Crimp','—'],
        ],
      },
    ],
  },

  'C3': {
    id: 'C3', emoji: '🏋️', label: 'HANGBOARD C3', name: 'MaxHangs',
    category: 'Hangboard · Gerät: 10a Linebreaker 30 mm', duration: '25–35 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Maximale Fingerkraft. Neuronale Aktivierung. Eva-López-Methode.'],
        ['Intensität', '90–100%. Nur 2–3 Sek. Reserve bei 10 Sek.'],
        ['Leiste', '30 mm 4-Finger-Bar. Zusatzgewicht (Weste / Gurt+Karabiner) oder Entlastung (Gummiband).'],
      ]},
      { type: 'table', title: 'Protokoll',
        headers: ['Set','Dauer','Griffart','Pause','Gewicht'],
        rows: [
          ['1','10 Sek.','Half Crimp','3 min','KG oder +2–5 kg'],
          ['2','10 Sek.','Half Crimp','3 min','wie Set 1'],
          ['3','10 Sek.','Half Crimp','3 min','wie Set 1'],
          ['4','10 Sek.','Half Crimp','3 min','wie Set 1'],
          ['5','10 Sek.','Half Crimp','—','wie Set 1'],
        ],
      },
      { type: 'table', title: 'Wochenprogression (Beispiel)',
        headers: ['Woche','Gewicht','Sets'],
        rows: [
          ['Wo 5','Körpergewicht','4'],
          ['Wo 6','+2,5 kg','4'],
          ['Wo 7','+5 kg','5'],
          ['Wo 8 (Deload)','Körpergewicht','3'],
        ],
      },
      { type: 'text', title: 'Progression', text: 'Kann man 12–13 Sek. halten → nächste Einheit +2–2,5 kg.' },
    ],
  },

  'C4': {
    id: 'C4', emoji: '🏋️', label: 'HANGBOARD C4', name: 'Neural Maintenance',
    category: 'Hangboard · Gerät: 10a Linebreaker 30 mm', duration: '15–20 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Fingerstärke neural aktiv halten ohne Ermüdung zu akkumulieren'],
        ['Intensität', '85–90%. Kurz. Frisch bleiben.'],
        ['Leiste', '30 mm, Half Crimp'],
      ]},
      { type: 'table', title: 'Protokoll',
        headers: ['Set','Dauer','Pause','Gewicht'],
        rows: [
          ['1','7 Sek.','3 min','+2–5 kg (aus Phase 2)'],
          ['2','7 Sek.','3 min','wie Set 1'],
          ['3','7 Sek.','—','wie Set 1'],
        ],
      },
      { type: 'warn', text: '⚠️ Danach nichts mehr Intensives.' },
    ],
  },

  'D1': {
    id: 'D1', emoji: '💪', label: 'KRAFT D1', name: 'Antagonistentraining',
    category: 'Krafttraining', duration: '15 min · immer nach dem Klettern',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Muskuläre Balance, Verletzungsprävention, Rotatorenmanschette'],
        ['Wann', 'Jede Phase – immer nach dem Klettern, nie davor'],
      ]},
      { type: 'table', title: 'Übungen',
        headers: ['Übung','Sets × Wdh.','Ausführung'],
        rows: [
          ['Fingerstrecker Theraband','3 × 15','Band um alle 5 Finger, spreizen gegen Widerstand'],
          ['Face Pulls','3 × 12','Kabel/Band auf Kopfhöhe, Ellbogen hoch'],
          ['External Rotation Theraband','3 × 12/Seite','Ellbogen 90°, Arm dreht nach außen'],
          ['Push-Ups + Scapular Protraction','3 × 10','Am Ende Schulterblätter aktiv nach vorne schieben'],
          ['Reverse Wrist Curls','2 × 15','Leichte Hantel, Handgelenk strecken'],
        ],
      },
    ],
  },

  'D2': {
    id: 'D2', emoji: '💪', label: 'KRAFT D2', name: 'Zug- und Core-Kraft',
    category: 'Krafttraining', duration: '25 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Latissimus, Rhomboiden, Core-Tension für Drop Knee und Kompression'],
      ]},
      { type: 'table', title: 'Übungen',
        headers: ['Übung','Sets × Wdh.','Hinweis'],
        rows: [
          ['Weighted Pull-Ups','4 × 4–5','85–90% 1RM, vollständige Streckung unten'],
          ['Lock-Offs','3 × 5–8 Sek./Seite','90° Ellbogenwinkel, andere Hand am Strick'],
          ['Front Lever Progression','3 × max.','Tuck → Straddle → Full. Maximale Body Tension.'],
          ['L-Sit / Compression','3 × 15–20 Sek.','An Ringen/Parallelstäben, Beine gestreckt'],
          ['Dead Hang auf Jug','2 × 30 Sek.','Schulterblätter aktiv nach unten'],
        ],
      },
    ],
  },

  'D3': {
    id: 'D3', emoji: '💪', label: 'KRAFT D3', name: 'Hip & Glute',
    category: 'Krafttraining', duration: '30 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Gluteus medius/minimus, Peroneusgruppe für Drop Knee und Sprunggelenkstabilität'],
      ]},
      { type: 'table', title: 'Übungen',
        headers: ['Übung','Sets × Wdh.','Ausführung'],
        rows: [
          ['Lateral Band Walks','3 × 15/Seite','Mini-Band um Knie, kleiner Schritt seitwärts, Knie nie einknicken'],
          ['Clamshells','3 × 15/Seite','Seitlage, Band um Knie, oberes Knie hebt wie Muschel'],
          ['Single-Leg RDL','3 × 10/Seite','Leichtes Gewicht, Hüfte in Waage, Rücken gerade'],
          ['Bulgarian Split Squat','3 × 8–10/Seite','Hinterer Fuß auf Bank, Knie zieht nicht über Zehe'],
          ['Posterior Tibialis Rises','2 × 15','Fußaußenrand leicht anheben, Knickfuß-Kompensation'],
          ['Single-Leg Calf Raises','2 × 15','Langsam exzentrisch, Peroneus-Kräftigung'],
        ],
      },
      { type: 'warn', text: '⚠️ Pes planovalgus: Bei allen Einbein-Übungen auf neutrale Fußstellung achten. Nicht in Pronation trainieren.' },
    ],
  },

  'D4': {
    id: 'D4', emoji: '💪', label: 'REHAB D4', name: 'Rehab & Prävention',
    category: 'Rehab · täglich möglich', duration: '15 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Epicondylitis-Prophylaxe (Golferellenbogen), Fußgewölbe-Aktivierung'],
      ]},
      { type: 'table', title: 'Übungen',
        headers: ['Übung','Sets × Wdh.','Gerät'],
        rows: [
          ['Flexbar Tyler Twist','3 × 15','Flexbar: Twist in Extension; Reverse Tyler Twist für Beugeseite'],
          ['Theraband Pronation/Supination','2 × 15/Seite','Leichtes Band'],
          ['Towel Curls','2 × 20','Kleines Handtuch mit Zehen zusammenziehen'],
          ['Arch Doming','3 × 10 × 5 Sek.','Fuß auf Boden, Gewölbe „hochziehen" ohne Zehen zu krümmen'],
        ],
      },
    ],
  },

  'E1': {
    id: 'E1', emoji: '🏃', label: 'AUSDAUER E1', name: 'Laufen Zone 2',
    category: 'Ausdauertraining · HFmax 193 bpm', duration: '25–45 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Aerobe Basis, Fettstoffwechsel, systemische Erholung'],
        ['Zone', 'Zone 2: 116–135 bpm (60–70% HFmax)'],
        ['Wann', 'Foundation 2×/Woche, alle anderen Phasen 1×/Woche'],
      ]},
      { type: 'table', title: 'Progression',
        headers: ['Wochen','Dauer','Distanz ca.'],
        rows: [
          ['1–2','25–30 min','3–4 km'],
          ['3–4','30–35 min','4–5 km'],
          ['5–8','35–40 min','5–6 km'],
          ['9–12','40–45 min','6–7 km'],
          ['13–15','30 min','4 km (Erhaltung)'],
        ],
      },
      { type: 'warn', text: '⚠️ Pes planovalgus: Laufdistanz anfangs begrenzen. Neue Einheiten erst nach 2 schmerzfreien Wochen.' },
      { type: 'text', title: 'Wichtig', text: 'Fühlt sich langsam an → das ist richtig. Zone 2 ist kein Workout-Gefühl.' },
    ],
  },

  'E2': {
    id: 'E2', emoji: '🚴', label: 'AUSDAUER E2', name: 'Spinning Zone 2',
    category: 'Ausdauertraining · Alternative bei Fußproblemen', duration: '40–60 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'Identisch mit E1, aber gelenkschonend'],
        ['Zone', 'Zone 2: 120–130 bpm anpeilen, max 135 bpm'],
      ]},
      { type: 'text', title: 'Protokoll', text: 'Widerstand einstellen → Puls auf 120–130 bpm bringen → halten. Wenn Puls auf 135 driftet: Widerstand minimal senken. Kein Widerstand ohne Puls-Kontrolle.' },
    ],
  },

  'E3': {
    id: 'E3', emoji: '🚴', label: 'AUSDAUER E3', name: 'Spinning VO₂max Intervalle – 4×4',
    category: 'Ausdauertraining · NICHT an Klettertagen', duration: 'ca. 45 min',
    content: [
      { type: 'kv', rows: [
        ['Ziel', 'VO₂max steigern. Transferiert auf Erholung zwischen Routen.'],
        ['Wann', 'Phase 2 und 3, 1–2×/Woche. NICHT an Klettertagen oder direkt davor.'],
      ]},
      { type: 'table', title: '4×4 Protokoll',
        headers: ['Block','Dauer','Intensität','Pause'],
        rows: [
          ['Einfahren','10 min','Zone 2','—'],
          ['Intervall 1','4 min','Zone 4–5 (160–175 bpm)','3 min Zone 2'],
          ['Intervall 2','4 min','Zone 4–5','3 min Zone 2'],
          ['Intervall 3','4 min','Zone 4–5','3 min Zone 2'],
          ['Intervall 4','4 min','Zone 4–5','—'],
          ['Ausfahren','10 min','Zone 1','—'],
          ['Total','~45 min','',''],
        ],
      },
      { type: 'text', title: 'Cardiac Drift', text: 'Widerstand zu Beginn setzen → Puls natürlich steigen lassen. Widerstand nur anpassen wenn HF Zonendecke überschreitet. Gleichmäßige Power > exakte HF-Kontrolle.' },
    ],
  },
};

// ── Week templates ────────────────────────────────────────────────────────────
// Day: { type:'training'|'rest'|'optional', locked:bool, title, location, components:[], notes }

const T = {
  phase1Work: [
    { type:'training', locked:false, title:'Hangboard + Antagonisten',    location:'Zu Hause',        components:['C1','D1'],                notes:'20 min Hangboard → 30 min Antagonisten' },
    { type:'training', locked:true,  title:'Aufwärmen + Technik + ARC',  location:'Halle (Seil)',    components:['A','T1','T2','T3','T7'],   notes:'Aufwärmen → 20 min Technik-Drills → 2×20 min ARC' },
    { type:'training', locked:true,  title:'Aufwärmen + Technik + Volumen', location:'Bouldern',     components:['A','T1','T2'],             notes:'Aufwärmen → 20 min Drills → freies Bouldern fb5–6' },
    { type:'rest',     locked:true,  title:'Ruhetag',                    location:'',                components:[],                          notes:'Optional: leichtes Dehnen, Fußübungen (D4)' },
    { type:'optional', locked:false, title:'Ausdauer oder Ruhe',         location:'Outdoor',         components:['E1'],                      notes:'30–40 min Laufen Zone 2 ODER Ruhetag' },
    { type:'training', locked:false, title:'Aufwärmen + ARC + Onsight',  location:'Fels oder Halle', components:['A','T7'],                  notes:'8–12 Routen UIAA 5–6, Technik bewusst anwenden' },
    { type:'optional', locked:false, title:'Volumen oder Ausdauer',      location:'Halle / Outdoor', components:['A','E2'],                  notes:'2. Klettersession leicht ODER 45 min Spinning Zone 2' },
  ],
  phase1Deload: [
    { type:'training', locked:false, title:'Hangboard (reduziert) + Kraft', location:'Zu Hause',     components:['C1','D1'],                notes:'Deload: nur 2 Sets Hangboard, Kraft halbieren' },
    { type:'training', locked:true,  title:'ARC + Technik (locker)',      location:'Halle (Seil)',    components:['A','T7'],                  notes:'ARC nur 1×20 min, Technik-Drills ohne Zeitdruck' },
    { type:'training', locked:true,  title:'Bouldern (leicht)',           location:'Bouldern',        components:['A'],                       notes:'Nur fb4–5, kein Versagen, Spaß' },
    { type:'rest',     locked:true,  title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
    { type:'rest',     locked:false, title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
    { type:'training', locked:false, title:'Entspannte Session',         location:'Fels oder Halle', components:['A'],                       notes:'Keine Limits, Spaß. ✅ Onsight-Test Woche 4.' },
    { type:'rest',     locked:false, title:'Ruhetag oder Spazieren',     location:'',                components:[],                          notes:'' },
  ],
  phase2Work: [
    { type:'training', locked:false, title:'MaxHangs + Zug & Core',      location:'Zu Hause / Gym',  components:['C3','D2'],                notes:'25–35 min MaxHangs → 25 min Zug+Core' },
    { type:'training', locked:true,  title:'Aufwärmen + Technik + Routen', location:'Halle (Seil)',  components:['A','T4','T5','T6'],        notes:'Aufwärmen → 20 min Technik → Routen UIAA 6–7 (nicht bis Ausfall)' },
    { type:'training', locked:true,  title:'Aufwärmen + Limit Bouldern', location:'Bouldern',        components:['A','T8'],                  notes:'Aufwärmen → 60 min Limit Bouldering fb6a–6c' },
    { type:'rest',     locked:true,  title:'Ruhetag',                    location:'',                components:[],                          notes:'Optional: 30 min Laufen (E1)' },
    { type:'optional', locked:false, title:'Hip & Glute oder Ruhe',      location:'Gym / Zu Hause',  components:['D3'],                     notes:'30–40 min Hip & Glute' },
    { type:'training', locked:false, title:'Aufwärmen + Limit + Onsight', location:'Fels oder Halle', components:['A','T8'],                notes:'Aufwärmen → Limit-Moves am Projekt → 3–4 Onsight-Versuche' },
    { type:'optional', locked:false, title:'Moderate Routen oder Spinning', location:'Halle / Gym',  components:['A','E3'],                 notes:'Routen UIAA 6–6+ ODER 35 min Spinning 4×4-Intervalle' },
  ],
  phase2Deload: [
    { type:'training', locked:false, title:'MaxHangs (reduziert)',        location:'Zu Hause',        components:['C3'],                     notes:'Deload: nur 3 Sets, kein Zusatzgewicht. ✅ Hangboard-Test: Max-Gewicht 30mm 10 Sek.' },
    { type:'training', locked:true,  title:'Moderate Routen',            location:'Halle (Seil)',    components:['A'],                       notes:'Nur UIAA 5–6, kein Technik-Stress' },
    { type:'training', locked:true,  title:'Bouldern (spielerisch)',      location:'Bouldern',        components:['A'],                       notes:'Nur fb5–6a, Technik spielerisch' },
    { type:'rest',     locked:true,  title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
    { type:'training', locked:false, title:'Leichte Ausdauer',           location:'Outdoor',         components:['E1'],                     notes:'30 min Laufen Zone 2' },
    { type:'training', locked:false, title:'Spaß-Session',               location:'Fels oder Halle', components:['A'],                       notes:'Spaß, kein Limit' },
    { type:'rest',     locked:false, title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
  ],
  phase3Work: [
    { type:'training', locked:false, title:'Hip & Glute + Spinning',     location:'Gym',             components:['D3','E3'],                notes:'30 min Hip+Glute+Core → 35 min Spinning Z4-Intervalle' },
    { type:'training', locked:true,  title:'Aufwärmen + PE Circuits',    location:'Halle (Seil)',    components:['A','T9'],                  notes:'Aufwärmen → 4×4 Boulder-Circuits oder Routen-Intervalle' },
    { type:'training', locked:true,  title:'Aufwärmen + PE Circuits',    location:'Bouldern',        components:['A','T9'],                  notes:'Aufwärmen → Kraftausdauer-Circuits' },
    { type:'rest',     locked:true,  title:'Ruhetag',                    location:'',                components:[],                          notes:'Komplett. Optional: leichtes Dehnen' },
    { type:'optional', locked:false, title:'Hangboard Erhaltung oder Ruhe', location:'Zu Hause',    components:['C2'],                     notes:'Nur 2×3 Repeaters (Erhaltung), 15 min' },
    { type:'training', locked:false, title:'Aufwärmen + Rotpunkt',       location:'Fels',            components:['A'],                       notes:'2–3 harte Rotpunkt-Burns + 3–4 moderate Routen' },
    { type:'optional', locked:false, title:'PE-Routen oder Ruhe',        location:'Halle',           components:['A'],                       notes:'Intervalle UIAA 7–7+ ODER Ruhe wenn Samstag intensiv war' },
  ],
  phase3Deload: [
    { type:'training', locked:false, title:'Hip & Glute',                location:'Gym',             components:['D3'],                     notes:'Deload: Nur Kraft, kein Spinning. ✅ Onsight-Test + Rotpunkt-Versuch.' },
    { type:'training', locked:true,  title:'Moderate Routen',            location:'Halle (Seil)',    components:['A'],                       notes:'Moderat, kein PE' },
    { type:'training', locked:true,  title:'Bouldern (locker)',           location:'Bouldern',        components:['A'],                       notes:'fb5–6a, locker' },
    { type:'rest',     locked:true,  title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
    { type:'rest',     locked:false, title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
    { type:'training', locked:false, title:'Entspannte Fels-Session',    location:'Fels',            components:['A'],                       notes:'1 entspannte Session' },
    { type:'rest',     locked:false, title:'Ruhetag',                    location:'',                components:[],                          notes:'' },
  ],
  phase4: [
    { type:'training', locked:false, title:'Neural Maintenance',         location:'Zu Hause',        components:['C4'],                     notes:'2–3 Sets MaxHangs (5–8 Sek.), kein Pump, 20 min total' },
    { type:'training', locked:true,  title:'Aufwärmen + Aktivierung',   location:'Halle (Seil)',    components:['A'],                       notes:'5–6 Routen UIAA 6–7, sauber, kein Pump, Technik genießen' },
    { type:'training', locked:true,  title:'Aufwärmen + leichtes Bouldern', location:'Bouldern',    components:['A'],                       notes:'Nur fb5–6a, Fußarbeit, Spaß, max 60 min' },
    { type:'rest',     locked:true,  title:'Ruhetag',                   location:'',                components:[],                          notes:'Gear checken, Beta visualisieren' },
    { type:'optional', locked:false, title:'Reise / Ruhe / Aktivierung', location:'',               components:[],                          notes:'Optional: 20 min gehen, Dehnen' },
    { type:'training', locked:false, title:'SENDTAG 🎯',                location:'Fels',            components:['A'],                       notes:'Vollständiges Aufwärmen → 2–3 Rotpunkt-Burns mit 20–45 min Pause' },
    { type:'training', locked:false, title:'SENDTAG 🎯',                location:'Fels',            components:['A'],                       notes:'2. Rotpunkt-Tag oder Onsight-Versuche' },
  ],
  phase5Deload: [
    { type:'rest',     locked:false, title:'Spazieren oder Yoga',        location:'',                components:[],                          notes:'30 min. Kein Hangboard. Kein Kraft. Kein Spinning.' },
    { type:'optional', locked:true,  title:'Optional: leichtes Klettern', location:'Halle (Seil)',  components:[],                          notes:'Nur wenn Lust da ist. UIAA 4–5.' },
    { type:'rest',     locked:false, title:'Ruhe',                       location:'',                components:[],                          notes:'' },
    { type:'rest',     locked:true,  title:'Ruhe',                       location:'',                components:[],                          notes:'' },
    { type:'rest',     locked:false, title:'Ruhe',                       location:'',                components:[],                          notes:'' },
    { type:'optional', locked:false, title:'Optional: lockere Session',  location:'Fels oder Halle', components:[],                          notes:'1 lockere Session wenn Lust da ist' },
    { type:'rest',     locked:false, title:'Ruhe',                       location:'',                components:[],                          notes:'' },
  ],
};

const WEEK_TEMPLATE_MAP = {
  1:'phase1Work', 2:'phase1Work', 3:'phase1Work', 4:'phase1Deload',
  5:'phase2Work', 6:'phase2Work', 7:'phase2Work', 8:'phase2Deload',
  9:'phase3Work', 10:'phase3Work', 11:'phase3Work', 12:'phase3Deload',
  13:'phase4', 14:'phase4', 15:'phase4', 16:'phase5Deload',
};

// ── Week generation ───────────────────────────────────────────────────────────
function generateWeeks() {
  return Array.from({ length: 16 }, (_, i) => {
    const weekNum = i + 1;
    const startDate = new Date(PLAN_START);
    startDate.setDate(startDate.getDate() + i * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    const phase = getPhase(weekNum);
    const isDeload = DELOAD_WEEKS.has(weekNum);
    const templateKey = WEEK_TEMPLATE_MAP[weekNum];
    const dayTemplates = T[templateKey];

    const days = dayTemplates.map((tmpl, j) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + j);
      return { ...tmpl, components: [...tmpl.components], date };
    });

    return { weekNum, phase, isDeload, startDate, endDate, days };
  });
}

const WEEKS = generateWeeks();

// ── Phase goal notes per week ─────────────────────────────────────────────────
const PHASE_NOTES = {
  1: 'Fingerkraft: Nur Repeaters, nie bis Versagen. Kletterzone: UIAA 5–6. Technik-Fokus: Silent Feet, Gerade Arme.',
  2: 'Hangboard: Wechsel zu MaxHangs. Mindestens 48–72h Fingerpause. Bouldern auf Limit fb6a–6c.',
  3: 'Max 2 PE-Sessions/Woche. Hangboard: nur Erhaltung. Fokus: Rustellen erkennen, Pumpmanagement.',
  4: 'Volumen −40–50%. Wochenende = Sending. Midweek = Aktivierung, nicht Training.',
  5: 'Vollständige Erholung. Wer sich schuldig fühlt, macht es falsch.',
};

function getPhaseNote(weekNum) {
  const phase = getPhase(weekNum);
  return PHASE_NOTES[phase.id] || '';
}
