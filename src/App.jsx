import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import Admin from "./Admin";

/* ───────────────────────── Language Switcher ───────────────────────── */

function LangSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 bg-[#2d2a2b]/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
      <button
        onClick={() => setLang("en")}
        className={`text-xl transition-opacity cursor-pointer ${
          lang === "en" ? "opacity-100 scale-110" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="English"
      >
        🇬🇧
      </button>
      <button
        onClick={() => setLang("pt")}
        className={`text-xl transition-opacity cursor-pointer ${
          lang === "pt" ? "opacity-100 scale-110" : "opacity-40 hover:opacity-70"
        }`}
        aria-label="Português"
      >
        🇵🇹
      </button>
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Background — jerk chicken on the grill */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-grill.jpg')" }}
      />
      {/* Dark overlay so content reads clearly */}
      <div className="absolute inset-0 bg-[#221F20]/70" />
      {/* Subtle radial glow behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-[#069BAF]/8 blur-3xl" />
      </div>

      <img
        src="/images/badge-logo.svg"
        alt="Bredrins"
        className="relative z-10 w-52 sm:w-64 md:w-80 mb-8 drop-shadow-2xl"
      />

      <p className="relative z-10 text-[#FBEBC3] text-xl sm:text-2xl md:text-3xl font-heading tracking-wide max-w-2xl leading-relaxed">
        {t.hero.tagline}
      </p>

      <a
        href="#contact"
        className="relative z-10 mt-10 inline-block bg-[#069BAF] hover:bg-[#D01C1F] text-[#221F20] hover:text-[#FBEBC3] font-heading text-lg px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#D01C1F]/30"
      >
        {t.hero.cta}
      </a>

      {/* Scroll hint */}
      <div className="absolute bottom-8 animate-bounce">
        <svg
          className="w-6 h-6 text-[#FBEBC3]/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

/* ───────────────────────── Story ───────────────────────── */

function Story() {
  const { t } = useLanguage();

  return (
    <section id="story" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-[#FACC48] text-3xl sm:text-4xl md:text-5xl font-heading mb-10">
          {t.story.heading}
        </h2>

        <div className="w-16 h-0.5 bg-[#069BAF] mx-auto mb-10" />

        <p className="text-[#FBEBC3]/90 text-lg sm:text-xl leading-relaxed mb-8">
          {t.story.text1}
        </p>
        <p className="text-[#FBEBC3]/80 text-lg sm:text-xl leading-relaxed mb-10">
          {t.story.text2}
        </p>

        <div className="w-12 h-0.5 bg-[#069BAF]/40 mx-auto mb-10" />

        <p className="text-[#069BAF] text-xl sm:text-2xl leading-relaxed italic font-light">
          {t.story.text3}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Food Carousel ───────────────────────── */

const defaultFoodImages = [
  { src: "/images/food/bam-bam-crispy.jpg", alt: "The Bam Bam Crispy" },
  { src: "/images/food/stony-hill-burger.jpg", alt: "The Stony Hill Burger" },
  { src: "/images/food/creole-crunch-wrap.jpg", alt: "The Creole Crunch Wrap" },
  { src: "/images/food/roadside-jerk-wrap.jpg", alt: "The Roadside Jerk Wrap" },
];

function FoodCarousel() {
  const { images: contentImages } = useLanguage();
  const foodImages = contentImages?.foodCarousel || defaultFoodImages;
  // Duplicate the images array to create seamless loop
  const images = [...foodImages, ...foodImages, ...foodImages, ...foodImages];

  return (
    <div className="relative overflow-hidden py-12">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#221F20] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#221F20] to-transparent z-10 pointer-events-none" />

      <div className="carousel-track flex gap-8 w-max">
        {images.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden bg-[#2d2a2b]/40 border border-white/5 hover:border-[#069BAF]/30 transition-all duration-300 group"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Menu ───────────────────────── */

const menuIcons = ["🔥", "🍔", "🌯", "🌶️"];

function Menu() {
  const { t } = useLanguage();

  return (
    <section id="menu" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-[#FACC48] text-3xl sm:text-4xl md:text-5xl font-heading text-center mb-4">
          {t.menu.heading}
        </h2>
        <p className="text-[#FBEBC3]/50 text-sm text-center mb-14 italic">
          {t.menu.note}
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {t.menu.items.map((item, i) => (
            <div
              key={item.name}
              className="group bg-[#2d2a2b]/60 border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-[#069BAF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#069BAF]/5"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1 group-hover:scale-110 transition-transform duration-300">
                  {menuIcons[i]}
                </span>
                <div>
                  <h3 className="text-[#FACC48] text-xl font-heading mb-2">
                    {item.name}
                  </h3>
                  <p className="text-[#FBEBC3]/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FoodCarousel />
    </section>
  );
}

/* ───────────────────────── Events ───────────────────────── */

function Events() {
  const { t } = useLanguage();

  return (
    <section id="events" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-[#FACC48] text-3xl sm:text-4xl md:text-5xl font-heading mb-12">
          {t.events.heading}
        </h2>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {t.events.items.map((item, i) => (
            <div
              key={i}
              className="bg-[#2d2a2b]/60 border border-white/5 rounded-2xl p-6 hover:border-[#D01C1F]/30 transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">
                {["🎪", "🏢", "🎉"][i]}
              </span>
              <p className="text-[#FBEBC3]/90 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <p className="text-[#FBEBC3]/70 text-lg leading-relaxed max-w-3xl mx-auto">
          {t.events.text}
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Family (Bredrins Frequency) ───────────────────────── */

function Family() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="family" className="relative py-24 px-6 overflow-hidden">
      {/* Warm glow background */}
      <div className="absolute inset-0 bg-[#221F20]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D01C1F]/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#069BAF]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="text-[#FACC48] text-3xl sm:text-4xl md:text-5xl font-heading mb-3">
          {t.family.heading}
        </h2>
        <p className="text-[#069BAF] text-lg sm:text-xl font-light mb-8">
          {t.family.subtitle}
        </p>

        <p className="text-[#FBEBC3]/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          {t.family.description}
        </p>

        {submitted ? (
          <div className="bg-[#2d2a2b]/60 border border-[#069BAF]/30 rounded-2xl p-8 mb-10">
            <p className="text-[#FACC48] text-2xl font-heading">
              {t.family.successMessage}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.family.emailPlaceholder}
              className="flex-1 bg-[#2d2a2b]/80 border border-white/10 rounded-full px-6 py-3.5 text-[#FBEBC3] placeholder-[#FBEBC3]/40 focus:outline-none focus:border-[#069BAF]/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-[#069BAF] hover:bg-[#069BAF]/80 text-[#221F20] font-heading text-lg px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#069BAF]/20 cursor-pointer whitespace-nowrap"
            >
              {t.family.buttonText}
            </button>
          </form>
        )}

        <div className="w-12 h-0.5 bg-[#069BAF]/20 mx-auto mb-6" />

        <p className="text-[#FBEBC3]/50 text-sm mb-2">
          {t.family.instagramText}
        </p>
        <a
          href="https://instagram.com/bredrinskitchen"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#069BAF] hover:text-[#FBEBC3] text-lg font-semibold transition-colors"
        >
          {t.family.instagramHandle}
        </a>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact / Footer ───────────────────────── */

function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-[#FACC48] text-3xl sm:text-4xl md:text-5xl font-heading mb-6">
          {t.contact.heading}
        </h2>

        <p className="text-[#FBEBC3]/80 text-lg mb-10">{t.contact.cta}</p>

        {/* Contact details */}
        <div className="space-y-4 mb-12">
          <a
            href="mailto:bredrinskitchen@gmail.com"
            className="block text-[#069BAF] hover:text-[#FBEBC3] text-lg transition-colors"
          >
            bredrinskitchen@gmail.com
          </a>

          <a
            href="https://instagram.com/bredrinskitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#069BAF] hover:text-[#FBEBC3] text-lg transition-colors"
          >
            @bredrinskitchen
          </a>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4">
            <div className="text-[#FBEBC3]/80">
              <span className="text-[#FACC48] font-semibold">
                {t.contact.ptLabel}:
              </span>{" "}
              <a
                href="tel:+351961498959"
                className="hover:text-[#069BAF] transition-colors"
              >
                João +351 961 498 959
              </a>
            </div>
            <div className="text-[#FBEBC3]/80">
              <span className="text-[#FACC48] font-semibold">
                {t.contact.enLabel}:
              </span>{" "}
              <a
                href="tel:+447886034546"
                className="hover:text-[#069BAF] transition-colors"
              >
                Jules +44 7886034546
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 bg-[#069BAF]/30 mx-auto mb-8" />

        {/* Trust line */}
        <p className="text-[#FBEBC3]/40 text-sm">{t.contact.trust}</p>

        {/* Copyright */}
        <p className="text-[#FBEBC3]/20 text-xs mt-6">
          &copy; {new Date().getFullYear()} Bredrins Kitchen. Feed You Happy /
          Alimenta a tua felicidade.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── App ───────────────────────── */

function Site() {
  return (
    <div className="bg-[#221F20] min-h-screen">
      <LangSwitcher />
      <Hero />

      {/* Rest of site with green pattern background */}
      <div className="relative">
        {/* Pattern background layer */}
        <div
          className="absolute inset-0 bg-repeat bg-center"
          style={{
            backgroundImage: "url('/images/hero-pattern.jpg')",
            backgroundSize: "800px",
          }}
        />
        {/* Dark overlay to keep it subtle */}
        <div className="absolute inset-0 bg-[#221F20]/75" />

        {/* Content */}
        <div className="relative z-10">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#069BAF]/30 to-transparent mx-auto" />
          <Story />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D01C1F]/30 to-transparent mx-auto" />
          <Menu />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#069BAF]/30 to-transparent mx-auto" />
          <Events />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D01C1F]/30 to-transparent mx-auto" />
          <Family />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#069BAF]/30 to-transparent mx-auto" />
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
