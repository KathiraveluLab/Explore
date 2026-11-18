import { PORTUGAL_PLACES, TRANSIT_ROUTES, TRANSPORT_MODES } from './data.js';
import {
  ExploreGameEngine,
  MIN_EXCHANGE_RATE,
  MAX_EXCHANGE_RATE,
  QUIZ_BONUS_POINTS,
  formatHour,
  getPlaceById
} from './engine.js';

const CAMERA_PRESETS = {
  mainland: { coords: [39.6, -8.15], zoom: 7 },
  lisbon: { coords: [38.73, -9.23], zoom: 11 },
  porto: { coords: [41.15, -8.6], zoom: 12 },
  madeira: { coords: [32.67, -16.92], zoom: 10 },
  azores: { coords: [37.74, -25.67], zoom: 10 }
};

function escapeHtml(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const engine = new ExploreGameEngine('lisboa-oriente');
let activeTab = 'transit';
let quizFeedback = null;
let mapInstance = null;
let routeLayerGroup = null;
let markerLayerGroup = null;

const dom = {
  euros: document.getElementById('hud-euros'),
  points: document.getElementById('hud-points'),
  rate: document.getElementById('hud-rate'),
  trend: document.getElementById('hud-trend'),
  clock: document.getElementById('hud-clock'),
  cycle: document.getElementById('hud-cycle'),
  explored: document.getElementById('hud-explored'),
  currentBanner: document.getElementById('current-location-banner'),
  mapContainer: document.getElementById('map'),
  mapLegend: document.getElementById('map-legend'),
  dossier: document.getElementById('place-dossier'),
  statusBanner: document.getElementById('status-banner'),
  nightAlert: document.getElementById('night-alert'),
  routeCountBadge: document.getElementById('route-count-badge'),
  routesList: document.getElementById('routes-list'),
  hotelCityBadge: document.getElementById('hotel-city-badge'),
  hotelsList: document.getElementById('hotels-list'),
  exchangeRateBadge: document.getElementById('exchange-rate-badge'),
  sparklineRange: document.getElementById('sparkline-range'),
  exchangeSparkline: document.getElementById('exchange-sparkline'),
  exchangePreview: document.getElementById('exchange-preview'),
  exchangeForm: document.getElementById('exchange-form'),
  exchangeInput: document.getElementById('exchange-input'),
  phraseCountBadge: document.getElementById('phrase-count-badge'),
  exploredList: document.getElementById('explored-list'),
  phrasebookList: document.getElementById('phrasebook-list'),
  travelLogList: document.getElementById('travel-log-list'),
  gameoverModal: document.getElementById('gameover-modal'),
  gameoverReason: document.getElementById('gameover-reason'),
  gameoverSummary: document.getElementById('gameover-summary'),
  btnReset: document.getElementById('btn-reset'),
  btnPlayAgain: document.getElementById('btn-play-again')
};

function setStatus(message, isError = false) {
  dom.statusBanner.textContent = message;
  dom.statusBanner.classList.toggle('error', isError);
}

function setActiveTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${tabName}`);
  });
}

function initMap() {
  if (typeof window.L === 'undefined') {
    dom.mapContainer.innerHTML =
      '<div class="map-fallback"><h3>OpenStreetMap Offline Preview</h3><p>Leaflet library could not load in this environment. You can still play the full Portugal simulation using the transit departures, hotel check-in, point exchange, and cultural dossier panels.</p></div>';
    return;
  }

  mapInstance = window.L.map('map', {
    center: CAMERA_PRESETS.mainland.coords,
    zoom: CAMERA_PRESETS.mainland.zoom,
    minZoom: 5,
    maxZoom: 16
  });

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance);

  routeLayerGroup = window.L.layerGroup().addTo(mapInstance);
  markerLayerGroup = window.L.layerGroup().addTo(mapInstance);
}

function renderMapOverlay() {
  if (!mapInstance || !routeLayerGroup || !markerLayerGroup) return;

  const state = engine.getState();
  const outboundRoutes = engine.getAvailableRoutes();
  const outboundMap = new Map();
  for (const r of outboundRoutes) {
    if (!outboundMap.has(r.destinationId)) {
      outboundMap.set(r.destinationId, []);
    }
    outboundMap.get(r.destinationId).push(r);
  }

  routeLayerGroup.clearLayers();
  markerLayerGroup.clearLayers();

  for (const route of TRANSIT_ROUTES) {
    const fromPlace = getPlaceById(route.from);
    const toPlace = getPlaceById(route.to);
    if (!fromPlace || !toPlace) continue;

    const modeMeta = TRANSPORT_MODES[route.mode];
    const isOutbound =
      route.from === state.currentPlaceId || route.to === state.currentPlaceId;

    const polyline = window.L.polyline([fromPlace.coords, toPlace.coords], {
      color: modeMeta ? modeMeta.color : '#1b4d89',
      weight: isOutbound ? 4 : 2,
      opacity: isOutbound ? 0.92 : 0.28,
      dashArray: modeMeta && modeMeta.dashArray ? modeMeta.dashArray : null
    });

    polyline.bindPopup(
      `<strong>${escapeHtml(modeMeta?.badge || route.mode)} ${escapeHtml(route.serviceName)}</strong><br>` +
        `${escapeHtml(fromPlace.name)} &lt;-&gt; ${escapeHtml(toPlace.name)}<br>` +
        `Operator: ${escapeHtml(route.operator)}<br>` +
        `Cost: ${route.costEur} EUR | Duration: ${route.durationHours}h`
    );

    polyline.addTo(routeLayerGroup);
  }

  for (const place of PORTUGAL_PLACES) {
    const isCurrent = place.id === state.currentPlaceId;
    const isExplored = state.exploredPlaces.some((p) => p.id === place.id);

    let pinClass = 'explore-marker-unexplored';
    let size = 14;
    if (isCurrent) {
      pinClass = 'explore-marker-current';
      size = 18;
    } else if (isExplored) {
      pinClass = 'explore-marker-explored';
      size = 15;
    }

    const icon = window.L.divIcon({
      className: `explore-marker-pin ${pinClass}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });

    const marker = window.L.marker(place.coords, { icon });
    const directRoutes = outboundMap.get(place.id) || [];

    let routeLinksHtml = '';
    if (isCurrent) {
      routeLinksHtml = '<br><em>You are currently here.</em>';
    } else if (directRoutes.length > 0) {
      routeLinksHtml =
        '<div style="margin-top:6px;display:flex;flex-direction:column;gap:4px;">' +
        directRoutes
          .map((r) => {
            const disabledAttr = r.canBoard ? '' : 'disabled';
            const modeLabel = TRANSPORT_MODES[r.mode]?.badge || r.mode;
            return `<button type="button" class="btn btn-sm btn-primary popup-board-btn" data-route-id="${escapeHtml(r.id)}" data-direction="${escapeHtml(r.direction)}" ${disabledAttr}>${escapeHtml(modeLabel)} ${escapeHtml(r.serviceName)} (${r.costEur} EUR)</button>`;
          })
          .join('') +
        '</div>';
    } else {
      routeLinksHtml = '<br><small>Connect via intermediate hubs on the transit network.</small>';
    }

    const statusText = isCurrent
      ? 'Current Location'
      : isExplored
        ? 'Explored'
        : `Unexplored (+${place.discoveryPoints} pts)`;

    marker.bindPopup(
      `<strong>${escapeHtml(place.name)}</strong><br>` +
        `<small>${escapeHtml(place.region)} - ${escapeHtml(statusText)}</small><br>` +
        `<span>${escapeHtml(place.summary)}</span>` +
        routeLinksHtml
    );

    marker.on('popupopen', (evt) => {
      const popupEl = evt.popup.getElement();
      if (!popupEl) return;
      popupEl.querySelectorAll('.popup-board-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          handleBoardRoute(btn.dataset.routeId, btn.dataset.direction);
          marker.closePopup();
        });
      });
    });

    marker.addTo(markerLayerGroup);
  }
}

