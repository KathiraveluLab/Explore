import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PORTUGAL_PLACES, TRANSIT_ROUTES, TRANSPORT_MODES } from '../src/data.js';
import {
  ExploreGameEngine,
  INITIAL_EUROS,
  INITIAL_POINTS,
  DAY_START_HOUR,
  NIGHT_START_HOUR,
  INITIAL_EXCHANGE_RATE,
  MIN_EXCHANGE_RATE,
  MAX_EXCHANGE_RATE,
  QUIZ_BONUS_POINTS
} from '../src/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function makeDeterministicRandom(values) {
  let idx = 0;
  return () => {
    const val = values[idx % values.length];
    idx += 1;
    return val;
  };
}

test('initial state starts at 10,000 Euro, 0 Points, Day 1 08:00, with 1 starting place', () => {
  const engine = new ExploreGameEngine();
  const state = engine.getState();

  assert.equal(state.euros, INITIAL_EUROS);
  assert.equal(state.euros, 10000);
  assert.equal(state.points, INITIAL_POINTS);
  assert.equal(state.points, 0);
  assert.equal(state.day, 1);
  assert.equal(state.hour, DAY_START_HOUR);
  assert.equal(state.isNight, false);
  assert.equal(state.currentPlaceId, 'lisboa-oriente');
  assert.equal(state.exchangeRate, INITIAL_EXCHANGE_RATE);
  assert.equal(state.exploredPlaces.length, 1);
  assert.equal(state.exploredPlaces[0].id, 'lisboa-oriente');
  assert.equal(state.learnedPhrases.length, 1);
  assert.equal(state.gameOver, false);
});

test('dataset integrity: 21 Portugal places, valid coordinates, phrases, quizzes, hotels, and routes', () => {
  assert.equal(PORTUGAL_PLACES.length, 21);
  const placeIds = new Set(PORTUGAL_PLACES.map((p) => p.id));
  assert.equal(placeIds.size, 21);

  for (const place of PORTUGAL_PLACES) {
    assert.ok(Array.isArray(place.coords) && place.coords.length === 2);
    const [lat, lng] = place.coords;
    assert.ok(lat >= 32 && lat <= 43, `Invalid latitude for ${place.id}: ${lat}`);
    assert.ok(lng >= -28 && lng <= -6, `Invalid longitude for ${place.id}: ${lng}`);
    assert.ok(place.summary && place.historyAndCulture && place.transitSpotlight);
    assert.ok(place.localPhrase?.pt && place.localPhrase?.en && place.localPhrase?.pronunciation);
    assert.ok(place.quiz?.question && Array.isArray(place.quiz.options) && place.quiz.options.length >= 2);
    assert.ok(Array.isArray(place.hotelOptions) && place.hotelOptions.length === 3);
    assert.ok(place.discoveryPoints > 0);
  }

  const validModes = new Set(Object.keys(TRANSPORT_MODES));
  assert.deepEqual(
    [...validModes].sort(),
    ['bus', 'ferry', 'flight', 'funicular', 'train', 'tram']
  );

  for (const route of TRANSIT_ROUTES) {
    assert.ok(placeIds.has(route.from), `Invalid route.from: ${route.from}`);
    assert.ok(placeIds.has(route.to), `Invalid route.to: ${route.to}`);
    assert.ok(validModes.has(route.mode), `Invalid transport mode: ${route.mode}`);
    assert.ok(route.costEur > 0);
    assert.ok(route.durationHours > 0);
    assert.ok(route.basePoints > 0);
    assert.ok(route.transitPhrase?.pt && route.transitPhrase?.en);
  }
});

test('taking public transport deducts Euros, advances time, earns points, logs places & phrases, and fluctuates exchange rate', () => {
  const engine = new ExploreGameEngine('lisboa-oriente', makeDeterministicRandom([0.9, 0.1, 0.8]));
  const res = engine.takeTransport('tram-lisboa-28');

  assert.equal(res.ok, true);
  assert.equal(res.isNewDiscovery, true);

  const state = engine.getState();
  assert.equal(state.currentPlaceId, 'lisboa-alfama');
  assert.equal(state.euros, 10000 - 4);
  assert.equal(state.hour, 9);
  assert.equal(state.isNight, false);
  assert.equal(state.exploredPlaces.length, 2);
  assert.ok(state.points > 0);
  assert.ok(state.learnedPhrases.length >= 3);
  assert.notEqual(state.exchangeRate, INITIAL_EXCHANGE_RATE);
  assert.ok(state.exchangeRate >= MIN_EXCHANGE_RATE && state.exchangeRate <= MAX_EXCHANGE_RATE);

  const quizRes = engine.answerQuiz('lisboa-alfama', 0);
  assert.equal(quizRes.ok, true);
  assert.equal(quizRes.correct, true);
  assert.equal(quizRes.pointsAwarded, QUIZ_BONUS_POINTS);
});

