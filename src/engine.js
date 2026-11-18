import { PORTUGAL_PLACES, TRANSIT_ROUTES, TRANSPORT_MODES } from './data.js';

export const INITIAL_EUROS = 10000;
export const INITIAL_POINTS = 0;
export const DAY_START_HOUR = 8;
export const NIGHT_START_HOUR = 20;
export const INITIAL_EXCHANGE_RATE = 1.8;
export const MIN_EXCHANGE_RATE = 0.75;
export const MAX_EXCHANGE_RATE = 3.6;
export const MEAN_EXCHANGE_RATE = 1.85;
export const QUIZ_BONUS_POINTS = 120;

const PLACE_MAP = new Map(PORTUGAL_PLACES.map((place) => [place.id, place]));
const ROUTE_MAP = new Map(TRANSIT_ROUTES.map((route) => [route.id, route]));

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatHour(hour) {
  const normalized = Math.max(0, Math.floor(hour)) % 24;
  return `${String(normalized).padStart(2, '0')}:00`;
}

export function getPlaceById(placeId) {
  return PLACE_MAP.get(placeId) || null;
}

export function getRouteById(routeId) {
  return ROUTE_MAP.get(routeId) || null;
}

function recordPhrase(state, phraseObj, sourceLabel) {
  if (!phraseObj || !phraseObj.pt) return;
  const exists = state.learnedPhrases.some((entry) => entry.pt === phraseObj.pt);
  if (!exists) {
    state.learnedPhrases.push({
      pt: phraseObj.pt,
      pronunciation: phraseObj.pronunciation || '',
      en: phraseObj.en,
      source: sourceLabel,
      day: state.day
    });
  }
}

export function fluctuateExchangeRate(currentRate, randomFn = Math.random) {
  const pullToMean = (MEAN_EXCHANGE_RATE - currentRate) * 0.16;
  const shock = (randomFn() - 0.5) * 0.44;
  const rawNext = currentRate + pullToMean + shock;
  const nextRate = roundMoney(Math.min(MAX_EXCHANGE_RATE, Math.max(MIN_EXCHANGE_RATE, rawNext)));
  const delta = roundMoney(nextRate - currentRate);
  let trendLabel = 'STEADY';
  if (delta >= 0.04) trendLabel = 'UP';
  else if (delta <= -0.04) trendLabel = 'DOWN';
  return { nextRate, delta, trendLabel };
}

export function createInitialState(startPlaceId = 'lisboa-oriente') {
  const startPlace = getPlaceById(startPlaceId) || PORTUGAL_PLACES[0];
  const state = {
    euros: INITIAL_EUROS,
    points: INITIAL_POINTS,
    day: 1,
    hour: DAY_START_HOUR,
    isNight: false,
    currentPlaceId: startPlace.id,
    exchangeRate: INITIAL_EXCHANGE_RATE,
    lastRateDelta: 0,
    lastRateTrend: 'STEADY',
    exchangeHistory: [
      {
        step: 0,
        rate: INITIAL_EXCHANGE_RATE,
        label: `Day 1 ${formatHour(DAY_START_HOUR)}`
      }
    ],
    exploredPlaces: [
      {
        id: startPlace.id,
        name: startPlace.name,
        region: startPlace.region,
        firstVisitedDay: 1,
        arrivalMode: 'start',
        visitCount: 1
      }
    ],
    learnedPhrases: [],
    completedQuizzes: [],
    travelLog: [
      {
        step: 0,
        day: 1,
        hour: DAY_START_HOUR,
        type: 'start',
        placeId: startPlace.id,
        summary: `Began Portugal expedition at ${startPlace.name} with ${INITIAL_EUROS.toFixed(2)} EUR.`
      }
    ],
    stats: {
      totalTrips: 0,
      totalNights: 0,
      eurosSpentTransport: 0,
      eurosSpentHotels: 0,
      eurosFromPoints: 0,
      pointsEarned: 0,
      pointsExchanged: 0,
      modesUsed: {}
    },
    gameOver: false,
    gameOverReason: null
  };

  recordPhrase(state, startPlace.localPhrase, startPlace.name);
  return state;
}