function renderLegend() {
  const modeItems = Object.values(TRANSPORT_MODES)
    .map(
      (mode) =>
        `<span class="legend-item"><span class="legend-line" style="background:${mode.color};"></span>${escapeHtml(mode.label)}</span>`
    )
    .join('');

  const nodeItems = `
    <span class="legend-item"><span class="legend-dot" style="background:#d97706;"></span>Current Location</span>
    <span class="legend-item"><span class="legend-dot" style="background:#13795b;"></span>Explored</span>
    <span class="legend-item"><span class="legend-dot" style="background:#1b4d89;"></span>Unexplored</span>
  `;

  dom.mapLegend.innerHTML = modeItems + nodeItems;
}

function renderHud() {
  const state = engine.getState();
  const currentPlace = engine.getCurrentPlace();

  dom.euros.textContent = `${state.euros.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} EUR`;
  dom.points.textContent = `${state.points.toLocaleString('en-US')} PTS`;
  dom.rate.textContent = `${state.exchangeRate.toFixed(2)} EUR/PT`;

  const deltaSign = state.lastRateDelta > 0 ? '+' : '';
  dom.trend.textContent =
    state.lastRateDelta === 0
      ? state.lastRateTrend
      : `${state.lastRateTrend} (${deltaSign}${state.lastRateDelta.toFixed(2)})`;
  dom.trend.className = 'trend-pill';
  if (state.lastRateTrend === 'UP') dom.trend.classList.add('trend-up');
  else if (state.lastRateTrend === 'DOWN') dom.trend.classList.add('trend-down');
  else dom.trend.classList.add('trend-steady');

  dom.clock.textContent = `Day ${state.day} - ${formatHour(state.hour)}`;
  dom.cycle.textContent = state.isNight ? 'NIGHTFALL (HOTEL)' : 'DAYTIME';
  dom.cycle.className = `cycle-pill ${state.isNight ? 'cycle-night' : 'cycle-day'}`;

  dom.explored.textContent = `${state.exploredPlaces.length} / ${PORTUGAL_PLACES.length}`;
  dom.currentBanner.textContent = `Current Station: ${currentPlace.name} (${currentPlace.region})`;
  dom.nightAlert.classList.toggle('hidden', !state.isNight || state.gameOver);
}

