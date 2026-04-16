import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { content as fallbackContent } from "./i18n";

const LanguageContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || '';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [content, setContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content`);
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      // The API returns { en: {...}, pt: {...}, images: {...} }
      // We only need en and pt for translation; images handled separately
      setContent(data);
    } catch {
      // Fall back to hardcoded i18n
      setContent(fallbackContent);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const t = content[lang] || content.en;
  const images = content.images || null;

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "pt" : "en"));
  };

  const refetch = () => fetchContent();

  if (loading) {
    return (
      <div className="bg-[#221F20] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#069BAF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, content, images, refetch }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