export function getAvailableRoutes(state) {
  const results = [];
  for (const route of TRANSIT_ROUTES) {
    let direction = null;
    let destinationId = null;

    if (route.from === state.currentPlaceId) {
      direction = 'forward';
      destinationId = route.to;
    } else if (route.to === state.currentPlaceId) {
      direction = 'reverse';
      destinationId = route.from;
    }

    if (!direction) continue;

    const destination = getPlaceById(destinationId);
    const modeInfo = TRANSPORT_MODES[route.mode];
    const affordable = state.euros >= route.costEur;
    const canBoard = !state.gameOver && !state.isNight && affordable;

    results.push({
      ...route,
      direction,
      originId: state.currentPlaceId,
      destinationId,
      destinationName: destination ? destination.name : destinationId,
      destinationRegion: destination ? destination.region : '',
      modeInfo,
      affordable,
      canBoard,
      alreadyExplored: state.exploredPlaces.some((p) => p.id === destinationId)
    });
  }

  return results.sort((a, b) => {
    if (a.alreadyExplored !== b.alreadyExplored) {
      return a.alreadyExplored ? 1 : -1;
    }
    return a.costEur - b.costEur;
  });
}

export function getHotelOptionsForPlace(placeId) {
  const place = getPlaceById(placeId);
  if (!place || !Array.isArray(place.hotelOptions)) return [];
  return place.hotelOptions;
}

function getMinimumRequiredCost(state) {
  const hotels = getHotelOptionsForPlace(state.currentPlaceId);
  const minHotelCost = hotels.length > 0 ? Math.min(...hotels.map((h) => h.costEur)) : Infinity;
  if (state.isNight) {
    return minHotelCost;
  }
  const routes = getAvailableRoutes(state);
  const minRouteCost = routes.length > 0 ? Math.min(...routes.map((r) => r.costEur)) : Infinity;
  return Math.min(minHotelCost, minRouteCost);
}

export function settleFinalBankruptcy(state) {
  if (state.euros <= 0 && state.points <= 0) {
    state.euros = 0;
    state.points = 0;
    state.gameOver = true;
    state.gameOverReason = state.gameOverReason || 'Reached 0 EUR and 0 Points.';
    return { settled: true, state };
  }

  const minRequired = getMinimumRequiredCost(state);
  const maxConvertibleEuros = roundMoney(state.points * state.exchangeRate);
  const totalLiquidity = roundMoney(state.euros + maxConvertibleEuros);

  if (totalLiquidity >= minRequired) {
    return { settled: false, state };
  }

  if (state.points > 0) {
    const converted = roundMoney(state.points * state.exchangeRate);
    state.stats.pointsExchanged = roundMoney(state.stats.pointsExchanged + state.points);
    state.stats.eurosFromPoints = roundMoney(state.stats.eurosFromPoints + converted);
    state.euros = roundMoney(state.euros + converted);
    state.points = 0;
  }

  const finalSpend = roundMoney(state.euros);
  if (finalSpend > 0) {
    if (state.isNight) {
      state.stats.eurosSpentHotels = roundMoney(state.stats.eurosSpentHotels + finalSpend);
    } else {
      state.stats.eurosSpentTransport = roundMoney(state.stats.eurosSpentTransport + finalSpend);
    }
  }

  state.euros = 0;
  state.points = 0;
  state.gameOver = true;
  state.gameOverReason =
    `Expedition funds exhausted: remaining ${finalSpend.toFixed(2)} EUR could not cover the minimum ${minRequired.toFixed(2)} EUR ${state.isNight ? 'nightly hotel rate' : 'transit fare or hotel'}.`;

  state.travelLog.push({
    step: state.travelLog.length,
    day: state.day,
    hour: state.hour,
    type: 'gameover',
    placeId: state.currentPlaceId,
    summary: state.gameOverReason
  });

  return { settled: true, state };
}

export function checkTermination(state) {
  if (state.euros <= 0 && state.points <= 0) {
    state.euros = 0;
    state.points = 0;
    state.gameOver = true;
    state.gameOverReason = 'Expedition concluded with 0.00 EUR and 0 Points remaining.';
    return true;
  }

  const minRequired = getMinimumRequiredCost(state);
  const totalLiquidity = roundMoney(state.euros + state.points * state.exchangeRate);

  if (totalLiquidity < minRequired) {
    settleFinalBankruptcy(state);
    return true;
  }

  return false;
}

function advanceMarketRate(state, randomFn) {
  const { nextRate, delta, trendLabel } = fluctuateExchangeRate(state.exchangeRate, randomFn);
  state.exchangeRate = nextRate;
  state.lastRateDelta = delta;
  state.lastRateTrend = trendLabel;
  state.exchangeHistory.push({
    step: state.exchangeHistory.length,
    rate: nextRate,
    label: `Day ${state.day} ${formatHour(state.hour)}`
  });
  if (state.exchangeHistory.length > 36) {
    state.exchangeHistory.shift();
  }
}

