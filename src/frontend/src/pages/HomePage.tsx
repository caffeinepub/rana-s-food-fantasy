import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  ChefHat,
  ChevronRight,
  Dumbbell,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { Category, useGetAllMenuItemsByCategory } from "../hooks/useQueries";
import type { MenuItemWithId } from "../hooks/useQueries";

interface HomePageProps {
  navigate: (path: string) => void;
}

const CATEGORY_META: Record<
  Category,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    image: string;
    description: string;
  }
> = {
  [Category.monthlyFood]: {
    label: "Monthly Food",
    icon: <CalendarDays className="w-5 h-5" />,
    color: "bg-primary/10 text-primary border-primary/20",
    image: "/assets/generated/monthly-food.dim_600x400.jpg",
    description: "Lunch plans starting ₹2000 — Veg & Non-Veg options",
  },
  [Category.specialPerKg]: {
    label: "Special / Per Kg Menu",
    icon: <ChefHat className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    image: "/assets/generated/special-per-kg.dim_600x400.jpg",
    description: "Made with homemade spices — Rice, Biryani, Chicken & Mutton",
  },
  [Category.gymProtein]: {
    label: "Gym & Protein Menu",
    icon: <Dumbbell className="w-5 h-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
    image: "/assets/generated/gym-protein.dim_600x400.jpg",
    description: "Salads, sprouted protein bowls & protein shakes",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage({ navigate }: HomePageProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const { data: menuCategories, isLoading: menuLoading } =
    useGetAllMenuItemsByCategory();

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* ─── Navigation ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          {/* Logo + Brand */}
          <a
            href="/"
            className="flex items-center gap-3 group"
            data-ocid="nav.home_link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/assets/uploads/IMG-20260221-WA0013-1.jpg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/IMG-20260221-WA0013-1.jpg";
              }}
              alt="Rana's Food Fantasy Logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all"
            />
            <span className="font-display font-bold text-lg text-foreground leading-tight hidden sm:block">
              Rana's Food Fantasy
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              data-ocid="nav.home_link"
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              data-ocid="nav.menu_link"
              onClick={() => scrollTo(menuRef)}
            >
              Menu
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              data-ocid="nav.contact_link"
              onClick={() => scrollTo(contactRef)}
            >
              Contact
            </button>
            <Button
              size="sm"
              variant="outline"
              className="ml-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              data-ocid="nav.admin_link"
              onClick={() => navigate("/admin")}
            >
              Admin
            </Button>
          </div>

          {/* Mobile: call + menu */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:8906465554"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Call us"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium border border-primary/30 text-primary rounded-lg"
              data-ocid="nav.admin_link"
              onClick={() => navigate("/admin")}
            >
              Admin
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* ─── Hero Section ───────────────────────────────────── */}
        <section
          className="relative min-h-[90vh] flex items-center overflow-hidden"
          aria-label="Hero"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-food-banner.dim_1200x500.jpg')",
            }}
            aria-hidden="true"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 hero-gradient" aria-hidden="true" />

          {/* Decorative spice dots pattern */}
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg
              role="presentation"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Decorative pattern</title>
              <defs>
                <pattern
                  id="dots"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" fill="oklch(0.72 0.18 70)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="container relative mx-auto px-4 py-24 max-w-7xl">
            <div className="max-w-2xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 text-xs font-semibold tracking-widest uppercase px-4 py-1.5">
                  🏠 Home Delivery in Siliguri
                </Badge>
              </motion.div>

              {/* Logo + Name */}
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <img
                  src="/assets/uploads/IMG-20260221-WA0013-1.jpg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/IMG-20260221-WA0013-1.jpg";
                  }}
                  alt="Rana's Food Fantasy"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/40 shadow-warm"
                />
              </motion.div>

              <motion.h1
                className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-4"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 }}
              >
                Rana's
                <br />
                <span className="text-primary italic">Food Fantasy</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-white/85 mb-8 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                Fresh, homemade meals, pure spices & farm-fresh vegetables —
                crafted with love and delivered right to your door in Siliguri.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm text-base font-semibold px-8 rounded-full"
                  asChild
                  data-ocid="hero.primary_button"
                >
                  <a href="tel:8906465554">
                    <Phone className="w-4 h-4 mr-2" />
                    Order Now — Call Us
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-base font-semibold px-8 rounded-full"
                  onClick={() => scrollTo(menuRef)}
                >
                  View Menu
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="mt-10 flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {[
                  { icon: "✅", text: "FSSAI Registered" },
                  { icon: "🏠", text: "Home Delivery" },
                  { icon: "🌿", text: "100% Fresh" },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white font-medium"
                  >
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── About Section ──────────────────────────────────── */}
        <section
          className="py-20 bg-secondary texture-overlay"
          aria-label="About"
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs font-semibold tracking-widest uppercase">
                  Our Story
                </Badge>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Taste the Love of{" "}
                  <span className="text-primary italic">Home Cooking</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Welcome to Rana's Food Fantasy — your neighbourhood cloud
                  kitchen nestled in Sarada Pally, Siliguri. We believe that the
                  best food is cooked with heart, using fresh ingredients
                  sourced locally every morning.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  From piping-hot homemade meals to pure aromatic spices and
                  farm-fresh vegetables, everything we deliver is prepared as if
                  it's for our own family. FSSAI registered, hygiene certified,
                  and made with genuine care.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { number: "₹2000", label: "Monthly Plan" },
                    { number: "100%", label: "Homemade Spices" },
                    { number: "🏠", label: "Home Delivery" },
                  ].map(({ number, label }) => (
                    <div
                      key={label}
                      className="p-4 bg-background rounded-xl border border-border shadow-xs"
                    >
                      <div className="font-display text-2xl font-bold text-primary">
                        {number}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-medium">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={1}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  {
                    img: "/assets/generated/monthly-food.dim_600x400.jpg",
                    title: "Monthly Food",
                    desc: "From ₹2000/month",
                    icon: "🍱",
                  },
                  {
                    img: "/assets/generated/gym-protein.dim_600x400.jpg",
                    title: "Gym & Protein",
                    desc: "Healthy bowls",
                    icon: "💪",
                  },
                  {
                    img: "/assets/generated/special-per-kg.dim_600x400.jpg",
                    title: "Special Menu",
                    desc: "Homemade spices",
                    icon: "🍛",
                    className: "col-span-2",
                  },
                ].map(({ img, title, desc, icon, className }) => (
                  <div
                    key={title}
                    className={`relative overflow-hidden rounded-2xl group card-hover shadow-card ${className ?? ""}`}
                  >
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="text-xl">{icon}</span>
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-white/80">{desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── Menu Section ───────────────────────────────────── */}
        <section
          ref={menuRef}
          className="py-20 bg-background"
          aria-label="Menu"
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              className="text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs font-semibold tracking-widest uppercase">
                  What We Offer
                </Badge>
              </motion.div>
              <motion.h2
                className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4"
                variants={fadeUp}
                custom={1}
              >
                Our <span className="text-primary italic">Menu</span>
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg max-w-xl mx-auto"
                variants={fadeUp}
                custom={2}
              >
                Freshly prepared every day — order by calling us directly
              </motion.p>
            </motion.div>

            {/* Loading State */}
            {menuLoading && (
              <div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                data-ocid="menu.loading_state"
              >
                {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(
                  (id) => (
                    <div
                      key={id}
                      className="rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <Skeleton className="h-48 w-full rounded-none" />
                      <div className="p-5 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {/* Empty State */}
            {!menuLoading &&
              (!menuCategories || menuCategories.length === 0) && (
                <div
                  className="text-center py-20 text-muted-foreground"
                  data-ocid="menu.empty_state"
                >
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="font-display text-2xl font-semibold mb-2">
                    Menu Coming Soon
                  </p>
                  <p className="text-sm mb-6">
                    Our full menu will be available shortly.
                  </p>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 rounded-full"
                  >
                    <a href="tel:8906465554">
                      <Phone className="w-4 h-4 mr-2" />
                      Call to Order
                    </a>
                  </Button>
                </div>
              )}

            {/* Menu Categories */}
            <AnimatePresence>
              {!menuLoading &&
                menuCategories &&
                menuCategories.map(([category, items], catIdx) => {
                  const meta = CATEGORY_META[category] ?? {
                    label: category,
                    icon: <ChefHat className="w-5 h-5" />,
                    color: "bg-muted text-foreground border-border",
                    image: "",
                    description: "",
                  };
                  return (
                    <motion.div
                      key={category}
                      className="mb-14"
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.55, delay: catIdx * 0.1 }}
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-8">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${meta.color}`}
                        >
                          {meta.icon}
                          {meta.label}
                        </div>
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {items.length} item{items.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Items Grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item: MenuItemWithId, idx: number) => (
                          <motion.div
                            key={`${category}-${item.name}`}
                            data-ocid={`menu.item.${catIdx * 10 + idx + 1}`}
                            className="group bg-card rounded-2xl border border-border overflow-hidden shadow-xs card-hover"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.06 }}
                          >
                            {/* Category image thumbnail */}
                            {meta.image && (
                              <div className="relative h-44 overflow-hidden">
                                <img
                                  src={meta.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent" />
                                {!item.available && (
                                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Currently Unavailable
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-display font-semibold text-lg text-foreground leading-snug">
                                  {item.name}
                                </h3>
                                <span className="font-bold text-primary text-lg whitespace-nowrap">
                                  ₹{item.price.toString()}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>

            {/* CTA after menu */}
            {!menuLoading && menuCategories && menuCategories.length > 0 && (
              <motion.div
                className="mt-8 text-center p-8 bg-primary/5 rounded-3xl border border-primary/15"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="font-display text-2xl font-semibold text-foreground mb-3">
                  Ready to Order?
                </p>
                <p className="text-muted-foreground mb-6">
                  Give us a call and we'll have your fresh food ready for
                  delivery!
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-warm font-semibold px-8"
                  asChild
                >
                  <a href="tel:8906465554" data-ocid="hero.primary_button">
                    <Phone className="w-4 h-4 mr-2" />
                    Call to Order: 8906465554
                  </a>
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* ─── Contact Section ────────────────────────────────── */}
        <section
          ref={contactRef}
          className="py-20 bg-foreground relative overflow-hidden"
          aria-label="Contact"
        >
          {/* Decorative element */}
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.62 0.18 55), oklch(0.52 0.12 145), oklch(0.62 0.18 55))",
            }}
            aria-hidden="true"
          />

          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              className="text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 text-xs font-semibold tracking-widest uppercase">
                  Get In Touch
                </Badge>
              </motion.div>
              <motion.h2
                className="font-display text-4xl sm:text-5xl font-bold text-white mb-4"
                variants={fadeUp}
                custom={1}
              >
                Contact <span className="text-primary italic">Us</span>
              </motion.h2>
              <motion.p
                className="text-white/70 text-lg max-w-lg mx-auto"
                variants={fadeUp}
                custom={2}
              >
                Ready to order? Reach out and we'll handle the rest
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              {/* Phone */}
              <motion.div
                variants={fadeUp}
                custom={0}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors group"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-1">Phone</h3>
                <a
                  href="tel:8906465554"
                  className="text-primary text-xl font-bold hover:underline"
                  data-ocid="contact.button"
                >
                  +91 8906465554
                </a>
                <p className="text-white/50 text-xs mt-2">
                  Tap to call & order
                </p>
              </motion.div>

              {/* Address */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-white mb-2">Our Location</h3>
                <address className="text-white/70 text-sm not-italic leading-relaxed">
                  Durga Rani Apartment, Sarada Pally,
                  <br />
                  Shiv Mandir, Siliguri-734011,
                  <br />
                  West Bengal
                </address>
              </motion.div>

              {/* FSSAI */}
              <motion.div
                variants={fadeUp}
                custom={2}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  FSSAI Registered
                </h3>
                <p className="text-white/70 text-sm">Registration No.</p>
                <p className="text-white font-mono font-semibold text-sm mt-1 tracking-wide">
                  22826080000159
                </p>
                <p className="text-white/50 text-xs mt-2">
                  Food Safety Certified ✓
                </p>
              </motion.div>
            </motion.div>

            {/* Big CTA */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm font-bold text-lg px-10 py-6 rounded-full"
                asChild
                data-ocid="contact.button"
              >
                <a href="tel:8906465554">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now: +91 8906465554
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="bg-foreground border-t border-white/10 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <div className="flex items-center gap-3">
              <img
                src="/assets/uploads/IMG-20260221-WA0013-1.jpg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/IMG-20260221-WA0013-1.jpg";
                }}
                alt="Rana's Food Fantasy"
                className="w-7 h-7 rounded-full object-cover opacity-80"
              />
              <span>
                <strong className="text-white/80">Rana's Food Fantasy</strong> —
                Cloud Kitchen, Siliguri
              </span>
            </div>
            <div className="text-center">
              <p>
                FSSAI Reg. No.:{" "}
                <span className="font-mono text-white/70">22826080000159</span>
              </p>
            </div>
            <p>
              © {year}. Built with{" "}
              <Heart className="inline w-3 h-3 text-primary fill-primary mx-0.5" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 hover:text-primary transition-colors underline-offset-2 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
