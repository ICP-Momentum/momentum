export const idlFactory = ({ IDL }) => {
  const CheckIn = IDL.Record({
    'id' : IDL.Text,
    'completedAt' : IDL.Int,
    'owner' : IDL.Principal,
    'note' : IDL.Opt(IDL.Text),
    'habitId' : IDL.Text,
    'xpEarned' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : CheckIn, 'err' : IDL.Text });
  const HabitFrequency = IDL.Variant({
    'daily' : IDL.Null,
    'weekly' : IDL.Null,
  });
  const HabitStatus = IDL.Variant({
    'active' : IDL.Null,
    'completed' : IDL.Null,
    'archived' : IDL.Null,
    'paused' : IDL.Null,
  });
  const Habit = IDL.Record({
    'id' : IDL.Text,
    'status' : HabitStatus,
    'xpPerCompletion' : IDL.Nat,
    'totalCompletions' : IDL.Nat,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'description' : IDL.Opt(IDL.Text),
    'lastCompletedAt' : IDL.Opt(IDL.Int),
    'category' : IDL.Text,
    'longestStreak' : IDL.Nat,
    'frequency' : HabitFrequency,
    'targetStreak' : IDL.Nat,
    'currentStreak' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : Habit, 'err' : IDL.Text });
  const AuthMethod = IDL.Variant({
    'internetIdentity' : IDL.Null,
    'nfid' : IDL.Null,
  });
  const User = IDL.Record({
    'id' : IDL.Text,
    'username' : IDL.Text,
    'totalXP' : IDL.Nat,
    'joinedAt' : IDL.Int,
    'authMethod' : AuthMethod,
    'walletAddress' : IDL.Text,
    'email' : IDL.Text,
    'level' : IDL.Nat,
    'totalHabitsCompleted' : IDL.Nat,
    'longestStreak' : IDL.Nat,
    'profilePicture' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'lastActive' : IDL.Int,
    'principalId' : IDL.Text,
    'currentStreak' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  return IDL.Service({
    'checkInHabit' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result_2], []),
    'createHabit' : IDL.Func(
        [
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Text,
          HabitFrequency,
          IDL.Nat,
          IDL.Nat,
        ],
        [Result_1],
        [],
      ),
    'getCurrentUser' : IDL.Func([], [Result], []),
    'getHabit' : IDL.Func([IDL.Text], [IDL.Opt(Habit)], ['query']),
    'getHabitCheckIns' : IDL.Func([IDL.Text], [IDL.Vec(CheckIn)], ['query']),
    'getUserHabits' : IDL.Func([], [IDL.Vec(Habit)], []),
    'getUserStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalHabits' : IDL.Nat,
            'totalUsers' : IDL.Nat,
            'totalCheckIns' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'healthCheck' : IDL.Func(
        [],
        [
          IDL.Record({
            'status' : IDL.Text,
            'habitCount' : IDL.Nat,
            'timestamp' : IDL.Int,
            'userCount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'registerUser' : IDL.Func(
        [AuthMethod, IDL.Text, IDL.Text, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result],
        [],
      ),
    'updateHabit' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text), HabitStatus],
        [Result_1],
        [],
      ),
    'updateProfile' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'updateProfilePicture' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result], []),
    'userExists' : IDL.Func([], [IDL.Bool], []),
    'validateSession' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
