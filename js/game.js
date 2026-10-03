/* ============================================================================
   JEU DE SENSIBILISATION AUX RISQUES PROFESSIONNELS
   Center Parcs — Les Landes de Gascogne
   S'appuie sur les grandes familles de risques identifiées par l'INRS
   (risque chimique, électrique, mécanique, TMS, RPS, chute, incendie, routier...)
   ========================================================================== */

const GAME_LOCATIONS = [
  {
    id: "accueil",
    name: "Accueil & Back-office",
    icon: "🏢",
    x: 14, y: 22,
    intro: "Vous poussez la porte des bureaux de l'accueil. Les téléphones sonnent, les écrans sont allumés, et une file de clients patiente déjà dehors.",
    questions: [
      {
        q: "Après plusieurs heures passées assis devant un écran à l'accueil, quel risque professionnel vous guette le plus directement ?",
        options: [
          "Le risque chimique",
          "Les troubles musculo-squelettiques (TMS) liés à la posture",
          "Le risque de noyade",
          "Le risque électrique",
        ],
        correct: 1,
        refOk: "Bonnes pratiques INRS — travail sur écran",
        explain: "Un travail prolongé sur écran sans pause ni réglage du poste expose aux TMS (dos, cou, poignets). L'INRS recommande des pauses régulières, un poste bien ajusté (écran, siège, clavier) et des changements de posture.",
      },
      {
        q: "Un client excédé hausse le ton et devient agressif au comptoir. Vous réagissez comment ?",
        options: [
          "Vous haussez le ton à votre tour pour vous imposer",
          "Vous restez calme, gardez vos distances et alertez un collègue ou votre responsable si la situation dégénère",
          "Vous ignorez complètement le client",
          "Vous quittez votre poste sans prévenir personne",
        ],
        correct: 1,
        refOk: "Prévention des risques psychosociaux (RPS) — gestion des incivilités",
        explain: "Face à une incivilité, l'INRS préconise de ne pas entrer dans l'escalade, de rester factuel et courtois, et de solliciter un appui si la tension monte — on ne reste jamais seul face à une situation qui dégénère.",
      },
    ],
  },
  {
    id: "piscine",
    name: "Piscine & locaux techniques",
    icon: "🏊",
    x: 50, y: 18,
    intro: "Vous descendez au local technique de traitement de l'eau, sous le dôme de la piscine. Des bidons de chlore et d'acide sont stockés le long du mur.",
    questions: [
      {
        q: "Pourquoi ne faut-il jamais stocker ou manipuler le chlore et l'acide avec le même matériel, côte à côte ?",
        options: [
          "C'est uniquement une question de place disponible",
          "Un mélange accidentel peut dégager un gaz toxique (chloramines)",
          "Cela n'a aucune incidence en pratique",
          "C'est seulement une question d'organisation du local",
        ],
        correct: 1,
        refOk: "Risque chimique — stockage des produits de traitement de l'eau",
        explain: "Le mélange chlore/acide peut libérer des vapeurs toxiques pour les voies respiratoires. L'INRS impose un stockage séparé, une ventilation efficace et du matériel dédié à chaque produit.",
      },
      {
        q: "En entrant dans le local, vous sentez une odeur de chlore anormalement forte. Que faites-vous ?",
        options: [
          "Vous entrez quand même pour identifier la fuite",
          "Vous évacuez immédiatement la zone, n'intervenez pas seul et alertez le responsable HSE",
          "Vous ouvrez juste une fenêtre et continuez votre tâche",
          "Vous ne dites rien, l'odeur finira par passer",
        ],
        correct: 1,
        refOk: "Conduite à tenir — risque chimique",
        explain: "Une odeur de chlore inhabituelle est un signal d'alerte : on évacue, on ne s'expose pas seul, et on prévient immédiatement les personnes compétentes.",
      },
    ],
  },
  {
    id: "maintenance",
    name: "Atelier maintenance",
    icon: "🛠️",
    x: 86, y: 24,
    intro: "Dans l'atelier, une pompe est en panne et doit être réparée rapidement avant la réouverture des bassins.",
    questions: [
      {
        q: "Avant d'intervenir sur une installation électrique ou une machine en panne, quelle règle est incontournable ?",
        options: [
          "Travailler vite pour limiter l'arrêt de l'équipement",
          "Consigner l'installation (couper l'énergie, condamner, vérifier l'absence de tension) avant toute intervention",
          "Demander à un collègue de couper le courant pendant que vous travaillez dessus",
          "Porter des gants en laine pour s'isoler",
        ],
        correct: 1,
        refOk: "Prévention du risque électrique et mécanique — consignation",
        explain: "Consigner avant d'intervenir est la base de la prévention du risque électrique et mécanique : couper, condamner, vérifier l'absence d'énergie résiduelle, avant toute opération de maintenance.",
      },
      {
        q: "L'échelle disponible pour atteindre un équipement en hauteur est abîmée. Que faites-vous ?",
        options: [
          "Vous montez prudemment en faisant attention",
          "Vous demandez à quelqu'un de la tenir fermement pendant que vous montez",
          "Vous n'utilisez pas l'échelle défectueuse : vous la signalez et utilisez un équipement conforme",
          "Vous reportez l'intervention sans rien signaler",
        ],
        correct: 2,
        refOk: "Prévention du risque de chute de hauteur",
        explain: "Un équipement défectueux doit être retiré du service et signalé. Le risque de chute de hauteur est l'un des plus graves en maintenance : utiliser un matériel conforme et vérifié n'est pas négociable.",
      },
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant & cuisine",
    icon: "🍽️",
    x: 84, y: 56,
    intro: "Il est midi, le coup de feu bat son plein en cuisine. Les sols sont glissants près des plans de friture.",
    questions: [
      {
        q: "Quel type d'accident est le plus fréquent en cuisine collective ?",
        options: [
          "Le risque routier",
          "Les chutes de plain-pied (sols gras/mouillés) et les coupures/brûlures",
          "Le risque radioactif",
          "Le risque de noyade",
        ],
        correct: 1,
        refOk: "Prévention des chutes et coupures en restauration",
        explain: "En restauration, chutes de plain-pied, coupures et brûlures sont les accidents les plus courants. Chaussures antidérapantes, nettoyage immédiat des sols et gestes sûrs avec couteaux et surfaces chaudes sont essentiels.",
      },
      {
        q: "Une friteuse s'enflamme brusquement. Quel est le bon réflexe ?",
        options: [
          "Verser de l'eau dessus pour éteindre le feu",
          "Couper l'alimentation si possible sans danger, étouffer le feu (couvercle, couverture anti-feu, jamais d'eau) et donner l'alerte",
          "Utiliser un extincteur à eau pulvérisée",
          "Laisser brûler et évacuer sans rien faire",
        ],
        correct: 1,
        refOk: "Risque incendie — feux de friture",
        explain: "L'eau sur une friteuse enflammée provoque une projection d'huile en feu et aggrave le sinistre. Il faut étouffer les flammes et déclencher l'alerte, jamais utiliser d'eau sur un feu gras.",
      },
    ],
  },
  {
    id: "menage",
    name: "Hébergements & ménage",
    icon: "🧹",
    x: 16, y: 58,
    intro: "Vous enchaînez le nettoyage des cottages entre deux arrivées. Les chariots de produits d'entretien et le linge s'accumulent.",
    questions: [
      {
        q: "Pourquoi ne faut-il jamais mélanger l'eau de javel avec un produit détartrant ou acide ?",
        options: [
          "Cela n'a aucun risque particulier",
          "Le mélange peut dégager un gaz toxique dangereux pour les voies respiratoires",
          "Cela permet de nettoyer plus efficacement",
          "Cela fait simplement perdre du temps",
        ],
        correct: 1,
        refOk: "Risque chimique — produits d'entretien",
        explain: "Javel + produit acide = émanations toxiques. Ne jamais mélanger les produits d'entretien, bien les étiqueter et aérer les locaux pendant leur utilisation.",
      },
      {
        q: "Vous devez déplacer seul(e) un lit lourd dans un hébergement. Que faites-vous ?",
        options: [
          "Vous forcez seul(e) en pliant le dos",
          "Vous demandez de l'aide à un collègue ou utilisez une aide à la manutention, avec les bons gestes et postures",
          "Vous tirez d'un coup sec pour aller plus vite",
          "Vous renoncez sans en parler à personne",
        ],
        correct: 1,
        refOk: "Prévention des TMS — gestes et postures de manutention",
        explain: "Le port de charges lourdes est une cause majeure de TMS et de lombalgies. L'aide mécanique ou humaine, associée à des gestes de manutention adaptés, permet de prévenir ces blessures.",
      },
    ],
  },
  {
    id: "espacesverts",
    name: "Espaces verts",
    icon: "🌳",
    x: 32, y: 88,
    intro: "Vous entretenez les abords des cottages avec une débroussailleuse, en plein soleil de l'après-midi.",
    questions: [
      {
        q: "Quels équipements de protection individuelle (EPI) sont indispensables pour utiliser une débroussailleuse ?",
        options: [
          "Aucun, ce n'est pas nécessaire pour un outil courant",
          "Protection auditive, visière ou lunettes, gants et pantalon anti-coupure",
          "Seulement des lunettes de soleil",
          "Un simple tablier de cuisine",
        ],
        correct: 1,
        refOk: "EPI — travaux d'espaces verts",
        explain: "La débroussailleuse expose au bruit, aux projections et aux coupures. Le port d'EPI adaptés (protection auditive, visière, gants, pantalon anti-coupure) est indispensable.",
      },
      {
        q: "Il fait très chaud et vous travaillez dehors toute la journée. Que faites-vous pour prévenir un coup de chaleur ?",
        options: [
          "Vous accélérez le travail pour finir plus vite",
          "Vous vous hydratez régulièrement, faites des pauses à l'ombre et adaptez l'effort aux heures les plus chaudes",
          "Vous ne buvez qu'en fin de journée",
          "Vous considérez que ce n'est pas un vrai risque professionnel",
        ],
        correct: 1,
        refOk: "Prévention du risque lié aux fortes chaleurs",
        explain: "La chaleur est un risque professionnel reconnu : hydratation régulière, pauses à l'ombre, adaptation des horaires et surveillance des signes d'alerte (fatigue, vertiges) préviennent le coup de chaleur.",
      },
    ],
  },
  {
    id: "bikecenter",
    name: "Activités & Bike Center",
    icon: "🚴",
    x: 70, y: 90,
    intro: "Une famille attend pour louer des vélos avant de partir découvrir le parc à cottages.",
    questions: [
      {
        q: "Avant de prêter un vélo à un client, quelle vérification est indispensable ?",
        options: [
          "Aucune, les vélos sont toujours en bon état",
          "Vérifier l'état général du vélo (freins, pneus, selle) et sa taille adaptée au client",
          "Vérifier uniquement la couleur du vélo",
          "Demander l'avis d'un collègue sans rien vérifier soi-même",
        ],
        correct: 1,
        refOk: "Prévention du risque lié au matériel de loisirs",
        explain: "Un contrôle rapide avant chaque location (freins, pneus, réglages) permet de prévenir les accidents liés à un matériel défaillant — une vérification simple mais essentielle.",
      },
      {
        q: "Un enfant tombe légèrement de vélo devant vous et se blesse au genou. Que faites-vous ?",
        options: [
          "Vous l'ignorez, ce n'est pas grave",
          "Vous portez assistance, évaluez la blessure, prévenez les secours du site et les parents, puis déclarez l'incident",
          "Vous grondez l'enfant pour son imprudence",
          "Vous continuez votre activité sans réagir",
        ],
        correct: 1,
        refOk: "Prise en charge d'un accident — premiers secours et déclaration",
        explain: "Porter assistance, évaluer la gravité, prévenir les secours internes et les parents, puis tracer l'évènement (déclaration d'accident) : c'est la base de la prise en charge d'un incident, même mineur.",
      },
    ],
  },
];

const GAME_DECOR = [
  { icon: "🌲", x: 4, y: 6 }, { icon: "🌲", x: 95, y: 8 }, { icon: "🌲", x: 2, y: 40 },
  { icon: "🌲", x: 97, y: 42 }, { icon: "🌲", x: 5, y: 75 }, { icon: "🌲", x: 94, y: 78 },
  { icon: "🌲", x: 50, y: 97 }, { icon: "🏡", x: 25, y: 38 }, { icon: "🏡", x: 70, y: 40 },
  { icon: "🏡", x: 45, y: 65 },
];

const GAME_STORAGE_KEY = "hsse_game_best_score";

let gameState = {
  score: 0,
  visited: {},
  currentLocation: null,
  currentQuestionIndex: 0,
  pointsThisVisit: 0,
};

function gameTotalPoints() {
  return GAME_LOCATIONS.reduce((sum, loc) => sum + loc.questions.length, 0);
}

function gameVisitedCount() {
  return Object.keys(gameState.visited).length;
}

function gameInit() {
  const saved = localStorage.getItem(GAME_STORAGE_KEY);
  gameState.best = saved ? parseInt(saved, 10) : 0;
  renderGameMap();
}

function renderGameMap() {
  const root = document.getElementById("gameRoot");
  const total = gameTotalPoints();
  const visitedCount = gameVisitedCount();

  const decorHtml = GAME_DECOR.map((d) => `<span class="game-map-deco" style="left:${d.x}%; top:${d.y}%;" aria-hidden="true">${d.icon}</span>`).join("");

  const pinsHtml = GAME_LOCATIONS.map((loc) => {
    const visited = gameState.visited[loc.id];
    return `
      <button class="game-pin ${visited ? "visited" : ""}" data-loc="${loc.id}" style="left:${loc.x}%; top:${loc.y}%;" aria-label="${loc.name}">
        <span class="game-pin-icon">${loc.icon}${visited ? '<span class="game-pin-check">✓</span>' : ""}</span>
        <span class="game-pin-label">${loc.name}</span>
      </button>`;
  }).join("");

  const avatarLoc = gameState.currentLocation
    ? GAME_LOCATIONS.find((l) => l.id === gameState.currentLocation)
    : { x: 50, y: 98 };

  root.innerHTML = `
    <div class="game-hud">
      <div class="game-hud-chip">⭐ <span class="big">${gameState.score}</span> / ${total} points</div>
      <div class="game-hud-chip">📍 ${visitedCount} / ${GAME_LOCATIONS.length} lieux visités</div>
      ${gameState.best ? `<div class="game-hud-chip">🏆 Record : ${gameState.best}/${total}</div>` : ""}
    </div>
    <div class="game-intro-card">
      <strong>Mission :</strong> déplacez votre avatar à travers le parc et visitez chaque lieu de travail pour répondre aux questions de sensibilisation aux risques professionnels (basées sur les fiches de prévention INRS). Une bonne réponse = 1 point.
    </div>
    <div class="game-map-wrap" id="gameMap">
      ${decorHtml}
      ${pinsHtml}
      <div class="game-avatar" id="gameAvatar" style="left:${avatarLoc.x}%; top:${avatarLoc.y}%;">🧑‍🔧</div>
    </div>
    <p class="game-legend">Touchez un lieu sur la carte pour vous y déplacer et démarrer le quiz.</p>
  `;

  root.querySelectorAll(".game-pin").forEach((btn) => {
    btn.addEventListener("click", () => gameGoTo(btn.dataset.loc));
  });

  if (visitedCount === GAME_LOCATIONS.length) {
    setTimeout(gameShowEnd, 500);
  }
}

function gameGoTo(locId) {
  const loc = GAME_LOCATIONS.find((l) => l.id === locId);
  if (!loc) return;
  const avatar = document.getElementById("gameAvatar");
  avatar.style.left = loc.x + "%";
  avatar.style.top = loc.y + "%";
  gameState.currentLocation = locId;
  setTimeout(() => gameOpenQuiz(loc), 500);
}

function gameOpenQuiz(loc) {
  gameState.currentQuestionIndex = 0;
  gameState.pointsThisVisit = 0;
  gameRenderQuizStep(loc);
}

function gameRenderQuizStep(loc) {
  const qIndex = gameState.currentQuestionIndex;
  const question = loc.questions[qIndex];
  const letters = ["A", "B", "C", "D"];

  const overlay = document.createElement("div");
  overlay.className = "game-modal-overlay";
  overlay.id = "gameModalOverlay";

  const introHtml = qIndex === 0 ? `<div class="game-modal-intro">${loc.intro}</div>` : "";

  overlay.innerHTML = `
    <div class="game-modal">
      <div class="game-modal-step">Question ${qIndex + 1} / ${loc.questions.length}</div>
      <div class="game-modal-head">
        <span class="game-modal-icon">${loc.icon}</span>
        <span class="game-modal-title">${loc.name}</span>
      </div>
      ${introHtml}
      <div class="game-question-text">${question.q}</div>
      <div class="game-options" id="gameOptions">
        ${question.options.map((opt, i) => `
          <button class="game-option" data-idx="${i}">
            <span class="letter">${letters[i]}</span><span>${opt}</span>
          </button>`).join("")}
      </div>
      <div id="gameFeedbackZone"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelectorAll(".game-option").forEach((btn) => {
    btn.addEventListener("click", () => gameAnswer(loc, parseInt(btn.dataset.idx, 10)));
  });
}

function gameAnswer(loc, idx) {
  const qIndex = gameState.currentQuestionIndex;
  const question = loc.questions[qIndex];
  const overlay = document.getElementById("gameModalOverlay");
  const options = overlay.querySelectorAll(".game-option");
  const isCorrect = idx === question.correct;

  options.forEach((btn, i) => {
    btn.classList.add("disabled");
    if (i === question.correct) btn.classList.add("correct");
    else if (i === idx) btn.classList.add("incorrect");
  });

  if (isCorrect) {
    gameState.score += 1;
    gameState.pointsThisVisit += 1;
  }

  const isLastQuestion = qIndex === loc.questions.length - 1;
  const nextLabel = isLastQuestion ? "Terminer et quitter ce lieu" : "Question suivante";

  const feedbackZone = document.getElementById("gameFeedbackZone");
  feedbackZone.innerHTML = `
    <div class="game-feedback ${isCorrect ? "ok" : "ko"}">
      <span class="game-feedback-title">${isCorrect ? "✅ Bonne réponse !" : "❌ Ce n'est pas la réponse la plus sûre."}</span>
      ${question.explain}
      <div><span class="game-feedback-ref">${question.refOk}</span></div>
    </div>
    <div class="game-modal-actions">
      <button class="btn-primary lg" id="gameNextBtn">${nextLabel}</button>
    </div>
  `;

  document.getElementById("gameNextBtn").addEventListener("click", () => gameNextStep(loc));
}

function gameNextStep(loc) {
  const overlay = document.getElementById("gameModalOverlay");
  const isLastQuestion = gameState.currentQuestionIndex === loc.questions.length - 1;

  if (!isLastQuestion) {
    gameState.currentQuestionIndex += 1;
    overlay.remove();
    gameRenderQuizStep(loc);
    return;
  }

  overlay.remove();
  gameState.visited[loc.id] = true;
  gameState.currentLocation = null;
  renderGameMap();
  gameShowToast(`+${gameState.pointsThisVisit} point${gameState.pointsThisVisit > 1 ? "s" : ""} — lieu visité : ${loc.name}`);
}

function gameShowToast(msg) {
  const toast = document.createElement("div");
  toast.className = "game-toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function gameShowEnd() {
  const total = gameTotalPoints();
  const score = gameState.score;

  if (score > (gameState.best || 0)) {
    gameState.best = score;
    localStorage.setItem(GAME_STORAGE_KEY, String(score));
  }

  let tier, emoji, text;
  const pct = score / total;
  if (pct >= 0.85) {
    tier = "Expert prévention HSSE"; emoji = "🏆";
    text = "Excellent ! Vous maîtrisez les bons réflexes de prévention sur l'ensemble des postes du parc.";
  } else if (pct >= 0.6) {
    tier = "Bon niveau de vigilance"; emoji = "👍";
    text = "Belle performance ! Quelques situations méritent encore d'être revues pour renforcer vos réflexes de prévention.";
  } else {
    tier = "À sensibiliser davantage"; emoji = "⚠️";
    text = "Rejouez pour revoir les bonnes pratiques de prévention : chaque lieu du parc présente des risques spécifiques à bien connaître.";
  }

  const overlay = document.createElement("div");
  overlay.className = "game-modal-overlay";
  overlay.id = "gameEndOverlay";
  overlay.innerHTML = `
    <div class="game-modal">
      <div class="game-end-card">
        <div class="game-end-emoji">${emoji}</div>
        <div class="game-modal-title">Parcours terminé !</div>
        <div class="game-end-score">${score} / ${total}</div>
        <div class="game-end-tier">${tier}</div>
        <p class="game-end-text">${text}</p>
        <button class="btn-primary lg" id="gameReplayBtn">Rejouer le parcours</button>
        <a class="btn-ghost lg" href="index.html">Retour à l'application</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById("gameReplayBtn").addEventListener("click", gameReset);
}

function gameReset() {
  document.getElementById("gameEndOverlay")?.remove();
  gameState.score = 0;
  gameState.visited = {};
  gameState.currentLocation = null;
  renderGameMap();
}

document.addEventListener("DOMContentLoaded", gameInit);
