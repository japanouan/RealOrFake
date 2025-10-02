// Utilities to write the requested structure into Firebase Realtime Database
// Usage (in browser console after app loads):
//   import('./utils/seedRealtimeDatabase').then(m => m.seedSchemaSkeleton())
//   import('./utils/seedRealtimeDatabase').then(m => m.exampleSeed())

import { db } from '../firebase';
import { ref, set, update, push, serverTimestamp } from 'firebase/database';

// 1) Users: users/{uid}
export async function writeUser(uid, userData) {
  const userRef = ref(db, `users/${uid}`);
  const payload = {
    displayName: null,
    photoURL: '',
    createdAt: Date.now(),
    streak: 0,
    longestStreak: 0,
    lastPlayedAt: null,
    settings: {
      lang: 'th',
      notifyDaily: true,
      privacyShare: false,
    },
    stats: {
      attempts: 0,
      correct: 0,
      f1: 0,
      avgTimeSec: 0,
    },
    ...userData,
  };
  await set(userRef, payload);
}

// 2) Items: items/{itemId}
export async function writeItem(itemId, itemData) {
  const itemRef = ref(db, `items/${itemId}`);
  const payload = {
    title: '',
    text: '',
    source: '',
    domain: '',
    publishedAt: null,
    difficulty: 'easy',
    topic: [],
    createdAt: Date.now(),
    // DO NOT add answer/meta here on client; keep on server only
    ...itemData,
  };
  await set(itemRef, payload);
}

// 3) Daily Challenges metadata: dailyChallenges/{yyyymmdd}
export async function setDailyChallengeMeta(dateKey, meta) {
  const dailyRef = ref(db, `dailyChallenges/${dateKey}`);
  const payload = {
    dateKey,
    count: 5,
    topics: [],
    createdAt: serverTimestamp(),
    ...meta,
  };
  await set(dailyRef, payload);
}

// 3.1) Daily Challenge items list: dailyChallenges/{yyyymmdd}/items/{itemId}
export async function addDailyChallengeItem(dateKey, itemId, order) {
  const itemRef = ref(db, `dailyChallenges/${dateKey}/items/${itemId}`);
  await set(itemRef, {
    itemRef: `items/${itemId}`,
    order,
  });
}

// 4) Assignments per user/day: assignments/{uid}/days/{yyyymmdd}
export async function ensureAssignment(uid, dateKey, options = {}) {
  const dayRef = ref(db, `assignments/${uid}/days/${dateKey}`);
  await set(dayRef, {
    dateKey,
    createdAt: serverTimestamp(),
    done: false,
    ...options,
  });
}

// 4.1) Assignment items: assignments/{uid}/days/{yyyymmdd}/items/{itemId}
export async function addAssignmentItem(uid, dateKey, itemId, order, servedAt = null) {
  const itemRef = ref(db, `assignments/${uid}/days/${dateKey}/items/${itemId}`);
  await set(itemRef, {
    itemRef: `items/${itemId}`,
    order,
    servedAt: servedAt || serverTimestamp(),
  });
}

// 5) Submissions: submissions/{uid}/{submissionId}
export async function addSubmission(uid, submission) {
  const listRef = ref(db, `submissions/${uid}`);
  const newRef = push(listRef);
  await set(newRef, {
    dateKey: null,
    itemRef: null,
    userLabel: null,
    userReason: '',
    // modelLabel/prob/isCorrect are server-computed; do not set on client
    durationSec: 0,
    createdAt: serverTimestamp(),
    ...submission,
  });
  return newRef.key;
}

// 6) User aggregates: userAggregates/{uid}
export async function setUserAggregates(uid, aggregates) {
  const aggRef = ref(db, `userAggregates/${uid}`);
  await update(aggRef, {
    all: { attempts: 0, correct: 0, f1: 0, ...(aggregates?.all || {}) },
    daily: aggregates?.daily || {},
    weekly: aggregates?.weekly || {},
    updatedAt: serverTimestamp(),
  });
}

// 7) Leaderboards: leaderboards/{period}
export async function setLeaderboard(period, data) {
  const lbRef = ref(db, `leaderboards/${period}`);
  await set(lbRef, {
    top: Array.isArray(data?.top) ? data.top : [],
    updatedAt: serverTimestamp(),
  });
}

// Create empty skeleton nodes so the structure appears in RTDB console
export async function seedSchemaSkeleton() {
  const ops = [];
  ops.push(update(ref(db), {
    users: {},
    items: {},
    dailyChallenges: {},
    assignments: {},
    submissions: {},
    userAggregates: {},
    leaderboards: {},
  }));
  await Promise.all(ops);
}

// Example seed with minimal sample data
export async function exampleSeed() {
  const sampleUid = 'demoUser1';
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateKey = `${y}-${m}-${d}`;

  await seedSchemaSkeleton();
  await writeUser(sampleUid, { displayName: 'Ada Lovelace', streak: 7, longestStreak: 12 });

  const itemId1 = 'item001';
  const itemId2 = 'item002';
  await writeItem(itemId1, { title: 'Claim A', text: '...', source: 'LIAR', domain: 'snopes.com', difficulty: 'easy', topic: ['health'] });
  await writeItem(itemId2, { title: 'Claim B', text: '...', source: 'MultiFC', domain: 'snopes.com', difficulty: 'med', topic: ['politics'] });

  await setDailyChallengeMeta(dateKey, { count: 2, topics: ['health','politics'] });
  await addDailyChallengeItem(dateKey, itemId1, 1);
  await addDailyChallengeItem(dateKey, itemId2, 2);

  await ensureAssignment(sampleUid, dateKey, { done: false });
  await addAssignmentItem(sampleUid, dateKey, itemId1, 1);
  await addAssignmentItem(sampleUid, dateKey, itemId2, 2);

  await addSubmission(sampleUid, { dateKey, itemRef: `items/${itemId1}`, userLabel: 1, userReason: 'น่าเชื่อถือ' });

  await setUserAggregates(sampleUid, {
    all: { attempts: 1, correct: 1, f1: 1 },
    daily: { [dateKey]: { attempts: 1, correct: 1, f1: 1 } },
  });

  await setLeaderboard(`daily-${dateKey}`, {
    top: [{ uid: sampleUid, score: 1, f1: 1, streak: 7 }]
  });
}