export function takeTransport(state, routeId, direction = 'forward', randomFn = Math.random) {
  if (state.gameOver) {
    return { ok: false, error: 'The game has already ended.', state };
  }
  if (state.isNight) {
    return { ok: false, error: 'Nightfall has arrived. You must check into a hotel before traveling again.', state };
  }

  const route = getRouteById(routeId);
  if (!route) {
    return { ok: false, error: `Unknown transit route: ${routeId}`, state };
  }

  let destinationId = null;
  if (direction === 'forward' && route.from === state.currentPlaceId) {
    destinationId = route.to;
  } else if (direction === 'reverse' && route.to === state.currentPlaceId) {
    destinationId = route.from;
  } else if (route.from === state.currentPlaceId) {
    destinationId = route.to;
  } else if (route.to === state.currentPlaceId) {
    destinationId = route.from;
  } else {
    return { ok: false, error: 'Selected transit route does not depart from your current location.', state };
  }

  if (state.euros < route.costEur) {
    return {
      ok: false,
      error: `Insufficient funds (${state.euros.toFixed(2)} EUR) for ${route.serviceName} (${route.costEur.toFixed(2)} EUR). Exchange points or check remaining options.`,
      state
    };
  }

  const destination = getPlaceById(destinationId);
  if (!destination) {
    return { ok: false, error: `Unknown destination: ${destinationId}`, state };
  }

  state.euros = roundMoney(state.euros - route.costEur);
  state.stats.eurosSpentTransport = roundMoney(state.stats.eurosSpentTransport + route.costEur);
  state.stats.totalTrips += 1;
  state.stats.modesUsed[route.mode] = (state.stats.modesUsed[route.mode] || 0) + 1;

  state.hour += route.durationHours;
  if (state.hour >= NIGHT_START_HOUR) {
    state.isNight = true;
  }

  state.currentPlaceId = destination.id;

  const existingExplore = state.exploredPlaces.find((p) => p.id === destination.id);
  let earnedPoints = route.basePoints;
  let isNewDiscovery = false;

  if (!existingExplore) {
    isNewDiscovery = true;
    earnedPoints += destination.discoveryPoints;
    state.exploredPlaces.push({
      id: destination.id,
      name: destination.name,
      region: destination.region,
      firstVisitedDay: state.day,
      arrivalMode: route.mode,
      visitCount: 1
    });
  } else {
    existingExplore.visitCount += 1;
  }

  state.points += earnedPoints;
  state.stats.pointsEarned += earnedPoints;

  recordPhrase(state, route.transitPhrase, `${route.operator} (${route.serviceName})`);
  recordPhrase(state, destination.localPhrase, destination.name);

  advanceMarketRate(state, randomFn);

  const modeBadge = TRANSPORT_MODES[route.mode]?.badge || `[${route.mode.toUpperCase()}]`;
  const nightNotice = state.isNight ? ' Nightfall reached — hotel stay required.' : '';
  const summary = `${modeBadge} Took ${route.serviceName} to ${destination.name} (-${route.costEur} EUR, +${earnedPoints} pts).${nightNotice}`;

  state.travelLog.push({
    step: state.travelLog.length,
    day: state.day,
    hour: state.hour,
    type: 'transit',
    mode: route.mode,
    placeId: destination.id,
    costEur: route.costEur,
    earnedPoints,
    summary
  });

  checkTermination(state);

  return {
    ok: true,
    isNewDiscovery,
    earnedPoints,
    route,
    destination,
    state
  };
}

export function exchangePointsToEuros(state, pointsToExchange) {
  if (state.gameOver) {
    return { ok: false, error: 'The game has already ended.', state };
  }

  const amount = Math.floor(Number(pointsToExchange));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Enter a positive whole number of points to exchange.', state };
  }
  if (amount > state.points) {
    return { ok: false, error: `Cannot exchange ${amount} points; only ${state.points} points available.`, state };
  }

  const eurosGained = roundMoney(amount * state.exchangeRate);
  state.points -= amount;
  state.euros = roundMoney(state.euros + eurosGained);
  state.stats.pointsExchanged += amount;
  state.stats.eurosFromPoints = roundMoney(state.stats.eurosFromPoints + eurosGained);

  const summary = `Exchanged ${amount} pts at ${state.exchangeRate.toFixed(2)} EUR/pt for +${eurosGained.toFixed(2)} EUR.`;
  state.travelLog.push({
    step: state.travelLog.length,
    day: state.day,
    hour: state.hour,
    type: 'exchange',
    placeId: state.currentPlaceId,
    eurosGained,
    pointsSpent: amount,
    summary
  });

  checkTermination(state);

  return {
    ok: true,
    pointsExchanged: amount,
    eurosGained,
    state
  };
}

