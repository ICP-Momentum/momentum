import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AuthMethod = { 'internetIdentity' : null } |
  { 'nfid' : null };
export interface CheckIn {
  'id' : string,
  'completedAt' : bigint,
  'owner' : Principal,
  'note' : [] | [string],
  'habitId' : string,
  'xpEarned' : bigint,
}
export interface Habit {
  'id' : string,
  'status' : HabitStatus,
  'xpPerCompletion' : bigint,
  'totalCompletions' : bigint,
  'owner' : Principal,
  'name' : string,
  'createdAt' : bigint,
  'description' : [] | [string],
  'lastCompletedAt' : [] | [bigint],
  'category' : string,
  'longestStreak' : bigint,
  'frequency' : HabitFrequency,
  'targetStreak' : bigint,
  'currentStreak' : bigint,
}
export type HabitFrequency = { 'daily' : null } |
  { 'weekly' : null };
export type HabitStatus = { 'active' : null } |
  { 'completed' : null } |
  { 'archived' : null } |
  { 'paused' : null };
export type Result = { 'ok' : User } |
  { 'err' : string };
export type Result_1 = { 'ok' : Habit } |
  { 'err' : string };
export type Result_2 = { 'ok' : CheckIn } |
  { 'err' : string };
export interface User {
  'id' : string,
  'username' : string,
  'totalXP' : bigint,
  'joinedAt' : bigint,
  'authMethod' : AuthMethod,
  'walletAddress' : string,
  'email' : string,
  'level' : bigint,
  'totalHabitsCompleted' : bigint,
  'longestStreak' : bigint,
  'profilePicture' : [] | [Uint8Array | number[]],
  'lastActive' : bigint,
  'principalId' : string,
  'currentStreak' : bigint,
}
export interface _SERVICE {
  'checkInHabit' : ActorMethod<[string, [] | [string]], Result_2>,
  'createHabit' : ActorMethod<
    [string, [] | [string], string, HabitFrequency, bigint, bigint],
    Result_1
  >,
  'getCurrentUser' : ActorMethod<[], Result>,
  'getHabit' : ActorMethod<[string], [] | [Habit]>,
  'getHabitCheckIns' : ActorMethod<[string], Array<CheckIn>>,
  'getUserHabits' : ActorMethod<[], Array<Habit>>,
  'getUserStats' : ActorMethod<
    [],
    { 'totalHabits' : bigint, 'totalUsers' : bigint, 'totalCheckIns' : bigint }
  >,
  'healthCheck' : ActorMethod<
    [],
    {
      'status' : string,
      'habitCount' : bigint,
      'timestamp' : bigint,
      'userCount' : bigint,
    }
  >,
  'registerUser' : ActorMethod<
    [AuthMethod, string, string, [] | [Uint8Array | number[]]],
    Result
  >,
  'updateHabit' : ActorMethod<
    [string, string, [] | [string], HabitStatus],
    Result_1
  >,
  'updateProfile' : ActorMethod<[string, string], Result>,
  'updateProfilePicture' : ActorMethod<[Uint8Array | number[]], Result>,
  'userExists' : ActorMethod<[], boolean>,
  'validateSession' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
