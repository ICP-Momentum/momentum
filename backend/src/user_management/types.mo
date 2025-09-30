// backend/src/user_management/types.mo
// Momentum - AI-Powered On-Chain Habit Tracker for Traders

import _Time "mo:base/Time";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

module {

    // Authentication method enumeration
    public type AuthMethod = {
        #nfid;
        #internetIdentity;
    };

    // Habit frequency
    public type HabitFrequency = {
        #daily;
        #weekly;
    };

    // Habit status
    public type HabitStatus = {
        #active;
        #paused;
        #completed;
        #archived;
    };

    // User type
    public type User = {
        id: Text;
        principalId: Text;
        username: Text;
        email: Text;
        profilePicture: ?Blob;
        authMethod: AuthMethod;
        walletAddress: Text;
        totalXP: Nat;
        level: Nat;
        currentStreak: Nat;
        longestStreak: Nat;
        totalHabitsCompleted: Nat;
        joinedAt: Int;
        lastActive: Int;
    };

    // Habit type
    public type Habit = {
        id: Text;
        owner: Principal;
        name: Text;
        description: ?Text;
        category: Text; // e.g., "journaling", "risk management", "market analysis"
        frequency: HabitFrequency;
        targetStreak: Nat;
        currentStreak: Nat;
        longestStreak: Nat;
        status: HabitStatus;
        xpPerCompletion: Nat;
        createdAt: Int;
        lastCompletedAt: ?Int;
        totalCompletions: Nat;
    };

    // Check-in record
    public type CheckIn = {
        id: Text;
        habitId: Text;
        owner: Principal;
        completedAt: Int;
        note: ?Text;
        xpEarned: Nat;
    };

    // User registration request
    public type UserRegistration = {
        authMethod: AuthMethod;
        username: Text;
        email: Text;
        profilePicture: ?Blob;
    };

    // User profile update request
    public type UserProfileUpdate = {
        username: Text;
        email: Text;
    };

    // Habit creation request
    public type HabitCreation = {
        name: Text;
        description: ?Text;
        category: Text;
        frequency: HabitFrequency;
        targetStreak: Nat;
        xpPerCompletion: Nat;
    };

    // Check-in creation request
    public type CheckInCreation = {
        habitId: Text;
        note: ?Text;
    };

    // Error types
    public type UserError = {
        #UserNotFound;
        #UserAlreadyExists;
        #HabitNotFound;
        #HabitAlreadyExists;
        #CheckInTooSoon;
        #Unauthorized;
        #ValidationError: Text;
    };

    // Pagination
    public type Pagination = {
        offset: Nat;
        limit: Nat;
    };

    // User statistics
    public type UserStats = {
        totalUsers: Nat;
        totalHabits: Nat;
        totalCheckIns: Nat;
        averageStreakLength: Nat;
        topUsers: [User];
    };

    // Habit statistics
    public type HabitStats = {
        totalHabits: Nat;
        activeHabits: Nat;
        completedHabits: Nat;
        totalCheckIns: Nat;
        averageCompletionRate: Nat;
    };

    // User dashboard data
    public type UserDashboard = {
        user: User;
        habits: [Habit];
        recentCheckIns: [CheckIn];
        stats: {
            totalXP: Nat;
            level: Nat;
            currentStreak: Nat;
            habitsCompleted: Nat;
        };
    };
}