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
  "Nav.SuccessStories": {
    en: "Stories",
    hi: "सफलता",
    mr: "यशस्वी मार्ग"
  },
  "Nav.EliteAccess": {
    en: "PREMIUM PLANS",
    hi: "प्रीमियम प्लान्स",
    mr: "प्रीमियम प्लॅन्स"
  },
  "Nav.SignIn": {
    en: "SIGN IN",
    hi: "लॉगिन करें",
    mr: "लॉगिन करा"
  },

  // BMI Calculator Section
  "Bmi.Title": {
    en: "BMI Calculator",
    hi: "बीएमआई कैलकुलेटर",
    mr: "बीएमआय कॅल्क्युलेटर"
  },
  "Bmi.Sub": {
    en: "Check your Body Mass Index (BMI) instantly with simple rules.",
    hi: "सरल नियमों के साथ तुरंत अपने बॉडी मास इंडेक्स (बीएमआई) की जांच करें।",
    mr: "साध्या नियमांसह आपले बॉडी मास इंडेक्स (बीएमआई) त्वरित तपासा."
  },
  "Bmi.WeightLabel": {
    en: "Weight (KG)",
    hi: "वजन (किग्रा)",
    mr: "वजन (किग्रॅ)"
  },
  "Bmi.HeightLabel": {
    en: "Height (CM)",
    hi: "लंबाई / ऊंचाई (सेमी)",
    mr: "उंची (सेमी)"
  },
  "Bmi.GenderLabel": {
    en: "Gender",
    hi: "लिंग",
    mr: "लिंग"
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
    en: "Fitness Goal",
    hi: "फिटनेस लक्ष्य",
    mr: "फिटनेस ध्येय"
  },
  "Bmi.Goal.Fit": {
    en: "General Fitness",
    hi: "सामान्य फिटनेस",
    mr: "सामान्य फिटनेस"
  },
  "Bmi.Goal.Loss": {
    en: "Fat Loss",
    hi: "वजन घटाना (Fat Loss)",
    mr: "चरबी कमी करणे"
  },
  "Bmi.Goal.Muscle": {
    en: "Muscle Gain",
    hi: "मांसपेशियों का निर्माण (Muscle Gain)",
    mr: "स्नायू वाढवणे"
  },
  "Bmi.Goal.Endu": {
    en: "General Health",
    hi: "सामान्य स्वास्थ्य",
    mr: "सामान्य आरोग्य"
  },
  "Bmi.Btn": {
    en: "CHECK MY BMI",
    hi: "बीएमआई चेक करें",
    mr: "बीएमआय तपासा"
  },
  "Bmi.ResultTitle": {
    en: "Your BMI Result",
    hi: "आपका बीएमआई परिणाम",
    mr: "तुमचा बीएमआय निकाल"
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
    en: "CALCULATE CALORIES",
    hi: "कैलोरी की गणना करें",
    mr: "कॅलरी मोजा"
  },
  "Cal.Output": {
    en: "Calorie Results",
    hi: "कैलोरी गणना परिणाम",
    mr: "कॅलरी गणना निकाल"
  },
  "Cal.Maintenance": {
    en: "Maintenance Calories",
    hi: "मैंटेनेंस कैलोरी (वजन सामान्य रखने के लिए)",
    mr: "मेंटेनन्स कॅलरीज"
  },
  "Cal.Loss": {
    en: "Fat Loss Calories",
    hi: "वजन घटाने की कैलोरी (Fat Loss)",
    mr: "वजन कमी करण्याची कॅलरी"
  },
  "Cal.Gain": {
    en: "Muscle Gain Calories",
    hi: "वजन बढ़ाने की कैलोरी (Muscle Gain)",
    mr: "वजन वाढवण्याची कॅलरी"
  },
  "Cal.Deficit": {
    en: "-500 Calories Deficit",
    hi: "-500 कैलोरी की कमी",
    mr: "-५०० कॅलरीची कमतरता"
  },
  "Cal.Surplus": {
    en: "+500 Calories Surplus",
    hi: "+500 कैलोरी की वृद्धि",
    mr: "+५०० कॅलरीची वाढ"
  },
  "Cal.TargetLabel": {
    en: "Your Target Calories",
    hi: "आपका कैलोरी लक्ष्य",
    mr: "तुमचे कॅलरी ध्येय"
  },

  // Home CTA & Other Sections
  "Home.HeroSub": {
    en: "Start Your Fitness Journey",
    hi: "अपनी फिटनेस यात्रा शुरू करें",
    mr: "आपली फिटनेस प्रवास सुरू करा"
  },
  "Home.Subtitle": {
    en: "Calculate your BMI and Calorie targets. Choose a plan or book a free professional consultation to get started.",
    hi: "अपने बीएमआई और कैलोरी लक्ष्यों की गणना करें। शुरू करने के लिए एक प्लान चुनें या फ्री कंसल्टेशन बुक करें।",
    mr: "तुमचे बीएमआय आणि कॅलरी लक्ष्य मोजा. सुरू करण्यासाठी प्लॅन निवडा किंवा मोफत चर्चा करा."
  },
  "Home.BmiEngine": {
    en: "BMI Checker",
    hi: "बीएमआई चेक",
    mr: "बीएमआय चेक"
  },
  "Home.BmiDesc": {
    en: "Check your Body Mass Index (BMI) instantly to understand if your weight is healthy, under, or over.",
    hi: "यह समझने के लिए कि आपका वजन स्वस्थ है, कम है या अधिक है, तुरंत अपने बॉडी मास इंडेक्स (बीएमआई) की जांच करें।",
    mr: "तुमचे वजन निरोगी, कमी किंवा जास्त आहे हे समजून घेण्यासाठी तुमचे बीएमआय त्वरित तपासा."
  },
  "Home.LaunchBmi": {
    en: "CHECK BMI NOW",
    hi: "बीएमआई अभी चेक करें",
    mr: "बीएमआय आता तपासा"
  },
  "Home.CalEngine": {
    en: "Calorie Checker",
    hi: "कैलोरी चेक",
    mr: "कॅलरी चेक"
  },
  "Home.CalDesc": {
    en: "Calculate your daily calorie needs to easily reach your fat loss, muscle gain or fitness goals.",
    hi: "फैट लॉस, मसल गेन या फिटनेस लक्ष्यों तक आसानी से पहुंचने के लिए अपनी दैनिक कैलोरी आवश्यकताओं की गणना करें।",
    mr: "फॅट लॉस, मसल गेन किंवा फिटनेस ध्येयांपर्यंत सहज पोहोचण्यासाठी तुमच्या दैनंदिन कॅलरी गरजा मोजा."
  },
  "Home.LaunchCal": {
    en: "CHECK CALORIES NOW",
    hi: "कैलोरी अभी चेक करें",
    mr: "कॅलरी आता तपासा"
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
