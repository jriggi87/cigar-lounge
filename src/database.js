import { db } from "./firebase";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, onSnapshot,
  arrayUnion, arrayRemove, serverTimestamp
} from "firebase/firestore";

// ─── User Profile ────────────────────────────────────────────────
export async function createUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), {
    name: data.name || "Aficionado",
    avatar: data.avatar || "AF",
    bio: data.bio || "Life is too short for bad cigars.",
    photo: data.photo || null,
    email: data.email || "",
    joinDate: new Date().getFullYear().toString(),
    friends: [],
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}

export function onUserProfile(uid, callback) {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

// ─── Cigars ──────────────────────────────────────────────────────
export async function saveCigar(uid, cigar) {
  const cigarRef = doc(db, "users", uid, "cigars", cigar.id);
  await setDoc(cigarRef, {
    ...cigar,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function deleteCigar(uid, cigarId) {
  await deleteDoc(doc(db, "users", uid, "cigars", cigarId));
}

export function onCigars(uid, callback) {
  const q = collection(db, "users", uid, "cigars");
  return onSnapshot(q, (snap) => {
    const cigars = [];
    snap.forEach((doc) => cigars.push({ id: doc.id, ...doc.data() }));
    callback(cigars);
  });
}

// ─── Favorites ───────────────────────────────────────────────────
export async function setFavorites(uid, favoriteIds) {
  await setDoc(doc(db, "users", uid, "meta", "favorites"), {
    ids: favoriteIds,
  });
}

export function onFavorites(uid, callback) {
  return onSnapshot(doc(db, "users", uid, "meta", "favorites"), (snap) => {
    callback(snap.exists() ? new Set(snap.data().ids || []) : new Set());
  });
}

// ─── Friends ─────────────────────────────────────────────────────
export async function searchUsers(searchTerm) {
  // Search by email or name
  const results = [];
  
  // Search by email (exact match)
  const emailQ = query(collection(db, "users"), where("email", "==", searchTerm.toLowerCase()));
  const emailSnap = await getDocs(emailQ);
  emailSnap.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  
  // If no email match, search by name prefix
  if (results.length === 0) {
    const nameQ = query(collection(db, "users"));
    const nameSnap = await getDocs(nameQ);
    nameSnap.forEach((d) => {
      const data = d.data();
      if (data.name && data.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push({ id: d.id, ...data });
      }
    });
  }
  
  return results;
}

export async function addFriend(uid, friendUid) {
  await updateDoc(doc(db, "users", uid), {
    friends: arrayUnion(friendUid),
  });
  // Also add reverse friendship
  await updateDoc(doc(db, "users", friendUid), {
    friends: arrayUnion(uid),
  });
}

export async function removeFriend(uid, friendUid) {
  await updateDoc(doc(db, "users", uid), {
    friends: arrayRemove(friendUid),
  });
  await updateDoc(doc(db, "users", friendUid), {
    friends: arrayRemove(uid),
  });
}

export async function getFriendProfiles(friendIds) {
  const profiles = [];
  for (const fid of friendIds) {
    const snap = await getDoc(doc(db, "users", fid));
    if (snap.exists()) {
      profiles.push({ id: snap.id, ...snap.data() });
    }
  }
  return profiles;
}

export async function getFriendCigars(friendUid) {
  const q = collection(db, "users", friendUid, "cigars");
  const snap = await getDocs(q);
  const cigars = [];
  snap.forEach((d) => cigars.push({ id: d.id, ...d.data() }));
  return cigars;
}
