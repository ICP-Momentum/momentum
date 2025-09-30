// src/contexts/auth-context.tsx
// Momentum - Simplified Auth Context

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IcpAgent } from '../lib/icp-agent';

type AuthMethod = 'nfid' | 'internet-identity';
type HabitFrequency = 'daily' | 'weekly';
type HabitStatus = 'active' | 'paused' | 'completed' | 'archived';

interface User {
  id: string;
  principalId: string;
  username: string;
  email: string;
  profilePicture?: ArrayBuffer;
  authMethod: AuthMethod;
  walletAddress: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalHabitsCompleted: number;
  joinedAt: Date;
  lastActive: Date;
}

interface Habit {
  id: string;
  owner: string;
  name: string;
  description?: string;
  category: string;
  frequency: HabitFrequency;
  targetStreak: number;
  currentStreak: number;
  longestStreak: number;
  status: HabitStatus;
  xpPerCompletion: number;
  createdAt: Date;
  lastCompletedAt?: Date;
  totalCompletions: number;
}

interface CheckIn {
  id: string;
  habitId: string;
  owner: string;
  completedAt: Date;
  note?: string;
  xpEarned: number;
}

interface AuthContextType {
  user: User | null;
  habits: Habit[];
  connectWallet: (method: AuthMethod) => Promise<void>;
  registerUser: (data: {
    authMethod: AuthMethod;
    username: string;
    email: string;
    profilePicture?: File;
  }) => Promise<void>;
  updateProfile: (username: string, email: string) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  createHabit: (data: {
    name: string;
    description?: string;
    category: string;
    frequency: HabitFrequency;
    targetStreak: number;
    xpPerCompletion: number;
  }) => Promise<Habit>;
  getUserHabits: () => Promise<Habit[]>;
  checkInHabit: (habitId: string, note?: string) => Promise<CheckIn>;
  disconnect: () => void;
  isLoading: boolean;
  isConnected: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Initializing auth context...');

      const connected = await IcpAgent.isAuthenticated();

