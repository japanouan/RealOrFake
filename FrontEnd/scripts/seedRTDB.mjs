import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, push, serverTimestamp } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Use the same config as src/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyA_VycM7zniO7ti64Bb-Yn1rfw5SUyDmg8",
  authDomain: "pattern-3d1a8.firebaseapp.com",
  databaseURL: "https://pattern-3d1a8-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "pattern-3d1a8",
  storageBucket: "pattern-3d1a8.appspot.com",
  messagingSenderId: "51744145096",
  appId: "1:51744145096:web:1560f343f029b4a9e2affd",
  measurementId: "G-BV5J4C9NK9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function seedSchemaSkeleton() {
  await update(ref(db), {
    users: {},
    items: {},
    dailyChallenges: {},
    assignments: {},
    submissions: {},
    userAggregates: {},
    leaderboards: {},
  });
  console.log('✅ Seeded schema skeleton');
}

async function exampleSeed() {
  const sampleUid = 'demoUser1';
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const dateKey = `${y}-${m}-${d}`;

  // users/{uid}
  await set(ref(db, `users/${sampleUid}`), {
    displayName: 'Ada Lovelace',
    photoURL: '',
    createdAt: Date.now(),
    streak: 7,
    longestStreak: 12,
    lastPlayedAt: null,
    settings: { lang: 'th', notifyDaily: true, privacyShare: false },
    stats: { attempts: 0, correct: 0, f1: 0, avgTimeSec: 0 }
  });

  // items
  await set(ref(db, `items/item001`), {
    title: 'Claim A', text: '...', source: 'LIAR', domain: 'snopes.com', publishedAt: null,
    difficulty: 'easy', topic: ['health'], createdAt: Date.now()
  });
  await set(ref(db, `items/item002`), {
    title: 'Claim B', text: '...', source: 'MultiFC', domain: 'snopes.com', publishedAt: null,
    difficulty: 'med', topic: ['politics'], createdAt: Date.now()
  });

  // dailyChallenges
  await set(ref(db, `dailyChallenges/${dateKey}`), {
    dateKey, count: 2, topics: ['health','politics'], createdAt: serverTimestamp()
  });
  await set(ref(db, `dailyChallenges/${dateKey}/items/item001`), { itemRef: 'items/item001', order: 1 });
  await set(ref(db, `dailyChallenges/${dateKey}/items/item002`), { itemRef: 'items/item002', order: 2 });

  // assignments
  await set(ref(db, `assignments/${sampleUid}/days/${dateKey}`), {
    dateKey, createdAt: serverTimestamp(), done: false
  });
  await set(ref(db, `assignments/${sampleUid}/days/${dateKey}/items/item001`), {
    itemRef: 'items/item001', order: 1, servedAt: serverTimestamp()
  });

  // submissions
  const newRef = push(ref(db, `submissions/${sampleUid}`));
  await set(newRef, {
    dateKey, itemRef: 'items/item001', userLabel: 1, userReason: 'ตัวอย่าง',
    durationSec: 10, createdAt: serverTimestamp()
  });

  // userAggregates
  await update(ref(db, `userAggregates/${sampleUid}`), {
    all: { attempts: 1, correct: 1, f1: 1 },
    daily: { [dateKey]: { attempts: 1, correct: 1, f1: 1 } },
    updatedAt: serverTimestamp()
  });

  // leaderboards
  await set(ref(db, `leaderboards/daily-${dateKey}`), {
    top: [{ uid: sampleUid, score: 1, f1: 1, streak: 7 }],
    updatedAt: serverTimestamp()
  });

  console.log('✅ Seeded example data');
}

(async () => {
  try {
    // Try to sign in anonymously to satisfy common security rules (ignore failures)
    try {
      const auth = getAuth();
      await signInAnonymously(auth);
      console.log('ℹ️ Signed in anonymously');
    } catch (e) {
      console.warn('Anonymous sign-in skipped or failed:', e?.message || e);
    }

    await seedSchemaSkeleton();
    await exampleSeed();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  }
})();


