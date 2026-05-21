import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "mr";

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  "Nav.Home": {
    en: "Home",
    hi: "होम",
    mr: "मुख्यपृष्ठ"
  },
  "Nav.Dashboard": {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    mr: "डॅशबोर्ड"
  },
  "Nav.Programs": {
    en: "Programs",
    hi: "प्रोग्राम्स",
    mr: "कार्यक्रम"
  },
  "Nav.Exercises": {
    en: "Exercises",
    hi: "व्यायाम",
    mr: "व्यायाम"
  },
  "Nav.Diet": {
    en: "Diet Plans",
    hi: "डाइट प्लान्स",
    mr: "आहार योजना"
  },
  "Nav.BMICalc": {
    en: "BMI Calc",
    hi: "बीएमआई कैल्क",
    mr: "बीएमआय कॅल्क"
  },
  "Nav.CalorieCalc": {
    en: "Calorie Calc",
    hi: "कैलोरी कैल्क",
    mr: "कॅलरी कॅल्क"
  },
  "Nav.AICoach": {
    en: "AI Coach",
    hi: "एआई कोच",
    mr: "एआय कोच"
  },
  "Nav.FAQ": {
    en: "FAQ",
    hi: "अक्सर पूछे जाने वाले सवाल",
    mr: "वारंवार विचारले जाणारे प्रश्न"
  },
  "Nav.EliteAccess": {
    en: "ELITE ACCESS",
    hi: "एलीट एक्सेस",
    mr: "एलिट ॲक्सेस"
  },
  "Nav.SignIn": {
    en: "SIGN IN",
    hi: "साइन इन",
    mr: "साइन इन"
  },

  // BMI Calculator Section
  "Bmi.Title": {
    en: "Body Metrics",
    hi: "शारीरिक मापदंड (BMI)",
    mr: "शारीरिक मापदंड (BMI)"
  },
  "Bmi.Sub": {
    en: "Initialize a comprehensive audit of your physical architecture using advanced neural classification.",
    hi: "उन्नत तंत्रिका वर्गीकरण का उपयोग करके अपने शारीरिक संरचना का व्यापक विश्लेषण शुरू करें।",
    mr: "प्रगत तंत्रिका वर्गीकरण वापरून आपल्या शारीरिक संरचनेचे सर्वसमावेशक विश्लेषण सुरू करा."
  },
  "Bmi.WeightLabel": {
    en: "Weight Protocol (KG)",
    hi: "वजन प्रोटोकॉल (किग्रा)",
    mr: "वजन प्रोटोकॉल (किग्रॅ)"
  },
  "Bmi.HeightLabel": {
    en: "Height Protocol (CM)",
    hi: "लंबाई प्रोटोकॉल (सेमी)",
    mr: "उंची प्रोटोकॉल (सेमी)"
  },
  "Bmi.GenderLabel": {
    en: "Gender Matrix",
    hi: "लिंग मैट्रिक्स",
    mr: "लिंग मॅट्रिक्स"
  },
  "Bmi.Male": {
    en: "Male",
    hi: "पुरुष",
    mr: "पुरुष"
  },
  "Bmi.Female": {
    en: "Female",
    hi: "महिला",
    mr: "महिला"
  },
  "Bmi.GoalLabel": {
    en: "Strategy Objective",
    hi: "रणनीतिक उद्देश्य",
    mr: "रणनीतीचे उद्दिष्ट"
  },
  "Bmi.Goal.Fit": {
    en: "General Fitness",
    hi: "सामान्य फिटनेस",
    mr: "सामान्य फिटनेस"
  },
  "Bmi.Goal.Loss": {
    en: "Weight Loss",
    hi: "वजन घटाना",
    mr: "वजन कमी करणे"
  },
  "Bmi.Goal.Muscle": {
    en: "Build Muscle",
    hi: "मांसपेशियों का निर्माण",
    mr: "स्नायू वाढवणे"
  },
  "Bmi.Goal.Endu": {
    en: "Endurance",
    hi: "सहनशक्ति (एंड्यूरेंस)",
    mr: "सहनशक्ती (एंड्यूरेंस)"
  },
  "Bmi.Btn": {
    en: "GENERATE NEURAL AUDIT",
    hi: "न्यूरल विश्लेषण उत्पन्न करें",
    mr: "न्यूरल विश्लेषण तयार करा"
  },
  "Bmi.ResultTitle": {
    en: "Diagnostic Output",
    hi: "नैदानिक आउटपुट",
    mr: "नैदानिक आउटपुट"
  },
  "Bmi.Underweight": {
    en: "Underweight",
    hi: "अंडरवेट (कम वजन)",
    mr: "अंडरवेट (कमी वजन)"
  },
  "Bmi.Normal": {
    en: "Normal",
    hi: "सामान्य",
    mr: "सामान्य"
  },
  "Bmi.Overweight": {
    en: "Overweight",
    hi: "ओवरवेट (अधिक वजन)",
    mr: "ओवरवेट (जास्त वजन)"
  },
  "Bmi.Obese": {
    en: "Obese",
    hi: "मोटापा (ओबीस)",
    mr: "लठ्ठपणा (ओबीस)"
  },
  "Bmi.OptimalRange": {
    en: "Your BMI points to standard optimal parameters.",
    hi: "आपका बीएमआई मानक इष्टतम मापदंडों की ओर इशारा करता है।",
    mr: "तुमचा बीएमआय मानक इष्टतम मापदंड दर्शवतो."
  },
  "Bmi.Legend": {
    en: "CLINICAL CLASSIFICATION LEGEND",
    hi: "नैदानिक वर्गीकरण विवरण",
    mr: "नैदानिक वर्गीकरण वर्णन"
  },

  // Calorie Calculator Section
  "Cal.Title": {
    en: "Energetics",
    hi: "ऊर्जा मापदंड",
    mr: "ऊर्जा मापदंड"
  },
  "Cal.Sub": {
    en: "Configure your thermogenic profile and calculate real-time metabolic and caloric thresholds.",
    hi: "अपने थर्मोजेनिक प्रोफाइल को कॉन्फ़िगर करें और वास्तविक समय के चयापचय और कैलोरी थ्रेसहोल्ड की गणना करें।",
    mr: "तुमचे थर्मोजेनिक प्रोफाइल कॉन्फिगर करा आणि रिअल-टाइम चयापचय आणि कॅलरी थ्रेसहोल्डची गणना करा."
  },
  "Cal.AgeLabel": {
    en: "Age Target",
    hi: "आयु सीमा",
    mr: "वय"
  },
  "Cal.ActivityLabel": {
    en: "Thermic Activity Coefficient",
    hi: "थर्मिक गतिविधि गुणांक",
    mr: "शारीरिक क्रियाशीलता स्तर"
  },
  "Cal.Activity.Sed": {
    en: "Sedentary (Office/Desk job)",
    hi: "गतिहीन (ऑफिस/डेस्क जॉब)",
    mr: "मंदावलेली क्रियाशीलता (ऑफिस/डेस्क जॉब)"
  },
  "Cal.Activity.Light": {
    en: "Lightly Active (1-3 days/week exercise)",
    hi: "हल्की सक्रियता (सप्ताह में 1-3 दिन व्यायाम)",
    mr: "कमी क्रियाशीलता (आठवड्यातून १-३ दिवस व्यायाम)"
  },
  "Cal.Activity.Mod": {
    en: "Moderately Active (3-5 days/week exercise)",
    hi: "मध्यम सक्रियता (सप्ताह में 3-5 दिन व्यायाम)",
    mr: "मध्यम क्रियाशीलता (आठवड्यातून ३-५ दिवस व्यायाम)"
  },
  "Cal.Activity.Very": {
    en: "Very Active (6-7 days/week intense work)",
    hi: "अत्यधिक सक्रियता (सप्ताह में 6-7 दिन कठोर व्यायाम)",
    mr: "खूप क्रियाशील (आठवड्यातून ६-७ दिवस कठोर व्यायाम)"
  },
  "Cal.Activity.Ext": {
    en: "Athlete Mode (Double splits / high manual physical labor)",
    hi: "एथलीट मोड (डबल स्प्लिट्स / उच्च शारीरिक श्रम)",
    mr: "ॲथलीट मोड (डबल स्प्लिट्स / उच्च शारीरिक श्रम)"
  },
  "Cal.Btn": {
    en: "COMMENCE PHYSIOLOGICAL AUDIT",
    hi: "शारीरिक ऑडिट प्रारंभ करें",
    mr: "शारीरिक ऑडिट सुरू करा"
  },
  "Cal.Output": {
    en: "Energetics Output",
    hi: "ऊर्जा गणना परिणाम",
    mr: "ऊर्जा गणना परिणाम"
  },
  "Cal.Maintenance": {
    en: "Maintenance Calories",
    hi: "रखरखाव कैलोरी (मैंटेनेंस)",
    mr: "देखभाल कॅलरी (मेंटेनन्स)"
  },
  "Cal.Loss": {
    en: "Weight Loss Calories",
    hi: "वजन घटाने की कैलोरी",
    mr: "वजन कमी करण्याची कॅलरी"
  },
  "Cal.Gain": {
    en: "Weight Gain Calories",
    hi: "वजन बढ़ाने की कैलोरी",
    mr: "वजन वाढवण्याची कॅलरी"
  },
  "Cal.Deficit": {
    en: "-500 KCAL Deficit",
    hi: "-५०० कैलोरी की कमी",
    mr: "-५०० कॅलरीची कमतरता"
  },
  "Cal.Surplus": {
    en: "+500 KCAL Surplus",
    hi: "+५०० कैलोरी की वृद्धि",
    mr: "+५०० कॅलरीची वाढ"
  },
  "Cal.TargetLabel": {
    en: "Custom Protocol Target",
    hi: "कस्टम प्रोटोकॉल लक्ष्य",
    mr: "सानुकूल प्रोटोकॉल लक्ष्य"
  },

  // Home CTA & Other Sections
  "Home.HeroSub": {
    en: "Transform Your Body Naturally",
    hi: "प्राकृतिक रूप से अपना शरीर बदलें",
    mr: "नैसर्गिकरित्या आपले शरीर बदला"
  },
  "Home.Subtitle": {
    en: "Pinpoint precision diagnostics for calculating body mass quotients and energetic maintenance targets.",
    hi: "शरीर के द्रव्यमान सूचकांक और ऊर्जा रखरखाव लक्ष्यों की सटीक गणना करने वाली प्रणाली।",
    mr: "शरीरमान निर्देशांक आणि ऊर्जेच्या उद्दिष्टांची अचूक गणना करणारी प्रणाली."
  },
  "Home.BmiEngine": {
    en: "BMI Diagnostic Engine",
    hi: "बीएमआई निदान इंजन",
    mr: "बीएमआय निदान प्रणाली"
  },
  "Home.BmiDesc": {
    en: "Compute your body mass index instantly based on accurate weight and height tracking ratios to discover body classifications.",
    hi: "शरीर के वर्गीकरण का पता लगाने के लिए सटीक वजन और ऊंचाई के अनुपात के आधार पर तुरंत अपने बीएमआई की गणना करें।",
    mr: "शरीराचे वर्गीकरण शोधण्यासाठी अचूक वजन आणि उंचीच्या गुणोत्तरावर आधारित तुमच्या बीएमआयची त्वरित गणना करा."
  },
  "Home.LaunchBmi": {
    en: "LAUNCH BMI ENGINE",
    hi: "बीएमआई इंजन शुरू करें",
    mr: "बीएमआय इंजिन सुरू करा"
  },
  "Home.CalEngine": {
    en: "Calorie Intake Architect",
    hi: "कैलोरी सेवन वास्तुकला",
    mr: "कॅलरी सेवन रचना"
  },
  "Home.CalDesc": {
    en: "Calculate maintenance, deficit (weight loss), and surplus (weight gain) targets tailored to age, height, activity level, and gender.",
    hi: "उम्र, ऊंचाई, गतिविधि स्तर और लिंग के अनुसार रखरखाव, कमी (वजन घटाने) और वृद्धि (वजन बढ़ाने) के लक्ष्यों की गणना करें।",
    mr: "वय, उंची, क्रियाशीलता पातळी आणि लिंगानुसार देखभाल, घट (वजन कमी करणे) आणि वाढ (वजन वाढवणे) या उद्दिष्टांची गणना करा."
  },
  "Home.LaunchCal": {
    en: "LAUNCH CALORIE ARCHITECT",
    hi: "कॅलरी आर्किटेक्ट सुरू करा",
    mr: "कॅलरी आर्किटेक्ट सुरू करा"
  },
  "Common.Language": {
    en: "Language",
    hi: "भाषा",
    mr: "भाषा"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("fitness-mantra-lang");
    if (saved === "hi" || saved === "mr" || saved === "en") {
      return saved;
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("fitness-mantra-lang", lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