function renderDossier() {
  const state = engine.getState();
  const place = engine.getCurrentPlace();
  const quizCompleted = state.completedQuizzes.includes(place.id);

  let quizSectionHtml = '';
  if (place.quiz) {
    const optionsHtml = place.quiz.options
      .map(
        (opt, idx) =>
          `<button type="button" class="quiz-option-btn" data-quiz-idx="${idx}" ${
            quizCompleted || state.gameOver ? 'disabled' : ''
          }>${idx + 1}. ${escapeHtml(opt)}</button>`
      )
      .join('');

    let feedbackHtml = '';
    if (quizCompleted) {
      feedbackHtml = `<div class="quiz-feedback correct">Completed (+${QUIZ_BONUS_POINTS} pts earned): ${escapeHtml(place.quiz.explanation)}</div>`;
    } else if (quizFeedback && quizFeedback.placeId === place.id) {
      feedbackHtml = `<div class="quiz-feedback ${quizFeedback.correct ? 'correct' : 'wrong'}">${escapeHtml(quizFeedback.message)}</div>`;
    }

    quizSectionHtml = `
      <div class="quiz-box">
        <strong>Cultural Knowledge Check (+${QUIZ_BONUS_POINTS} Bonus Points)</strong>
        <p style="margin:6px 0 0;font-size:0.9rem;">${escapeHtml(place.quiz.question)}</p>
        <div class="quiz-options">${optionsHtml}</div>
        ${feedbackHtml}
      </div>
    `;
  }

  dom.dossier.innerHTML = `
    <div class="dossier-header">
      <div>
        <span class="region-tag">${escapeHtml(place.region)}</span>
        <h2>${escapeHtml(place.name)}</h2>
      </div>
      <span class="badge-muted">${quizCompleted ? 'Quiz Mastered' : 'Active Destination'}</span>
    </div>
    <p>${escapeHtml(place.summary)}</p>
    <div class="dossier-grid">
      <div class="info-box">
        <h4>History &amp; Culture</h4>
        <p style="margin:0;">${escapeHtml(place.historyAndCulture)}</p>
      </div>
      <div class="info-box">
        <h4>Public Transit Spotlight</h4>
        <p style="margin:0;">${escapeHtml(place.transitSpotlight)}</p>
      </div>
    </div>
    <div class="phrase-box">
      <div class="region-tag" style="color:var(--azulejo);">PORTUGUESE PHRASE IN CONTEXT - ${escapeHtml(place.localPhrase.context)}</div>
      <div class="phrase-pt">"${escapeHtml(place.localPhrase.pt)}"</div>
      <div class="phrase-pronunciation">Pronunciation: ${escapeHtml(place.localPhrase.pronunciation)}</div>
      <div class="phrase-en">English: ${escapeHtml(place.localPhrase.en)}</div>
    </div>
    ${quizSectionHtml}
  `;

  dom.dossier.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.quizIdx);
      const result = engine.answerQuiz(place.id, idx);
      if (!result.ok) {
        setStatus(result.error, true);
        return;
      }
      if (result.correct) {
        quizFeedback = {
          placeId: place.id,
          correct: true,
          message: `Correct! +${result.pointsAwarded} pts awarded. ${result.explanation}`
        };
        setStatus(`Quiz mastered at ${place.name}: +${result.pointsAwarded} Exploration Points.`);
      } else {
        quizFeedback = {
          placeId: place.id,
          correct: false,
          message: `Not quite right. Hint: ${result.explanation} Try again!`
        };
        setStatus(`Incorrect answer for ${place.name} quiz. Read the hint and try again.`, true);
      }
      renderAll();
    });
  });
}