      if (connected) {
        console.log('✅ Wallet connected, fetching user data...');
        await refreshUserFromBackend();
        await refreshHabitsFromBackend();
      }
    } catch (error) {
      console.error('❌ Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Encode auth method to Motoko variant
  const encodeAuthMethod = (method: AuthMethod) => {
    return method === 'nfid' ? { nfid: null } : { internetIdentity: null };
  };

  // Helper: Encode habit frequency to Motoko variant
  const encodeHabitFrequency = (frequency: HabitFrequency) => {
    return frequency === 'daily' ? { daily: null } : { weekly: null };
  };

  // Helper: Decode backend data
  const decodeUser = (backendUser: any): User => {
    return {
      id: backendUser.id,
      principalId: backendUser.principalId,
      username: backendUser.username,
      email: backendUser.email,
      profilePicture:
        backendUser.profilePicture && backendUser.profilePicture[0]
          ? backendUser.profilePicture[0]
          : undefined,
      authMethod: 'nfid' in backendUser.authMethod ? 'nfid' : 'internet-identity',
      walletAddress: backendUser.walletAddress,
      totalXP: Number(backendUser.totalXP),
      level: Number(backendUser.level),
      currentStreak: Number(backendUser.currentStreak),
      longestStreak: Number(backendUser.longestStreak),
      totalHabitsCompleted: Number(backendUser.totalHabitsCompleted),
      joinedAt: new Date(Number(backendUser.joinedAt) / 1000000),
      lastActive: new Date(Number(backendUser.lastActive) / 1000000),
    };
  };

  const decodeHabit = (backendHabit: any): Habit => {
    return {
      id: backendHabit.id,
      owner: backendHabit.owner.toText(),
      name: backendHabit.name,
      description:
        backendHabit.description && backendHabit.description[0]
          ? backendHabit.description[0]
          : undefined,
      category: backendHabit.category,
      frequency: 'daily' in backendHabit.frequency ? 'daily' : 'weekly',
      targetStreak: Number(backendHabit.targetStreak),
      currentStreak: Number(backendHabit.currentStreak),
      longestStreak: Number(backendHabit.longestStreak),
      status: Object.keys(backendHabit.status)[0] as HabitStatus,
      xpPerCompletion: Number(backendHabit.xpPerCompletion),
      createdAt: new Date(Number(backendHabit.createdAt) / 1000000),
      lastCompletedAt:
        backendHabit.lastCompletedAt && backendHabit.lastCompletedAt[0]
          ? new Date(Number(backendHabit.lastCompletedAt[0]) / 1000000)
          : undefined,
      totalCompletions: Number(backendHabit.totalCompletions),
    };
  };

  const refreshUserFromBackend = async () => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) return;

      const result = await userManagementActor.getCurrentUser();

      if ('ok' in result) {
        const frontendUser = decodeUser(result.ok);
        setUser(frontendUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      setUser(null);
    }
  };

  const refreshHabitsFromBackend = async () => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) return;

      const backendHabits = await userManagementActor.getUserHabits();
      const frontendHabits = backendHabits.map(decodeHabit);
      setHabits(frontendHabits);
    } catch (error) {
      console.error('❌ Failed to refresh habits:', error);
      setHabits([]);
    }
  };

  const handleConnectWallet = async (method: AuthMethod) => {
    setIsLoading(true);
    try {
      console.log('🔌 Connecting wallet with:', method);

      let connected = false;
      if (method === 'nfid') {
        connected = await IcpAgent.authenticateWithNFID();
      } else {
        connected = await IcpAgent.authenticateWithII();
      }

      if (!connected) {
        throw new Error('Failed to connect wallet');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const userExistsResult = await userManagementActor.userExists();

      if (userExistsResult) {
        console.log('👤 Existing user, loading data...');
        await refreshUserFromBackend();
        await refreshHabitsFromBackend();
        navigate('/dashboard');
      } else {
        console.log('🆕 New user, redirecting to register...');
        navigate('/register');
      }
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterUser = async (data: {
    authMethod: AuthMethod;
    username: string;
    email: string;
    profilePicture?: File;
  }) => {
    setIsLoading(true);
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      let profilePictureBlob: ArrayBuffer | null = null;
      if (data.profilePicture) {
        profilePictureBlob = await data.profilePicture.arrayBuffer();
      }

      const authMethod = encodeAuthMethod(data.authMethod);

      const result = await userManagementActor.registerUser(
        authMethod,
        data.username,
        data.email,
        profilePictureBlob ? [new Uint8Array(profilePictureBlob)] : []
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshUserFromBackend();
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (username: string, email: string) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const result = await userManagementActor.updateProfile(username, email);

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshUserFromBackend();
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      throw error;
    }
  };

  const handleUpdateProfilePicture = async (file: File) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await userManagementActor.updateProfilePicture(new Uint8Array(arrayBuffer));

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshUserFromBackend();
    } catch (error) {
      console.error('❌ Failed to update profile picture:', error);
      throw error;
    }
  };

  const handleCreateHabit = async (data: {
    name: string;
    description?: string;
    category: string;
    frequency: HabitFrequency;
    targetStreak: number;
    xpPerCompletion: number;
  }): Promise<Habit> => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const frequency = encodeHabitFrequency(data.frequency);

      const result = await userManagementActor.createHabit(
        data.name,
        data.description ? [data.description] : [],
        data.category,
        frequency,
        data.targetStreak,
        data.xpPerCompletion
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      const newHabit = decodeHabit(result.ok);
      await refreshHabitsFromBackend();
      return newHabit;
    } catch (error) {
      console.error('❌ Failed to create habit:', error);
      throw error;
    }
  };

  const handleGetUserHabits = async (): Promise<Habit[]> => {
    await refreshHabitsFromBackend();
    return habits;
  };

  const handleCheckInHabit = async (habitId: string, note?: string): Promise<CheckIn> => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const result = await userManagementActor.checkInHabit(habitId, note ? [note] : []);

      if ('err' in result) {
        throw new Error(result.err);
      }

      const checkIn: CheckIn = {
        id: result.ok.id,
        habitId: result.ok.habitId,
        owner: result.ok.owner.toText(),
        completedAt: new Date(Number(result.ok.completedAt) / 1000000),
        note: result.ok.note && result.ok.note[0] ? result.ok.note[0] : undefined,
        xpEarned: Number(result.ok.xpEarned),
      };

      await refreshUserFromBackend();
      await refreshHabitsFromBackend();
      return checkIn;
    } catch (error) {
      console.error('❌ Failed to check in habit:', error);
      throw error;
    }
  };

  const handleDisconnect = async () => {
    try {
      await IcpAgent.logout();
      setUser(null);
      setHabits([]);
      navigate('/');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const refreshUser = async () => {
    await refreshUserFromBackend();
    await refreshHabitsFromBackend();
  };

  const isConnected = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        habits,
        connectWallet: handleConnectWallet,
        registerUser: handleRegisterUser,
        updateProfile: handleUpdateProfile,
        updateProfilePicture: handleUpdateProfilePicture,
        createHabit: handleCreateHabit,
        getUserHabits: handleGetUserHabits,
        checkInHabit: handleCheckInHabit,
        disconnect: handleDisconnect,
        isLoading,
        isConnected,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
