import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en-US/en.json";

const resources = {
  "en": { translation: translationEN },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag || "en";
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage,
    supportedLngs: ['en'],
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    cleanCode: true,
    ns: ['translation'],
    defaultNS: 'translation',
  });
};

initI18n();

export default i18n;