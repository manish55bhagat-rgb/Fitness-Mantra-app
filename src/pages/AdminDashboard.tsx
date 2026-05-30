import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Activity, Search, Calendar, Clock, ArrowLeft, Mail, 
  X, Dumbbell, Apple, LineChart, Shield, ShieldAlert, Filter, Eye
} from "lucide-react";

interface ExtendedUserProfile {
  uid: string;
  fullName: string;
  email: string;
  role?: "admin" | "user";
  registrationDate?: string;
  lastLogin?: string;
  profilePhotoUrl?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  photoUrl?: string;
  createdAt?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  isOnline?: boolean;
}

interface SelectedUserStats {
  workouts: any[];
  diets: any[];
  progress: any[];
}

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "idle">("all");
  
  // Selected user for details view
  const [selectedUser, setSelectedUser] = useState<ExtendedUserProfile | null>(null);
  const [selectedUserStats, setSelectedUserStats] = useState<SelectedUserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Authorization Check & Real-time users subscription
  useEffect(() => {
    if (!authLoading) {
      if (!profile || profile.role !== "admin") {
        setError("ACCESS RESTRICTED: SECURITY CLEARANCE LEVEL 'ADMIN' IS REQUIRED. Admin email must be manish55bhagat@gmail.com.");
        setLoading(false);
      } else {
        setLoading(true);
        setError(null);
        console.log("[AdminDashboard] Subscribing to users collection in real-time...");
        
        const usersCollectionRef = collection(db, "users");
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
          const userList: ExtendedUserProfile[] = [];
          snapshot.forEach((doc) => {
            userList.push({ uid: doc.id, ...doc.data() } as ExtendedUserProfile);
          });
          
          // Sort alphabetically by full name in-memory to prevent missing 'fullName' field exclusion
          userList.sort((a, b) => {
            const nameA = a.fullName || a.email || "";
            const nameB = b.fullName || b.email || "";
            return nameA.localeCompare(nameB);
          });
          
          console.log(`[AdminDashboard] Query Success! Total users fetched: ${userList.length}`);
          console.log("[AdminDashboard] Firestore query result payload details:", userList.map(u => ({
            uid: u.uid,
            fullName: u.fullName,
            email: u.email,
            isOnline: u.isOnline,
            lastLogin: u.lastLogin,
            registrationDate: u.registrationDate || u.createdAt
          })));

          setUsers(userList);
          setLoading(false);
        }, (err: any) => {
          console.error("[AdminDashboard] Firestore fetch error fetching user directory records in real-time:", err);
          setError(`Failed to fetch user directory records in real-time. error: ${err.message || err}`);
          setLoading(false);
        });

        return () => {
          console.log("[AdminDashboard] Unsubscribing from users collection...");
          unsubscribe();
        };
      }
    }
  }, [profile, authLoading]);

  const fetchSelectedUserStats = async (targetUser: ExtendedUserProfile) => {
    setLoadingStats(true);
    try {
      const workoutsRef = collection(db, "users", targetUser.uid, "workouts");
      const dietsRef = collection(db, "users", targetUser.uid, "diets");
      const progressRef = collection(db, "users", targetUser.uid, "progress");

      const [workoutsSnap, dietsSnap, progressSnap] = await Promise.all([
        getDocs(query(workoutsRef, orderBy("timestamp", "desc"))).catch(() => null),
        getDocs(query(dietsRef, orderBy("timestamp", "desc"))).catch(() => null),
        getDocs(query(progressRef, orderBy("timestamp", "desc"))).catch(() => null)
      ]);

      const workouts: any[] = [];
      const diets: any[] = [];
      const progress: any[] = [];

      workoutsSnap?.forEach(doc => workouts.push({ id: doc.id, ...doc.data() }));
      dietsSnap?.forEach(doc => diets.push({ id: doc.id, ...doc.data() }));
      progressSnap?.forEach(doc => progress.push({ id: doc.id, ...doc.data() }));

      setSelectedUserStats({ workouts, diets, progress });
    } catch (err) {
      console.error("Error retrieving user metrics:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSelectUser = (userItem: ExtendedUserProfile) => {
    setSelectedUser(userItem);
    setSelectedUserStats(null);
    fetchSelectedUserStats(userItem);
  };

  // Helper: Checks if a date string is within the last 7 days
  const isActive = (lastLoginStr?: string) => {
    if (!lastLoginStr) return false;
    const lastLoginDate = new Date(lastLoginStr);
    const timeDiff = Date.now() - lastLoginDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff <= 7;
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    // Search matching
    const searchMatch = 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const roleMatch = 
      roleFilter === "all" || 
      (roleFilter === "admin" && u.role === "admin") || 
      (roleFilter === "user" ? (!u.role || u.role === "user") : true);

    // Activity status filter (Active if logged in last 7 days)
    const activeState = isActive(u.lastLogin);
    const statusMatch = 
      statusFilter === "all" ||
      (statusFilter === "active" && activeState) ||
      (statusFilter === "idle" && !activeState);

    return searchMatch && roleMatch && statusMatch;
  });

  // KPI Calculations
  const totalCount = users.length;
  const activeCount = users.filter(u => isActive(u.lastLogin)).length;
  const adminCount = users.filter(u => u.role === "admin").length;

  console.log(`[AdminDashboard] Dashboard rendering debug log: Rendering admin display with ${filteredUsers.length} of ${totalCount} users. adminCount=${adminCount}, activeCount=${activeCount}.`);

  if (error && (!profile || profile.role !== "admin")) {
    return (
      <div className="py-40 bg-deep-black min-h-screen flex items-center justify-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-10 border-red-500/20 text-center"
        >
          <div className="inline-flex w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full items-center justify-center mb-6 text-red-500">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic text-red-500 mb-4">
            Access Protocol Violated
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-8 max-w-sm line-clamp-3">
            {error}
          </p>
          <button 
            onClick={() => navigate("/")}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] tracking-widest uppercase rounded-xl border border-white/10 transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-4 h-4" /> REVERT TO BASE TERMINAL
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-32 bg-deep-black min-h-screen relative overflow-hidden text-white">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-green/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title and Back */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-neon-green mb-3">
              <Shield className="w-5 h-5" />
              <span className="text-[8px] font-black tracking-[0.55em] uppercase font-mono">
                SECURE ADMINISTRATION PORTAL
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter italic">
              User Metasystems
            </h1>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="self-start px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black tracking-widest uppercase border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Core Portal
          </button>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(57,255,20,0.3)]" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-[60px] rounded-full" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-mono font-black tracking-widest text-white/40 uppercase mb-2">
                      CORE USERS REGISTERED
                    </p>
                    <h3 className="text-4xl font-display font-black tracking-tight">{totalCount}</h3>
                  </div>
                  <div className="w-10 h-10 bg-neon-green/10 text-neon-green rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-white/30">
                  REAL-TIME SYNCED DATABASE
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-mono font-black tracking-widest text-white/40 uppercase mb-2">
                      ACTIVE BIOMETRICS (LAST 7D)
                    </p>
                    <h3 className="text-4xl font-display font-black tracking-tight text-blue-400">{activeCount}</h3>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-white/30">
                  {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}% PARTICIPATION RATE
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-mono font-black tracking-widest text-white/40 uppercase mb-2">
                      SYSTEM CLEARANCE ADMINS
                    </p>
                    <h3 className="text-4xl font-display font-black tracking-tight text-amber-500">{adminCount}</h3>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-amber-500">
                  ROOT ADMIN CONFIGURED
                </div>
              </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="glass-panel p-6 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search text */}
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="SEARCH USERS BY NAME, IDENTIFICATION EMAIL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[10px] uppercase font-bold tracking-widest text-white focus:outline-none focus:border-neon-green transition-all"
                />
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[8px] font-black uppercase text-white/40 font-mono">ROLE:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="bg-transparent text-white text-[8px] font-black tracking-widest uppercase cursor-pointer outline-none border-none py-1 pr-4 appearance-none"
                  >
                    <option value="all" className="bg-deep-black text-white">ALL</option>
                    <option value="admin" className="bg-deep-black text-white">ADMINS</option>
                    <option value="user" className="bg-deep-black text-white">STANDARD USERS</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[8px] font-black uppercase text-white/40 font-mono">STATUS:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-transparent text-white text-[8px] font-black tracking-widest uppercase cursor-pointer outline-none border-none py-1 pr-4 appearance-none"
                  >
                    <option value="all" className="bg-deep-black text-white">ALL</option>
                    <option value="active" className="bg-deep-black text-white">ACTIVE (7D)</option>
                    <option value="idle" className="bg-deep-black text-white">INACTIVE (IDLE)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DIRECTORY TABLE OR GRID */}
            <div className="glass-panel border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/80 font-mono">
                  Registry Dossier ({filteredUsers.length} listed)
                </h2>
                <span className="h-2 w-2 rounded-full bg-neon-green animate-ping inline-block" />
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-16 text-center border-t border-white/5">
                  <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                    NO USER RECORDS MATCHING THE FILTERS ARE CURRENTLY INDEXED.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5 text-[8px] font-black uppercase tracking-[0.3em] font-mono text-white/40">
                        <th className="py-5 px-6">System User / Avatar</th>
                        <th className="py-5 px-6">Digital Address</th>
                        <th className="py-5 px-6">Access Role</th>
                        <th className="py-5 px-6">Registration Date</th>
                        <th className="py-5 px-6">Last Ingress Protocol</th>
                        <th className="py-5 px-6 text-center">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[9px] font-mono font-medium text-white/70">
                      {filteredUsers.map((userItem) => {
                        const isOnline = userItem.isOnline === true || (
                          userItem.lastLogin ? (Date.now() - new Date(userItem.lastLogin).getTime() < 1000 * 60 * 5) : false
                        );
                        return (
                          <tr 
                            key={userItem.uid} 
                            className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            onClick={() => handleSelectUser(userItem)}
                          >
                            <td className="py-4 px-6 flex items-center gap-3">
                              {userItem.profilePhotoUrl || userItem.photoUrl ? (
                                <img 
                                  src={userItem.profilePhotoUrl || userItem.photoUrl} 
                                  alt="avatar" 
                                  className="w-8 h-8 rounded-full object-cover border border-white/10 group-hover:border-neon-green/50 transition-colors"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center font-bold text-white tracking-widest text-[10px]">
                                  {userItem.fullName.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-sans font-bold text-white text-[11px] uppercase group-hover:text-neon-green transition-colors">
                                  {userItem.fullName}
                                </span>
                                <span className="text-[7px] text-white/30 uppercase tracking-widest mt-0.5">
                                  UID: {userItem.uid.substring(0, 8)}...
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-white/50 lowercase">
                              {userItem.email}
                            </td>
                            <td className="py-4 px-6">
                              {userItem.role === "admin" ? (
                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[7px] font-black uppercase tracking-widest">
                                  ADMIN
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-white/5 text-white/50 border border-white/10 rounded text-[7px] font-black uppercase tracking-widest">
                                  USER
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-white/40">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {userItem.registrationDate 
                                  ? new Date(userItem.registrationDate).toLocaleDateString()
                                  : userItem.createdAt 
                                    ? new Date(userItem.createdAt).toLocaleDateString()
                                    : "Legacy / N/A"}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-neon-green shadow-glow animate-pulse' : 'bg-red-500'}`} />
                                  <span className={isOnline ? 'text-neon-green font-bold' : 'text-white/40'}>
                                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                                  </span>
                                </div>
                                <span className="text-[7.5px] text-white/30 font-mono mt-0.5 block">
                                  {userItem.lastLogin 
                                    ? new Date(userItem.lastLogin).toLocaleString() 
                                    : "No Record Yet"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectUser(userItem);
                                }}
                                className="p-2 hover:bg-neon-green hover:text-black rounded-lg transition-all text-white/40 flex items-center justify-center mx-auto"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* EXPANDED USER DETAILS DRAWER / STATS MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black backdrop-blur-md"
            />

            {/* Sidebar drawer panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-xl bg-deep-black border-l border-white/15 h-screen overflow-y-auto p-10 z-10 flex flex-col gap-8 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Close and Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-neon-green font-bold text-xs uppercase font-mono border border-white/10">
                    BIO
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tighter italic">
                      Biometric Dossier
                    </h2>
                    <p className="text-[7px] font-mono tracking-[0.4em] text-white/20 uppercase">
                      Individual Subject Parameterization
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Banner */}
              <div className="glass-panel p-6 border-white/10 bg-white/[0.01] flex items-center gap-5">
                {selectedUser.profilePhotoUrl || selectedUser.photoUrl ? (
                  <img 
                    src={selectedUser.profilePhotoUrl || selectedUser.photoUrl} 
                    alt="avatar" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-neon-green"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 bg-neon-green text-black rounded-2xl flex items-center justify-center font-black tracking-widest text-lg">
                    {selectedUser.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-display font-black uppercase tracking-tight text-white mb-0.5">
                    {selectedUser.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-[9px] font-mono">
                    <Mail className="w-3 h-3 text-white/30" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-neon-green/15 text-neon-green text-[7px] font-black uppercase tracking-widest border border-neon-green/30 rounded">
                      {selectedUser.subscriptionStatus || "Free Member"}
                    </span>
                    <span className="text-[7px] font-mono text-white/30">
                      UID: {selectedUser.uid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Parameters Summary Grid */}
              <div>
                <h4 className="text-[8px] font-black tracking-[0.3em] text-white/30 uppercase mb-4 font-mono">
                  PHYSIOLOGICAL METRICS
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[7px] font-black tracking-widest uppercase text-white/30 block mb-1">AGE</span>
                    <span className="text-sm font-bold text-white font-mono">{selectedUser.age || 25}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[7px] font-black tracking-widest uppercase text-white/30 block mb-1">GENDER</span>
                    <span className="text-sm font-bold text-white font-mono uppercase">{selectedUser.gender || "M"}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[7px] font-black tracking-widest uppercase text-white/30 block mb-1">HEIGHT (CM)</span>
                    <span className="text-sm font-bold text-white font-mono">{selectedUser.height || 172}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <span className="text-[7px] font-black tracking-widest uppercase text-white/30 block mb-1">WEIGHT (KG)</span>
                    <span className="text-sm font-bold text-white font-mono">{selectedUser.weight || 68}</span>
                  </div>
                </div>
              </div>

              {/* Nested Subcollections / Active Logs */}
              <div className="space-y-6">
                <hr className="border-white/5" />
                <h4 className="text-[8px] font-black tracking-[0.3em] text-white/30 uppercase font-mono flex items-center justify-between">
                  <span>BIO-DIAGNOSTIC METRIC LOGS</span>
                  {loadingStats && <span className="text-[7px] text-neon-green animate-pulse">SYNCING RECORDS...</span>}
                </h4>

                {loadingStats ? (
                  <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : selectedUserStats ? (
                  <div className="space-y-6">
                    {/* Log Counts Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Workouts logged count */}
                      <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-neon-green/10 text-neon-green rounded-lg flex items-center justify-center shrink-0">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black tracking-widest text-white/40 uppercase">WORKOUTS</span>
                          <span className="text-base font-bold font-mono">{selectedUserStats.workouts.length} logs</span>
                        </div>
                      </div>

                      {/* Nutrient logged count */}
                      <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                          <Apple className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black tracking-widest text-white/40 uppercase">NUTRITION</span>
                          <span className="text-base font-bold font-mono">{selectedUserStats.diets.length} meals</span>
                        </div>
                      </div>

                      {/* Progress measurements count */}
                      <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                          <LineChart className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black tracking-widest text-white/40 uppercase">REPORTS</span>
                          <span className="text-base font-bold font-mono">{selectedUserStats.progress.length} snaps</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Lists tabs */}
                    <div className="space-y-4">
                      {/* Latests inputs overview */}
                      <div className="glass-panel p-5 border-white/5 space-y-4">
                        <h5 className="text-[9px] font-black tracking-widest text-white/80 uppercase font-mono">
                          Recent Exercise Logs
                        </h5>
                        {selectedUserStats.workouts.length === 0 ? (
                          <div className="text-[8px] font-mono text-white/20 uppercase py-2">
                            NO ACTIVE EXERCISE CYCLES LOGGED IN USER DATASETS.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[140px] overflow-y-auto">
                            {selectedUserStats.workouts.slice(0, 3).map((w, index) => (
                              <div key={w.id || index} className="flex justify-between items-center text-[9px] font-mono py-1.5 border-b border-white/5 last:border-none">
                                <div className="flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${w.completed ? 'bg-neon-green' : 'bg-red-500'}`} />
                                  <span className="text-white uppercase font-bold">{w.workoutName}</span>
                                </div>
                                <div className="text-white/40">
                                  <span>{w.duration} min</span> • <span className="text-neon-green font-bold">{w.caloriesBurned} kcal</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="glass-panel p-5 border-white/5 space-y-4">
                        <h5 className="text-[9px] font-black tracking-widest text-white/80 uppercase font-mono">
                          Recent Food Logs
                        </h5>
                        {selectedUserStats.diets.length === 0 ? (
                          <div className="text-[8px] font-mono text-white/20 uppercase py-2">
                            NO NUTRITIONAL BREAKDOWNS INDEXED IN SYSTEM FOR THIS USER.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[140px] overflow-y-auto">
                            {selectedUserStats.diets.slice(0, 3).map((d, index) => (
                              <div key={d.id || index} className="flex justify-between items-center text-[9px] font-mono py-1.5 border-b border-white/5 last:border-none">
                                <span className="text-white uppercase font-bold">{d.mealName}</span>
                                <div className="text-white/40">
                                  <span className="text-blue-400 font-bold">{d.calories} kcal</span> • <span>p: {d.protein}g</span> • <span>c: {d.carbohydrates}g</span> • <span>f: {d.fat}g</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/20">
                    UNABLE TO RETRIEVE USER STATS AND SUBCOLLECTION METRICS.
                  </div>
                )}
              </div>

              {/* Ingress Logs History */}
              <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2 font-mono text-[8.5px] text-white/30">
                <div className="flex justify-between">
                  <span>LAST ACTIVE DATE</span>
                  <span className="text-white/60">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>REGISTRATION STAMP</span>
                  <span className="text-white/60">
                    {selectedUser.registrationDate 
                      ? new Date(selectedUser.registrationDate).toLocaleString() 
                      : selectedUser.createdAt 
                        ? new Date(selectedUser.createdAt).toLocaleString() 
                        : "N/A"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