function renderRoutes() {
  const state = engine.getState();
  const routes = engine.getAvailableRoutes();
  dom.routeCountBadge.textContent = `${routes.length} routes`;

  if (routes.length === 0) {
    dom.routesList.innerHTML = '<p class="helper-text">No outbound routes available.</p>';
    return;
  }

  dom.routesList.innerHTML = routes
    .map((route) => {
      const destPlace = getPlaceById(route.destinationId);
      const discoveryBonus = route.alreadyExplored ? 0 : destPlace?.discoveryPoints || 0;
      const totalPotentialPoints = route.basePoints + discoveryBonus;
      const modeColor = route.modeInfo?.color || '#1b4d89';
      const modeBadge = route.modeInfo?.badge || `[${route.mode.toUpperCase()}]`;

      let disabledReason = '';
      if (state.gameOver) disabledReason = 'Game Over';
      else if (state.isNight) disabledReason = 'Nightfall - Hotel First';
      else if (!route.affordable) disabledReason = 'Need More EUR';

      return `
        <article class="action-card ${route.alreadyExplored ? 'explored-dest' : ''}">
          <div class="action-top">
            <div>
              <span class="mode-tag" style="background:${modeColor};">${escapeHtml(modeBadge)}</span>
              <div class="action-title">To ${escapeHtml(route.destinationName)}</div>
            </div>
            <span class="badge-muted">${route.alreadyExplored ? 'Visited' : 'New Place'}</span>
          </div>
          <div class="action-meta">
            <strong>${escapeHtml(route.operator)}</strong> - ${escapeHtml(route.serviceName)} | ${route.durationHours}h travel
          </div>
          <div class="action-meta">${escapeHtml(route.educationalNote)}</div>
          <div class="action-phrase">
            <strong>Transit Portuguese:</strong> "${escapeHtml(route.transitPhrase.pt)}"
            <br><em>${escapeHtml(route.transitPhrase.en)}</em>
          </div>
          <div class="action-footer">
            <div>
              <span class="price-tag">${route.costEur.toFixed(2)} EUR</span>
              <span class="points-tag"> +${totalPotentialPoints} pts</span>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-board-route"
              data-route-id="${escapeHtml(route.id)}"
              data-direction="${escapeHtml(route.direction)}"
              ${route.canBoard ? '' : 'disabled'}
            >${disabledReason || 'Board Transit'}</button>
          </div>
        </article>
      `;
    })
    .join('');

  dom.routesList.querySelectorAll('.btn-board-route').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleBoardRoute(btn.dataset.routeId, btn.dataset.direction);
    });
  });
}