test('reaching 20:00 triggers Nightfall, blocks transit until stayAtHotel, then advances to Day + 1 at 08:00', () => {
  const engine = new ExploreGameEngine('lisboa-oriente', makeDeterministicRandom([0.75, 0.25]));

  // Day 1: 08:00 -> +3h (11:00) -> +3h (14:00) -> +3h (17:00) -> +3h (20:00)
  assert.equal(engine.takeTransport('train-oriente-porto', 'forward').ok, true); // -> porto-campanha (11:00)
  assert.equal(engine.takeTransport('train-oriente-porto', 'reverse').ok, true); // -> lisboa-oriente (14:00)
  assert.equal(engine.takeTransport('train-oriente-faro', 'forward').ok, true); // -> faro (17:00)
  assert.equal(engine.takeTransport('train-oriente-faro', 'reverse').ok, true); // -> lisboa-oriente (20:00)

  const nightState = engine.getState();
  assert.equal(nightState.hour, NIGHT_START_HOUR);
  assert.equal(nightState.isNight, true);

  const blocked = engine.takeTransport('tram-lisboa-28');
  assert.equal(blocked.ok, false);
  assert.match(blocked.error, /Nightfall/i);

  const eurosBeforeHotel = nightState.euros;
  const hotelRes = engine.stayAtHotel('pensao');
  assert.equal(hotelRes.ok, true);

  const morningState = engine.getState();
  assert.equal(morningState.isNight, false);
  assert.equal(morningState.day, 2);
  assert.equal(morningState.hour, DAY_START_HOUR);
  assert.equal(morningState.euros, eurosBeforeHotel - hotelRes.hotel.costEur);

  const nextDayTrip = engine.takeTransport('tram-lisboa-28');
  assert.equal(nextDayTrip.ok, true);
});

test('exchanging points converts points back to Euros at current exchange rate', () => {
  const engine = new ExploreGameEngine('lisboa-oriente', makeDeterministicRandom([0.95]));
  engine.takeTransport('flight-lisboa-funchal');

  const state = engine.getState();
  const rateBefore = state.exchangeRate;
  const eurosBefore = state.euros;
  const pointsBefore = state.points;
  const pointsToSell = 100;

  const exRes = engine.exchangePoints(pointsToSell);
  assert.equal(exRes.ok, true);
  assert.equal(exRes.pointsExchanged, pointsToSell);
  assert.equal(state.points, pointsBefore - pointsToSell);
  const expectedGain = Math.round(pointsToSell * rateBefore * 100) / 100;
  assert.equal(exRes.eurosGained, expectedGain);
  assert.equal(state.euros, Math.round((eurosBefore + expectedGain) * 100) / 100);
});

test('game ends when player reaches 0 points and 0 Euro (direct and via bankruptcy settlement)', () => {
  // Case 1: Exact 0 EUR and 0 Points via bankruptcy settlement when funds fall below cheapest fare
  const engine = new ExploreGameEngine('lisboa-oriente', makeDeterministicRandom([0.5]));
  const state = engine.getState();
  state.euros = 2;
  state.points = 0;

  const res = engine.settleBankruptcy();
  assert.equal(res.settled, true);
  assert.equal(state.euros, 0);
  assert.equal(state.points, 0);
  assert.equal(state.gameOver, true);

  // Subsequent actions are blocked
  assert.equal(engine.takeTransport('tram-lisboa-28').ok, false);
  assert.equal(engine.stayAtHotel('pensao').ok, false);
  assert.equal(engine.exchangePoints(1).ok, false);

  // Case 2: Player has Euros = 0 and Points > 0 that CAN fund a route -> NOT game over yet
  const engine2 = new ExploreGameEngine('lisboa-oriente', makeDeterministicRandom([0.5]));
  const s2 = engine2.getState();
  s2.euros = 0;
  s2.points = 50; // 50 * 1.80 = 90 EUR >= 4 EUR min route
  const notSettled = engine2.settleBankruptcy();
  assert.equal(notSettled.settled, false);
  assert.equal(s2.gameOver, false);

  // Exchanging all points allows continuing travel
  assert.equal(engine2.exchangePoints(50).ok, true);
  assert.equal(s2.points, 0);
  assert.equal(s2.euros, 90);
  assert.equal(engine2.takeTransport('tram-lisboa-28').ok, true);
});

test('compliance check: no emojis, no license mentions, and no forbidden persona/bmad references', () => {
  const filesToCheck = [
    'package.json',
    'README.md',
    'index.html',
    'styles.css',
    path.join('src', 'data.js'),
    path.join('src', 'engine.js'),
    path.join('src', 'app.js'),
    path.join('tests', 'engine.test.js')
  ];

  const emojiRegex = /\p{Extended_Pictographic}/u;
  const forbiddenTerms = [
    /\bbmad\b/i,
    /\blicense\b/i,
    /\bpowerhouse\b/i,
    /\bbairavaa\b/i,
    /\bbagavathi\b/i,
    /\bvillu\b/i,
    /\bbadri\b/i,
    /\baathi\b/i,
    /\bdeva\b/i,
    /\bpuli\b/i,
    /\bselva\b/i,
    /\bsivakasi\b/i,
    /\bthirumalai\b/i,
    /\btheri\b/i,
    /\budhaya\b/i,
    /\bbigil\b/i,
    /\bpokkiri\b/i,
    /\bthiruppachi\b/i,
    /\bvelayutham\b/i,
    /\bvaseegara\b/i,
    /\bsenthurapandi\b/i,
    /\bshahjahan\b/i,
    /\bmadurey\b/i
  ];

  for (const relPath of filesToCheck) {
    const absPath = path.join(ROOT_DIR, relPath);
    const content = fs.readFileSync(absPath, 'utf8');
    assert.equal(
      emojiRegex.test(content),
      false,
      `Found prohibited emoji character in ${relPath}`
    );

    if (relPath !== path.join('tests', 'engine.test.js')) {
      for (const pattern of forbiddenTerms) {
        assert.equal(
          pattern.test(content),
          false,
          `Found prohibited term matching ${pattern} in ${relPath}`
        );
      }
    }
  }
});
