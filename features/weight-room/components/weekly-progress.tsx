import { CheckCircle2, Dumbbell, Flame, TrendingUp } from "lucide-react";

import type { WorkoutPlanDay, WorkoutPlanExercise } from "../queries";

const DAY_OF_RELEASE_TO_WEEKDAY: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * "Track Your Progress" card — mirrors Flutter _WeeklyProgressSection.
 * Computes weekly stats from the active plan's days + the user's
 * completed-exercise set.
 *
 * A day counts as "completed" when every exercise in it is marked
 * complete. The streak counts back from today's weekday.
 */
export function WeeklyProgress({
  days,
  exercisesByDay,
  completedExerciseIds,
}: {
  days: WorkoutPlanDay[];
  exercisesByDay: Record<string, WorkoutPlanExercise[]>;
  completedExerciseIds: Set<string>;
}) {
  let weeklyWorkoutsTotal = 0;
  let weeklyWorkoutsCompleted = 0;
  let weeklyExercisesTotal = 0;
  let weeklyExercisesCompleted = 0;
  const dailyCompletion = new Map<number, boolean>();

  days.forEach((day, i) => {
    const exercises = exercisesByDay[day.id] ?? [];
    if (exercises.length === 0) return;
    weeklyWorkoutsTotal++;
    weeklyExercisesTotal += exercises.length;
    const doneInDay = exercises.filter((e) =>
      completedExerciseIds.has(e.id)
    ).length;
    weeklyExercisesCompleted += doneInDay;
    const dayDone = doneInDay === exercises.length;
    const weekday =
      DAY_OF_RELEASE_TO_WEEKDAY[day.dayOfRelease ?? ""] ??
      Math.min(7, Math.max(1, i + 1));
    if (dayDone) {
      weeklyWorkoutsCompleted++;
      dailyCompletion.set(weekday, true);
    }
  });

  // Streak: consecutive completed weekdays ending today, going backward.
  const todayWeekday = ((new Date().getDay() + 6) % 7) + 1; // Mon=1..Sun=7
  let streak = 0;
  for (let wd = todayWeekday; wd >= 1; wd--) {
    if (dailyCompletion.get(wd) === true) streak++;
    else break;
  }

  const pct =
    weeklyWorkoutsTotal > 0
      ? weeklyWorkoutsCompleted / weeklyWorkoutsTotal
      : 0;
  const pctLabel = `${Math.round(pct * 100)}%`;
  const hasAny = weeklyWorkoutsCompleted > 0;

  if (weeklyWorkoutsTotal === 0) return null;

  return (
    <div className="rounded-3xl border border-[#E8E6E3] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary/22 to-primary/6 text-primary">
          <TrendingUp className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <p className="text-[15px] font-bold tracking-tight">
          Track Your Progress
        </p>
        <span
          className={`ml-auto rounded-md px-2 py-1 text-[11px] font-semibold ${
            hasAny
              ? "bg-[#10B981]/10 text-[#10B981]"
              : "bg-muted text-muted-foreground"
          }`}
        >
          This Week
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <ProgressRing percent={pct} label={pctLabel} />

        <div className="grid flex-1 grid-cols-2 gap-3">
          <Stat
            value={`${weeklyWorkoutsCompleted}/${weeklyWorkoutsTotal}`}
            label="Workouts"
            icon={<Dumbbell className="h-3.5 w-3.5" strokeWidth={2} />}
            color="text-primary bg-primary/10"
          />
          <Stat
            value={`${weeklyExercisesCompleted}/${weeklyExercisesTotal}`}
            label="Exercises"
            icon={<CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />}
            color="text-[#10B981] bg-[#10B981]/10"
          />
          <Stat
            value={`${streak}`}
            label="Day streak"
            icon={<Flame className="h-3.5 w-3.5" strokeWidth={2} />}
            color="text-[#F59E0B] bg-[#F59E0B]/10"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-around rounded-2xl bg-[#F9FAFB] px-2.5 py-2.5">
        {DAY_LABELS.map((label, i) => {
          const weekday = i + 1;
          const isToday = weekday === todayWeekday;
          const isCompleted = dailyCompletion.get(weekday) === true;
          return (
            <DayIndicator
              key={i}
              label={label}
              isToday={isToday}
              isCompleted={isCompleted}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProgressRing({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  const size = 80;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, percent)) * circumference;

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F3F4F6"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          className="transition-[stroke-dasharray] duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[16px] font-bold leading-none">{label}</span>
        <span className="mt-0.5 text-[10px] text-muted-foreground">done</span>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  icon,
  color,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[14px] font-bold leading-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function DayIndicator({
  label,
  isToday,
  isCompleted,
}: {
  label: string;
  isToday: boolean;
  isCompleted: boolean;
}) {
  let cls = "bg-white text-muted-foreground ring-1 ring-border";
  if (isCompleted) cls = "bg-[#10B981] text-white";
  else if (isToday) cls = "bg-primary/10 text-primary ring-1 ring-primary/30";

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${cls}`}
      >
        {isCompleted ? "✓" : label}
      </span>
    </div>
  );
}