function renderHotels() {
  const state = engine.getState();
  const place = engine.getCurrentPlace();
  const hotels = engine.getHotels();
  dom.hotelCityBadge.textContent = place.name;

  dom.hotelsList.innerHTML = hotels
    .map((hotel) => {
      const canAfford = !state.gameOver && state.euros >= hotel.costEur;
      return `
        <article class="action-card">
          <div class="action-top">
            <div>
              <span class="mode-tag" style="background:#312e81;">[HOTEL] ${escapeHtml(hotel.tier)}</span>
              <div class="action-title">${escapeHtml(hotel.name)}</div>
            </div>
          </div>
          <div class="action-phrase">
            <strong>Check-in Portuguese:</strong> "${escapeHtml(hotel.phrasePt)}"
            <br><em>${escapeHtml(hotel.phrasePronunciation)}</em> - ${escapeHtml(hotel.phraseEn)}
          </div>
          <div class="action-footer">
            <div>
              <span class="price-tag">${hotel.costEur.toFixed(2)} EUR / night</span>
              <span class="points-tag"> +${hotel.bonusPoints} pts</span>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-book-hotel"
              data-hotel-id="${escapeHtml(hotel.id)}"
              ${canAfford ? '' : 'disabled'}
            >${canAfford ? (state.isNight ? 'Check In for Night' : 'Rest Overnight') : 'Need More EUR'}</button>
          </div>
        </article>
      `;
    })
    .join('');

  dom.hotelsList.querySelectorAll('.btn-book-hotel').forEach((btn) => {
    btn.addEventListener('click', () => {
      const result = engine.stayAtHotel(btn.dataset.hotelId);
      if (!result.ok) {
        setStatus(result.error, true);
        return;
      }
      setStatus(
        `Rested at ${result.hotel.name} (-${result.hotel.costEur} EUR, +${result.hotel.bonusPoints} pts). Morning of Day ${engine.getState().day} begins.`
      );
      if (!engine.getState().isNight && !engine.getState().gameOver) {
        setActiveTab('transit');
      }
      renderAll();
    });
  });
}

