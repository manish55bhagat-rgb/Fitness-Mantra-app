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
}

export const exercises: Exercise[] = [
  {
    id: "chest-1",
    title: "Dumbbell Incline Press",
    category: "Chest",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    video: "https://v.videopress.com/embed/XXXXXX", // Placeholder for real gym video
    muscles: ["Upper Chest"],
    secondaryMuscles: ["Front Delts", "Triceps"],
    equipment: ["Dumbbells", "Incline Bench"],
    calories: 120,
    duration: "45s",
    description: "A paramount compound movement for developing the upper pectoral region and front deltoids with a significant range of motion.",
    instructions: [
      "Adjust a bench to a 30-45 degree incline.",
      "Sit on the bench and place dumbbells on your knees.",
      "Kick the weights up as you lie back, holding them above your chest.",
      "Lower the weights slowly until they are level with your chest.",
      "Press the weights back up to the starting position without locking elbows."
    ],
    tips: ["Keep your shoulder blades retracted.", "Feet flat on the floor.", "Controlled eccentric phase."],
    sets: 4,
    reps: "8-12"
  },
  {
    id: "back-1",
    title: "Barbell Pendlay Row",
    category: "Back",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop",
    video: "https://v.videopress.com/embed/XXXXXX",
    muscles: ["Lats", "Rhomboids"],
    secondaryMuscles: ["Lower Back", "Biceps", "Forearms"],
    equipment: ["Barbell", "Weight Plates"],
    calories: 150,
    duration: "25s",
    description: "The gold standard for explosive back power and thickness. Starts from a dead-stop on the floor each rep.",
    instructions: [
      "Stand with feet shoulder-width apart, bar over mid-foot.",
      "Bend at the hips until your back is parallel to the floor.",
      "Grip the bar slightly wider than shoulder width.",
      "Explosively pull the bar to your lower chest while keeping your back flat.",
      "Return the bar to the floor after each rep."
    ],
    tips: ["Maintain a flat back at all times.", "Do not use momentum from your legs.", "Pull with your elbows."],
    sets: 5,
    reps: "5-8"
  },
  {
    id: "legs-1",
    title: "Goblet Squats",
    category: "Legs",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    video: "https://v.videopress.com/embed/XXXXXX",
    muscles: ["Quads", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    equipment: ["Dumbbell or Kettlebell"],
    calories: 100,
    duration: "60s",
    description: "An exceptional exercise for teaching proper squat mechanics while building significant lower-body strength and mobility.",
    instructions: [
      "Hold a dumbbell vertically against your chest (goblet style).",
      "Stand with feet slightly wider than shoulder-width.",
      "Lower your hips back and down, keeping your chest up.",
      "Descend until your elbows touch the inside of your knees.",
      "Drive back up to the starting position through your heels."
    ],
    tips: ["Keep your knees tracked over your toes.", "Weight on your heels.", "Keep the dumbbell glued to your chest."],
    sets: 3,
    reps: "12-15"
  },
  {
    id: "shoulders-1",
    title: "Side Lateral Raises",
    category: "Shoulders",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=2070&auto=format&fit=crop",
    video: "https://v.videopress.com/embed/XXXXXX",
    muscles: ["Side Delts"],
    secondaryMuscles: ["Traps"],
    equipment: ["Dumbbells"],
    calories: 80,
    duration: "40s",
    description: "The primary exercise for creating shoulder width ('capped delts'). Focuses heavily on the lateral head of the deltoid.",
    instructions: [
      "Stand tall with dumbbells by your sides.",
      "With a slight bend in the elbows, raise the weights out to your sides.",
      "Continue until your arms are parallel to the floor.",
      "Pause for a split second at the top.",
      "Slowly lower the weights back to the start position."
    ],
    tips: ["Lead with your elbows.", "Don't swing the weights.", "Keep pinkies slightly elevated at the top."],
    sets: 4,
    reps: "15-20"
  },
  {
    id: "arms-1",
    title: "Hammer Curls",
    category: "Arms",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    video: "https://v.videopress.com/embed/XXXXXX",
    muscles: ["Brachialis", "Biceps"],
    secondaryMuscles: ["Brachioradialis", "Forearms"],
    equipment: ["Dumbbells"],
    calories: 70,
    duration: "30s",
    description: "A variations that targets the brachialis, allowing for thicker-looking arms and better forearm development.",
    instructions: [
      "Hold dumbbells with a neutral grip (palms facing your body).",
      "Keep elbows tucked to your sides.",
      "Curl the weight up towards your shoulders.",
      "Squeeze at the top.",
      "Lower with control."
    ],
    tips: ["Don't swing.", "Full range of motion.", "Keep your wrists straight."],
    sets: 3,
    reps: "10-12"
  },
  {
    id: "abs-1",
    title: "Hanging Leg Raises",
    category: "Abs",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop",
    video: "https://v.videopress.com/embed/XXXXXX",
    muscles: ["Lower Abs"],
    secondaryMuscles: ["Hip Flexors", "Grip Strength"],
    equipment: ["Pull-up Bar"],
    calories: 90,
    duration: "45s",
    description: "The ultimate core exercise for testing abdominal strength and relative body-weight control.",
    instructions: [
      "Hang from a pull-up bar with an overhand grip.",
      "Keep your legs straight and together.",
      "Raise your legs until they are at least parallel to the floor.",
      "Slowly lower them back down without swinging."
    ],
    tips: ["Avoid using momentum.", "Exhale as you raise your legs.", "Controlled eccentric is key."],
    sets: 3,
    reps: "8-12"
  }
];