export function stayAtHotel(state, hotelId = 'pensao', randomFn = Math.random) {
  if (state.gameOver) {
    return { ok: false, error: 'The game has already ended.', state };
  }

  const currentPlace = getPlaceById(state.currentPlaceId);
  const hotels = getHotelOptionsForPlace(state.currentPlaceId);
  const hotel = hotels.find((h) => h.id === hotelId) || hotels[0];

  if (!hotel) {
    return { ok: false, error: 'No hotel options available at the current location.', state };
  }

  if (state.euros < hotel.costEur) {
    return {
      ok: false,
      error: `Insufficient funds (${state.euros.toFixed(2)} EUR) for ${hotel.name} (${hotel.costEur.toFixed(2)} EUR). Exchange points or choose a lower-cost stay.`,
      state
    };
  }

  state.euros = roundMoney(state.euros - hotel.costEur);
  state.stats.eurosSpentHotels = roundMoney(state.stats.eurosSpentHotels + hotel.costEur);
  state.stats.totalNights += 1;

  state.points += hotel.bonusPoints;
  state.stats.pointsEarned += hotel.bonusPoints;

  state.day += 1;
  state.hour = DAY_START_HOUR;
  state.isNight = false;

  recordPhrase(
    state,
    {
      pt: hotel.phrasePt,
      pronunciation: hotel.phrasePronunciation,
      en: hotel.phraseEn
    },
    hotel.name
  );

  advanceMarketRate(state, randomFn);

  const summary = `[HOTEL] Stayed overnight at ${hotel.name} in ${currentPlace ? currentPlace.name : state.currentPlaceId} (-${hotel.costEur} EUR, +${hotel.bonusPoints} pts). Morning of Day ${state.day}.`;
  state.travelLog.push({
    step: state.travelLog.length,
    day: state.day,
    hour: state.hour,
    type: 'hotel',
    placeId: state.currentPlaceId,
    costEur: hotel.costEur,
    bonusPoints: hotel.bonusPoints,
    summary
  });

  checkTermination(state);

  return {
    ok: true,
    hotel,
    state
  };
}

export function answerPlaceQuiz(state, placeId, selectedOptionIndex) {
  if (state.gameOver) {
    return { ok: false, error: 'The game has already ended.', state };
  }

  const place = getPlaceById(placeId);
  if (!place || !place.quiz) {
    return { ok: false, error: 'Quiz unavailable for this location.', state };
  }

  if (state.currentPlaceId !== placeId) {
    return { ok: false, error: 'Travel to this location to complete its cultural quiz.', state };
  }

  if (state.completedQuizzes.includes(placeId)) {
    return { ok: false, error: 'You have already completed the knowledge check for this place.', state };
  }

  const isCorrect = Number(selectedOptionIndex) === place.quiz.answerIndex;
  if (!isCorrect) {
    return {
      ok: true,
      correct: false,
      pointsAwarded: 0,
      explanation: place.quiz.explanation,
      state
    };
  }

  state.completedQuizzes.push(placeId);
  state.points += QUIZ_BONUS_POINTS;
  state.stats.pointsEarned += QUIZ_BONUS_POINTS;

  state.travelLog.push({
    step: state.travelLog.length,
    day: state.day,
    hour: state.hour,
    type: 'quiz',
    placeId,
    pointsAwarded: QUIZ_BONUS_POINTS,
    summary: `[QUIZ] Answered ${place.name} cultural challenge (+${QUIZ_BONUS_POINTS} pts).`
  });

  return {
    ok: true,
    correct: true,
    pointsAwarded: QUIZ_BONUS_POINTS,
    explanation: place.quiz.explanation,
    state
  };
}

export class ExploreGameEngine {
  constructor(startPlaceId = 'lisboa-oriente', randomFn = Math.random) {
    this.randomFn = randomFn;
    this.state = createInitialState(startPlaceId);
  }

  reset(startPlaceId = 'lisboa-oriente') {
    this.state = createInitialState(startPlaceId);
    return this.state;
  }

  getState() {
    return this.state;
  }

  getCurrentPlace() {
    return getPlaceById(this.state.currentPlaceId);
  }

  getAvailableRoutes() {
    return getAvailableRoutes(this.state);
  }

  getHotels() {
    return getHotelOptionsForPlace(this.state.currentPlaceId);
  }

  takeTransport(routeId, direction) {
    return takeTransport(this.state, routeId, direction, this.randomFn);
  }

  exchangePoints(pointsToExchange) {
    return exchangePointsToEuros(this.state, pointsToExchange);
  }

  stayAtHotel(hotelId) {
    return stayAtHotel(this.state, hotelId, this.randomFn);
  }

  answerQuiz(placeId, selectedOptionIndex) {
    return answerPlaceQuiz(this.state, placeId, selectedOptionIndex);
  }

  settleBankruptcy() {
    return settleFinalBankruptcy(this.state);
  }
}
