/* ============================================================================
   OUTIL D'AUDIT INTERNE HSSE — BASE DE QUESTIONS
   Toutes les questions des 7 grilles d'audit source, réorganisées pour
   optimiser le déroulement de l'audit terrain (cf. consignes utilisateur).
   Chaque question : { t: texte, r: référence (optionnel) }
   ========================================================================== */

const AUDIT_DATA = {
  departments: [

    /* ======================================================================
       1. GM — pas de changement
       ====================================================================== */
    {
      id: "gm",
      name: "GM",
      icon: "🧑‍💼",
      sections: [
        {
          id: "gm-pool",
          name: "Pool",
          questions: [
            { t: "Y a-t-il une vérification au moins deux fois par jour par un membre de la MT ?", r: "FP-01-08" },
            { t: "Les résultats de la qualité de l'eau, des sols et de l'air sont-ils revus une fois par mois avec le (SHE&)Pool Manager ?" },
          ]
        },
        {
          id: "gm-safety",
          name: "Safety",
          questions: [
            { t: "Le CSE se déroule-t-il conformément à la réglementation nationale ?", r: "CSE" },
            { t: "Le Risk Committee se tient-il chaque trimestre, incluant un plan d'action ?" },
            { t: "Les partenaires externes participent-ils au Risk Committee ?" },
            { t: "Les KPIs mensuels sont-ils revus avec la MT ?" },
            { t: "Le dossier SharePoint SHARED_RISK du parc est-il complété correctement ?" },
          ]
        },
        {
          id: "gm-haccp",
          name: "HACCP externalisé",
          questions: [
            { t: "Les rapports Sécurité Sanitaire des Aliments/HACCP sont-ils discutés lors du Risk Committee ?" },
          ]
        },
        {
          id: "gm-csr",
          name: "CSR",
          questions: [
            { t: "Le CSR program du parc est-il mis à jour au moins une fois par trimestre ?", r: "FE-02-02" },
            { t: "Le GM valide et signe-t-il la Management Review ISO ?" },
          ]
        },
      ]
    },

    /* ======================================================================
       2. SHE & POOL — réorganisé :
          POOL : Bureaux (traçabilité documentaire) / Bassins (propreté et
                 affichage) / Sous-sols (maintenance)
          SHE  : Traçabilité documentaire et suivi HSE / Contrôle de
                 conformité du poste de police (poste d'accueil et sécurité)
       ====================================================================== */
    {
      id: "she-pool",
      name: "SHE & Pool",
      icon: "🏊",
      sections: [
        {
          id: "pool-bureaux",
          name: "POOL — Bureaux (traçabilité documentaire)",
          questions: [
            { t: "Toutes les priorités 1 Pool sont-elles résolues dans le délai imparti ?", r: "FE-04-02 Pool" },
            { t: "Le POSS est-il à jour et conforme à la réglementation nationale et au manuel Pool CPE, et signé par le GM ?" },
            { t: "Le personnel de la piscine a-t-il reçu une formation sur le POSS et est-elle enregistrée ?" },
            { t: "Les employés ont-ils tous les diplômes/certificats appropriés et si besoin recyclés conformément au manuel de formation obligatoire ?" },
            { t: "Le carnet sanitaire piscine est-il rempli correctement ? (visiteurs, consommation d'eau, contre-lavage des filtres, chlore libre actif, pH, T°…)" },
            { t: "Est-ce que les contrôles de sécurité des attractions sont effectués et enregistrés chaque jour avant ouverture au public (toboggans, jeux d'eau, pataugeoire, rivière…) ?" },
            { t: "Les accidents sont-ils enregistrés, suivis et analysés mensuellement ?" },
            { t: "Y a-t-il un registre des formations mis à jour annuellement pour le(s) FM sur la livraison de substances chimiques ?", r: "SP-02-05-1a" },
            { t: "L'auto-évaluation de l'approvisionnement en chlore et en acide est-elle réalisée au moins deux fois au cours de l'année écoulée et les mesures nécessaires sont-elles prises pour améliorer les écarts constatés ?", r: "SP-02-05-03" },
            { t: "Le rapport d'analyse d'eau est-il vérifié par le FM ou le chef d'équipe après chaque analyse, et des mesures correctives sont-elles prises et enregistrées le cas échéant ?" },
            { t: "Le test du dummy est-il réalisé et enregistré (en incluant des actions correctives) au moins une fois par mois pendant les heures d'ouverture ?" },
            { t: "Est-ce que chaque nouveau maître nageur suit la formation « surveillance et attitude » ?" },
            { t: "Le programme surveillance et attitude est-il en place ? (introduction, rappel trimestriel, action du mois)" },
            { t: "Le matériel pour les activités aquatiques (Aquaspeed…) est-il régulièrement contrôlé et enregistré ?" },
            { t: "Toutes les bouches d'aspiration au niveau des parois et du fond des bassins sont-elles contrôlées et enregistrées conformément au manuel Pool CPE ?", r: "SP-03-21" },
          ]
        },
        {
          id: "pool-bassins",
          name: "POOL — Bassins (propreté et affichage)",
          questions: [
            { t: "Le protocole de nettoyage et de désinfection des sols est-il vérifié et enregistré ?" },
            { t: "Est-ce que le règlement intérieur actualisé est affiché à l'entrée de la piscine ?" },
            { t: "Est-ce que la signalétique de sécurité (incluant les feux de circulation) des toboggans et des autres attractions est présente et conforme à l'EN1069 et à la législation nationale ?" },
            { t: "La signalétique des gilets de flottaison est-elle affichée à plusieurs endroits dans la piscine (entrée, portants…) ?" },
            { t: "Y a-t-il toujours suffisamment de gilets de flottaison disponibles sur les portants ?" },
            { t: "Le matériel de premiers secours est-il disponible et conforme au manuel Pool CPE ?" },
            { t: "Y a-t-il un mégaphone et un système de sonorisation, qui fonctionnent bien, à la disposition des sauveteurs ?" },
            { t: "Le fond des bassins est-il clairement visible, à toute heure, en toute saison ?" },
          ]
        },
        {
          id: "pool-soussols",
          name: "POOL — Sous-sols (maintenance / locaux techniques)",
          questions: [
            { t: "Tous les locaux techniques et les lieux de stockage des produits chimiques sont-ils inaccessibles aux personnes non autorisées ?" },
            { t: "Les contre-lavages se font-ils uniquement en dehors des heures d'ouverture au public ?" },
            { t: "Est-ce que les produits acide et alcalin sont bien séparés entre eux, sur bac de rétention, qui sont eux-mêmes contrôlés, nettoyés et vidés régulièrement ?" },
            { t: "Est-ce que les EPI sont présents et en bon état (masque, cartouche, tablier/combinaison et gants…) ?" },
          ]
        },
        {
          id: "she-doc",
          name: "SHE — Traçabilité documentaire et suivi HSE",
          questions: [
            // -- Incendie
            { t: "Toutes les priorités 1 liées à la sécurité incendie sont-elles résolues dans le délai imparti ?", r: "FE-04-02 Fire Safety", g: "Incendie" },
            { t: "Les biens sont-ils stockés sous la ligne rouge dans tous les espaces de stockage ?", r: "WFi-02-01", g: "Incendie" },
            { t: "Est-ce que le self-assessment incendie annuel est fait correctement (mesures préventives et correctives détaillées avec priorités, en cas de déviation) ?", r: "FFi-02-03", g: "Incendie" },
            { t: "L'ensemble des rondes de contrôle incendie obligatoires ont-elles été effectuées ? (rondes préventives, rondes de fermeture, extincteurs, éclairage d'urgence…)", g: "Incendie" },
            { t: "Le plan ATEX est-il disponible et actualisé ?", r: "FFi-05-01", g: "Incendie" },
            { t: "Un avis favorable est-il émis par toutes les commissions de sécurité des ERP ?", g: "Incendie" },
            { t: "Les couvertures antifeu sont-elles présentes là où elles sont obligatoires (cuisine…) ?", g: "Incendie" },
            { t: "Est-ce que l'éclairage de sécurité fonctionne partout ? Si non, les lampes/batteries défectueuses sont-elles détectées et des mesures correctives sont-elles implémentées ?", g: "Incendie" },
            { t: "Est-ce que les règles de stockage dans les locaux techniques, dégagements, couloirs et escaliers sont conformes à la réglementation nationale et à notre système de management Fire ?", g: "Incendie" },
            { t: "Est-ce que les locaux à risques (stockage produits dangereux, chaufferie…) sont ventilés conformément à la réglementation nationale ?", g: "Incendie" },
            { t: "Est-ce que les portes coupe-feu sont en bon état de fonctionnement conformément à la réglementation nationale ?", g: "Incendie" },
            // -- Leisure / Playground
            { t: "La procédure FE-03-19 est-elle utilisée dès lors qu'un évènement significatif est organisé ?", g: "Activités de loisirs" },
            { t: "Les exercices d'urgence CP incluent-ils les partenaires externes, au moins une fois par an ?", g: "Activités de loisirs" },
            { t: "L'auto-évaluation aires de jeu est-elle réalisée annuellement avant la fin du mois de mars ?", r: "FSa-01-12", g: "Aires de jeux" },
            // -- CSR
            { t: "Toutes les priorités 1 liées à la RSE sont-elles résolues dans le délai imparti (incluant Clé Verte) ?", r: "FE-04-02 CSR", g: "RSE" },
            { t: "La politique RSE mise à jour, les certificats ISO 14001/50001, SDG, et label Clé Verte sont-ils affichés à plusieurs endroits incluant la réception ?", g: "RSE" },
            { t: "La revue de direction ISO 14001-50001 est-elle conforme et présentée annuellement à la MT ?", r: "FE-05-01", g: "RSE" },
            { t: "Clé Verte : tous les critères impératifs sont-ils respectés ? Sinon, un plan d'actions est mis en œuvre pour les atteindre (priorité 1 ou 2).", r: "FE-04-02", g: "RSE" },
            { t: "Le CSR program du parc est-il défini et suivi régulièrement en conformité avec les CSR programs France et CPE ?", r: "FE-02-02", g: "RSE" },
            { t: "Le CSR program mis à jour fait-il l'objet d'un reporting trimestriel au niveau CP France (et CPE) ?", r: "FE-02-02", g: "RSE" },
            // -- Légionelle
            { t: "Toutes les priorités 1 Légionelle sont-elles résolues dans le délai imparti ?", r: "FE-04-02 Légionelle", g: "Légionelle" },
            { t: "L'évaluation des risques Légionelle est-elle à jour et conforme à la réglementation française et au manuel Légionelle CPE ? (tous les points d'usage à risque sont identifiés et suivis)", g: "Légionelle" },
            { t: "Le carnet sanitaire Légionelle est-il complet et conforme à la réglementation française et au manuel Légionelle CPE ?", g: "Légionelle" },
            { t: "Le Quarterly check Légionelle est-il réalisé chaque trimestre et les déviations intégrées dans la FE-04-02 Légionelle ?", r: "FL-02-01", g: "Légionelle" },
            { t: "Tous les résultats des analyses de Legionella et de l'eau potable sont-ils régulièrement vérifiés par le responsable S&P ?", r: "FL-01-15", g: "Légionelle" },
            { t: "En cas de contamination Légionelle (résultat positif), la checklist FL-03-01 est-elle remplie et discutée avec le/la GM, le Manager Maintenance et l'ORD ?", g: "Légionelle" },
            // -- Sécurité générale / Santé sécurité au travail
            { t: "Toutes les priorités 1 liées à la sécurité des personnes et des biens et à la santé sécurité au travail sont-elles résolues dans le délai imparti ?", r: "FE-04-02 General Safety", g: "Sécurité générale / HST" },
            { t: "Le DUERP et le plan d'action associé en matière de santé et de sécurité au travail sont-ils mis à jour au moins une fois par an ?", g: "Sécurité générale / HST" },
            { t: "Le plan d'action du DUERP est-il mis en œuvre ?", g: "Sécurité générale / HST" },
            { t: "Le CSE procède-t-il à une (des) visite(s) dans les différents départements ?", g: "Sécurité générale / HST" },
            { t: "Tous les incidents et accidents de travail sont-ils enregistrés, suivis et analysés conformément à la réglementation nationale ?", g: "Sécurité générale / HST" },
            { t: "Tous les incidents et accidents des clients sont-ils enregistrés, suivis et analysés ?", g: "Sécurité générale / HST" },
            { t: "Les incidents et accidents des partenaires (salariés ou clients), suivi et analyse afférents, sont-ils communiqués à CP ?", g: "Sécurité générale / HST" },
            { t: "Y a-t-il suffisamment d'EPI appropriés disponibles dans chaque département conformément aux risques évalués ? (CP/SP et partenaires)", g: "Sécurité générale / HST" },
            { t: "Les employés reçoivent-ils les instructions appropriées sur l'utilisation des EPI annuellement ?", g: "Sécurité générale / HST" },
            { t: "Les managers (floormanagers, department managers) vérifient-ils l'utilisation adéquate des EPI ?", g: "Sécurité générale / HST" },
            { t: "Y a-t-il un inventaire des produits dangereux actualisé au minimum 1 fois par an ?", g: "Sécurité générale / HST" },
            { t: "Existe-t-il une (des) instruction(s) écrite(s) concernant la livraison des produits dangereux (acide, chlore, carburant…) ?", g: "Sécurité générale / HST" },
            { t: "L'instruction WSa-01-01 (coordination de la sécurité des projets) est-elle suivie lors des projets ?", g: "Sécurité générale / HST" },
            { t: "La livraison des produits dangereux (acides, chlore, pétrole…) est-elle vérifiée avec traçabilité, conformément aux instructions ?", r: "FP-02-05", g: "Sécurité générale / HST" },
            { t: "Les produits dangereux sont-ils stockés conformément à la réglementation en vigueur (et procédures CPE) ?", g: "Sécurité générale / HST" },
            { t: "Toutes les fiches de données de sécurité concernant les produits dangereux sont-elles présentes, à jour, et disponibles dans tous les départements et pour les services d'urgence ?", g: "Sécurité générale / HST" },
            { t: "La livraison de chlore et d'acide sulfurique est-elle vérifiée avant arrivée sur le parc et accompagnée jusqu'au point de déchargement ?", r: "FP-02-05", g: "Sécurité générale / HST" },
            { t: "Sur les bâtiments centraux : y a-t-il des équipements de protection individuels ou collectifs garantissant la sécurité lors des travaux en hauteur ?", g: "Sécurité générale / HST" },
            { t: "Les véhicules de service à moteur sont-ils uniquement conduits par des salariés majeurs en possession du permis de conduire idoine ?", g: "Sécurité générale / HST" },
            { t: "Les clés des véhicules de service sont-elles retirées lorsque le conducteur quitte le véhicule ?", g: "Sécurité générale / HST" },
            { t: "L'avertissement concernant les interdictions de nager et/ou de pénétrer sur le lac / l'étang / la mare / le cours d'eau gelé est-il clairement affiché ?", r: "SP-01-11", g: "Sécurité générale / HST" },
            { t: "Le FE-03-20 a, c et le FE-03-20b sont-ils disponibles et actualisés pour chaque projet important ?", g: "Sécurité générale / HST" },
            { t: "Le SHE planning annuel est-il mis à jour ?", g: "Sécurité générale / HST" },
            { t: "La signalétique de sécurité des zones à risque est-elle conforme à la réglementation nationale et au système de management CP ?", g: "Sécurité générale / HST" },
            { t: "Le Red Book est-il mis à jour ?", g: "Sécurité générale / HST" },
            { t: "La liste des numéros de téléphone d'urgence du parc est-elle mise à jour ?", g: "Sécurité générale / HST" },
            { t: "Les 4 exercices Red Book (2 incendie, 1 sûreté, 1 environnement) interviennent-ils chaque année ? L'un d'entre eux est-il organisé avec les autorités publiques ?", g: "Sécurité générale / HST" },
            { t: "En cas d'évènement sanitaire contagieux, le parc dispose-t-il de suffisamment d'équipements de protection (masques, gants, gel hydroalcoolique…) pour une durée d'un mois minimum ?", g: "Sécurité générale / HST" },
          ]
        },
        {
          id: "she-poste",
          name: "SHE — Contrôle de conformité du poste de police (poste d'accueil et de sécurité)",
          questions: [
            { t: "Toutes les priorités 1 liées à la sûreté et au Guest Service sont-elles résolues dans le délai imparti ?", r: "FE-04-02 Security" },
            { t: "Une synthèse mensuelle des actes de malveillance est-elle réalisée et discutée en MT ?" },
            { t: "Le plan de gestion des clés et accès (badge, bracelet…) est-il à jour ?" },
            { t: "Les portes-clés sont-ils scellés ?" },
            { t: "Tous les mouvements des clés et moyens d'accès sont-ils enregistrés (entrées et sorties) ?" },
            { t: "Tous les passes partiels et généraux sont-ils stockés en toute sécurité (armoire fermée) ?" },
            { t: "La présence effective des passes, clés et portes-clés est-elle vérifiée quotidiennement (a minima tous les soirs) ? En cas de défaut, existe-t-il une instruction/consigne ?" },
            { t: "Les anomalies (trous, destructions…) détectées lors des rondes périphériques de la clôture autour du parc sont-elles traitées en priorité 1 ?" },
            { t: "Les passes, portes-clés et moyens d'accès généraux (badges, bracelets…) cottages sont-ils contrôlés mensuellement par le Guest Service ?" },
            { t: "Les droits DCJ (Salto, Onsite360…) et autre(s) système(s) de contrôle d'accès sont-ils vérifiés au moins 2 fois par an par le Manager SHE ou Floormanager Guest Service ?" },
            { t: "Est-ce que la vidéosurveillance est en conformité avec la législation nationale et le système de management de la sûreté CPE ?" },
            { t: "Existe-t-il un contrôle mensuel tracé de l'ensemble de la vidéosurveillance (écrans, enregistrement et caméras) ?" },
            { t: "Le bon fonctionnement des systèmes d'alarme (anti-intrusion, vidéoprotection, boutons d'appel d'urgence…) est-il testé trimestriellement, avec traçabilité ?" },
            { t: "Tous les visiteurs (fournisseurs, sous-traitants, livreurs, visiteurs professionnels…) sont-ils enregistrés et identifiés (badge…) ?" },
            { t: "Les contrôles du Guest Service (personnes, véhicules) sont-ils effectués régulièrement pour prévenir la fraude et les vols ?" },
            { t: "Tous les contrôles de fermeture (incendie) des départements sont-ils enregistrés ?" },
            { t: "Les anomalies relevées lors des rondes du Guest Service sont-elles signalées et communiquées au responsable du département ?" },
            { t: "Les radios présentes au poste d'accueil et de sécurité sont-ils fonctionnels et en nombre suffisant ?" },
            { t: "À l'arrivée les groupes sont-ils informés sur les règles du parc ?" },
            { t: "Les règles pour les transports de fonds internes sont-elles respectées ?" },
            { t: "L'approvisionnement du distributeur automatique de billets respecte-t-il la réglementation nationale et les règles CPE ?" },
            { t: "L'affichage des localisations des premiers secours est-il bien en place ?" },
            { t: "Existe-t-il une procédure de contrôle d'accès pour la banque, visée par les Managers Finance et SHE ?" },
            { t: "Les locaux sensibles (cave à eau, locaux stockage produits chimiques, salles serveurs, etc.) sont-ils inaccessibles aux personnes non autorisées ?" },
            { t: "Le plan d'urgence (5 plans d'intervention + 5 plans des ERP + 5 plans de chaque type de cottage) est-il toujours présent et actualisé au poste d'accueil et de sécurité et dans le Red Book ?" },
            { t: "Le kit d'urgence est-il complet et conforme au manuel guest service ?", r: "WSe 01-02/01-03" },
            { t: "Tous les agents et managers ont-ils les cartes professionnelles, qualifications et recyclages à jour, conformément à la réglementation nationale et règles internes CPE ?" },
            { t: "Les Guest Service et systèmes de sûreté (par ex. vidéoprotection) possèdent-ils les autorisations requises, conformément à la réglementation nationale ?" },
            { t: "Tous les employés du Guest Service ont-ils signé le code de déontologie ?", r: "MSe 02-02" },
            { t: "Tous les outils de travail définis dans GSe-01-02 sont-ils présents et adaptés aux risques du parc ?" },
            { t: "Le Guest Service dispose-t-il d'au moins un véhicule en permanence ?" },
            { t: "Guardtek est-il complètement déployé pour le Guest Service ?" },
            { t: "L'agent du Guest Service (ou de la réception) accueille-t-il/elle les visiteurs à l'extérieur du poste d'accueil et de sécurité ?" },
          ]
        },
      ]
    },

    /* ======================================================================
       3. MAINTENANCE — réorganisé :
          1) Suivi documentaire réglementaire (regroupé par item)
          2) Maintenance pure (installations techniques Pool)
          3) Contrôle de la ferme
          4) Contrôle des espaces verts et des aires de jeux
       ====================================================================== */
    {
      id: "maintenance",
      name: "Maintenance",
      icon: "🔧",
      sections: [
        {
          id: "maint-doc",
          name: "Suivi documentaire réglementaire (par item)",
          questions: [
            // -- Sécurité incendie / installations réglementées
            { t: "Toutes les priorités 1 liées à la sécurité incendie sont-elles résolues dans le délai imparti ?", r: "FE-04-02 Fire Safety", g: "Incendie / installations réglementées" },
            { t: "Tous les manuels, instructions techniques et plans relatifs à la sécurité incendie sont-ils disponibles et à jour ?", g: "Incendie / installations réglementées" },
            { t: "Le rapport annuel de nettoyage et d'entretien des hottes et des conduits est-il disponible (cuisines) ?", g: "Incendie / installations réglementées" },
            { t: "Le système d'alarme est-il inspecté conformément à la réglementation nationale en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Les ascenseurs sont-ils inspectés conformément à la réglementation nationale en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "L'éclairage de sécurité est-il inspecté conformément à la réglementation nationale en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Les installations de gaz sont-elles inspectées conformément à la réglementation nationale et au système de gestion des risques incendie CPE ?", g: "Incendie / installations réglementées" },
            { t: "Les installations électriques des hébergements (cottages, appartements, hôtel) sont-elles inspectées conformément à la réglementation en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Les installations de désenfumage sont-elles inspectées conformément à la réglementation nationale en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Les installations électriques des bâtiments centraux (y compris la thermographie) sont-elles inspectées conformément à la réglementation en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Les installations de chauffage, ventilation et climatisation des bâtiments centraux ont-elles été inspectées conformément à la réglementation en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Les cellules haute tension et les transformateurs sont-ils inspectés conformément à la réglementation nationale en vigueur ?", g: "Incendie / installations réglementées" },
            { t: "Le matériel de décoration intérieure est-il ignifugé conformément à la réglementation et/ou au système de gestion des risques incendie CPE ?", g: "Incendie / installations réglementées" },
            { t: "Les poteaux et bouches d'incendie sont-ils inspectés conformément à la réglementation et au système de gestion des risques incendie CPE ?", g: "Incendie / installations réglementées" },
            { t: "La (les) zone(s) de stockage des bouteilles de gaz (zone grillagée fermée) est-elle à plus de 10 mètres des bâtiments ?", g: "Incendie / installations réglementées" },
            { t: "Le(s) système(s) sprinkler est-il (sont-ils) inspecté(s) conformément à la GFi-11-01 (réservoir, têtes, tuyauterie…) ?", g: "Incendie / installations réglementées" },
            { t: "Toutes les inspections et maintenances obligatoires du système de sécurité incendie des ERP sont-elles réalisées conformément à la réglementation nationale ?", g: "Incendie / installations réglementées" },
            { t: "Les inspections obligatoires des détecteurs de fumée individuels (et CO le cas échéant) des hébergements sont-elles réalisées conformément à la réglementation et au WFi-07-01 ?", g: "Incendie / installations réglementées" },
            { t: "Le dossier technique amiante et l'inventaire sont-ils à jour ?", r: "DTA, FSa-01-19", g: "Incendie / installations réglementées" },
            { t: "La sécurité incendie des salles serveur (MER, SER) est-elle assurée conformément à la réglementation et au système de gestion des risques incendie CPE ?", g: "Incendie / installations réglementées" },
            { t: "Les boutons d'arrêt d'urgence et valves sont-ils signalés ? (électricité, gaz, eau…)", g: "Incendie / installations réglementées" },
            { t: "Les portes coupe-feu sont-elles inspectées conformément à la réglementation nationale ?", g: "Incendie / installations réglementées" },
            { t: "Tous les extincteurs du parc sont-ils inspectés conformément à la réglementation et au système de gestion des risques incendie CPE ?", r: "GFi", g: "Incendie / installations réglementées" },
            { t: "Tous les équipements sous pression sont-ils inspectés conformément à la réglementation et au système de gestion des risques incendie CPE ?", g: "Incendie / installations réglementées" },
            // -- Légionelle
            { t: "En cas d'anomalie sur les fiches de contrôles/cartes IPC1 Légionelle, les mesures correctives sont-elles mises en place et enregistrées ?", r: "FE-04-02 Légionelle", g: "Légionelle" },
            { t: "Est-ce que la production d'eau chaude est maintenue à plus de 55 °C en sortie de ballon ? (chaufferie collective)", g: "Légionelle" },
            { t: "Est-ce que la température en retour de boucle ECS est au minimum à 50 °C ? (chaufferie collective)", g: "Légionelle" },
            { t: "Toutes les instructions, manuels et plans des installations ECS et relatifs à la prévention de la Légionelle sont-ils disponibles et à jour ?", g: "Légionelle" },
            { t: "Est-ce que le Manager Maintenance contrôle tous les mois les fiches de contrôles/les cartes IPC1 concernant la prévention légionellose ? (signature)", g: "Légionelle" },
            { t: "Le permis réparation eau potable est-il utilisé dès que nécessaire ?", r: "FE-03-11", g: "Légionelle" },
            // -- RSE / Énergie / Déchets
            { t: "Les reportings Énergie et Déchets (Energy Monitor, Waste Monitor) sont-ils transmis mensuellement ?", g: "RSE / Énergie / Déchets" },
            { t: "Toutes les déviations liées à la gestion de l'énergie ou à la gestion des déchets sont-elles renseignées dans la FE-04-02 ?", g: "RSE / Énergie / Déchets" },
            { t: "Le coordinateur énergie pilote-t-il le programme de réduction des consommations d'énergie du parc ? (plan de sobriété énergétique)", g: "RSE / Énergie / Déchets" },
            { t: "Avez-vous établi un plan d'actions détaillé et quantifié afin d'atteindre les objectifs CSR pour 2025 ?", g: "RSE / Énergie / Déchets" },
            { t: "Avez-vous établi un plan d'actions détaillé et quantifié afin d'atteindre les objectifs CSR pour 2030 ?", g: "RSE / Énergie / Déchets" },
            // -- Sécurité générale / formations / IPC1
            { t: "Tous les formations, diplômes, autorisations des employés concernant l'utilisation des véhicules, machines, équipements, EPI… sont-ils réalisés et enregistrés ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Les employés sont-ils formés et reçoivent-ils les instructions appropriées au travail en hauteur ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Tous les manuels, instructions techniques et plans relatifs aux bâtiments centraux (ERP) et cottages sont-ils disponibles et à jour ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Les EPI, EPC (harnais, lignes de vie…) et outils pour le travail en hauteur sont-ils contrôlés conformément à la réglementation nationale en vigueur ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Tous les employés concernés possèdent-ils l'(les) habilitation(s) électrique(s) adéquate(s), conformément à la réglementation et au manuel des formations obligatoires CPE ?", g: "Sécurité générale / formations / IPC1" },
            { t: "La détection de gaz est-elle vérifiée et maintenue périodiquement conformément à la réglementation en vigueur ?", g: "Sécurité générale / formations / IPC1" },
            { t: "La détection de CO2 est-elle vérifiée et maintenue périodiquement conformément à la réglementation en vigueur ?", g: "Sécurité générale / formations / IPC1" },
            { t: "L'accessibilité du parc pour les personnes en situation de handicap (extérieur, ERP, cottages…) est-elle conforme à la réglementation nationale en vigueur ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Toutes les cartes IPC1 sont-elles planifiées en conformité avec les équipements existants, la réglementation nationale et les systèmes de management CPE ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Est-ce que toutes les cartes IPC1 sont exécutées conformément à la planification ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Les bons Levy liés à la Sécurité sont-ils traités en priorité et résolus dans les temps ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Conformément à l'instruction Wsa-01-17, le contrôle des éléments décoratifs suspendus est-il réalisé annuellement (bureau de contrôle si > 50 kg, en interne si < 50 kg) ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Avez-vous un inventaire et un plan à jour des décorations installées dans le Market Dôme, l'Aqua Mundo et les autres ERP ?", g: "Sécurité générale / formations / IPC1" },
            { t: "Est-ce que la signalétique du lac ou des points d'eau est présente ? (interdiction de nager et de patiner en hiver)", g: "Sécurité générale / formations / IPC1" },
            { t: "Le dossier technique amiante de votre parc est-il complet et à jour, en conformité avec la réglementation nationale en vigueur ? (si concerné)", g: "Sécurité générale / formations / IPC1" },
            { t: "Dans les laveries, les dispositifs de sécurité des machines sont-ils contrôlés, le registre est-il tenu à jour et les avertissements affichés ?", g: "Sécurité générale / formations / IPC1" },
            { t: "En cas de co-activité, un plan de prévention est-il mis en place avec l'(les) entreprise(s) extérieure(s) ? Des protocoles de sécurité sont-ils établis avec les transporteurs livrant sur site ?", g: "Sécurité générale / formations / IPC1" },
            // -- Nuisibles
            { t: "Y a-t-il un suivi régulier (a minima trimestriel) avec notre partenaire, associé à un plan d'action, concernant la lutte contre les nuisibles ?", g: "Lutte contre les nuisibles" },
          ]
        },
        {
          id: "maint-pure",
          name: "Maintenance pure (installations techniques Pool)",
          questions: [
            { t: "L'inspection annuelle des toboggans et autres attractions de la piscine (par un bureau de contrôle) est-elle réalisée ?" },
            { t: "Les installations de traitement d'air de la piscine sont-elles en parfait état de fonctionnement ?" },
            { t: "Les installations de traitement d'eau de la piscine sont-elles en parfait état de fonctionnement ?" },
            { t: "Tous les manuels, instructions techniques et plans relatifs à la piscine sont-ils disponibles et à jour ?" },
            { t: "Les rapports AVS pour la piscine sont-ils pris en compte et intégrés dans la FE-04-02 Pool ?" },
            { t: "Toutes les cartes IPC1 de l'Aqua Mundo sont-elles planifiées, puis exécutées, conformément au SP-03-21 ?" },
          ]
        },
        {
          id: "maint-ferme",
          name: "Contrôle de la ferme",
          questions: [
            { t: "À l'entrée de la mini-ferme, des instructions claires sont-elles affichées concernant les règles d'hygiène applicables aux visiteurs (interdictions de fumer et d'introduction de nourriture, lavage des mains, horaires d'ouverture…) ?" },
            { t: "Les animaux sont-ils en bonne santé (pas de signes cliniques sortant de l'ordinaire, irritations, dépression, anorexie, boiterie, écoulements, toux, éternuements…) ?" },
            { t: "Les checklists (quotidiennes, hebdomadaires, mensuelles et annuelles) sont-elles présentes ?" },
            { t: "Les animaux ont-ils de l'eau et du foin à volonté ?" },
            { t: "Les animaux malades sont-ils a minima isolés (hors de la vue des clients) ou sortis du parc ?" },
            { t: "Le mode de conservation des cadavres en attendant l'équarisseur est-il pratique et adapté (congélateur de taille adaptée, hors de la vue des clients…) ?" },
            { t: "Les animaux ont-ils bénéficié d'un examen clinique général annuel de contrôle, réalisé par un vétérinaire ?" },
            { t: "La traçabilité des évènements sanitaires et zootechniques est-elle satisfaisante ?" },
            { t: "La vaccination des animaux de la (mini-)ferme est-elle à jour ?" },
            { t: "La prophylaxie des animaux de la ferme (introduction, tests périodiques) est-elle réalisée par un vétérinaire sanitaire et concerne-t-elle les maladies réglementées (brucellose par exemple) ?" },
          ]
        },
        {
          id: "maint-espacesverts",
          name: "Contrôle des espaces verts et des aires de jeux",
          questions: [
            // -- Aires de jeux
            { t: "Toutes les priorités 1 liées à la sécurité des aires de jeux sont-elles résolues dans le délai imparti ?", r: "FE-04-02 Playground", g: "Aires de jeux" },
            { t: "Les contrôles quotidiens/hebdomadaires et mensuels sont-ils entièrement exécutés (y compris les mesures préventives et correctives détaillées en priorité, en cas d'écart) ?", g: "Aires de jeux" },
            { t: "Un dossier de base pour chaque aire de jeux est-il complet et disponible avec photos ? (instructions de montage/entretien, manuel utilisateur, plans, certificats de conformité…)", g: "Aires de jeux" },
            { t: "Existe-t-il un journal de bord (plan de maintenance et d'entretien des équipements) pour chaque aire de jeux ?", g: "Aires de jeux" },
            { t: "Y a-t-il une inspection annuelle de chaque aire de jeux et élément de jeu, y compris un rapport ?", g: "Aires de jeux" },
            { t: "La résolution des anomalies est-elle tracée/documentée ?", g: "Aires de jeux" },
            // -- Espaces verts
            { t: "Arbres à risque intérieur : les câbles acier et élingues pour les arbres tropicaux dans l'Aqua Mundo, le Market Dome (et autres bâtiments centraux) sont-ils vérifiés au moins 2 fois par an, avec traçabilité ?", g: "Espaces verts" },
            { t: "Arbres à risque extérieur : le parc possède-t-il un inventaire des arbres à risque mis à jour ces 3 dernières années ?", g: "Espaces verts" },
            { t: "Arbres à risque extérieur : les actions préventives sur les arbres à risque (élagage, coupe, inventorisation…) sont-elles prises en cours de l'année ?", g: "Espaces verts" },
            { t: "Tous les produits phytosanitaires et biocides sont-ils stockés conformément à la réglementation nationale en vigueur ?", g: "Espaces verts" },
            { t: "Y a-t-il un contrat pour le traitement anti-nuisible des bâtiments centraux, suivi par un journal de bord actualisé ?", g: "Espaces verts" },
            { t: "Les employés concernés sont-ils formés à l'utilisation des produits et équipements phytosanitaires et biocides conformément à la réglementation nationale ? (CertiPhyto, Certibiocide)", g: "Espaces verts" },
          ]
        },
      ]
    },

    /* ======================================================================
       4. RH — pas de changement
       ====================================================================== */
    {
      id: "rh",
      name: "RH",
      icon: "🧑‍🤝‍🧑",
      sections: [
        {
          id: "rh-fire",
          name: "Fire",
          questions: [
            { t: "Les employés intervenant sur le sprinkler (par ex. IPC1) sont-ils formés ?" },
            { t: "Existe-t-il un Responsable Unique de Sécurité formé et nommé par le GM ?" },
            { t: "Des secouristes (SST, PSC1, PSE1, PSE2) sont-ils présents dans chaque service, conformément à la réglementation nationale ?" },
          ]
        },
        {
          id: "rh-safety",
          name: "Safety",
          questions: [
            { t: "Tous les employés possèdent-ils les diplômes et recyclages appropriés, conformément au manuel des formations obligatoires ?" },
            { t: "Tous les nouveaux employés ont-ils reçu leur introduction SHE & CSR au cours des 6 premières semaines ?" },
            { t: "Tous les incidents et accidents de travail sont-ils enregistrés et transmis conformément à la réglementation nationale en vigueur ?" },
            { t: "Le(s) responsable(s) des installations électriques est-il (sont-ils) formé(s) et désigné(s) par le GM ?" },
            { t: "Le responsable réseau d'eau et prévention Légionellose est-il formé et désigné par le GM ?" },
            { t: "Tous les employés conduisant un véhicule de service motorisé sont-ils majeurs et en possession d'un permis de conduire adéquat ?" },
            { t: "La vérification des antécédents de chaque employé en contact avec des enfants et/ou de l'argent est-elle vérifiée avec traçabilité, à l'embauche puis annuellement ? (extrait de casier judiciaire — bulletin n°3)" },
          ]
        },
      ]
    },

    /* ======================================================================
       5. OPÉRATIONS — réorganisé : Activités payantes / Bike Center
       ====================================================================== */
    {
      id: "operations",
      name: "Opérations",
      icon: "🎡",
      sections: [
        {
          id: "ops-activites",
          name: "Contrôle des activités payantes",
          questions: [
            { t: "Est-ce que toutes les priorités 1 liées au Leisure/Operations sont résolues dans le délai imparti ?", r: "FE-04-02 Leisure/operations" },
            { t: "Une analyse des risques a-t-elle été effectuée pour chaque activité ? (CP/SP et partenaires)" },
            { t: "Tous les employés permanents sont-ils en possession d'un diplôme de premier secours valide ? (CP/SP et partenaires)" },
            { t: "Tous les employés ont-ils les diplômes et certificats requis, ainsi que les recyclages, conformément à la réglementation du pays ? (CP/SP et partenaires)" },
            { t: "Y a-t-il une trousse de premiers soins à chaque lieu d'activité ? (CP/SP et partenaires)" },
            { t: "Tous les équipements de sécurité et de protection sont-ils à la disposition des clients conformément à la réglementation ? (CP/SP et partenaires)" },
            { t: "Les contrôles de sécurité réguliers sont-ils entièrement réalisés et documentés (matériel, EPI, contrôles d'ouverture et de fermeture…) ? (CP/SP et partenaires)" },
            { t: "Existe-t-il une inspection annuelle pour chaque installation ou équipement conformément à la réglementation, incluant un rapport ? (CP/SP et partenaires)" },
            { t: "Existe-t-il un plan de sécurité et/ou de secours pour les activités à haut et moyen risque (par ex. POSS pour l'accrobranche) ? (CP/SP et partenaires)" },
            { t: "Les incidents et accidents sont-ils enregistrés, suivis et analysés au moins une fois par an ? (CP/SP et partenaires)" },
            { t: "Existe-t-il un plan d'évacuation et des consignes d'évacuation spécifiques au Kids Club ?" },
            { t: "Pour les activités liées à l'alimentation : les règles HACCP sont-elles respectées conformément à l'e-learning suivi, au manuel, et à la réglementation ?" },
            { t: "Le contrôle de sécurité FSa-04-01 a-t-il lieu deux fois par an entre CP et le partenaire ?" },
          ]
        },
        {
          id: "ops-bikecenter",
          name: "Contrôle du Bike Center",
          questions: [
            { t: "Y a-t-il une vérification annuelle, avec traçabilité, de tous les vélos et véhicules loués au Cycle Center ?" },
            { t: "Existe-t-il une instruction claire fournie par le personnel lors de la location de véhicules aux clients (incluant les règles de sécurité) ?" },
            { t: "Les batteries sont-elles chargées uniquement en présence de personnel ? (sinon, la charge est réalisée dans une armoire dédiée anti-feu)" },
            { t: "Au moins deux employés du Cycle Center ont-ils terminé la formation sur la manipulation des batteries au lithium ?" },
          ]
        },
      ]
    },

    /* ======================================================================
       6. RESTAURATION — deux audits distincts :
          A) Restauration externalisée AREAS
          B) Contrôle de conformité alimentaire — restauration interne
       ====================================================================== */
    {
      id: "restauration",
      name: "Restauration",
      icon: "🍽️",
      sections: [
        {
          id: "resto-areas",
          name: "AREAS — Restauration externalisée",
          questions: [
            { t: "Les priorités 1 HACCP sont-elles toutes résolues dans le délai imparti ? (CP et/ou partenaire)" },
            { t: "Le personnel de restauration a-t-il suivi toutes les formations obligatoires SHE et HACCP, avec traçabilité ?" },
            { t: "Les affichages obligatoires sont-ils présents conformément à la réglementation nationale ? (interdiction vente d'alcool aux mineurs, inspections, licence IV…)" },
            { t: "Dans les locaux sprinklés (ligne rouge) : les hauteurs maximales de stockage sont-elles respectées dans les chambres froides (25 cm) et pièces tempérées (60 cm) ?" },
            { t: "Est-ce que les filtres des hottes et autres pièces du système de ventilation sont régulièrement nettoyés (filtres hebdomadairement, conduits au minimum une fois par an) ?" },
            { t: "Le tri et le stockage des déchets sont-ils conformes à la réglementation nationale (et standards CPE) ?" },
            { t: "Les produits dangereux sont-ils stockés et utilisés conformément à la réglementation nationale ?" },
            { t: "Le stockage et l'évacuation des huiles et graisses sont-ils conformes à la réglementation nationale ?" },
            { t: "Les analyses (aliment, surface, eau potable) sont-elles effectuées conformément à la réglementation nationale ?" },
            { t: "La procédure « toxi-infection alimentaire collective » est-elle en place, connue et partagée avec Center Parcs ?" },
            { t: "Le SHE Matters est-il mis en place et suivi quotidiennement ? (minimum hebdomadaire)" },
            { t: "Le système de management de la sécurité des aliments (HACCP) est-il présenté, discuté régulièrement (a minima lors de Risk Committee) et suivi entre CP et le partenaire ?", r: "FE-04-02 / FE-04-03" },
            { t: "La vérification de la charte CSR est-elle réalisée 1 fois par an, incluant un plan d'action, entre CP et le partenaire ?", r: "FE-06-01" },
            { t: "Les véhicules de service à moteur sont-ils uniquement conduits par des salariés majeurs en possession du permis de conduire idoine ?" },
          ]
        },
        {
          id: "resto-interne",
          name: "Restauration interne — Contrôle de conformité alimentaire",
          questions: [
            // -- Documentation / traçabilité HACCP
            { t: "Le plan de maîtrise sanitaire (PMS) et le plan HACCP sont-ils disponibles, à jour et adaptés aux activités réellement exercées sur le point de vente ?", g: "Documentation & traçabilité HACCP" },
            { t: "Les autocontrôles obligatoires (températures, DLC, étiquetage, échantillothèque le cas échéant) sont-ils enregistrés selon la fréquence définie par le PMS ?", g: "Documentation & traçabilité HACCP" },
            { t: "Le personnel affecté à la restauration a-t-il suivi une formation HACCP/hygiène alimentaire, avec attestation et traçabilité individuelle ?", g: "Documentation & traçabilité HACCP" },
            { t: "Le classeur/registre de traçabilité (fiches de non-conformité, actions correctives, relevés) est-il tenu à jour et disponible sur le point de vente ?", g: "Documentation & traçabilité HACCP" },
            { t: "Les résultats des analyses microbiologiques (labo externe) sont-ils exploités avec plan d'action en cas de non-conformité ?", g: "Documentation & traçabilité HACCP" },
            // -- Réception et stockage
            { t: "Un contrôle à réception est-il réalisé et enregistré (température, DLC/DLUO, intégrité des emballages, conformité du bon de livraison) ?", g: "Réception & stockage" },
            { t: "La règle du premier entré/premier sorti (FIFO/FEFO) est-elle appliquée et vérifiable dans les stockages secs et frais ?", g: "Réception & stockage" },
            { t: "Les produits sont-ils étiquetés avec DLC/DLUO à l'ouverture ou au déconditionnement, et aucun produit périmé n'est-il présent en zone de stockage ou de production ?", g: "Réception & stockage" },
            { t: "La séparation des denrées (crues/cuites, allergènes, produits chimiques/alimentaires) est-elle respectée dans tous les espaces de stockage ?", g: "Réception & stockage" },
            { t: "Les zones et matériels de stockage sont-ils propres, en bon état, et exempts de traces de nuisibles ?", g: "Réception & stockage" },
            // -- Chaîne du froid et cuisson
            { t: "Les températures des enceintes froides (positives et négatives) sont-elles relevées au minimum 2 fois par jour et enregistrées, avec alerte en cas de dépassement ?", g: "Chaîne du froid & cuisson" },
            { t: "Les sondes de température utilisées sont-elles étalonnées/vérifiées périodiquement, avec traçabilité ?", g: "Chaîne du froid & cuisson" },
            { t: "Les températures de cuisson, de refroidissement rapide et de remise en température sont-elles contrôlées et enregistrées conformément au plan HACCP ?", g: "Chaîne du froid & cuisson" },
            { t: "En cas de rupture de la chaîne du froid, une procédure de gestion des produits est-elle appliquée et tracée (destruction, dérogation…) ?", g: "Chaîne du froid & cuisson" },
            // -- Hygiène du personnel
            { t: "Le personnel porte-t-il une tenue de travail propre, adaptée et dédiée (coiffe, chaussures de sécurité...) ?", g: "Hygiène du personnel" },
            { t: "Les postes de lavage des mains sont-ils accessibles, approvisionnés (savon, essuie-mains à usage unique) et utilisés aux points critiques ?", g: "Hygiène du personnel" },
            { t: "La procédure de gestion du personnel malade, porteur de plaies ou symptomatique (éviction, protection) est-elle connue et appliquée ?", g: "Hygiène du personnel" },
            { t: "Le port de bijoux, montres et vernis est-il proscrit en zone de production conformément aux règles internes ?", g: "Hygiène du personnel" },
            // -- Nettoyage et désinfection
            { t: "Le plan de nettoyage et désinfection (fréquence, produits, dilution, mode opératoire) est-il affiché et respecté pour chaque zone/équipement ?", g: "Nettoyage & désinfection" },
            { t: "Les opérations de nettoyage sont-elles tracées quotidiennement (registre ou checklist signée) ?", g: "Nettoyage & désinfection" },
            { t: "Les produits de nettoyage utilisés sont-ils conformes (usage alimentaire), correctement stockés et séparés des denrées ?", g: "Nettoyage & désinfection" },
            { t: "Des autocontrôles de surface (type ATP ou boîtes contact) sont-ils réalisés périodiquement pour vérifier l'efficacité du nettoyage ?", g: "Nettoyage & désinfection" },
            // -- Allergènes
            { t: "L'information sur les 14 allergènes majeurs est-elle disponible, à jour et facilement accessible à la clientèle pour chaque recette/produit ?", g: "Allergènes" },
            { t: "Une procédure de prévention des contaminations croisées allergènes est-elle en place (matériel dédié, ordre de production, nettoyage renforcé) ?", g: "Allergènes" },
            { t: "Les fiches techniques/recettes intégrant les allergènes sont-elles tenues à jour en cas de changement de fournisseur ou de recette ?", g: "Allergènes" },
            // -- Lutte contre les nuisibles
            { t: "Un contrat de lutte contre les nuisibles est-il en place avec plan d'implantation des appâts/pièges et suivi des passages ?", g: "Lutte contre les nuisibles" },
            { t: "Les rapports d'intervention sont-ils exploités avec mise en place d'actions correctives en cas de détection ?", g: "Lutte contre les nuisibles" },
            { t: "Les ouvertures (portes, quais de livraison, aérations) sont-elles protégées contre l'intrusion de nuisibles (bandes, rideaux, grilles) ?", g: "Lutte contre les nuisibles" },
            // -- Gestion des non-conformités et retrait/rappel
            { t: "Une procédure de gestion des produits non conformes (blocage, isolement, destruction) est-elle connue et appliquée ?", g: "Non-conformités & retrait/rappel" },
            { t: "La procédure retrait/rappel (RASFF/alertes) est-elle connue de l'équipe et testée/simulée périodiquement ?", g: "Non-conformités & retrait/rappel" },
            { t: "La procédure « toxi-infection alimentaire collective » est-elle affichée, connue de l'équipe et partagée avec le référent SHE du parc ?", g: "Non-conformités & retrait/rappel" },
            // -- Déchets et huiles
            { t: "Le tri et le stockage des déchets alimentaires sont-ils conformes à la réglementation (bacs fermés, zone dédiée, fréquence d'évacuation) ?", g: "Déchets & huiles" },
            { t: "Le stockage et l'évacuation des huiles et graisses usagées sont-ils conformes (bac de rétention propre, contrat de collecte à jour) ?", g: "Déchets & huiles" },
            // -- Affichage réglementaire
            { t: "Les affichages obligatoires sont-ils présents et à jour (origine des viandes, interdiction de vente d'alcool aux mineurs, non-fumeur, résultats derniers contrôles officiels) ?", g: "Affichage réglementaire" },
          ]
        },
      ]
    },

    /* ======================================================================
       7. CLEANING — réorganisé : Traçabilité / Contrôles terrain
       ====================================================================== */
    {
      id: "cleaning",
      name: "Cleaning",
      icon: "🧹",
      sections: [
        {
          id: "clean-tracabilite",
          name: "Contrôles de traçabilité",
          questions: [
            { t: "Tous les employés cleaning de la piscine ont-ils suivi le e-learning dédié (nettoyage piscine) ?" },
            { t: "La (les) formation(s) des employés cleaning sur l'utilisation de leurs machines (autolaveuse, mono-brosse…) et équipements (EPI) est-elle (sont-elles) réalisée(s) et enregistrée(s) ?" },
            { t: "Existe-t-il une traçabilité pour la remise des moyens d'accès (clés, porte-clés, badges…) aux employés du cleaning ?" },
          ]
        },
        {
          id: "clean-terrain",
          name: "Contrôles terrain",
          questions: [
            { t: "La qualité des sols (et analyses afférentes) est-elle suivie et discutée mensuellement avec le (SHE&)Pool Manager ?" },
            { t: "Les produits dangereux sont-ils stockés et utilisés conformément à la réglementation en vigueur (et procédures CPE) ?" },
            { t: "Si besoin, les employés concernés sont-ils formés au travail en hauteur ?" },
            { t: "Les sèche-linge sont-ils éteints la nuit et sans linge sec à l'intérieur ?" },
            { t: "Les produits de nettoyage (et si demandé matériels et méthodes) sont-ils conformes aux critères Clé Verte ?" },
          ]
        },
      ]
    },

  ]
};
