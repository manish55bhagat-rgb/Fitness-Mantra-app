export interface ProgramExercise {
  id: string;
  title: string;
  category: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Abs" | "Cardio";
  muscles: string[]; // Primary target muscle first, followed by others
  image: string;
  video: string; // Video URL template
  description: string;
  instructions: string[];
  tips: {
    correctForm: string[];
    commonMistakes: string[];
    breathingTips: string;
    safetyNote: string;
  };
}

export const masterBodyweightExercises: ProgramExercise[] = [
  {
    id: "push-ups",
    title: "Classic Push-ups",
    category: "Chest",
    muscles: ["Chest", "Shoulders", "Arms"],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/IODxDxX7oi4",
    description: "The fundamental upper body push pattern that targets pectorals, anterior deltoids, and triceps with exceptional core stability requirements.",
    instructions: [
      "Position your hands shoulder-width apart on the floor.",
      "Extend your legs behind, assuming a high plank line.",
      "Lower your chest toward the floor, keeping elbows at a 45-degree angle to the torso.",
      "Push flatly against the floor to rise back up to full arm extensions."
    ],
    tips: {
      correctForm: [
        "Position wrists vertically aligned directly underneath shoulders.",
        "Maintain absolute rigidity from cervical spine down to heels.",
        "Squeeze glutes and contract abdominals to stabilize pelvis."
      ],
      commonMistakes: [
        "Sagging lower back or elevated buttocks.",
        "Elbows flaring too wide perpendicular to spine.",
        "Truncated range of motion without full lockouts or deep chest drops."
      ],
      breathingTips: "Inhale slowly as you lower chest downwards. Exhale explosively as you push back up to starting high-plank position.",
      safetyNote: "If wrist compression felt, execute on high push-up bars, dumbbells or adapt with knee-assisted pushups."
    }
  },
  {
    id: "bodyweight-squats",
    title: "Air Squats",
    category: "Legs",
    muscles: ["Legs", "Cardio"], // Quads, Glutes
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/U3HlEF_E9fo",
    description: "A primary compound pattern reinforcing lower-extremity power, structural hip flexion, knee tracking, and active glute expansion.",
    instructions: [
      "Position feet shoulder-width apart, toes flared slightly outwards (15 degrees).",
      "Drive hips backwards and hinge knees, sinking your center of mass.",
      "Descend until thighs break horizontal parallel lines.",
      "Drive your feet through the floor, rising vertically into standard stance."
    ],
    tips: {
      correctForm: [
        "Keep heels pinned flat against the floor at all times.",
        "Track knees directly in line with second/third foot toes.",
        "Elevate head and maintain erect, broad thoracic extension."
      ],
      commonMistakes: [
        "Knee valgus collapse (knees buckling inward).",
        "Heels rising, leaving entire axial load on ankle joints.",
        "Extreme lumbar roundness (butt wink) at deepest descent points."
      ],
      breathingTips: "Inhale controlled as you sink. Exhale purposefully as you drive upwards through the feet.",
      safetyNote: "Place arms forward for counterbalance if struggling to maintain erect spine orientation."
    }
  },
  {
    id: "plank-hold",
    title: "Classic Forearm Plank",
    category: "Abs",
    muscles: ["Abs", "Back"],
    image: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/pvIjsG5Svck",
    description: "A premier static isometric abdominal core hold targeting transverse abdominis, rectus abdominis, obliques, and lumbar stabilization.",
    instructions: [
      "Place forearms flat on the floor, elbows aligned beneath shoulders.",
      "Extend legs backward, balance on toe balls.",
      "Establish a flat structural line, neck parallel, chin tucked safely."
    ],
    tips: {
      correctForm: [
        "Engage your quadriceps dynamically to protect knees.",
        "Actively push your forearms through the ground to open upper back.",
        "Perform posterior pelvic tilt to activate core musculature."
      ],
      commonMistakes: [
        "Hanging pelvis down towards the floor, hyperextending low spine.",
        "Shrugging shoulders into ears, causing severe trap/neck stress.",
        "Holding breath, starving muscle tissue of steady oxygen profiles."
      ],
      breathingTips: "Take rhythmic, shallow diaphragmatic breaths. Do not hold breath during isometric holds.",
      safetyNote: "If lower back distress occurs, drop down on knees briefly to relieve active lumbar pressure."
    }
  },
  {
    id: "jumping-jacks",
    title: "Jumping Jacks",
    category: "Cardio",
    muscles: ["Cardio", "Shoulders", "Legs"],
    image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/iSSAk4Xg5_g",
    description: "A dynamic full-body cardiovascular coordination routine that enhances metabolic heart rate thresholds and calf power output.",
    instructions: [
      "Stand with feet together, arms neutrally extended at your sides.",
      "Jump feet outwards to shoulder-width while raising arms overhead.",
      "Quickly snap feet back together while returning arms to sides."
    ],
    tips: {
      correctForm: [
        "Maintain slight knee flex on impact to absorb ground shock.",
        "Push off solely from balls of your feet.",
        "Keep core tight to coordinate jumps efficiently."
      ],
      commonMistakes: [
        "Landing on flat heels, telegraphing shock directly into shins.",
        "Bent, floppy arms that skip shoulder and upper trap involvement."
      ],
      breathingTips: "Inhale during arm ascent and stance expansion, exhale as hands snap back to waste line.",
      safetyNote: "Modify to lower impact stepping jacks if ankle, knee, or hip joint pain occurs."
    }
  },
  {
    id: "mountain-climbers",
    title: "Mountain Climbers",
    category: "Abs",
    muscles: ["Abs", "Cardio", "Shoulders"],
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/zTfZjSInNnc",
    description: "An explosive core transition moving alternating hips under direct high plank stabilization limits.",
    instructions: [
      "Set your starting line in a clean high push-up stance.",
      "Drive right knee towards your lower chest line.",
      "Quickly reset right leg while explosively driving left knee forwards."
    ],
    tips: {
      correctForm: [
        "Align wrists directly underneath shoulder joints.",
        "Keep your hips low and consistent, parallel to floor levels.",
        "Drive knees in straight lines without twisting hips to side boundaries."
      ],
      commonMistakes: [
        "Hips bouncing vertically high into air layers.",
        "Sliding feet on the floor instead of hovering steps.",
        "Lack of thoracic strength, causing shoulders to drift backward."
      ],
      breathingTips: "Breathe rapidly and rhythmically in coordination with each dynamic knee drive.",
      safetyNote: "Reduce speed or elevate hand positions on stable platforms/benches if shoulders fatigue."
    }
  },
  {
    id: "lying-leg-raises",
    title: "Lying Leg Raises",
    category: "Abs",
    muscles: ["Abs"],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/Wp4BlxcFTco",
    description: "An exceptional isolated lower abdominal dynamic progression requiring safe lumbar flat-pressing protocols.",
    instructions: [
      "Lie supine on floor, arms placed flat down adjacent to hips.",
      "Keep legs straight, squeeze ankles tightly together.",
      "Raise both feet to a 90-degree angle using lower abdominals.",
      "Slowly lower legs until heels hover 3 inches above floor."
    ],
    tips: {
      correctForm: [
        "Forcefully press lower back flat down into the floor at all times.",
        "Engage quads to keep legs straight for maximum lower abdominal stretch.",
        "Squeeze inner thighs together to preserve centerline symmetry."
      ],
      commonMistakes: [
        "Arching lower back off floor, loading pressure purely on hips.",
        "Using arm leverage to press hips upward off ground.",
        "Dropping legs under zero eccentric control on the descent phase."
      ],
      breathingTips: "Inhale while lowering legs meticulously. Exhale clearly as legs are raised.",
      safetyNote: "Place hands under glutes as a wedge if struggling to avoid lumbar arching."
    }
  },
  {
    id: "bicycle-crunches",
    title: "Bicycle Crunches",
    category: "Abs",
    muscles: ["Abs", "Cardio"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/9G6k18T-h2A",
    description: "Highly rated core biomechanical pattern that maps both upper-abdominal compression and oblique rotatory power.",
    instructions: [
      "Lie down on floor, light hand touch behind ears, head raised.",
      "Bring shoulders off ground and float feet slightly.",
      "Twist torso, reaching left elbow to meet right knee while extending left leg straight.",
      "Switch sides seamlessly in a rhythmic bicycling rotation."
    ],
    tips: {
      correctForm: [
        "Rotate from ribs and obliques, do not pull neck with hands.",
        "Slow down execution to maximize time under tension.",
        "Extend the non-working leg fully out into space."
      ],
      commonMistakes: [
        "Jerking elbows inward without actually rotating shoulders.",
        "Rapid, sloppy leg kicking without clear core engagement.",
        "Allowing head to crash back into floor on each transition."
      ],
      breathingTips: "Exhale sharply on twist, inhale on central transitions.",
      safetyNote: "If hip popping occurs, lift extended legs higher off the floor."
    }
  },
  {
    id: "lunges",
    title: "Reverse Lunges",
    category: "Legs",
    muscles: ["Legs"],
    image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/O-7v_YidgIs",
    description: "An unilateral structural single-leg masterpiece targeting glutes, quadriceps, and hamstrings, with vast balance refinement.",
    instructions: [
      "Stand straight with hands resting securely on your hips.",
      "Step backward with your right leg, settling on the ball of the foot.",
      "Bend both knees to 90 degrees, dropping back knee towards floor.",
      "Drive off your front heel to step back smoothly into standard stance."
    ],
    tips: {
      correctForm: [
        "Keep your front knee directly aligned over front ankle.",
        "Slight forward torso lean is ideal to target glutes.",
        "Squeeze your core to maintain strict balance."
      ],
      commonMistakes: [
        "Slamming back knee violently against floor tiles.",
        "Allowing front knee to travel far past toes, straining patellar tendons.",
        "Shifting torso weight sideways off center gravity limits."
      ],
      breathingTips: "Inhale while stepping backwards. Exhale powerfully as you push up to original stance.",
      safetyNote: "Perform near a secure wall or chair support if balance feels compromised."
    }
  },
  {
    id: "tricep-dips",
    title: "Dips on Floor / Chair",
    category: "Arms",
    muscles: ["Arms", "Chest"],
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/6kALZikXxLc",
    description: "A target-rich push dynamic targeting the medial/lateral triceps, anterior shoulders, and upper clavicular chest fibers.",
    instructions: [
      "Sit on floor or bench edge, hands gripping closely near hips.",
      "Walk feet forward and lift hips off floor.",
      "Lower rear close past the bench plane by flexing elbows downward.",
      "Press through palms to full elbow lockouts raising body back up."
    ],
    tips: {
      correctForm: [
        "Keep elbows tucked tightly pointing backwards, not flared outwards.",
        "Maintain shoulder blades pulled down back to stabilize neck.",
        "Keep hips close to bench or floor plane during entire descent."
      ],
      commonMistakes: [
        "Shrugging or sliding forward far away from support boundaries, over-stretching anterior deltoids.",
        "Extremely short ranges of movement."
      ],
      breathingTips: "Inhale slowly as you descend into deep bend. Exhale fully on upward extension.",
      safetyNote: "If shoulder joint snapping is felt, use floor variation to shorten range of motion."
    }
  },
  {
    id: "glute-bridges",
    title: "Glute Bridges",
    category: "Legs",
    muscles: ["Legs", "Back"], // Glutes, Hamstrings, Lower Back
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/OUXlA6r7iR8",
    description: "A foundational glute-dominant posterior chain lock pattern, crucial for lower lumbar health and hamstring power.",
    instructions: [
      "Lie flat on your back, bend knees, place feet flat near glutos.",
      "Press through your heels and squeeze glutos to elevate hips.",
      "Align hips with knees and shoulders in a rigid diagonal line.",
      "Lower slowly back to ground."
    ],
    tips: {
      correctForm: [
        "Drive through your heels, not your toes, to activate glutes.",
        "Contract core to prevent hyperextending lower back at apex hook.",
        "Keep thighs perfectly parallel without knee splay."
      ],
      commonMistakes: [
        "Arching lower back instead of squeezing glutes.",
        "Bouncing hips rapidly off floor without contraction holds."
      ],
      breathingTips: "Exhale dynamically as you elevate hips. Inhale gently on descent.",
      safetyNote: "Add a resistance band above knees if available for maximum external rotation."
    }
  },
  {
    id: "burpees",
    title: "Full Body Burpees",
    category: "Cardio",
    muscles: ["Cardio", "Chest", "Legs"],
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/dZfe9Hst-Xo",
    description: "The gold-standard high intensity functional movement designed to maximize cardiorespiratory endurance and explosive power.",
    instructions: [
      "Stand tall, instantly drop into a squat position placing hands on ground.",
      "Shoot legs backward to land in high plank posture.",
      "Complete a full push-up (optional or standard).",
      "Hop feet forward back to hands, then launch into vertical jump."
    ],
    tips: {
      correctForm: [
        "Keep spine stable and inline, no pelvic sagging on leg thrust.",
        "Land softly with knee flex on jumps, protecting joints.",
        "Coordinate the movement with a steady pace."
      ],
      commonMistakes: [
        "Bending hips directly without squatting, loading spinal disks.",
        "Extreme lower back arch on the floor descent.",
        "Stiff landing on heels."
      ],
      breathingTips: "Inhale dropping down & thrusting legs. Exhale pushing up and launching jump.",
      safetyNote: "Adapt to stepping burpees (removing jump and thrust) if joint integrity requires."
    }
  },
  {
    id: "high-knees",
    title: "High Knees Sprint",
    category: "Cardio",
    muscles: ["Cardio", "Legs"],
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/ZqM96XQ8s_A",
    description: "A fast, intense cardiovascular sprint in place that challenges pelvic stabilizers and knee elevation muscles.",
    instructions: [
      "Stand tall with feet parallel.",
      "Sprint in place, raising left/right knees alternating high as possible.",
      "Raise knee to hip height, pumping arms in cadence."
    ],
    tips: {
      correctForm: [
        "Stay tall, do not lean backwards to compensate knees.",
        "Drive arms in straight line to stabilize rapid leg movement.",
        "Land softly on balls of toes."
      ],
      commonMistakes: [
        "Leaning torso back, which stresses hip flexors and lumbar joints.",
        "Barely raising knees off floor.",
        "Rigid, stiff arm carriage."
      ],
      breathingTips: "Deliver concise exhales with each step, breathing rapidly and shallowly.",
      safetyNote: "Reduce impact to march in place if high joint loads irritate knees."
    }
  }
];

// Generates an array of exercises for a single day of the 30-day program based on level.
export function generateWorkoutForDay(day: number, level: "Beginner" | "Intermediate" | "Advanced") {
  // Let's programmatically sample 8, 10, or 12 exercises based on the level.
  const exerciseCount = level === "Beginner" ? 8 : level === "Intermediate" ? 10 : 12;
  
  // Create a structured order of master exercises that varies by day
  const rawIdxs = Array.from({ length: masterBodyweightExercises.length }, (_, i) => i);
  
  // Deterministic shuffle based on day and level, so the same day always gives the exact same list
  const seed = day + (level === "Beginner" ? 100 : level === "Intermediate" ? 200 : 300);
  const shuffledIdxs = [...rawIdxs];
  
  for (let i = shuffledIdxs.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * (i + 1)) % 1000) / 1000 * (i + 1));
    const temp = shuffledIdxs[i];
    shuffledIdxs[i] = shuffledIdxs[j];
    shuffledIdxs[j] = temp;
  }
  
  // Sample the desired count
  const selectedIdxs = shuffledIdxs.slice(0, exerciseCount);
  const selectedRaw = selectedIdxs.map(idx => masterBodyweightExercises[idx]);
  
  // Tune sets, reps, duration, and rest based on day and level
  const enhancedExercises = selectedRaw.map((ex, stepIdx) => {
    let sets = 3;
    let reps = "10";
    let holdDuration = 0; // if 0, it is reps based.
    let rest = 30; // seconds
    let estimatedKcal = 12; // kcal per exercise set block
    
    if (level === "Beginner") {
      sets = 3;
      if (ex.id === "plank-hold") {
        holdDuration = 30; // 30 seconds
      } else if (ex.id === "lying-leg-raises" || ex.id === "push-ups") {
        reps = "8 - 10";
      } else {
        reps = "10 - 12";
      }
      rest = 30;
      estimatedKcal = Math.round(9 * sets);
    } else if (level === "Intermediate") {
      sets = 4;
      if (ex.id === "plank-hold") {
        holdDuration = 45;
      } else if (ex.id === "lying-leg-raises" || ex.id === "push-ups") {
        reps = "12 - 15";
      } else if (ex.id === "burpees") {
        reps = "8 - 10";
      } else {
        reps = "15 - 20";
      }
      rest = 20;
      estimatedKcal = Math.round(12 * sets);
    } else { // Advanced
      sets = 4;
      if (ex.id === "plank-hold") {
        holdDuration = 60;
      } else if (ex.id === "lying-leg-raises" || ex.id === "push-ups") {
        reps = "18 - 25";
      } else if (ex.id === "burpees") {
        reps = "12 - 15";
      } else {
        reps = "20 - 30";
      }
      rest = 15;
      estimatedKcal = Math.round(16 * sets);
    }
    
    // Add progressive overload across weeks
    // Every week (7 days), increase reps/hold duration slightly
    const weekModifier = Math.floor((day - 1) / 7);
    if (weekModifier > 0) {
      if (holdDuration > 0) {
        holdDuration += weekModifier * 5;
      } else {
        const parts = reps.split("-").map(p => parseInt(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0])) {
          reps = `${parts[0] + weekModifier * 2} - ${parts[1] + weekModifier * 3}`;
        } else {
          // Fallback if formatting differs
          reps = `${parseInt(reps) + weekModifier * 2}`;
        }
      }
      estimatedKcal = Math.round(estimatedKcal * (1 + weekModifier * 0.1));
    }
    
    return {
      ...ex,
      sets,
      reps: holdDuration > 0 ? `${holdDuration}s Hold` : reps,
      holdDuration,
      rest,
      estimatedKcal
    };
  });
  
  return enhancedExercises;
}

export interface DayProgression {
  day: number;
  unlocked: boolean;
  completed: boolean;
  completedAt?: string;
}

export interface ProgramProgressState {
  level: "Beginner" | "Intermediate" | "Advanced";
  currentDay: number;
  dailyStreak: number;
  lastCompletedDate?: string;
  history: {
    day: number;
    level: "Beginner" | "Intermediate" | "Advanced";
    date: string;
    durationMinutes: number;
    burnedCalories: number;
  }[];
}
