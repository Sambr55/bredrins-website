import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "./LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL || '';

/* ─── Helpers ─── */

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function AutoTextarea({ value, onChange, className = "", ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value || ""}
      onChange={onChange}
      rows={2}
      className={`w-full bg-[#2d2a2b] text-[#FBEBC3] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#069BAF] transition-colors resize-none ${className}`}
      {...props}
    />
  );
}

function Input({ value, onChange, className = "", ...props }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      className={`w-full bg-[#2d2a2b] text-[#FBEBC3] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#069BAF] transition-colors ${className}`}
      {...props}
    />
  );
}

function Label({ children }) {
  return <label className="block text-[#FBEBC3]/60 text-sm mb-1.5 font-medium">{children}</label>;
}

function SectionTitle({ children }) {
  return <h2 className="text-[#FACC48] text-2xl font-bold mb-6">{children}</h2>;
}

/* ─── Toast ─── */

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-lg text-sm font-medium shadow-xl transition-all ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {message}
    </div>
  );
}

/* ─── Section Editors ─── */

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "story", label: "Story" },
  { id: "menu", label: "Menu" },
  { id: "events", label: "Events" },
  { id: "family", label: "Family" },
  { id: "contact", label: "Contact" },
  { id: "images", label: "Images" },
];

function HeroEditor({ data, onChange }) {
  return (
    <div className="space-y-5">
      <SectionTitle>Hero Section</SectionTitle>
      <div>
        <Label>Tagline</Label>
        <AutoTextarea value={data.tagline} onChange={(e) => onChange({ ...data, tagline: e.target.value })} />
      </div>
      <div>
        <Label>Call to Action Button</Label>
        <Input value={data.cta} onChange={(e) => onChange({ ...data, cta: e.target.value })} />
      </div>
    </div>
  );
}

function StoryEditor({ data, onChange }) {
  return (
    <div className="space-y-5">
      <SectionTitle>Story Section</SectionTitle>
      <div>
        <Label>Heading</Label>
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </div>
      <div>
        <Label>Paragraph 1</Label>
        <AutoTextarea value={data.text1} onChange={(e) => onChange({ ...data, text1: e.target.value })} />
      </div>
      <div>
        <Label>Paragraph 2</Label>
        <AutoTextarea value={data.text2} onChange={(e) => onChange({ ...data, text2: e.target.value })} />
      </div>
      <div>
        <Label>Paragraph 3 (highlighted quote)</Label>
        <AutoTextarea value={data.text3} onChange={(e) => onChange({ ...data, text3: e.target.value })} />
      </div>
    </div>
  );
}

