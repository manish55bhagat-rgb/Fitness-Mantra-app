import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  onSnapshot, 
  getDocFromServer,
  addDoc,
  deleteDoc,
  orderBy,
  query,
  limit
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  registrationDate: string;
  lastLogin: string;
  profilePhotoUrl: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  photoUrl: string;
  createdAt: string;
  subscriptionStatus: "Free" | "Standard" | "Architect Elite" | "Performance Pro" | "Free Plan" | "Pro Plan" | "Premium Plan";
  subscriptionExpiry: string;
  isOnline?: boolean;
  goal?: string;
  dietPreference?: string;
  medicalConditions?: string;
  isOnboarded?: boolean;
  selectedPlan?: string;
  paymentStatus?: string;
  accessStatus?: string;
  accessStartDate?: string;
  accessEndDate?: string;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  workoutName: string;
  duration: number; // minutes
  caloriesBurned: number;
  completed: boolean;
  timestamp: string; // ISO string
}

export interface DietLog {
  id?: string;
  userId: string;
  mealName: string;
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  timestamp: string; // ISO string
}

export interface ProgressLog {
  id?: string;
  userId: string;
  weight: number;
  bmi: number;
  bodyFat?: number;
  goalProgress?: number;
  timestamp: string; // ISO string
}

export interface SubscriptionLog {
  id?: string;
  userId: string;
  planName: string;
  transactionId: string;
  paymentStatus: string;
  purchaseDate: string;
  expiryDate: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  workouts: WorkoutLog[];
  diets: DietLog[];
  progressList: ProgressLog[];
  subscriptions: SubscriptionLog[];
  modalOpen: boolean;
  modalTab: "signin" | "signup" | "forgot";
  setModalOpen: (open: boolean) => void;
  setModalTab: (tab: "signin" | "signup" | "forgot") => void;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (fullName: string, email: string, pass: string, gender?: string, age?: number, height?: number) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  addWorkoutRecord: (name: string, duration: number, calories: number, completed: boolean) => Promise<void>;
  deleteWorkoutRecord: (id: string) => Promise<void>;
  addDietRecord: (name: string, cal: number, pro: number, carbs: number, fat: number) => Promise<void>;
  addProgressRecord: (weight: number, heightCm: number, bodyFat?: number, goalProg?: number) => Promise<void>;
  purchasePlan: (planName: string, amount: string, isSuccess: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time collections
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [diets, setDiets] = useState<DietLog[]>([]);
  const [progressList, setProgressList] = useState<ProgressLog[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionLog[]>([]);

  // UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"signin" | "signup" | "forgot">("signin");

  // Prerequisite: Verify Database Connection immediately on mount
  useEffect(() => {
    async function testFirestoreConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
      } catch (err: any) {
        if (err?.message?.includes("offline") || err?.message?.includes("network")) {
          console.warn("Firebase Client appears offline. Testing configuration details... ", err);
        }
      }
    }
    testFirestoreConnection();
  }, []);

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setProfile(null);
        setWorkouts([]);
        setDiets([]);
        setProgressList([]);
        setSubscriptions([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Listen to User data modifications in Firestore in real time
  useEffect(() => {
    if (!user) return;

    // 1. Sync User Profile
    const profileRef = doc(db, "users", user.uid);
    const unsubProfile = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      } else {
        // Fallback or setup profile if auth exists but firestore profile is missing
        const userEmail = user.email || "";
        const role = userEmail.toLowerCase().trim() === "manish55bhagat@gmail.com" ? "admin" : "user";
        const now = new Date().toISOString();
        const newProfile: UserProfile = {
          uid: user.uid,
          fullName: user.displayName || "Anonymous Professional",
          email: userEmail,
          role: role,
          registrationDate: now,
          lastLogin: now,
          profilePhotoUrl: user.photoURL || "",
          age: 26,
          gender: "Male",
          height: 175,
          weight: 70,
          photoUrl: user.photoURL || "",
          createdAt: now,
          subscriptionStatus: "Free",
          subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };
        setDoc(profileRef, newProfile)
          .then(() => {
            console.log(`[AuthContext] Fallback profile created successfully in Firestore for UID: ${user.uid} (Email: ${userEmail}, Role: ${role})`);
          })
          .catch(e => console.error("[AuthContext] Error creating fallback profile:", e));
      }
      setLoading(false);
    }, (error) => {
      console.error("Profile sync error: ", error);
      setLoading(false);
    });

    // 2. Sync Workouts Subcollection in real time
    const workoutsQuery = query(collection(db, "users", user.uid, "workouts"), orderBy("timestamp", "desc"));
    const unsubWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      const records: WorkoutLog[] = [];
      snapshot.forEach((doc) => {
        records.push({ ...(doc.data() as WorkoutLog), id: doc.id });
      });
      setWorkouts(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user?.uid}/workouts`);
    });

    // 3. Sync Diet Logs
    const dietsQuery = query(collection(db, "users", user.uid, "diets"), orderBy("timestamp", "desc"));
    const unsubDiets = onSnapshot(dietsQuery, (snapshot) => {
      const records: DietLog[] = [];
      snapshot.forEach((doc) => {
        records.push({ ...(doc.data() as DietLog), id: doc.id });
      });
      setDiets(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user?.uid}/diets`);
    });

    // 4. Sync Progress Reports
    const progressQuery = query(collection(db, "users", user.uid, "progress"), orderBy("timestamp", "desc"));
    const unsubProgress = onSnapshot(progressQuery, (snapshot) => {
      const records: ProgressLog[] = [];
      snapshot.forEach((doc) => {
        records.push({ ...(doc.data() as ProgressLog), id: doc.id });
      });
      setProgressList(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user?.uid}/progress`);
    });

    // 5. Sync Subscription Purchase Receipts
    const subQuery = query(collection(db, "users", user.uid, "subscriptions"), orderBy("purchaseDate", "desc"));
    const unsubSubs = onSnapshot(subQuery, (snapshot) => {
      const records: SubscriptionLog[] = [];
      snapshot.forEach((doc) => {
        records.push({ ...(doc.data() as SubscriptionLog), id: doc.id });
      });
      setSubscriptions(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user?.uid}/subscriptions`);
    });

    return () => {
      unsubProfile();
      unsubWorkouts();
      unsubDiets();
      unsubProgress();
      unsubSubs();
    };
  }, [user]);

  // Auth operations
  async function signInWithEmail(email: string, pass: string) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const uid = cred.user.uid;
      const userEmail = email.toLowerCase().trim();
      const role = userEmail === "manish55bhagat@gmail.com" ? "admin" : "user";
      const lastLoginTime = new Date().toISOString();
      
      const pRef = doc(db, "users", uid);
      await setDoc(pRef, { 
        lastLogin: lastLoginTime,
        role: role,
        isOnline: true
      }, { merge: true });
      console.log(`[AuthContext] Successfully logged in and updated lastLogin & isOnline=true for user UID: ${uid} (Email: ${userEmail}, Time: ${lastLoginTime}, Role: ${role})`);
    } catch (e) {
      console.error(`[AuthContext] Error in signInWithEmail for ${email}:`, e);
      throw e;
    }
  }

  async function signUpWithEmail(fullName: string, email: string, pass: string, gender: string = "Male", age: number = 25, height: number = 172) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = cred.user.uid;
      const userEmail = email.toLowerCase().trim();
      const role = userEmail === "manish55bhagat@gmail.com" ? "admin" : "user";
      const now = new Date().toISOString();

      // Automatically create corresponding user profile in firestore
      const pRef = doc(db, "users", uid);
      const initialProfile: UserProfile = {
        uid,
        fullName,
        email,
        role,
        registrationDate: now,
        lastLogin: now,
        profilePhotoUrl: "",
        age,
        gender,
        height,
        weight: 68,
        photoUrl: "",
        createdAt: now,
        subscriptionStatus: "Free",
        subscriptionExpiry: new Date().toISOString(), // expired or not set yet
        isOnline: true
      };
      await setDoc(pRef, initialProfile);
      console.log(`[AuthContext] Successfully registered and created Firestore profile with isOnline=true for user UID: ${uid} (Name: ${fullName}, Email: ${userEmail}, Role: ${role}, Time: ${now})`);
    } catch (e) {
      console.error(`[AuthContext] Error in signUpWithEmail for ${email}:`, e);
      throw e;
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userObj = cred.user;
      const userEmail = (userObj.email || "").toLowerCase().trim();
      const role = userEmail === "manish55bhagat@gmail.com" ? "admin" : "user";
      const now = new Date().toISOString();

      // Check if user profile already exists
      const pRef = doc(db, "users", userObj.uid);
      const snap = await getDoc(pRef);
      if (!snap.exists()) {
        const initialProfile: UserProfile = {
          uid: userObj.uid,
          fullName: userObj.displayName || "Google User",
          email: userObj.email || "",
          role,
          registrationDate: now,
          lastLogin: now,
          profilePhotoUrl: userObj.photoURL || "",
          age: 25,
          gender: "Male",
          height: 172,
          weight: 68,
          photoUrl: userObj.photoURL || "",
          createdAt: now,
          subscriptionStatus: "Free",
          subscriptionExpiry: new Date().toISOString(),
          isOnline: true
        };
        await setDoc(pRef, initialProfile);
        console.log(`[AuthContext] Successfully registered new user via Google Sign-In with isOnline=true for UID: ${userObj.uid} (Email: ${userEmail}, Role: ${role}, Time: ${now})`);
      } else {
        // Automatically sync role, lastLogin, and isOnline=true on Google login success
        await setDoc(pRef, { 
          role,
          lastLogin: now,
          isOnline: true
        }, { merge: true });
        console.log(`[AuthContext] Successfully logged in and updated lastLogin & isOnline=true via Google Sign-In for UID: ${userObj.uid} (Email: ${userEmail}, Role: ${role}, Time: ${now})`);
      }
    } catch (e) {
      console.error("[AuthContext] Error in signInWithGoogle:", e);
      throw e;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      throw e;
    }
  }

  async function logOut() {
    try {
      if (auth.currentUser) {
        const pRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(pRef, { isOnline: false }, { merge: true }).catch(err => {
          console.warn("[AuthContext] Ignored error setting isOnline to false during logout:", err);
        });
      }
      await signOut(auth);
    } catch (e) {
      throw e;
    }
  }

  // File Writing and edits following strict transaction error catching
  async function updateUserProfile(data: Partial<UserProfile>) {
    if (!user) return;
    const pPath = `users/${user.uid}`;
    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, pPath);
    }
  }

  async function addWorkoutRecord(name: string, duration: number, calories: number, completed: boolean) {
    if (!user) return;
    const subPath = `users/${user.uid}/workouts`;
    try {
      const newRec: Omit<WorkoutLog, "id"> = {
        userId: user.uid,
        workoutName: name,
        duration,
        caloriesBurned: calories,
        completed,
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, "users", user.uid, "workouts"), newRec);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, subPath);
    }
  }

  async function deleteWorkoutRecord(id: string) {
    if (!user) return;
    const itemPath = `users/${user.uid}/workouts/${id}`;
    try {
      await deleteDoc(doc(db, "users", user.uid, "workouts", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, itemPath);
    }
  }

  async function addDietRecord(name: string, cal: number, pro: number, carbs: number, fat: number) {
    if (!user) return;
    const subPath = `users/${user.uid}/diets`;
    try {
      const newRec: Omit<DietLog, "id"> = {
        userId: user.uid,
        mealName: name,
        calories: cal,
        protein: pro,
        carbohydrates: carbs,
        fat,
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, "users", user.uid, "diets"), newRec);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, subPath);
    }
  }

  async function addProgressRecord(weight: number, heightCm: number, bodyFat?: number, goalProg?: number) {
    if (!user) return;
    const subPath = `users/${user.uid}/progress`;
    try {
      // Metric Calculation: weight (kg) / (height (m) ^ 2)
      const heightM = heightCm / 100;
      const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
      const newRec: Omit<ProgressLog, "id"> = {
        userId: user.uid,
        weight,
        bmi,
        bodyFat: bodyFat || 18,
        goalProgress: goalProg || 50,
        timestamp: new Date().toISOString()
      };
      
      // Update weight in real-time on user doc as well
      await setDoc(doc(db, "users", user.uid), { weight, height: heightCm }, { merge: true });
      await addDoc(collection(db, "users", user.uid, "progress"), newRec);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, subPath);
    }
  }

  async function purchasePlan(planName: string, amount: string, isSuccess: boolean): Promise<boolean> {
    if (!user) {
      setModalOpen(true);
      setModalTab("signin");
      return false;
    }
    if (!isSuccess) return false;

    const subPath = `users/${user.uid}/subscriptions`;
    try {
      const purchaseDate = new Date();
      let durationMonths = 1;
      if (planName.toLowerCase().includes("elite") || planName.toLowerCase().includes("yearly")) {
        durationMonths = 12;
      } else if (planName.toLowerCase().includes("quarter")) {
        durationMonths = 3;
      }

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

      const transactionId = "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();

      const newSub: Omit<SubscriptionLog, "id"> = {
        userId: user.uid,
        planName,
        transactionId,
        paymentStatus: "Success",
        purchaseDate: purchaseDate.toISOString(),
        expiryDate: expiryDate.toISOString()
      };

      // 1. Log transaction in subcollection
      await addDoc(collection(db, "users", user.uid, "subscriptions"), newSub);

      // 2. Set plan values in UserProfile
      const mappedStatus: UserProfile["subscriptionStatus"] = planName.includes("Elite") || planName.includes("Premium") 
        ? "Premium Plan" 
        : planName.includes("Pro") 
          ? "Pro Plan" 
          : "Free Plan";

      await setDoc(doc(db, "users", user.uid), {
        subscriptionStatus: mappedStatus,
        subscriptionExpiry: expiryDate.toISOString()
      }, { merge: true });

      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, subPath);
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      workouts,
      diets,
      progressList,
      subscriptions,
      modalOpen,
      modalTab,
      setModalOpen,
      setModalTab,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      resetPassword,
      logOut,
      updateUserProfile,
      addWorkoutRecord,
      deleteWorkoutRecord,
      addDietRecord,
      addProgressRecord,
      purchasePlan
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
