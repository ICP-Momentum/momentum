// backend/src/user_management/main.mo
// Momentum - AI-Powered On-Chain Habit Tracker for Traders

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Int "mo:base/Int";

import Types "./types";

persistent actor UserManagement {

    // Type aliases
    type User = Types.User;
    type AuthMethod = Types.AuthMethod;
    type Habit = Types.Habit;
    type HabitFrequency = Types.HabitFrequency;
    type HabitStatus = Types.HabitStatus;
    type CheckIn = Types.CheckIn;
    type Result<T, E> = Result.Result<T, E>;
    type UserId = Text;

    // STABLE STORAGE
    private var userEntries : [(Principal, User)] = [];
    private var habitEntries : [(Text, Habit)] = [];
    private var checkInEntries : [(Text, CheckIn)] = [];
    private var userIdCounter : Nat = 0;
    private var habitIdCounter : Nat = 0;
    private var checkInIdCounter : Nat = 0;
    private var _migrationVersion: Nat = 3;

    // RUNTIME STORAGE
    private transient var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private transient var habits = HashMap.HashMap<Text, Habit>(50, Text.equal, Text.hash);
    private transient var checkIns = HashMap.HashMap<Text, CheckIn>(200, Text.equal, Text.hash);
    private transient var userHabits = HashMap.HashMap<Principal, [Text]>(10, Principal.equal, Principal.hash);
    private transient var habitCheckIns = HashMap.HashMap<Text, [Text]>(50, Text.equal, Text.hash);

    // System functions
    system func preupgrade() {
        Debug.print("📦 Pre-upgrade: Preparing stable storage...");
        userEntries := Iter.toArray(users.entries());
        habitEntries := Iter.toArray(habits.entries());
        checkInEntries := Iter.toArray(checkIns.entries());
        Debug.print("📦 Saved to stable storage");
    };

    system func postupgrade() {
        Debug.print("🔄 Post-upgrade: Loading from stable storage...");
        users := HashMap.fromIter(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
        habits := HashMap.fromIter(habitEntries.vals(), habitEntries.size(), Text.equal, Text.hash);
        checkIns := HashMap.fromIter(checkInEntries.vals(), checkInEntries.size(), Text.equal, Text.hash);

        // Rebuild indexes
        for ((principal, _user) in users.entries()) {
            let userHabitsList = Array.filter<(Text, Habit)>(Iter.toArray(habits.entries()), func((_, h)) { h.owner == principal });
            let habitIds = Array.map<(Text, Habit), Text>(userHabitsList, func((id, _)) { id });
            userHabits.put(principal, habitIds);
        };

        for ((habitId, _habit) in habits.entries()) {
            let habitCheckInsList = Array.filter<(Text, CheckIn)>(Iter.toArray(checkIns.entries()), func((_, c)) { c.habitId == habitId });
            let checkInIds = Array.map<(Text, CheckIn), Text>(habitCheckInsList, func((id, _)) { id });
            habitCheckIns.put(habitId, checkInIds);
        };

        userEntries := [];
        habitEntries := [];
        checkInEntries := [];
        Debug.print("✅ Post-upgrade completed");
    };

    // Helper function for XP to level calculation
    private func calculateLevel(xp: Nat) : Nat {
        // Simple formula: Level = floor(XP / 100)
        xp / 100
    };

    // USER MANAGEMENT

    // Register new user
    public shared(msg) func registerUser(
        authMethod: AuthMethod,
        username: Text,
        email: Text,
        profilePicture: ?Blob
    ) : async Result<User, Text> {
        let caller = msg.caller;

        switch(users.get(caller)) {
            case (?_existingUser) {
                return #err("User already registered");
            };
            case null {};
        };

        userIdCounter += 1;
        let userId = "user_" # Nat.toText(userIdCounter);

        let newUser : User = {
            id = userId;
            principalId = Principal.toText(caller);
            username = username;
            email = email;
            profilePicture = profilePicture;
            authMethod = authMethod;
            walletAddress = Principal.toText(caller);
            totalXP = 0;
            level = 0;
            currentStreak = 0;
            longestStreak = 0;
            totalHabitsCompleted = 0;
            joinedAt = Time.now();
            lastActive = Time.now();
        };

        users.put(caller, newUser);
        userHabits.put(caller, []);

        Debug.print("User registered: " # userId);
        #ok(newUser)
    };

    // Get current user
    public shared(msg) func getCurrentUser() : async Result<User, Text> {
        let caller = msg.caller;

        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    username = user.username;
                    email = user.email;
                    profilePicture = user.profilePicture;
                    authMethod = user.authMethod;
                    walletAddress = user.walletAddress;
                    totalXP = user.totalXP;
                    level = user.level;
                    currentStreak = user.currentStreak;
                    longestStreak = user.longestStreak;
                    totalHabitsCompleted = user.totalHabitsCompleted;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };

                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Update user profile
    public shared(msg) func updateProfile(
        username: Text,
        email: Text
    ) : async Result<User, Text> {
        let caller = msg.caller;

        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    username = username;
                    email = email;
                    profilePicture = user.profilePicture;
                    authMethod = user.authMethod;
                    walletAddress = user.walletAddress;
                    totalXP = user.totalXP;
                    level = user.level;
                    currentStreak = user.currentStreak;
                    longestStreak = user.longestStreak;
                    totalHabitsCompleted = user.totalHabitsCompleted;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };

                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Update profile picture
    public shared(msg) func updateProfilePicture(profilePicture: Blob) : async Result<User, Text> {
        let caller = msg.caller;

        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    username = user.username;
                    email = user.email;
                    profilePicture = ?profilePicture;
                    authMethod = user.authMethod;
                    walletAddress = user.walletAddress;
                    totalXP = user.totalXP;
                    level = user.level;
                    currentStreak = user.currentStreak;
                    longestStreak = user.longestStreak;
                    totalHabitsCompleted = user.totalHabitsCompleted;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };

                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Check if user exists
    public shared(msg) func userExists() : async Bool {
        switch(users.get(msg.caller)) {
            case null false;
            case (?_) true;
        };
    };

    // HABIT MANAGEMENT

    // Create new habit
    public shared(msg) func createHabit(
        name: Text,
        description: ?Text,
        category: Text,
        frequency: HabitFrequency,
        targetStreak: Nat,
        xpPerCompletion: Nat
    ) : async Result<Habit, Text> {
        let caller = msg.caller;

        switch(users.get(caller)) {
            case null {
                return #err("User not found. Please register first.");
            };
            case (?_user) {
                habitIdCounter += 1;
                let habitId = "habit_" # Nat.toText(habitIdCounter);

                let newHabit : Habit = {
                    id = habitId;
                    owner = caller;
                    name = name;
                    description = description;
                    category = category;
                    frequency = frequency;
                    targetStreak = targetStreak;
                    currentStreak = 0;
                    longestStreak = 0;
                    status = #active;
                    xpPerCompletion = xpPerCompletion;
                    createdAt = Time.now();
                    lastCompletedAt = null;
                    totalCompletions = 0;
                };

                habits.put(habitId, newHabit);

                let userHabitsList = switch(userHabits.get(caller)) {
                    case (?list) Array.append(list, [habitId]);
                    case null [habitId];
                };
                userHabits.put(caller, userHabitsList);

                habitCheckIns.put(habitId, []);

                Debug.print("Habit created: " # habitId);
                #ok(newHabit)
            };
        };
    };

    // Get user's habits
    public shared(msg) func getUserHabits() : async [Habit] {
        let caller = msg.caller;

        let userHabitIds = switch(userHabits.get(caller)) {
            case (?ids) ids;
            case null [];
        };

        Array.mapFilter<Text, Habit>(userHabitIds, func(id) {
            habits.get(id)
        })
    };

    // Get specific habit
    public query func getHabit(habitId: Text) : async ?Habit {
        habits.get(habitId)
    };

    // Update habit
    public shared(msg) func updateHabit(
        habitId: Text,
        name: Text,
        description: ?Text,
        status: HabitStatus
    ) : async Result<Habit, Text> {
        let caller = msg.caller;

        switch(habits.get(habitId)) {
            case null {
                #err("Habit not found")
            };
            case (?habit) {
                if (habit.owner != caller) {
                    return #err("Unauthorized");
                };

                let updatedHabit : Habit = {
                    id = habit.id;
                    owner = habit.owner;
                    name = name;
                    description = description;
                    category = habit.category;
                    frequency = habit.frequency;
                    targetStreak = habit.targetStreak;
                    currentStreak = habit.currentStreak;
                    longestStreak = habit.longestStreak;
                    status = status;
                    xpPerCompletion = habit.xpPerCompletion;
                    createdAt = habit.createdAt;
                    lastCompletedAt = habit.lastCompletedAt;
                    totalCompletions = habit.totalCompletions;
                };

                habits.put(habitId, updatedHabit);
                #ok(updatedHabit)
            };
        };
    };

    // CHECK-IN MANAGEMENT

    // Create check-in
    public shared(msg) func checkInHabit(
        habitId: Text,
        note: ?Text
    ) : async Result<CheckIn, Text> {
        let caller = msg.caller;

        let habit = switch(habits.get(habitId)) {
            case null { return #err("Habit not found"); };
            case (?h) h;
        };

        if (habit.owner != caller) {
            return #err("Unauthorized");
        };

        // Check if already checked in today (simplified version)
        let now = Time.now();
        switch(habit.lastCompletedAt) {
            case (?lastTime) {
                let dayInNanos = 24 * 60 * 60 * 1_000_000_000;
                if (now - lastTime < dayInNanos and habit.frequency == #daily) {
                    return #err("Already checked in today");
                };
                let weekInNanos = 7 * dayInNanos;
                if (now - lastTime < weekInNanos and habit.frequency == #weekly) {
                    return #err("Already checked in this week");
                };
            };
            case null {};
        };

        // Create check-in
        checkInIdCounter += 1;
        let checkInId = "checkin_" # Nat.toText(checkInIdCounter);

        let checkIn : CheckIn = {
            id = checkInId;
            habitId = habitId;
            owner = caller;
            completedAt = now;
            note = note;
            xpEarned = habit.xpPerCompletion;
        };

        checkIns.put(checkInId, checkIn);

        // Update habit check-ins list
        let habitCheckInList = switch(habitCheckIns.get(habitId)) {
            case (?list) Array.append(list, [checkInId]);
            case null [checkInId];
        };
        habitCheckIns.put(habitId, habitCheckInList);

        // Update habit streak
        let newCurrentStreak = habit.currentStreak + 1;
        let newLongestStreak = if (newCurrentStreak > habit.longestStreak) newCurrentStreak else habit.longestStreak;

        let updatedHabit : Habit = {
            id = habit.id;
            owner = habit.owner;
            name = habit.name;
            description = habit.description;
            category = habit.category;
            frequency = habit.frequency;
            targetStreak = habit.targetStreak;
            currentStreak = newCurrentStreak;
            longestStreak = newLongestStreak;
            status = habit.status;
            xpPerCompletion = habit.xpPerCompletion;
            createdAt = habit.createdAt;
            lastCompletedAt = ?now;
            totalCompletions = habit.totalCompletions + 1;
        };

        habits.put(habitId, updatedHabit);

        // Update user stats
        switch(users.get(caller)) {
            case (?user) {
                let newTotalXP = user.totalXP + habit.xpPerCompletion;
                let newLevel = calculateLevel(newTotalXP);

                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    username = user.username;
                    email = user.email;
                    profilePicture = user.profilePicture;
                    authMethod = user.authMethod;
                    walletAddress = user.walletAddress;
                    totalXP = newTotalXP;
                    level = newLevel;
                    currentStreak = if (newCurrentStreak > user.currentStreak) newCurrentStreak else user.currentStreak;
                    longestStreak = if (newCurrentStreak > user.longestStreak) newCurrentStreak else user.longestStreak;
                    totalHabitsCompleted = user.totalHabitsCompleted + 1;
                    joinedAt = user.joinedAt;
                    lastActive = now;
                };

                users.put(caller, updatedUser);
            };
            case null {};
        };

        Debug.print("Check-in created: " # checkInId);
        #ok(checkIn)
    };

    // Get habit check-ins
    public query func getHabitCheckIns(habitId: Text) : async [CheckIn] {
        let checkInIds = switch(habitCheckIns.get(habitId)) {
            case (?ids) ids;
            case null [];
        };

        Array.mapFilter<Text, CheckIn>(checkInIds, func(id) {
            checkIns.get(id)
        })
    };

    // STATISTICS

    // Get user stats
    public query func getUserStats() : async {
        totalUsers: Nat;
        totalHabits: Nat;
        totalCheckIns: Nat;
    } {
        {
            totalUsers = users.size();
            totalHabits = habits.size();
            totalCheckIns = checkIns.size();
        }
    };

    // Health check
    public query func healthCheck() : async {status: Text; timestamp: Int; userCount: Nat; habitCount: Nat} {
        {
            status = "healthy";
            timestamp = Time.now();
            userCount = users.size();
            habitCount = habits.size();
        }
    };

    // Validate session
    public shared(_msg) func validateSession() : async Result<User, Text> {
        await getCurrentUser()
    };
}