function MenuEditor({ data, onChange }) {
  const updateItem = (index, field, value) => {
    const items = [...data.items];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, items });
  };
  const addItem = () => {
    onChange({ ...data, items: [...data.items, { name: "", desc: "" }] });
  };
  const removeItem = (index) => {
    const items = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items });
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Menu Section</SectionTitle>
      <div>
        <Label>Heading</Label>
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </div>
      <div>
        <Label>Note</Label>
        <Input value={data.note} onChange={(e) => onChange({ ...data, note: e.target.value })} />
      </div>
      <div className="border-t border-white/10 pt-4">
        <Label>Menu Items</Label>
        <div className="space-y-4 mt-2">
          {data.items.map((item, i) => (
            <div key={i} className="bg-[#1a1819] rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#069BAF] text-sm font-medium">Item {i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <AutoTextarea value={item.desc} onChange={(e) => updateItem(i, "desc", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-4 bg-[#069BAF] hover:bg-[#069BAF]/80 text-[#221F20] font-medium text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          + Add Menu Item
        </button>
      </div>
    </div>
  );
}

function EventsEditor({ data, onChange }) {
  const updateEventItem = (index, value) => {
    const items = [...data.items];
    items[index] = value;
    onChange({ ...data, items });
  };
  const addEventItem = () => {
    onChange({ ...data, items: [...data.items, ""] });
  };
  const removeEventItem = (index) => {
    const items = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items });
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Events Section</SectionTitle>
      <div>
        <Label>Heading</Label>
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </div>
      <div className="border-t border-white/10 pt-4">
        <Label>Event Types</Label>
        <div className="space-y-3 mt-2">
          {data.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateEventItem(i, e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeEventItem(i)}
                className="text-red-400 hover:text-red-300 text-sm px-3 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addEventItem}
          className="mt-3 bg-[#069BAF] hover:bg-[#069BAF]/80 text-[#221F20] font-medium text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          + Add Event Type
        </button>
      </div>
      <div>
        <Label>Description Text</Label>
        <AutoTextarea value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} />
      </div>
    </div>
  );
}

function FamilyEditor({ data, onChange }) {
  return (
    <div className="space-y-5">
      <SectionTitle>Family / Newsletter Section</SectionTitle>
      <div>
        <Label>Heading</Label>
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} />
      </div>
      <div>
        <Label>Description</Label>
        <AutoTextarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email Placeholder</Label>
          <Input value={data.emailPlaceholder} onChange={(e) => onChange({ ...data, emailPlaceholder: e.target.value })} />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input value={data.buttonText} onChange={(e) => onChange({ ...data, buttonText: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Success Message</Label>
        <Input value={data.successMessage} onChange={(e) => onChange({ ...data, successMessage: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Instagram Text</Label>
          <Input value={data.instagramText} onChange={(e) => onChange({ ...data, instagramText: e.target.value })} />
        </div>
        <div>
          <Label>Instagram Handle</Label>
          <Input value={data.instagramHandle} onChange={(e) => onChange({ ...data, instagramHandle: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function ContactEditor({ data, onChange }) {
  return (
    <div className="space-y-5">
      <SectionTitle>Contact / Bookings Section</SectionTitle>
      <div>
        <Label>Heading</Label>
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </div>
      <div>
        <Label>Call to Action</Label>
        <Input value={data.cta} onChange={(e) => onChange({ ...data, cta: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>PT Label</Label>
          <Input value={data.ptLabel} onChange={(e) => onChange({ ...data, ptLabel: e.target.value })} />
        </div>
        <div>
          <Label>EN Label</Label>
          <Input value={data.enLabel} onChange={(e) => onChange({ ...data, enLabel: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Trust Line</Label>
        <AutoTextarea value={data.trust} onChange={(e) => onChange({ ...data, trust: e.target.value })} />
      </div>
    </div>
  );
}

function ImagesEditor({ images, onImagesChange }) {
  const [uploading, setUploading] = useState(null);

  const handleUpload = async (index, file) => {
    if (!file) return;
    setUploading(index);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const creds = sessionStorage.getItem("bredrins_admin_creds");
      const headers = creds ? { Authorization: `Basic ${creds}` } : {};
      const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: formData, headers });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      const updated = [...images];
      updated[index] = { ...updated[index], src: url };
      onImagesChange(updated);
    } catch (err) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(null);
    }
  };

  const updateAlt = (index, alt) => {
    const updated = [...images];
    updated[index] = { ...updated[index], alt };
    onImagesChange(updated);
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Food Carousel Images</SectionTitle>
      <p className="text-[#FBEBC3]/50 text-sm">
        Replace carousel images by uploading new ones. Recommended: square images, at least 600x600px.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {images.map((img, i) => (
          <div key={i} className="bg-[#1a1819] rounded-lg p-4 border border-white/5">
            <div className="w-full h-48 rounded-lg overflow-hidden bg-[#2d2a2b] mb-3">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="space-y-3">
              <div>
                <Label>Alt Text</Label>
                <Input value={img.alt} onChange={(e) => updateAlt(i, e.target.value)} />
              </div>
              <div>
                <Label>Replace Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(i, e.target.files[0])}
                  className="block w-full text-sm text-[#FBEBC3]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#069BAF] file:text-[#221F20] hover:file:bg-[#069BAF]/80 file:cursor-pointer cursor-pointer"
                />
                {uploading === i && (
                  <p className="text-[#069BAF] text-sm mt-1">Uploading...</p>
                )}
              </div>
              <p className="text-[#FBEBC3]/30 text-xs truncate">Current: {img.src}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Admin Panel ─── */

export default function Admin() {
  const { refetch } = useLanguage();
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeLang, setActiveLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("bredrins_admin_creds"));
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const creds = btoa(`${loginUser}:${loginPass}`);
    try {
      const res = await fetch(`${API_BASE}/api/auth-check`, {
        method: "POST",
        headers: { Authorization: `Basic ${creds}` },
      });
      if (!res.ok) throw new Error("Invalid credentials");
      sessionStorage.setItem("bredrins_admin_creds", creds);
      setAuthenticated(true);
      setLoginError("");
    } catch {
      setLoginError("Invalid username or password");
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/content`)
      .then((r) => r.json())
      .then((d) => setData(deepClone(d)))
      .catch(() => setToast({ message: "Failed to load content from API", type: "error" }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const creds = sessionStorage.getItem("bredrins_admin_creds");
    try {
      const res = await fetch(`${API_BASE}/api/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(creds ? { Authorization: `Basic ${creds}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ message: "Content saved successfully!", type: "success" });
      refetch();
    } catch {
      setToast({ message: "Failed to save content. Is the server running?", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const updateSection = useCallback(
    (section, value) => {
      setData((prev) => ({
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          [section]: value,
        },
      }));
    },
    [activeLang]
  );

  const updateImages = useCallback((newImages) => {
    setData((prev) => ({
      ...prev,
      images: { ...prev.images, foodCarousel: newImages },
    }));
  }, []);

  if (!authenticated) {
    return (
      <div className="bg-[#221F20] min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-[#1a1819] border border-white/10 rounded-xl p-8 w-full max-w-sm space-y-5">
          <h1 className="text-[#FACC48] text-2xl font-bold text-center">Bredrins CMS</h1>
          <p className="text-[#FBEBC3]/50 text-sm text-center">Sign in to manage content</p>
          {loginError && (
            <p className="text-red-400 text-sm text-center">{loginError}</p>
          )}
          <div>
            <Label>Username</Label>
            <Input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <Label>Password</Label>
            <input
              type="password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-[#2d2a2b] text-[#FBEBC3] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#069BAF] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#069BAF] hover:bg-[#069BAF]/80 text-[#221F20] font-bold text-sm px-8 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#221F20] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#069BAF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const langData = data[activeLang] || data.en;

  const renderEditor = () => {
    switch (activeSection) {
      case "hero":
        return <HeroEditor data={langData.hero} onChange={(v) => updateSection("hero", v)} />;
      case "story":
        return <StoryEditor data={langData.story} onChange={(v) => updateSection("story", v)} />;
      case "menu":
        return <MenuEditor data={langData.menu} onChange={(v) => updateSection("menu", v)} />;
      case "events":
        return <EventsEditor data={langData.events} onChange={(v) => updateSection("events", v)} />;
      case "family":
        return <FamilyEditor data={langData.family} onChange={(v) => updateSection("family", v)} />;
      case "contact":
        return <ContactEditor data={langData.contact} onChange={(v) => updateSection("contact", v)} />;
      case "images":
        return (
          <ImagesEditor
            images={data.images?.foodCarousel || []}
            onImagesChange={updateImages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#221F20] min-h-screen text-[#FBEBC3]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1819] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-[#FBEBC3] cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-[#FACC48] text-lg font-bold">Bredrins CMS</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Language tabs - only show for non-images sections */}
          {activeSection !== "images" && (
            <div className="flex bg-[#2d2a2b] rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setActiveLang("en")}
                className={`px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeLang === "en"
                    ? "bg-[#069BAF] text-[#221F20]"
                    : "text-[#FBEBC3]/60 hover:text-[#FBEBC3]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setActiveLang("pt")}
                className={`px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeLang === "pt"
                    ? "bg-[#069BAF] text-[#221F20]"
                    : "text-[#FBEBC3]/60 hover:text-[#FBEBC3]"
                }`}
              >
                PT
              </button>
            </div>
          )}
          <a
            href="/"
            className="text-[#069BAF] hover:text-[#FBEBC3] text-sm transition-colors"
          >
            View Site
          </a>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar - desktop */}
        <aside className="hidden sm:block w-52 fixed left-0 top-14 bottom-20 bg-[#1a1819] border-r border-white/10 overflow-y-auto">
          <nav className="py-4">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === s.id
                    ? "bg-[#069BAF]/10 text-[#069BAF] border-r-2 border-[#069BAF]"
                    : "text-[#FBEBC3]/60 hover:text-[#FBEBC3] hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Sidebar - mobile */}
        {mobileMenuOpen && (
          <div className="sm:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileMenuOpen(false)}>
            <aside
              className="w-56 bg-[#1a1819] h-full border-r border-white/10 pt-14"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="py-4">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSection(s.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                      activeSection === s.id
                        ? "bg-[#069BAF]/10 text-[#069BAF]"
                        : "text-[#FBEBC3]/60 hover:text-[#FBEBC3]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 sm:ml-52 p-6 sm:p-10 pb-28 min-h-screen">
          <div className="max-w-3xl">
            {renderEditor()}
          </div>
        </main>
      </div>

      {/* Fixed save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1819] border-t border-white/10 px-6 py-4 flex items-center justify-between sm:pl-58">
        <p className="text-[#FBEBC3]/40 text-sm hidden sm:block">
          Changes are saved to server and reflected on the live site immediately.
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#069BAF] hover:bg-[#069BAF]/80 disabled:opacity-50 text-[#221F20] font-bold text-sm px-8 py-3 rounded-lg transition-colors cursor-pointer ml-auto"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
