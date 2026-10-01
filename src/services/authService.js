/**
 * Authentication Service for Aastha General Store
 * Integrated with Firebase Authentication & Cloud Firestore 'users' collection.
 * Supports email/password auth, secure role verification, profile updates, and offline fallback.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile as updateFirebaseAuthProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, COLLECTIONS, ADMIN_CREDENTIALS } from '../firebase';
import { storageService } from './storageService';
import { generateSalt, hashPasswordWithSalt, sha256 } from '../utils/crypto';

const SESSION_STORAGE_KEY = 'aastha_session';
const USERS_STORAGE_KEY = 'aastha_users';
const AUTH_UPDATE_EVENT = 'aastha_auth_updated';
const ADMIN_OVERRIDE_KEY = 'aastha_admin_override';
const ADMIN_SETTINGS_COLLECTION = 'store_settings';
const ADMIN_SETTINGS_DOC = 'admin';

// Designated Admin Configuration
export const ADMIN_CONFIG = {
  username: ADMIN_CREDENTIALS.defaultUsername, // 'masterSam'
  email: ADMIN_CREDENTIALS.defaultEmail,       // 'admin@aasthastore.com'
  defaultPassword: 'Aastha@Jaunpur2026',
  // SHA-256 fallback hash for local offline testing
  passwordHash: 'b4cfa147e359743e6a2224ae6ecca4fa656000412a736997a414d65abe903ab3',
};

// Normalize username into a valid email if no domain is provided
function resolveEmail(emailOrUser) {
  const trimmed = emailOrUser.trim().toLowerCase();
  if (trimmed.includes('@')) return trimmed;
  if (trimmed === ADMIN_CONFIG.username.toLowerCase()) return ADMIN_CONFIG.email;
  return `${trimmed.replace(/[^a-z0-9_]/g, '')}@aasthastore.com`;
}

// Returns the currently configured admin username (custom one if changed, else default)
async function getConfiguredAdminUsername() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, ADMIN_SETTINGS_COLLECTION, ADMIN_SETTINGS_DOC));
      if (snap.exists() && snap.data().username) return snap.data().username;
    } catch (e) {
      console.warn('[authService] Could not read admin settings:', e);
    }
  }
  const override = storageService.getItem(ADMIN_OVERRIDE_KEY, null);
  return override?.username || ADMIN_CONFIG.username;
}

function notifyAuthChange(sessionUser) {
  storageService.setItem(SESSION_STORAGE_KEY, sessionUser);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_UPDATE_EVENT, { detail: sessionUser }));
  }
}

export const authService = {
  /**
   * Fetch current cached user session
   */
  getCurrentSession: () => {
    return storageService.getItem(SESSION_STORAGE_KEY, null);
  },

  /**
   * Subscribe to auth changes (Firebase Auth state + local storage changes)
   * @param {Function} callback 
   * @returns {Function} Unsubscribe
   */
  subscribe: (callback) => {
    let unsubscribeFirebase = null;

    if (isFirebaseConfigured && auth) {
      try {
        unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            let userData = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
              avatar: firebaseUser.photoURL || '',
              role: firebaseUser.email === ADMIN_CONFIG.email ? 'admin' : 'customer',
              phone: '',
              address: '',
            };

            // Fetch extra profile data from Firestore if available
            if (db) {
              try {
                const userDocRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                  const firestoreData = userDocSnap.data();
                  userData = { ...userData, ...firestoreData };
                }
              } catch (dbErr) {
                console.warn('[authService] Could not read user profile doc:', dbErr);
              }
            }

            storageService.setItem(SESSION_STORAGE_KEY, userData);
            callback(userData);
          } else {
            // No user in Firebase
            storageService.removeItem(SESSION_STORAGE_KEY);
            callback(null);
          }
        });
      } catch (err) {
        console.error('[authService] Firebase auth listener failed:', err);
      }
    }

    // Local event listener
    const handleLocalUpdate = (e) => {
      callback(e.detail || authService.getCurrentSession());
    };

    window.addEventListener(AUTH_UPDATE_EVENT, handleLocalUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === SESSION_STORAGE_KEY) {
        callback(authService.getCurrentSession());
      }
    });

    // Fire initial state
    callback(authService.getCurrentSession());

    return () => {
      if (unsubscribeFirebase) unsubscribeFirebase();
      window.removeEventListener(AUTH_UPDATE_EVENT, handleLocalUpdate);
    };
  },

  /**
   * Register a new customer via Firebase Authentication & Cloud Firestore
   * @param {Object} data - { name, email, username, phone, address, password }
   * @returns {Promise<Object>}
   */
  register: async ({ name, email, username, phone, address, password }) => {
    const finalEmail = resolveEmail(email || username || '');
    const cleanName = name.trim();
    const cleanPhone = phone?.trim() || '';
    const cleanAddress = address?.trim() || '';

    if (!finalEmail || !password || password.length < 6) {
      throw new Error('Please provide a valid email and a password of at least 6 characters.');
    }

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, password);
        const firebaseUser = userCredential.user;

        // Update Auth Display Name
        await updateFirebaseAuthProfile(firebaseUser, {
          displayName: cleanName,
        });

        // Determine Role
        const role = finalEmail === ADMIN_CONFIG.email ? 'admin' : 'customer';

        const userProfile = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: cleanName,
          email: finalEmail,
          phone: cleanPhone,
          address: cleanAddress,
          avatar: '',
          role,
          createdAt: new Date().toISOString(),
        };

        // Write to Firestore 'users' collection
        if (db) {
          try {
            await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), userProfile);
          } catch (fsErr) {
            console.warn('[authService] Failed writing user doc to Firestore:', fsErr);
          }
        }

        notifyAuthChange(userProfile);
        return userProfile;
      } catch (fbErr) {
        if (fbErr.code === 'auth/email-already-in-use') {
          throw new Error('An account with this email/username already exists. Please log in.');
        } else if (fbErr.code === 'auth/weak-password') {
          throw new Error('Password should be at least 6 characters long.');
        }
        throw new Error(fbErr.message || 'Registration failed.');
      }
    }

    // Local Fallback Registration
    const users = storageService.getItem(USERS_STORAGE_KEY, []);
    const existing = users.find((u) => u.email === finalEmail || (username && u.username === username.toLowerCase()));
    if (existing) {
      throw new Error('An account with this username/email already exists.');
    }

    const salt = generateSalt(16);
    const passwordHash = await hashPasswordWithSalt(password, salt);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      uid: `usr_${Date.now()}`,
      name: cleanName,
      email: finalEmail,
      username: username ? username.toLowerCase() : finalEmail.split('@')[0],
      phone: cleanPhone,
      address: cleanAddress,
      avatar: '',
      role: finalEmail === ADMIN_CONFIG.email ? 'admin' : 'customer',
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storageService.setItem(USERS_STORAGE_KEY, users);

    const sessionUser = { ...newUser };
    delete sessionUser.salt;
    delete sessionUser.passwordHash;
    notifyAuthChange(sessionUser);
    return sessionUser;
  },

  /**
   * Unified login with Email or Username and Password
   * @param {string} emailOrUser 
   * @param {string} password 
   */
  login: async (emailOrUser, password) => {
    const finalEmail = resolveEmail(emailOrUser);

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, finalEmail, password);
        const firebaseUser = userCredential.user;

        let role = finalEmail === ADMIN_CONFIG.email ? 'admin' : 'customer';
        let userDocData = {};

        if (db) {
          try {
            const userDocSnap = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
            if (userDocSnap.exists()) {
              userDocData = userDocSnap.data();
              if (userDocData.role) role = userDocData.role;
            }
          } catch (e) {
            console.warn('[authService] Could not read Firestore user:', e);
          }
        }

        const sessionUser = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || userDocData.name || finalEmail.split('@')[0],
          avatar: firebaseUser.photoURL || userDocData.avatar || '',
          phone: userDocData.phone || '',
          address: userDocData.address || '',
          role,
        };

        notifyAuthChange(sessionUser);
        return sessionUser;
      } catch (fbErr) {
        if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found') {
          throw new Error('Invalid email or password. Please verify your credentials.');
        }
        throw new Error(fbErr.message || 'Login failed. Please try again.');
      }
    }

    // Local Fallback Login
    const users = storageService.getItem(USERS_STORAGE_KEY, []);
    const user = users.find(
      (u) =>
        u.email?.toLowerCase() === finalEmail.toLowerCase() ||
        u.username?.toLowerCase() === emailOrUser.toLowerCase().trim()
    );

    if (!user) {
      // Check admin hardcoded fallback
      if (
        emailOrUser.trim() === ADMIN_CONFIG.username ||
        emailOrUser.trim().toLowerCase() === ADMIN_CONFIG.email
      ) {
        return await authService.adminLogin(emailOrUser, password);
      }
      throw new Error('Account not found. Please register or check your login details.');
    }

    const calculatedHash = await hashPasswordWithSalt(password, user.salt);
    if (calculatedHash !== user.passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    const sessionUser = { ...user };
    delete sessionUser.salt;
    delete sessionUser.passwordHash;
    notifyAuthChange(sessionUser);
    return sessionUser;
  },

  /**
   * Admin Authentication
   * @param {string} usernameOrEmail 
   * @param {string} password 
   */
  adminLogin: async (usernameOrEmail, password) => {
    const configuredUsername = await getConfiguredAdminUsername();
    const typed = usernameOrEmail.trim();
    const isTargetAdmin =
      typed.toLowerCase() === configuredUsername.toLowerCase() ||
      typed.toLowerCase() === ADMIN_CONFIG.email;

    if (!isTargetAdmin) {
      throw new Error('Unauthorized. This username/email does not possess admin privileges.');
    }

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, ADMIN_CONFIG.email, password);
        const fbUser = userCredential.user;

        // Ensure user document has role: admin
        if (db) {
          try {
            await setDoc(
              doc(db, COLLECTIONS.USERS, fbUser.uid),
              {
                id: fbUser.uid,
                email: ADMIN_CONFIG.email,
                name: 'Store Administrator',
                role: 'admin',
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e) {
            console.warn('[authService] Firestore admin doc update warning:', e);
          }
        }

        const adminSession = {
          id: fbUser.uid,
          uid: fbUser.uid,
          name: 'Store Administrator',
          email: ADMIN_CONFIG.email,
          username: configuredUsername,
          role: 'admin',
          avatar: fbUser.photoURL || '',
        };

        notifyAuthChange(adminSession);
        return adminSession;
      } catch (fbErr) {
        // If admin account doesn't exist yet in Firebase Auth, attempt to create it automatically!
        if (
          (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') &&
          password === ADMIN_CONFIG.defaultPassword
        ) {
          try {
            // Attempt auto-provisioning initial admin account
            const newCred = await createUserWithEmailAndPassword(auth, ADMIN_CONFIG.email, password);
            const fbUser = newCred.user;
            await updateFirebaseAuthProfile(fbUser, { displayName: 'Store Administrator' });

            if (db) {
              await setDoc(doc(db, COLLECTIONS.USERS, fbUser.uid), {
                id: fbUser.uid,
                email: ADMIN_CONFIG.email,
                name: 'Store Administrator',
                role: 'admin',
                createdAt: new Date().toISOString(),
              });
            }

            const adminSession = {
              id: fbUser.uid,
              uid: fbUser.uid,
              name: 'Store Administrator',
              email: ADMIN_CONFIG.email,
              username: configuredUsername,
              role: 'admin',
            };
            notifyAuthChange(adminSession);
            return adminSession;
          } catch (provErr) {
            console.warn('[authService] Admin auto-provision failed:', provErr);
          }
        }
        throw new Error('Admin authentication failed. Please verify admin password.');
      }
    }

    // Local Admin Fallback
    const inputHash = await sha256(password);
    const override = storageService.getItem(ADMIN_OVERRIDE_KEY, null);
    const passwordOk = override?.passwordHash
      ? inputHash === override.passwordHash
      : password === ADMIN_CONFIG.defaultPassword || inputHash === ADMIN_CONFIG.passwordHash;
    if (passwordOk) {
      const adminSession = {
        id: 'admin_root_masterSam',
        uid: 'admin_root_masterSam',
        name: 'Store Administrator',
        username: configuredUsername,
        email: ADMIN_CONFIG.email,
        phone: ADMIN_CREDENTIALS.storePhone,
        address: 'Main Market, Jaunpur, UP',
        role: 'admin',
      };
      notifyAuthChange(adminSession);
      return adminSession;
    }

    throw new Error('Invalid Admin password.');
  },

  /**
   * Get the current admin username (for showing in Admin Settings)
   */
  getAdminUsername: () => getConfiguredAdminUsername(),

  /**
   * Change admin username and/or password. Current password is always required.
   * @param {{currentPassword: string, newUsername?: string, newPassword?: string}} params
   */
  changeAdminCredentials: async ({ currentPassword, newUsername, newPassword }) => {
    const cleanUsername = (newUsername || '').trim();
    if (!currentPassword) throw new Error('Please enter your current admin password.');
    if (!cleanUsername && !newPassword) throw new Error('Enter a new username or a new password.');
    if (cleanUsername && !/^[A-Za-z0-9_]{4,20}$/.test(cleanUsername)) {
      throw new Error('Username must be 4-20 characters (letters, numbers, underscore only).');
    }
    if (newPassword && newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        const credential = EmailAuthProvider.credential(ADMIN_CONFIG.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        if (newPassword) await updatePassword(auth.currentUser, newPassword);
      } catch (fbErr) {
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
          throw new Error('Current password is incorrect.');
        }
        throw new Error(fbErr.message || 'Failed to update admin credentials.');
      }
      if (cleanUsername && db) {
        await setDoc(
          doc(db, ADMIN_SETTINGS_COLLECTION, ADMIN_SETTINGS_DOC),
          { username: cleanUsername, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      }
      return { success: true, username: cleanUsername || (await getConfiguredAdminUsername()) };
    }

    // Local fallback mode
    const override = storageService.getItem(ADMIN_OVERRIDE_KEY, null);
    const inputHash = await sha256(currentPassword);
    const currentOk = override?.passwordHash
      ? inputHash === override.passwordHash
      : currentPassword === ADMIN_CONFIG.defaultPassword || inputHash === ADMIN_CONFIG.passwordHash;
    if (!currentOk) throw new Error('Current password is incorrect.');

    const updated = {
      username: cleanUsername || override?.username || ADMIN_CONFIG.username,
      passwordHash: newPassword ? await sha256(newPassword) : override?.passwordHash || '',
    };
    storageService.setItem(ADMIN_OVERRIDE_KEY, updated);
    return { success: true, username: updated.username };
  },

  /**
   * Log out currently signed-in user
   */
  logout: async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('[authService] Firebase sign out error:', err);
      }
    }
    storageService.removeItem(SESSION_STORAGE_KEY);
    notifyAuthChange(null);
  },

  /**
   * Update User Profile (name, phone, address, avatar)
   * Updates Firebase Auth profile + Cloud Firestore user document.
   * @param {string} userId 
   * @param {Object} updateData 
   */
  updateUserProfile: async (userId, updateData) => {
    const current = authService.getCurrentSession() || {};

    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        const authUpdates = {};
        if (updateData.name) authUpdates.displayName = updateData.name;
        if (updateData.avatar) authUpdates.photoURL = updateData.avatar;
        if (Object.keys(authUpdates).length > 0) {
          await updateFirebaseAuthProfile(auth.currentUser, authUpdates);
        }

        if (db && userId) {
          await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
            ...updateData,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('[authService] Firebase profile update warning:', err);
      }
    }

    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    notifyAuthChange(updated);
    return updated;
  },

  /**
   * Change password with current-password verification
   * In Firebase: reauthenticates with current password before executing updatePassword.
   * @param {string} userId 
   * @param {string} currentPassword 
   * @param {string} newPassword 
   */
  changePassword: async (userId, currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        // Verify current password first
        await reauthenticateWithCredential(auth.currentUser, credential);
        // Update password in Firebase Auth
        await updatePassword(auth.currentUser, newPassword);
        return { success: true };
      } catch (fbErr) {
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
          throw new Error('Current password is incorrect.');
        }
        throw new Error(fbErr.message || 'Failed to update password.');
      }
    }

    // Local Fallback
    const users = storageService.getItem(USERS_STORAGE_KEY, []);
    const userIndex = users.findIndex((u) => u.id === userId || u.uid === userId);
    if (userIndex === -1) {
      throw new Error('User account not found.');
    }

    const targetUser = users[userIndex];
    const currentHash = await hashPasswordWithSalt(currentPassword, targetUser.salt);
    if (currentHash !== targetUser.passwordHash) {
      throw new Error('Current password is incorrect.');
    }

    const newSalt = generateSalt(16);
    const newHash = await hashPasswordWithSalt(newPassword, newSalt);

    users[userIndex] = {
      ...targetUser,
      salt: newSalt,
      passwordHash: newHash,
      updatedAt: new Date().toISOString(),
    };

    storageService.setItem(USERS_STORAGE_KEY, users);
    return { success: true };
  },
};