function renderSparkline() {
  const state = engine.getState();
  const history = state.exchangeHistory;
  const width = 320;
  const height = 88;
  const pad = 8;

  if (!history || history.length === 0) {
    dom.exchangeSparkline.innerHTML = '';
    return;
  }

  const rates = history.map((item) => item.rate);
  const minVal = Math.min(MIN_EXCHANGE_RATE, ...rates);
  const maxVal = Math.max(MAX_EXCHANGE_RATE, ...rates);
  const span = Math.max(0.1, maxVal - minVal);

  const points = history.map((item, idx) => {
    const x =
      history.length === 1
        ? width / 2
        : pad + (idx / (history.length - 1)) * (width - pad * 2);
    const y = height - pad - ((item.rate - minVal) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const lastPoint = points[points.length - 1].split(',');
  dom.exchangeSparkline.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Point exchange rate chart">
      <line x1="${pad}" y1="${height / 2}" x2="${width - pad}" y2="${height / 2}" stroke="#cbd5e1" stroke-dasharray="3 3" />
      <polyline fill="none" stroke="#1b4d89" stroke-width="2.5" points="${points.join(' ')}" />
      <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="4" fill="#d97706" />
    </svg>
  `;
}

function renderExchange() {
  const state = engine.getState();
  const cashValue = (state.points * state.exchangeRate).toFixed(2);
  dom.exchangeRateBadge.textContent = `${state.exchangeRate.toFixed(2)} EUR/pt`;
  dom.sparklineRange.textContent = `Bounds ${MIN_EXCHANGE_RATE.toFixed(2)} - ${MAX_EXCHANGE_RATE.toFixed(2)} EUR`;
  dom.exchangePreview.textContent = `Available to convert: ${state.points} pts (${cashValue} EUR at current rate)`;
  renderSparkline();
}

function renderJournal() {
  const state = engine.getState();
  dom.phraseCountBadge.textContent = `${state.learnedPhrases.length} phrases`;

  dom.exploredList.innerHTML = state.exploredPlaces
    .map(
      (p) =>
        `<li><strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.region)}) - Day ${p.firstVisitedDay} via ${escapeHtml(p.arrivalMode)} (visits: ${p.visitCount})</li>`
    )
    .join('');

  dom.phrasebookList.innerHTML = [...state.learnedPhrases]
    .reverse()
    .map(
      (entry) =>
        `<li><strong>"${escapeHtml(entry.pt)}"</strong><br><em>${escapeHtml(entry.pronunciation)}</em><br>${escapeHtml(entry.en)} <span style="color:var(--ink-muted);">[${escapeHtml(entry.source)}]</span></li>`
    )
    .join('');

  dom.travelLogList.innerHTML = [...state.travelLog]
    .reverse()
    .slice(0, 20)
    .map(
      (item) =>
        `<li><strong>Day ${item.day} ${formatHour(item.hour)}:</strong> ${escapeHtml(item.summary)}</li>`
    )
    .join('');
}

function renderGameOver() {
  const state = engine.getState();
  dom.gameoverModal.classList.toggle('hidden', !state.gameOver);
  if (!state.gameOver) return;

  dom.gameoverReason.textContent =
    state.gameOverReason || 'You have reached 0.00 EUR and 0 Exploration Points.';

  const modesSummary = Object.entries(state.stats.modesUsed)
    .map(([mode, count]) => `${mode}: ${count}`)
    .join(', ') || 'none';

  dom.gameoverSummary.innerHTML = `
    <div class="summary-stat"><span>Places Explored</span><strong>${state.exploredPlaces.length} / ${PORTUGAL_PLACES.length}</strong></div>
    <div class="summary-stat"><span>Days Traveled</span><strong>${state.day} Days (${state.stats.totalNights} nights)</strong></div>
    <div class="summary-stat"><span>Portuguese Phrases</span><strong>${state.learnedPhrases.length} Learned</strong></div>
    <div class="summary-stat"><span>Quizzes Mastered</span><strong>${state.completedQuizzes.length} / ${PORTUGAL_PLACES.length}</strong></div>
    <div class="summary-stat"><span>Transit Spent</span><strong>${state.stats.eurosSpentTransport.toFixed(2)} EUR</strong></div>
    <div class="summary-stat"><span>Hotels Spent</span><strong>${state.stats.eurosSpentHotels.toFixed(2)} EUR</strong></div>
    <div class="summary-stat"><span>Euros from Points</span><strong>${state.stats.eurosFromPoints.toFixed(2)} EUR</strong></div>
    <div class="summary-stat"><span>Transit Modes Ridden</span><strong>${escapeHtml(modesSummary)}</strong></div>
  `;
}

function handleBoardRoute(routeId, direction) {
  const result = engine.takeTransport(routeId, direction);
  if (!result.ok) {
    setStatus(result.error, true);
    return;
  }

  quizFeedback = null;
  const state = engine.getState();
  const discoveryTag = result.isNewDiscovery ? 'New destination discovered! ' : '';
  const nightTag = state.isNight
    ? ' Nightfall has arrived — check into a hotel before traveling tomorrow.'
    : '';
  setStatus(
    `${discoveryTag}Arrived in ${result.destination.name} via ${result.route.serviceName} (-${result.route.costEur} EUR, +${result.earnedPoints} pts).${nightTag}`
  );

  if (mapInstance && result.destination?.coords) {
    mapInstance.panTo(result.destination.coords, { animate: true });
  }

  if (state.isNight && !state.gameOver) {
    setActiveTab('hotel');
  }

  renderAll();
}

function handleExchangePoints(pointsAmount) {
  const result = engine.exchangePoints(pointsAmount);
  if (!result.ok) {
    setStatus(result.error, true);
    return;
  }
  dom.exchangeInput.value = '';
  setStatus(
    `Converted ${result.pointsExchanged} pts into +${result.eurosGained.toFixed(2)} EUR at ${engine.getState().exchangeRate.toFixed(2)} EUR/pt.`
  );
  renderAll();
}

function resetGame() {
  engine.reset('lisboa-oriente');
  quizFeedback = null;
  setActiveTab('transit');
  setStatus('New Portugal expedition started at Lisboa - Gare do Oriente with 10,000.00 EUR.');
  if (mapInstance) {
    mapInstance.setView(CAMERA_PRESETS.mainland.coords, CAMERA_PRESETS.mainland.zoom);
  }
  renderAll();
}

function renderAll() {
  renderHud();
  renderMapOverlay();
  renderDossier();
  renderRoutes();
  renderHotels();
  renderExchange();
  renderJournal();
  renderGameOver();
}

function bindEvents() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  document.querySelectorAll('[data-camera]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!mapInstance) return;
      const preset = CAMERA_PRESETS[btn.dataset.camera];
      if (preset) {
        mapInstance.setView(preset.coords, preset.zoom, { animate: true });
      }
    });
  });

  document.querySelectorAll('[data-exchange-pct]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pct = Number(btn.dataset.exchangePct);
      const available = engine.getState().points;
      const amount = pct === 1 ? available : Math.max(1, Math.floor(available * pct));
      if (available <= 0) {
        setStatus('You currently have 0 points to exchange.', true);
        return;
      }
      handleExchangePoints(amount);
    });
  });

  dom.exchangeForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleExchangePoints(dom.exchangeInput.value);
  });

  dom.btnReset.addEventListener('click', resetGame);
  dom.btnPlayAgain.addEventListener('click', resetGame);
}

initMap();
renderLegend();
bindEvents();
renderAll();
