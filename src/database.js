import { db } from "./firebase";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, onSnapshot,
  arrayUnion, arrayRemove, serverTimestamp, orderBy, limit,
  addDoc, Timestamp
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
    friendRequestsIn: [],   // UIDs of people who want to be your friend
    friendRequestsOut: [],  // UIDs of people you've sent requests to
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
    snap.forEach((d) => cigars.push({ id: d.id, ...d.data() }));
    callback(cigars);
  });
}

// ─── Favorites ───────────────────────────────────────────────────
export async function setFavorites(uid, favoriteIds) {
  await setDoc(doc(db, "users", uid, "meta", "favorites"), { ids: favoriteIds });
}

export function onFavorites(uid, callback) {
  return onSnapshot(doc(db, "users", uid, "meta", "favorites"), (snap) => {
    callback(snap.exists() ? new Set(snap.data().ids || []) : new Set());
  });
}

// ─── Friend Requests ─────────────────────────────────────────────
export async function sendFriendRequest(fromUid, toUid) {
  // Add to sender's outgoing requests
  await updateDoc(doc(db, "users", fromUid), {
    friendRequestsOut: arrayUnion(toUid),
  });
  // Add to receiver's incoming requests
  await updateDoc(doc(db, "users", toUid), {
    friendRequestsIn: arrayUnion(fromUid),
  });
}

export async function acceptFriendRequest(uid, requesterUid) {
  // Add each other as friends
  await updateDoc(doc(db, "users", uid), {
    friends: arrayUnion(requesterUid),
    friendRequestsIn: arrayRemove(requesterUid),
  });
  await updateDoc(doc(db, "users", requesterUid), {
    friends: arrayUnion(uid),
    friendRequestsOut: arrayRemove(uid),
  });
}

export async function declineFriendRequest(uid, requesterUid) {
  // Remove from both request lists
  await updateDoc(doc(db, "users", uid), {
    friendRequestsIn: arrayRemove(requesterUid),
  });
  await updateDoc(doc(db, "users", requesterUid), {
    friendRequestsOut: arrayRemove(uid),
  });
}

export async function cancelFriendRequest(uid, targetUid) {
  await updateDoc(doc(db, "users", uid), {
    friendRequestsOut: arrayRemove(targetUid),
  });
  await updateDoc(doc(db, "users", targetUid), {
    friendRequestsIn: arrayRemove(uid),
  });
}

// ─── Friends ─────────────────────────────────────────────────────
export async function searchUsers(searchTerm) {
  const results = [];
  const emailQ = query(collection(db, "users"), where("email", "==", searchTerm.toLowerCase()));
  const emailSnap = await getDocs(emailQ);
  emailSnap.forEach((d) => results.push({ id: d.id, ...d.data() }));
  
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

export async function removeFriend(uid, friendUid) {
  await updateDoc(doc(db, "users", uid), { friends: arrayRemove(friendUid) });
  await updateDoc(doc(db, "users", friendUid), { friends: arrayRemove(uid) });
}

export async function getFriendProfiles(friendIds) {
  const profiles = [];
  for (const fid of friendIds) {
    const snap = await getDoc(doc(db, "users", fid));
    if (snap.exists()) profiles.push({ id: snap.id, ...snap.data() });
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

export async function getFriendFavorites(friendUid) {
  try {
    const snap = await getDoc(doc(db, "users", friendUid, "meta", "favorites"));
    return snap.exists() ? new Set(snap.data().ids || []) : new Set();
  } catch { return new Set(); }
}

// ─── Activity Feed ───────────────────────────────────────────────
// Activity types: "smoke", "add_humidor", "rate", "favorite"
export async function postActivity(uid, activity) {
  await addDoc(collection(db, "users", uid, "activity"), {
    ...activity,
    timestamp: serverTimestamp(),
  });
}

export async function getUserActivity(uid, maxItems = 20) {
  try {
    const q = query(
      collection(db, "users", uid, "activity"),
      orderBy("timestamp", "desc"),
      limit(maxItems)
    );
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch {
    return [];
  }
}

export async function getFriendsFeed(friendIds, maxPerFriend = 10) {
  const allActivity = [];
  for (const fid of friendIds) {
    try {
      const profile = await getUserProfile(fid);
      const activity = await getUserActivity(fid, maxPerFriend);
      activity.forEach(a => {
        allActivity.push({
          ...a,
          userId: fid,
          userName: profile?.name || "Unknown",
          userAvatar: profile?.avatar || "??",
          userPhoto: profile?.photo || null,
        });
      });
    } catch {}
  }
  allActivity.sort((a, b) => {
    const ta = a.timestamp?.seconds || 0;
    const tb = b.timestamp?.seconds || 0;
    return tb - ta;
  });
  return allActivity.slice(0, 40);
}

// ─── Reactions ───────────────────────────────────────────────────
export async function addReaction(ownerUid, activityId, reactorUid, emoji) {
  const ref = doc(db, "users", ownerUid, "activity", activityId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const reactions = data.reactions || {};
  // Each user can have one reaction per post, toggle off if same emoji
  if (reactions[reactorUid] === emoji) {
    delete reactions[reactorUid];
  } else {
    reactions[reactorUid] = emoji;
  }
  await updateDoc(ref, { reactions });
}
