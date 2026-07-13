export interface Exercise {
  id: string;
  title: string;
  category: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Abs" | "Cardio" | "Yoga";
  level: "Beginner" | "Intermediate" | "Advanced" | "Elite";
  image: string;
  video: string;
  muscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  calories: number;
  duration: string;
  description: string;
  instructions: string[];
  tips: string[];
  sets: number;
  reps: string;
  rest: number;
}

export const exercises: Exercise[] = [
  // ================= CHEST =================
  {
    id: "push-up",
    title: "Push Up",
    category: "Chest",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/IODxDxX7oi4",
    muscles: ["Chest"],
    secondaryMuscles: ["Triceps", "Front Shoulders"],
    equipment: ["Bodyweight"],
    calories: 100,
    duration: "45s",
    description: "The classic upper body compound movement targeting the pectorals, anterior deltoids, and triceps with substantial core stabilizer involvement.",
    instructions: [
      "Set your hands slightly wider than shoulder-width apart on the ground.",
      "Extend your legs backward into a high plank with a straight neutral spine.",
      "Lower your chest until it nearly touches the ground while tucking elbows at 45 degrees.",
      "Press through your palms to return to full arm extensions."
    ],
    tips: ["Keep your core tight.", "Lower your chest fully.", "Breathe in down, breathe out up."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "bench-press",
    title: "Bench Press",
    category: "Chest",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/rT7DgCr-3pg",
    muscles: ["Chest"],
    secondaryMuscles: ["Triceps", "Front Shoulders"],
    equipment: ["Barbell", "Flat Bench"],
    calories: 120,
    duration: "40s",
    description: "The gold standard upper-body compound exercise for building pectoral mass, front shoulder strength, and tricep extension power.",
    instructions: [
      "Lie flat on the bench, feet pinned securely to the floor.",
      "Grip the barbell slightly wider than shoulder-width with hands directly over elbows.",
      "Unrack and lower the bar slowly to your mid-chest line.",
      "Push vertically, driving the bar upward to a locked-out extension."
    ],
    tips: ["Retract your shoulder blades.", "Keep elbows tucked slightly.", "Drive your feet into the floor."],
    sets: 4,
    reps: "8 - 12",
    rest: 60
  },
  {
    id: "incline-bench-press",
    title: "Incline Bench Press",
    category: "Chest",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/SrqOu55lrYU",
    muscles: ["Upper Chest"],
    secondaryMuscles: ["Front Shoulders", "Triceps"],
    equipment: ["Barbell", "Incline Bench"],
    calories: 115,
    duration: "45s",
    description: "Targeted compound press designed to emphasize the clavicular head of the pectorals and build front deltoid volume.",
    instructions: [
      "Set an adjustable bench to a 30 to 45 degree angle and sit flatly.",
      "Unrack the barbell, holding it vertically above your upper-chest plane.",
      "Lower the bar under deep control until it hovers close to your collarbones.",
      "Press the barbell straight up, contracting upper pectorals."
    ],
    tips: ["Avoid too steep bench angle to protect shoulders.", "Keep the wrists straight.", "Control the bar down."],
    sets: 4,
    reps: "8 - 10",
    rest: 60
  },
  {
    id: "chest-fly",
    title: "Chest Fly",
    category: "Chest",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/eGjt4lk6g34",
    muscles: ["Chest"],
    secondaryMuscles: ["Front Shoulders"],
    equipment: ["Dumbbells", "Flat Bench"],
    calories: 85,
    duration: "50s",
    description: "An isolation movement that stretches the pectoral fibers and stimulates muscle fiber recruitment with zero tricep elbow action.",
    instructions: [
      "Lie supine on a flat bench holding dumbbells straight above your chest.",
      "With a slight elbow bend, slowly flare your arms out to the sides in an arc.",
      "Lower until you feel a comfortable stretch across your chest.",
      "Squeeze your chest together to hug the weights back to the top."
    ],
    tips: ["Keep elbows slightly bent.", "Do not overstretch past shoulder level.", "Focus on squeezing your chest at the peak."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },

  // ================= BACK =================
  {
    id: "pull-up",
    title: "Pull Up",
    category: "Back",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/eGo4IYlbE5g",
    muscles: ["Lats"],
    secondaryMuscles: ["Biceps", "Rhomboids", "Middle Back"],
    equipment: ["Pull-up Bar"],
    calories: 130,
    duration: "35s",
    description: "The fundamental bodyweight pulling test targeting back width (latissimus dorsi) and comprehensive arm pull power.",
    instructions: [
      "Grip the overhead bar with hands wider than shoulder-width, palms facing away.",
      "Hang with straight arms, pulling your shoulder blades down together.",
      "Drive your elbows toward your hips, pulling your chest up to the bar.",
      "Lower slowly under absolute control to a full dead hang."
    ],
    tips: ["Do not swing or use momentum.", "Keep chest proud at the top.", "Pull with your back, not your biceps."],
    sets: 3,
    reps: "8 - 12",
    rest: 75
  },
  {
    id: "lat-pulldown",
    title: "Lat Pulldown",
    category: "Back",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/CAwf7n6Luuc",
    muscles: ["Lats"],
    secondaryMuscles: ["Biceps", "Rhomboids", "Rear Shoulders"],
    equipment: ["Cable Machine", "Wide Grip Bar"],
    calories: 95,
    duration: "40s",
    description: "Exceptional machine exercise that isolates latimus dorsi contraction, allowing progression to bodyweight pullups.",
    instructions: [
      "Sit securely in the lat pulldown machine, adjusting thigh pads tightly.",
      "Grip the bar widely, palms facing away, and lean back slightly.",
      "Pull the bar down toward your upper chest, squeezing shoulder blades.",
      "Let the bar rise back up slowly under complete muscular resistance."
    ],
    tips: ["Keep your shoulders down.", "Pull through your elbows.", "Avoid rocking your back."],
    sets: 4,
    reps: "10 - 12",
    rest: 45
  },
  {
    id: "seated-row",
    title: "Seated Row",
    category: "Back",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/GZBFXGvIM48",
    muscles: ["Rhomboids", "Middle Back"],
    secondaryMuscles: ["Biceps", "Lats", "Lower Back"],
    equipment: ["Cable Machine", "V-Bar Attachment"],
    calories: 90,
    duration: "45s",
    description: "Builds back thickness, posture integrity, and rear-shoulder power by simulating a rowing movement under direct load.",
    instructions: [
      "Sit on the bench, feet on footplates, knees slightly bent.",
      "Grip the V-bar with straight arms, sitting upright with core engaged.",
      "Pull the handle to your lower abdomen while squeezing your shoulder blades.",
      "Extend your arms back forward slowly, keeping tension on the spine."
    ],
    tips: ["Maintain a straight spine.", "Squeeze shoulder blades at the peak.", "Do not lean back excessively."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "deadlift",
    title: "Deadlift",
    category: "Back",
    level: "Elite",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/op9kVnSso6Q",
    muscles: ["Hamstrings", "Lower Back"],
    secondaryMuscles: ["Glutes", "Quads", "Core", "Traps"],
    equipment: ["Barbell", "Weight Plates"],
    calories: 180,
    duration: "30s",
    description: "The ultimate posterior chain lift that works almost every muscle from calves to traps, building extreme structural strength.",
    instructions: [
      "Stand with mid-foot directly under the barbell, feet hip-width.",
      "Hinge at hips, bending knees to grip the bar with a flat neutral back.",
      "Engage your lats and push through the floor, standing up with the weight.",
      "Lock out hips and knees at top, then descend by hinging hips back."
    ],
    tips: ["Keep your back perfectly flat.", "Keep the bar close to your shins.", "Exhale dynamically as you lock out."],
    sets: 4,
    reps: "5 - 8",
    rest: 90
  },

  // ================= LEGS =================
  {
    id: "barbell-squat",
    title: "Barbell Squat",
    category: "Legs",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/yHAOSb_A_T0",
    muscles: ["Quads"],
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    equipment: ["Barbell", "Squat Rack"],
    calories: 160,
    duration: "40s",
    description: "The premier lower-body exercise for developing quadriceps, glutes, and complete trunk stability under spinal loading.",
    instructions: [
      "Rest the bar on your upper back (traps), grip it tightly with feet shoulder-width.",
      "Unhinge hips and bend knees, sinking down as if sitting in a chair.",
      "Descend until your thighs break a parallel line with the ground.",
      "Drive hard through your heels, extending legs back to full stance."
    ],
    tips: ["Keep your knees in line with your toes.", "Elevate chest, keep spine straight.", "Maintain heels flat on ground."],
    sets: 4,
    reps: "8 - 12",
    rest: 75
  },
  {
    id: "goblet-squat",
    title: "Goblet Squat",
    category: "Legs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/MeIiYIFkOm0",
    muscles: ["Quads"],
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    equipment: ["Dumbbell"],
    calories: 105,
    duration: "45s",
    description: "A friendly, lower-back-safe squat variation that enforces upright torso mechanics and builds glute power.",
    instructions: [
      "Hold a dumbbell vertically at your chest with hands cradling the bell.",
      "Stand with feet shoulder-width apart, toes flared out slightly.",
      "Squat down by pushing hips back, keeping the weight pinned to chest.",
      "Touch elbows to inside of knees, then drive back upwards."
    ],
    tips: ["Keep your core braced.", "Weight in your heels.", "Don't let your knees buckle in."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "walking-lunges",
    title: "Walking Lunges",
    category: "Legs",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/D7KaRcUTQms",
    muscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Calves"],
    equipment: ["Dumbbells"],
    calories: 125,
    duration: "50s",
    description: "Excellent unilateral lower-body dynamic movement that builds balance, coordination, glute activation, and leg strength.",
    instructions: [
      "Stand tall holding dumbbells at your sides, chest upright.",
      "Step forward with your right leg, lowering hips until front knee bends to 90 degrees.",
      "Push off the right foot and step forward with the left leg to complete a step.",
      "Continue alternating steps dynamically while moving forward."
    ],
    tips: ["Keep your knee aligned over your ankle.", "Do not slam your back knee down.", "Engage your core to maintain balance."],
    sets: 3,
    reps: "10 steps per leg",
    rest: 45
  },
  {
    id: "leg-press",
    title: "Leg Press",
    category: "Legs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/IZxyjWwjyuy",
    muscles: ["Quads"],
    secondaryMuscles: ["Glutes", "Hamstrings"],
    equipment: ["Leg Press Machine"],
    calories: 110,
    duration: "45s",
    description: "Enables heavy quadricep and glute loading while stabilizing the spine, making it highly effective for leg size.",
    instructions: [
      "Sit flatly in the machine, placing feet shoulder-width on the platform.",
      "Lower safety handles and flex knees slowly to drop the weight plate.",
      "Lower until knees form a 90-degree angle under full control.",
      "Press through your heels to push the platform back up without locking knees."
    ],
    tips: ["Do not lock your knees at top.", "Keep lower back flat against seat.", "Push with your heels, not toes."],
    sets: 4,
    reps: "10 - 15",
    rest: 60
  },
  {
    id: "leg-extension",
    title: "Leg Extension",
    category: "Legs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/YyvSfVLYHQg",
    muscles: ["Quads"],
    secondaryMuscles: [],
    equipment: ["Leg Extension Machine"],
    calories: 80,
    duration: "40s",
    description: "An isolation exercise that places extreme, direct loading on the quadriceps, specifically emphasizing the rectus femoris.",
    instructions: [
      "Sit in machine with ankles tucked behind the padded roller bar.",
      "Hold side handles to secure your hips down into the cushion.",
      "Contract quads to lift and extend your legs horizontally straight.",
      "Hold briefly at top, then lower weight back down slowly."
    ],
    tips: ["Do not swing the weight.", "Hold for a split second at top contraction.", "Keep toes pointed straight."],
    sets: 3,
    reps: "15 - 20",
    rest: 45
  },
  {
    id: "leg-curl",
    title: "Leg Curl",
    category: "Legs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/1Tq3QdIUkyw",
    muscles: ["Hamstrings"],
    secondaryMuscles: ["Calves"],
    equipment: ["Leg Curl Machine"],
    calories: 80,
    duration: "40s",
    description: "Essential isolation exercise that targets hamstring flexors, balancing knee joint health against quadricep strength.",
    instructions: [
      "Lie face down on the machine or sit (based on model) with legs straight.",
      "Secure padded roller behind your lower calves near Achilles tendon.",
      "Contract hamstrings to curl the weights toward your glutes.",
      "Extend legs back out slowly under constant resistance."
    ],
    tips: ["Avoid lifting hips off bench.", "Squeeze hamstrings at bottom.", "Return weight under full control."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "standing-calf-raise",
    title: "Standing Calf Raise",
    category: "Legs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/N38V90TAsYk",
    muscles: ["Calves"],
    secondaryMuscles: [],
    equipment: ["Bodyweight", "Calf Block"],
    calories: 60,
    duration: "50s",
    description: "Isolates gastrocnemius calf muscle fibers, enhancing ankle joint flexibility and lower leg power output.",
    instructions: [
      "Stand on edge of block, balls of feet supported, heels hanging.",
      "Lower heels slowly as far as possible to feel a deep calf stretch.",
      "Press through big toes to raise heels dynamically as high as possible.",
      "Hold contraction briefly, then slowly descend back down."
    ],
    tips: ["Focus on a slow, deep stretch.", "Press straight up to toes.", "Squeeze calves at apex of raise."],
    sets: 4,
    reps: "15 - 20",
    rest: 30
  },

  // ================= SHOULDERS =================
  {
    id: "shoulder-press",
    title: "Shoulder Press",
    category: "Shoulders",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/qEwKCR5JCog",
    muscles: ["Shoulders"],
    secondaryMuscles: ["Triceps", "Upper Chest"],
    equipment: ["Dumbbells", "Seat"],
    calories: 100,
    duration: "40s",
    description: "The core vertical pressing movement targeting the anterior deltoids and triceps with substantial axial loading.",
    instructions: [
      "Sit on an upright bench, holding dumbbells at shoulder height with palms forward.",
      "Press the dumbbells vertically up until arms are fully straight above head.",
      "Lower the weights slowly back down to shoulder level."
    ],
    tips: ["Do not flare elbows perpendicular.", "Keep core engaged, no lumbar arching.", "Lower dumbbells below chin level."],
    sets: 4,
    reps: "8 - 12",
    rest: 60
  },
  {
    id: "arnold-press",
    title: "Arnold Press",
    category: "Shoulders",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/6yJVqDR_Z_8",
    muscles: ["Shoulders"],
    secondaryMuscles: ["Triceps", "Upper Chest"],
    equipment: ["Dumbbells", "Seat"],
    calories: 105,
    duration: "45s",
    description: "Developed by Arnold Schwarzenegger, this rotation press targets all three heads of the deltoids in a single pattern.",
    instructions: [
      "Sit upright, holding dumbbells in front of shoulders with palms facing you.",
      "Rotate wrists outwards as you press weights vertically overhead.",
      "At top lockout, palms must face forward as in a standard press.",
      "Lower and rotate wrists back to starting position."
    ],
    tips: ["Control the wrist rotation.", "Perform in a smooth, continuous line.", "Keep head looking straight ahead."],
    sets: 3,
    reps: "10 - 12",
    rest: 60
  },
  {
    id: "lateral-raise",
    title: "Lateral Raise",
    category: "Shoulders",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/3VcKaXtou6Y",
    muscles: ["Side Delts"],
    secondaryMuscles: ["Traps"],
    equipment: ["Dumbbells"],
    calories: 70,
    duration: "45s",
    description: "The premier exercise to isolate lateral deltoids, creating shoulder width and a tapered torso shape.",
    instructions: [
      "Stand tall holding dumbbells by your thighs, palms facing inwards.",
      "Keep a subtle elbow bend, raising weights out wide to the sides.",
      "Raise arms until they are parallel to ground, then pause.",
      "Slowly lower back down under full muscular control."
    ],
    tips: ["Lead with your elbows.", "Keep pinky fingers slightly elevated.", "Avoid swinging your hips for momentum."],
    sets: 4,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "front-raise",
    title: "Front Raise",
    category: "Shoulders",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/hRJ61w_6o_M",
    muscles: ["Front Delts"],
    secondaryMuscles: ["Upper Chest"],
    equipment: ["Dumbbells"],
    calories: 70,
    duration: "40s",
    description: "Isolates the anterior deltoids, supporting shoulder joint flex stability and shoulder-chest separation.",
    instructions: [
      "Stand with dumbbells resting on front of thighs, palms facing backward.",
      "Keep arms mostly straight and raise them forward directly in front of you.",
      "Stop when arms are parallel to floor, hold briefly.",
      "Lower down slowly under strict resistance."
    ],
    tips: ["Do not shrug.", "Keep torso upright and static.", "Lower slowly to prevent momentum."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "rear-delt-fly",
    title: "Rear Delt Fly",
    category: "Shoulders",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/nlKki3y507g",
    muscles: ["Rear Delts"],
    secondaryMuscles: ["Rhomboids", "Traps"],
    equipment: ["Dumbbells"],
    calories: 75,
    duration: "45s",
    description: "Bridges postural safety by targeting often-neglected posterior delts and rhomboids to balance front chest presses.",
    instructions: [
      "Hinge at your hips with a flat back, torso parallel to ground.",
      "Dumbbells hang straight down with palms facing each other.",
      "Squeeze rear delts to raise arms wide out to your sides.",
      "Slowly lower dumbbells back down, feeling back stretch."
    ],
    tips: ["Lead with elbows.", "Keep back flat.", "Don't use arms/momentum to swing."],
    sets: 3,
    reps: "12 - 15",
    rest: 45
  },

  // ================= ARMS =================
  {
    id: "barbell-curl",
    title: "Barbell Curl",
    category: "Arms",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/i1YgFZmeMv4",
    muscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    equipment: ["Barbell"],
    calories: 80,
    duration: "30s",
    description: "The foundational biceps mass builder that places constant loaded resistance across the forearm flexors and biceps brachii.",
    instructions: [
      "Hold the barbell with an underhand grip, hands shoulder-width apart.",
      "Stand tall, pinning elbows tightly to your rib cage.",
      "Curl the bar toward shoulders, squeezing biceps at apex.",
      "Lower the bar slowly to full extension."
    ],
    tips: ["Keep elbows locked at sides.", "Avoid rocking your back.", "Lower with control for eccentric stimulation."],
    sets: 3,
    reps: "10 - 12",
    rest: 45
  },
  {
    id: "dumbbell-curl",
    title: "Dumbbell Curl",
    category: "Arms",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/yTwo9gV6wWY",
    muscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    equipment: ["Dumbbells"],
    calories: 75,
    duration: "35s",
    description: "Unilateral arm coordination exercise that allows natural wrist supination to maximize peak bicep contraction.",
    instructions: [
      "Stand holding dumbbells at your sides, palms facing inward.",
      "Curl the weights, rotating wrists upward so palms face you at top.",
      "Squeeze biceps, then lower weights slowly rotating palms back in."
    ],
    tips: ["Squeeze at the top.", "Do not swing.", "Control the eccentric phase."],
    sets: 3,
    reps: "10 - 12",
    rest: 45
  },
  {
    id: "hammer-curl",
    title: "Hammer Curl",
    category: "Arms",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/zC3nLlEvin4",
    muscles: ["Brachialis"],
    secondaryMuscles: ["Biceps", "Forearms"],
    equipment: ["Dumbbells"],
    calories: 75,
    duration: "30s",
    description: "Neutral-grip curl targets brachialis and brachioradialis, adding thickness and power to biceps and forearms.",
    instructions: [
      "Stand holding dumbbells with palms facing each other (neutral grip).",
      "Keep elbows tucked to sides and curl weights up to shoulder plane.",
      "Squeeze forearms at top, then lower with strict control."
    ],
    tips: ["Maintain wrist alignment.", "No swaying.", "Full extension at bottom."],
    sets: 3,
    reps: "10 - 15",
    rest: 45
  },
  {
    id: "preacher-curl",
    title: "Preacher Curl",
    category: "Arms",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/fIWP-FRFNU0",
    muscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    equipment: ["Barbell", "Preacher Bench"],
    calories: 80,
    duration: "40s",
    description: "Eliminates all torso cheating and shoulder sway by pinning arms against an angled pad, creating pure biceps isolation.",
    instructions: [
      "Sit at the bench, placing back of upper arms flat against angled pad.",
      "Hold barbell or EZ bar underhand with straight arms.",
      "Curl the bar upwards, stopping when forearms are vertical.",
      "Lower slowly back to near extension, preserving elbow safety."
    ],
    tips: ["Do not hyperextend elbows at bottom.", "Keep back flat against seat.", "Keep elbows aligned on pad."],
    sets: 3,
    reps: "10 - 12",
    rest: 45
  },
  {
    id: "tricep-pushdown",
    title: "Tricep Pushdown",
    category: "Arms",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/2-LAMclzpHY",
    muscles: ["Triceps"],
    secondaryMuscles: ["Forearms"],
    equipment: ["Cable Machine", "Rope Attachment"],
    calories: 75,
    duration: "35s",
    description: "A premier cable isolation movement for loading the lateral and medial heads of the triceps with dynamic peak lockout.",
    instructions: [
      "Face cable pulley, grip rope with elbows flexed to 90 degrees.",
      "Stand with chest proud, pinning elbows tightly near ribs.",
      "Extend arms downward, splitting rope wide apart at bottom.",
      "Hold triceps squeeze, then return rope slowly to start."
    ],
    tips: ["Pin elbows to sides.", "Flare the rope at bottom.", "Avoid using shoulder pressure to push."],
    sets: 4,
    reps: "12 - 15",
    rest: 45
  },
  {
    id: "overhead-extension",
    title: "Overhead Extension",
    category: "Arms",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/X-iV-qq8YVE",
    muscles: ["Triceps"],
    secondaryMuscles: ["Core"],
    equipment: ["Dumbbell"],
    calories: 80,
    duration: "40s",
    description: "Overhead positioning stretches long head of triceps under load, critical for total arm size and elbow strength.",
    instructions: [
      "Sit upright holding a single heavy dumbbell with both hands overhead.",
      "Keep upper arms vertical, lowering weight behind your head by bending elbows.",
      "Lower until forearms pass horizontal, then press weight vertically back to top."
    ],
    tips: ["Keep elbows pointing forward.", "Engage core to support lower back.", "Full elbow extension at top."],
    sets: 3,
    reps: "10 - 12",
    rest: 45
  },
  {
    id: "close-grip-bench-press",
    title: "Close Grip Bench Press",
    category: "Arms",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/nEF0buYMe9U",
    muscles: ["Triceps"],
    secondaryMuscles: ["Chest", "Front Shoulders"],
    equipment: ["Barbell", "Flat Bench"],
    calories: 110,
    duration: "45s",
    description: "Heavy compound press that shifts focus from pectorals to triceps, building extreme extension lock power.",
    instructions: [
      "Lie supine on bench, grip bar with hands shoulder-width apart.",
      "Unrack bar and lower it slowly to mid-chest while keeping elbows tucked to ribs.",
      "Press the bar up powerfully, locking out triceps at top."
    ],
    tips: ["Do not grip too close (wrist safety).", "Keep elbows tucked to side.", "Engage feet drive."],
    sets: 3,
    reps: "8 - 12",
    rest: 60
  },

  // ================= ABS =================
  {
    id: "crunch",
    title: "Crunch",
    category: "Abs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/MKmrqcoCZ-M",
    muscles: ["Abs"],
    secondaryMuscles: [],
    equipment: ["Bodyweight"],
    calories: 50,
    duration: "40s",
    description: "Isolates upper abdominal contraction by rolling spine off ground under strict compression checks.",
    instructions: [
      "Lie supine on floor, knees bent, feet flatly placed.",
      "Lightly touch fingers behind ears, elbows flared wide.",
      "Contract abs to roll shoulder blades off floor 2 to 3 inches.",
      "Slowly lower shoulders back down without relaxing abs entirely."
    ],
    tips: ["Do not pull on your neck.", "Press lower back flat into floor.", "Exhale fully on contraction."],
    sets: 3,
    reps: "15 - 20",
    rest: 30
  },
  {
    id: "sit-up",
    title: "Sit Up",
    category: "Abs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/jDwoBqPH0O4",
    muscles: ["Abs"],
    secondaryMuscles: ["Hip Flexors"],
    equipment: ["Bodyweight"],
    calories: 60,
    duration: "45s",
    description: "Classical core testing protocol that activates hip flexor and abdominal chains through full spinal flexion.",
    instructions: [
      "Lie supine, knees flexed, feet secured flatly on floor.",
      "Cross hands on chest or touch ears, engage core.",
      "Sit up fully, bringing your chest close to your thighs.",
      "Lower torso back to floor slowly under full muscle control."
    ],
    tips: ["Avoid using arm momentum.", "Lower torso slowly.", "Keep feet pinned flat."],
    sets: 3,
    reps: "12 - 15",
    rest: 30
  },
  {
    id: "russian-twist",
    title: "Russian Twist",
    category: "Abs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/wkD8rjkS_R8",
    muscles: ["Obliques"],
    secondaryMuscles: ["Abs", "Lower Back"],
    equipment: ["Bodyweight", "Dumbbell"],
    calories: 70,
    duration: "45s",
    description: "Rotational isometric sit hold targeting lateral obliques, transverse abdominal walls, and spinal rotation.",
    instructions: [
      "Sit on floor with knees bent, leaning torso back at a 45-degree angle.",
      "Elevate feet slightly to balance on glutes (advanced, or keep heels on floor).",
      "Clasp hands or hold a weight, rotating shoulders side-to-side dynamically."
    ],
    tips: ["Rotate from the ribs/shoulders.", "Keep hips stable and straight.", "Engage abs deeply."],
    sets: 3,
    reps: "20 twists total",
    rest: 30
  },
  {
    id: "leg-raise",
    title: "Leg Raise",
    category: "Abs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/Wp4BlxcFTco",
    muscles: ["Lower Abs"],
    secondaryMuscles: ["Hip Flexors"],
    equipment: ["Bodyweight"],
    calories: 65,
    duration: "40s",
    description: "Excellent movement to isolate lower abdominal fibers under pelvic hip tilt resistance requirements.",
    instructions: [
      "Lie flat on your back, arms down at sides.",
      "Keep legs straight and ankles together, lift them straight to 90 degrees.",
      "Lower legs slowly back down until heels hover 2 inches above ground."
    ],
    tips: ["Forcefully press lower back flat.", "Control the eccentric down phase.", "Don't let feet touch floor."],
    sets: 3,
    reps: "12 - 15",
    rest: 35
  },
  {
    id: "hanging-leg-raise",
    title: "Hanging Leg Raise",
    category: "Abs",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/g0S_S-m0Mlo",
    muscles: ["Lower Abs"],
    secondaryMuscles: ["Grip Strength", "Hip Flexors"],
    equipment: ["Pull-up Bar"],
    calories: 90,
    duration: "35s",
    description: "The ultimate core exercise, which checks relative abdominal strength and body control against momentum swing factors.",
    instructions: [
      "Hang with straight arms from pull-up bar, body relaxed.",
      "Contract abs and lift straight legs until they are parallel to floor.",
      "Lower legs slowly under complete core control, preventing swing."
    ],
    tips: ["No swinging.", "Squeeze legs straight.", "Exhale as feet lift."],
    sets: 3,
    reps: "8 - 12",
    rest: 45
  },
  {
    id: "plank",
    title: "Plank",
    category: "Abs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/pvIjsG5Svck",
    muscles: ["Abs"],
    secondaryMuscles: ["Lower Back", "Shoulders"],
    equipment: ["Bodyweight"],
    calories: 60,
    duration: "60s",
    description: "Isometric core bracing masterpiece targeting transverse abdominis, rectus abdominis, obliques, and pelvic health.",
    instructions: [
      "Rest forearms flatly on floor, elbows aligned beneath shoulders.",
      "Extend legs backward, balance on toes, and raise hips.",
      "Hold a rigid flat line from ears down to heels."
    ],
    tips: ["Squeeze glutes to protect lower back.", "Push forearms through ground.", "Keep breathing steadily."],
    sets: 3,
    reps: "60s Hold",
    rest: 30
  },
  {
    id: "side-plank",
    title: "Side Plank",
    category: "Abs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/wqzbaH7-aEk",
    muscles: ["Obliques"],
    secondaryMuscles: ["Shoulders", "Glutes"],
    equipment: ["Bodyweight"],
    calories: 55,
    duration: "45s",
    description: "Isometric lateral brace that builds deep side oblique walls, hip stabilizer control, and shoulder side strength.",
    instructions: [
      "Lie on your side, supporting upper body on a single forearm directly under shoulder.",
      "Stack feet together and lift hips vertically high.",
      "Form a rigid side diagonal line, holding core braced."
    ],
    tips: ["Elevate hips high.", "Align neck in straight line.", "Keep breathing consistently."],
    sets: 3,
    reps: "45s Hold per side",
    rest: 30
  },

  // ================= CARDIO & FULL BODY =================
  {
    id: "mountain-climber",
    title: "Mountain Climber",
    category: "Cardio",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/zTfZjSInNnc",
    muscles: ["Abs"],
    secondaryMuscles: ["Cardio", "Shoulders", "Legs"],
    equipment: ["Bodyweight"],
    calories: 120,
    duration: "45s",
    description: "High-intensity cardio-abdominal pattern moving alternating hips under direct high-plank stabilization limits.",
    instructions: [
      "Set your starting line in a clean high push-up stance.",
      "Drive right knee towards your lower chest line.",
      "Quickly reset right leg while dynamically driving left knee forward."
    ],
    tips: ["Keep your hips low.", "Drive knees straight forward.", "Brace shoulders above wrists."],
    sets: 3,
    reps: "45s Action",
    rest: 30
  },
  {
    id: "burpee",
    title: "Burpee",
    category: "Cardio",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    video: "https://www.youtube.com/embed/dZfe9Hst-Xo",
    muscles: ["Cardio"],
    secondaryMuscles: ["Chest", "Legs", "Shoulders"],
    equipment: ["Bodyweight"],
    calories: 150,
    duration: "40s",
    description: "The gold-standard metabolic conditioning compound movement that challenges total cardiovascular threshold levels.",
    instructions: [
      "Stand tall, instantly squat placing palms flatly on floor.",
      "Thrust legs back to land in a straight high plank stance.",
      "Complete a push-up, then hop feet forward underneath chest.",
      "Explode vertically upward into a full straight vertical jump."
    ],
    tips: ["Land softly with knee flex.", "Keep spine flat on plank push phase.", "Pace yourself for steady duration."],
    sets: 4,
    reps: "12 - 15",
    rest: 45
  }
];
