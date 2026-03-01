import { BackgroundSlideshow } from "@/components/BackgroundSlideshow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  ExternalLink,
  Headphones,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Package,
  Phone,
  Shield,
  ShoppingBag,
  Star,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Category } from "./backend.d";
import { useActor } from "./hooks/useActor";
import {
  useGetAllProducts,
  useGetAllServices,
  useGetShopInfo,
  useSeedData,
} from "./hooks/useQueries";

// ── Category icon map ────────────────────────────────────────────────────────
const categoryIcons: Record<string, React.ReactNode> = {
  [Category.Desktop]: <Cpu className="h-3.5 w-3.5" />,
  [Category.Laptop]: <Laptop className="h-3.5 w-3.5" />,
  [Category.Monitors]: <Monitor className="h-3.5 w-3.5" />,
  [Category.Accessories]: <Headphones className="h-3.5 w-3.5" />,
};

// Unified primary-toned badges — no rainbow
const categoryColors: Record<string, string> = {
  [Category.Desktop]: "bg-primary/12 text-primary border-primary/25",
  [Category.Laptop]: "bg-primary/12 text-primary border-primary/25",
  [Category.Monitors]: "bg-primary/12 text-primary border-primary/25",
  [Category.Accessories]: "bg-primary/12 text-primary border-primary/25",
};

// ── Animated stat counter ────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
}: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const steps = 60;
          const step = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span
      ref={ref}
      className="font-display font-black text-4xl md:text-5xl text-primary"
    >
      {count}
      {suffix}
    </span>
  );
}

// ── Navigation ───────────────────────────────────────────────────────────────
function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-glass border-b border-white/10 shadow-lg shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2"
          >
            <img
              src="/assets/generated/rs-computers-logo-transparent.dim_400x120.png"
              alt="RS Computers"
              className="h-9 md:h-11 w-auto object-contain"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              >
                {link.label}
              </button>
            ))}
            <Button
              size="sm"
              className="ml-4 bg-primary text-primary-foreground hover:opacity-90 font-semibold shadow-cyan-sm"
              onClick={() => handleNavClick("#products")}
            >
              Shop Now
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/10 nav-glass"
            >
              <nav className="flex flex-col py-4 gap-1">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="px-4 pt-2">
                  <Button
                    className="w-full bg-primary text-primary-foreground font-semibold"
                    onClick={() => handleNavClick("#products")}
                  >
                    Shop Now
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const trustPoints = [
    { icon: <Shield className="h-4 w-4" />, text: "Warranty Included" },
    { icon: <Zap className="h-4 w-4" />, text: "Same-Day Repairs" },
    { icon: <Star className="h-4 w-4" />, text: "5-Star Rated" },
    { icon: <Users className="h-4 w-4" />, text: "2K+ Customers" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero uses wallpaper directly — just needs text-legibility overlays */}
      {/* Layered overlays: left-side vignette + bottom fade for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      {/* Cyan atmospheric glow — bottom-left origin for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,_oklch(0.78_0.17_195_/_0.12)_0%,_transparent_55%)]" />

      {/* Fine grid — subtle, only on left where bg is dark */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.78 0.17 195) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.78 0.17 195) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Left-aligned layout for editorial punch */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge className="mb-8 px-4 py-1.5 bg-primary/15 text-primary border-primary/30 text-xs font-bold uppercase tracking-[0.15em]">
              Trusted Since 2008
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-foreground leading-[0.95] tracking-tight mb-6"
          >
            Your Local{" "}
            <span className="text-primary glow-cyan-text">Computer</span>
            <br />
            Experts.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-6 leading-relaxed"
          >
            Premium hardware, laptops &amp; accessories — plus professional
            repair services. All in one place, right in your neighbourhood.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground font-bold text-base px-8 h-13 shadow-cyan-md hover:opacity-90 transition-opacity group"
              onClick={() => scrollTo("#products")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 text-foreground font-semibold text-base px-8 h-13 hover:bg-foreground/8 hover:border-foreground/40 backdrop-blur-sm"
              onClick={() => scrollTo("#services")}
            >
              <Wrench className="mr-2 h-5 w-5" />
              Our Services
            </Button>
          </motion.div>

          {/* 5-Star badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 w-fit"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-5 w-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div>
              <p className="text-amber-300 font-bold text-sm leading-tight">
                5-Star Rated
              </p>
              <p className="text-amber-400/70 text-xs">
                2,000+ Happy Customers
              </p>
            </div>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {trustPoints.map((tp) => (
              <div
                key={tp.text}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary">{tp.icon}</span>
                <span>{tp.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.6 }}
          className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ── Product image map ────────────────────────────────────────────────────────
const productImages: Record<string, string> = {
  cpu: "/assets/generated/product-cpu.dim_400x300.jpg",
  ram: "/assets/generated/product-ram.dim_400x300.jpg",
  hdd: "/assets/generated/product-hdd.dim_400x300.jpg",
  ssd: "/assets/generated/product-ssd.dim_400x300.jpg",
  fan: "/assets/generated/product-fan.dim_400x300.jpg",
  desktop: "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  workstation: "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "mini pc": "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "all-in-one": "/assets/generated/product-all-in-one.dim_400x300.jpg",
  aio: "/assets/generated/product-all-in-one.dim_400x300.jpg",
  laptop: "/assets/generated/product-laptop.dim_400x300.jpg",
  ultrabook: "/assets/generated/product-laptop.dim_400x300.jpg",
  monitor: "/assets/generated/product-monitor.dim_400x300.jpg",
  keyboard: "/assets/generated/product-keyboard.dim_400x300.jpg",
  mouse: "/assets/generated/product-mouse.dim_400x300.jpg",
  headset: "/assets/generated/product-headset.dim_400x300.jpg",
  webcam: "/assets/generated/product-webcam.dim_400x300.jpg",
  router: "/assets/generated/product-router.dim_400x300.jpg",
  ups: "/assets/generated/product-ups.dim_400x300.jpg",
  "graphics card": "/assets/generated/product-gpu.dim_400x300.jpg",
  gtx: "/assets/generated/product-gpu.dim_400x300.jpg",
  rtx: "/assets/generated/product-gpu.dim_400x300.jpg",
  motherboard: "/assets/generated/product-motherboard.dim_400x300.jpg",
  "power supply": "/assets/generated/product-psu.dim_400x300.jpg",
  psu: "/assets/generated/product-psu.dim_400x300.jpg",
  "usb hub": "/assets/generated/product-usb-hub.dim_400x300.jpg",
  "curved monitor": "/assets/generated/product-curved-monitor.dim_400x300.jpg",
  "portable monitor":
    "/assets/generated/product-portable-monitor.dim_400x300.jpg",
  "external ssd": "/assets/generated/product-external-ssd.dim_400x300.jpg",
  printer: "/assets/generated/product-printer.dim_400x300.jpg",
  convertible: "/assets/generated/product-convertible-laptop.dim_400x300.jpg",
  "2-in-1": "/assets/generated/product-convertible-laptop.dim_400x300.jpg",
  chromebook: "/assets/generated/product-chromebook.dim_400x300.jpg",
  "gaming laptop": "/assets/generated/product-gaming-laptop.dim_400x300.jpg",
  "creator laptop": "/assets/generated/product-gaming-laptop.dim_400x300.jpg",
  "thin & light": "/assets/generated/product-ultrabook-slim.dim_400x300.jpg",
  "refurbished dell": "/assets/generated/product-laptop.dim_400x300.jpg",
  "refurbished hp": "/assets/generated/product-laptop.dim_400x300.jpg",
  "refurbished laptop": "/assets/generated/product-laptop.dim_400x300.jpg",
  "budget laptop": "/assets/generated/product-laptop.dim_400x300.jpg",
  "office desktop":
    "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "micro tower": "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "tower pc": "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "refurbished desktop":
    "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "second hand desktop":
    "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  "custom gaming desktop":
    "/assets/generated/product-desktop-computer.dim_400x300.jpg",
  '27" 4k': "/assets/generated/product-monitor-27k.dim_400x300.jpg",
  '32" 4k': "/assets/generated/product-monitor-27k.dim_400x300.jpg",
  "gaming monitor": "/assets/generated/product-monitor-144hz.dim_400x300.jpg",
  "144hz": "/assets/generated/product-monitor-144hz.dim_400x300.jpg",
  "docking station":
    "/assets/generated/product-docking-station.dim_400x300.jpg",
  "cooling pad": "/assets/generated/product-cooling-pad.dim_400x300.jpg",
  ultrawide: "/assets/generated/product-ultrawide-monitor.dim_400x300.jpg",
  '34"': "/assets/generated/product-ultrawide-monitor.dim_400x300.jpg",
  "laptop stand": "/assets/generated/product-laptop-stand.dim_400x300.jpg",
  stand: "/assets/generated/product-laptop-stand.dim_400x300.jpg",
  "webcam hd": "/assets/generated/product-webcam-hd.dim_400x300.jpg",
};

function getProductImage(name: string): string | null {
  const lower = name.toLowerCase();
  // Check multi-word keys first (longer keys take priority)
  const multiWordKeys = [
    "all-in-one",
    "all in one",
    "mini pc",
    "graphics card",
    "power supply",
    "usb hub",
    "curved monitor",
    "portable monitor",
    "external ssd",
    "gaming laptop",
    "creator laptop",
    "gaming monitor",
    "2-in-1",
    "convertible",
    "thin & light",
    "budget laptop",
    "refurbished dell",
    "refurbished hp",
    "refurbished laptop",
    "refurbished desktop",
    "office desktop",
    "micro tower",
    "tower pc",
    "second hand desktop",
    "custom gaming desktop",
    '27" 4k',
    '32" 4k',
    "144hz",
    "docking station",
    "cooling pad",
    "laptop stand",
    "webcam hd",
    "ultrawide",
    '34"',
  ];
  for (const key of multiWordKeys) {
    if (lower.includes(key))
      return productImages[key] ?? productImages["all-in-one"];
  }
  for (const [key, img] of Object.entries(productImages)) {
    if (lower.includes(key)) return img;
  }
  return null;
}

// ── Products Section ─────────────────────────────────────────────────────────
function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { data: products, isLoading } = useGetAllProducts();

  const categories = [
    "All",
    Category.Desktop,
    Category.Laptop,
    Category.Monitors,
    Category.Accessories,
  ];

  const filtered =
    activeCategory === "All"
      ? (products ?? [])
      : (products ?? []).filter((p) => p.category === activeCategory);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="products"
      className="py-24 md:py-32 relative section-glass circuit-bg"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 uppercase tracking-widest text-xs">
            Browse & Shop
          </Badge>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hand-picked hardware for every need — from ultrabooks to
            workstations, peripherals to displays.
          </p>
        </motion.div>

        {/* Filter tabs — segmented control */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-1 card-frosted border border-white/10 rounded-xl p-1.5 flex-wrap justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                    transition-all duration-200 outline-none
                    focus-visible:ring-2 focus-visible:ring-primary/50
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-cyan-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }
                  `}
                >
                  {cat !== "All" && (
                    <span className={isActive ? "opacity-90" : "opacity-60"}>
                      {categoryIcons[cat]}
                    </span>
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((k) => (
              <div
                key={k}
                className="rounded-xl border border-white/10 card-frosted p-5 space-y-3"
              >
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-16 w-full bg-muted" />
                <Skeleton className="h-8 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product) => {
              const productImg = getProductImage(product.name);
              return (
                <motion.div
                  key={product.id.toString()}
                  variants={cardVariants}
                  className="group relative rounded-xl border border-white/10 card-frosted hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover overflow-hidden flex flex-col"
                >
                  {/* Top edge glow on hover */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

                  {/* Product image */}
                  {productImg && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <img
                        src={productImg}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay for smooth transition to card content */}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card/80 to-transparent" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category + Stock row */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          categoryColors[product.category] ??
                          "bg-primary/12 text-primary border-primary/25"
                        }`}
                      >
                        {categoryIcons[product.category]}
                        {product.category}
                      </span>
                      {product.inStock ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          In Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 inline-block" />
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Name — primary info, larger */}
                    <h3 className="font-display font-bold text-foreground text-xl leading-tight mb-2.5 group-hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
                      {product.description}
                    </p>

                    {/* Price bar — distinct tinted background */}
                    <div className="flex items-center justify-between -mx-6 -mb-6 px-6 py-4 bg-muted/20 border-t border-border mt-auto rounded-b-xl">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                          Price
                        </p>
                        <span className="font-mono-price font-bold text-2xl text-primary">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className={`h-8 text-xs font-semibold transition-all ${
                          product.inStock
                            ? "bg-primary text-primary-foreground hover:opacity-85 shadow-cyan-sm"
                            : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                        }`}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? "Add to Cart" : "Unavailable"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ── Services Section ─────────────────────────────────────────────────────────
function ServicesSection() {
  const { data: services, isLoading } = useGetAllServices();

  const serviceIcons = [Wrench, Zap, Shield, Cpu, Monitor, Laptop];

  return (
    <section
      id="services"
      className="py-24 md:py-32 section-glass-alt relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at right top, oklch(0.78 0.17 195), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 uppercase tracking-widest text-xs">
            Expert Repairs
          </Badge>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional diagnostics, repairs, and upgrades by certified
            technicians. We get you back up and running fast.
          </p>
        </motion.div>

        {/* Services grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <div
                key={k}
                className="rounded-xl border border-white/10 card-frosted p-6 space-y-3"
              >
                <Skeleton className="h-10 w-10 rounded-xl bg-muted" />
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-20 w-full bg-muted" />
                <Skeleton className="h-8 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services ?? []).map((service, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              return (
                <motion.div
                  key={service.id.toString()}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group rounded-xl border border-white/10 card-frosted p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-card-hover flex flex-col"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  {/* Name */}
                  <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
                    {service.description}
                  </p>

                  {/* Price & Duration */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Starting from
                      </p>
                      <span className="font-mono-price font-bold text-xl text-primary">
                        ₹{service.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Duration
                      </p>
                      <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Not sure what you need? Come in for a free consultation.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get In Touch
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const stats = [
    { value: 15, suffix: "+", label: "Years in Business" },
    { value: 2000, suffix: "+", label: "Happy Customers" },
    { value: 98, suffix: "%", label: "Satisfaction Rate" },
    { value: 500, suffix: "+", label: "Products Available" },
  ];

  const reasons = [
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Warranty on All Products",
      desc: "Every product comes with manufacturer warranty and our in-store extended warranty options.",
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Expert Local Support",
      desc: "Our certified technicians are here to help — no call centres, just real people who know tech.",
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "Fast Turnaround",
      desc: "Most repairs and upgrades completed same-day or next-day. We respect your time.",
    },
    {
      icon: <Star className="h-5 w-5 text-primary" />,
      title: "Curated Selection",
      desc: "We only stock products we trust and have tested. Quality over quantity, every time.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
      title: "Price Match Guarantee",
      desc: "Find the same product cheaper? We'll match any authorised retailer's price.",
    },
    {
      icon: <Wrench className="h-5 w-5 text-primary" />,
      title: "Full Repair Lab",
      desc: "On-site workshop with professional tools. Motherboard-level repairs, data recovery, upgrades.",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative section-glass">
      {/* Background glow */}
      <div
        className="absolute left-0 bottom-0 w-1/3 h-1/2 opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at left bottom, oklch(0.78 0.17 195), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 uppercase tracking-widest text-xs">
            Our Story
          </Badge>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Why RS Computers?
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Since 2008, RS Computers has been the go-to destination for
            technology enthusiasts, students, professionals, and businesses. We
            combine the expertise of a specialist retailer with the warmth of a
            local shop — because tech should feel personal.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative text-center p-6 rounded-xl border border-white/10 card-frosted overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="flex flex-col items-center">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground text-sm mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="flex gap-4 p-5 rounded-xl border border-white/10 card-frosted hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                {reason.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground mb-1.5">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const { data: shopInfo, isLoading } = useGetShopInfo();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Message sent! We'll be in touch within 24 hours.", {
      description: `Thanks, ${form.name}. We look forward to helping you.`,
    });
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  const contactItems = shopInfo
    ? [
        {
          icon: <MapPin className="h-5 w-5" />,
          label: "Address",
          value: "Chitali, Pathardi, Ahmednagar, Maharashtra 414505",
        },
        {
          icon: <Phone className="h-5 w-5" />,
          label: "Phone",
          value: "9139412451",
        },
        {
          icon: <Mail className="h-5 w-5" />,
          label: "Email",
          value: "rscomputers.nagar@gmail.com",
        },
        {
          icon: <Clock className="h-5 w-5" />,
          label: "Hours",
          value: "Mon–Sat: 10am–7pm",
        },
        {
          icon: <ExternalLink className="h-5 w-5" />,
          label: "Facebook",
          value: "facebook.com/rscomputers.nagar",
          href: "https://www.facebook.com/rscomputers.nagar",
        },
        {
          icon: <ExternalLink className="h-5 w-5" />,
          label: "Instagram",
          value: "@rs_computers_official",
          href: "https://www.instagram.com/rs_computers_official/",
        },
      ]
    : [];

  return (
    <section
      id="contact"
      className="py-24 md:py-32 section-glass-alt relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_oklch(0.78_0.17_195_/_0.06)_0%,_transparent_60%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge className="mb-4 bg-primary/15 text-primary border-primary/30 uppercase tracking-widest text-xs">
            Get In Touch
          </Badge>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Visit or Contact Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Drop by the store, call us, or send a message below. We're always
            happy to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="rounded-xl border border-white/10 card-frosted p-8">
              <h3 className="font-display font-bold text-2xl text-foreground mb-6">
                Shop Information
              </h3>
              {isLoading ? (
                <div className="space-y-4">
                  {["c1", "c2", "c3", "c4"].map((k) => (
                    <Skeleton key={k} className="h-12 w-full bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {contactItems.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">
                          {item.label}
                        </p>
                        {"href" in item && item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm font-medium hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground text-sm font-medium">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick info card */}
            <div className="rounded-xl border border-primary/30 card-frosted p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">
                    Free Diagnostics Available
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Bring in your device for a free assessment. No fix, no fee
                    on most repairs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-xl border border-white/10 card-frosted p-8">
              <h3 className="font-display font-bold text-2xl text-foreground mb-6">
                Send a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    required
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="bg-muted/30 border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="bg-muted/30 border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="text-sm font-semibold text-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="bg-muted/30 border-border focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-cyan-sm py-6"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  Find Us
                </h3>
                <p className="text-muted-foreground text-sm">
                  Chitali, Pathardi, Ahmednagar, Maharashtra
                </p>
              </div>
            </div>
            <a
              href="https://share.google/2aO0XnnuB74ELmy0O"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Open in Google Maps
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <iframe
              title="RS Computers Location"
              src="https://maps.google.com/maps?q=Chitali,Pathardi,Ahmednagar,Maharashtra+414505,India&output=embed&z=15"
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="footer-glass border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src="/assets/generated/rs-computers-logo-transparent.dim_400x120.png"
              alt="RS Computers"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your trusted local computer shop since 2008. We provide premium
              hardware, professional services, and expert advice to the
              community.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-bold text-foreground text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "#home" },
                { label: "Products", href: "#products" },
                { label: "Services", href: "#services" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-display font-bold text-foreground text-sm uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>9139412451</span>
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>rscomputers.nagar@gmail.com</span>
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Chitali, Pathardi, Ahmednagar, Maharashtra 414505</span>
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Mon–Sat 10am–7pm</span>
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.facebook.com/rscomputers.nagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Facebook Page
                </a>
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.instagram.com/rs_computers_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @rs_computers_official
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {year} RS Computers. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            Built with ❤️ using{" "}
            <span className="text-primary font-semibold">caffeine.ai</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Extra laptop & desktop products ──────────────────────────────────────────
const extraLaptopDesktopProducts = [
  // Laptops
  {
    name: "Gaming Laptop RTX 4060",
    description:
      "High-performance gaming laptop with Intel Core i7 13th Gen, RTX 4060, 16GB RAM, 512GB NVMe SSD, 144Hz display. Dominate every game.",
    price: 89000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Creator Laptop",
    description:
      "15.6-inch creator laptop, Intel Core i7, 32GB RAM, 1TB SSD, OLED display. Built for video editing, design, and 3D work.",
    price: 95000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "2-in-1 Convertible Laptop",
    description:
      "360° touchscreen convertible laptop, Intel Core i5, 8GB RAM, 256GB SSD. Use as laptop or tablet with stylus support.",
    price: 42000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Chromebook",
    description:
      "Lightweight Chromebook for students and everyday use. Fast boot, 10-hour battery, 4GB RAM, 64GB storage.",
    price: 18500,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Thin & Light Laptop",
    description:
      "Ultra-slim 13.3-inch laptop under 1.2kg, Intel Core i5, 8GB RAM, 512GB SSD. Perfect for travel and daily commute.",
    price: 52000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Budget Laptop",
    description:
      "Affordable 15.6-inch laptop for basic tasks, Intel Celeron, 4GB RAM, 500GB HDD. Great for students and home use.",
    price: 14000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Refurbished Dell Laptop",
    description:
      "Certified refurbished Dell Latitude 5490, Core i5 8th Gen, 8GB RAM, 256GB SSD. Tested and warrantied. Great value.",
    price: 16500,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Refurbished HP Laptop",
    description:
      "Certified refurbished HP ProBook 440, Core i5 7th Gen, 8GB RAM, 256GB SSD. Professionally cleaned and tested.",
    price: 15000,
    category: Category.Laptop,
    inStock: true,
  },
  // Desktops
  {
    name: "Office Desktop PC",
    description:
      "Reliable office desktop, Intel Core i3, 8GB RAM, 1TB HDD, Windows 11. Ideal for daily office work and browsing.",
    price: 22000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Micro Tower PC",
    description:
      "Compact micro tower desktop, Intel Core i5, 8GB RAM, 256GB SSD. Space-saving form factor for homes and offices.",
    price: 28000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Tower PC Core i7",
    description:
      "Full tower desktop with Intel Core i7 12th Gen, 16GB RAM, 512GB SSD + 1TB HDD. Great for heavy multitasking.",
    price: 55000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Refurbished Desktop PC",
    description:
      "Certified refurbished desktop with Core i5 6th Gen, 8GB RAM, 500GB HDD, Windows 10 licensed. Budget-friendly.",
    price: 10500,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Second Hand Desktop Core i3",
    description:
      "Used desktop PC, Core i3 4th Gen, 4GB RAM, 320GB HDD. Tested and functional. Good for basic use.",
    price: 6500,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Custom Gaming Desktop",
    description:
      "Custom-built gaming PC with AMD Ryzen 5, RX 6600, 16GB DDR4, 512GB NVMe SSD, RGB cabinet. Ready to ship.",
    price: 62000,
    category: Category.Desktop,
    inStock: true,
  },
];

// ── Monitor & Accessories products ───────────────────────────────────────────
const monitorAccessoryProducts = [
  // Monitors
  {
    name: '27" 4K IPS Monitor',
    description:
      "27-inch 4K UHD IPS monitor, 60Hz, HDMI + DisplayPort, built-in speakers, ultra-thin bezel. Stunning clarity for work and media.",
    price: 18500,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: '32" 4K Monitor',
    description:
      "32-inch 4K VA panel monitor, wide colour gamut, 5ms response time, height adjustable stand. Ideal for creative professionals.",
    price: 26000,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: "Gaming Monitor 144Hz",
    description:
      "24-inch Full HD 144Hz gaming monitor, 1ms response time, AMD FreeSync, HDMI & DisplayPort. Buttery-smooth gameplay.",
    price: 14500,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: "Curved Gaming Monitor",
    description:
      "27-inch 1080p curved monitor, 165Hz, 1ms, ultra-wide viewing angle. Immersive experience for gamers.",
    price: 19000,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: "Portable Monitor",
    description:
      "15.6-inch portable USB-C monitor, Full HD IPS panel, plug-and-play, slim design. Perfect for laptops and mobile setups.",
    price: 9500,
    category: Category.Monitors,
    inStock: true,
  },
  // Accessories
  {
    name: "Laptop Cooling Pad",
    description:
      "Adjustable laptop cooling pad with dual fans, LED lighting, 2 USB ports. Fits laptops up to 17 inches. Keeps your system cool.",
    price: 1200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "USB-C Docking Station",
    description:
      "7-in-1 USB-C docking station with HDMI, 3x USB 3.0, SD card reader, USB-C PD charging. Single cable desk setup.",
    price: 3200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "External SSD 500GB",
    description:
      "Portable 500GB USB 3.2 external SSD, 550MB/s read speed, rugged design. Fast backup and data transfer.",
    price: 4500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Inkjet Printer",
    description:
      "Colour inkjet all-in-one printer with scan and copy, Wi-Fi printing, mobile print support. Great for home and office.",
    price: 5800,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Wireless Keyboard & Mouse Combo",
    description:
      "2.4GHz wireless keyboard and mouse combo, silent keys, ergonomic design, long battery life. Perfect office set.",
    price: 1800,
    category: Category.Accessories,
    inStock: true,
  },
];

// ── Extra monitor & accessories products (batch 2) ───────────────────────────
const extraMonitorAccessoryProducts = [
  // Monitors
  {
    name: '34" Ultrawide Monitor',
    description:
      "34-inch ultrawide 21:9 curved IPS monitor, 3440×1440 WQHD, 100Hz, AMD FreeSync, USB-C. Immersive multitasking for power users.",
    price: 32000,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: '22" FHD Office Monitor',
    description:
      "22-inch Full HD IPS monitor, 60Hz, thin bezel, HDMI & VGA ports, eye-care filter. Reliable everyday display for home and office.",
    price: 7200,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: '27" 165Hz Gaming Monitor',
    description:
      "27-inch QHD 165Hz gaming monitor, 1ms MPRT, HDR400, G-Sync compatible. Crystal-clear visuals with ultra-smooth gameplay.",
    price: 22000,
    category: Category.Monitors,
    inStock: true,
  },
  // Accessories
  {
    name: "Aluminium Laptop Stand",
    description:
      "Adjustable aluminium laptop stand with ventilated design, foldable and portable. Compatible with 11-17 inch laptops. Ergonomic working posture.",
    price: 1500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "HD Webcam 1080p",
    description:
      "Full HD 1080p USB webcam with built-in noise-cancelling microphone, auto light correction. Perfect for video calls and streaming.",
    price: 2200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "HDMI Cable 1.8m",
    description:
      "High-speed HDMI 2.0 cable, 1.8m, supports 4K@60Hz, braided nylon jacket. Essential connection for monitors, TVs and projectors.",
    price: 350,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: 'Laptop Bag 15.6"',
    description:
      "Water-resistant laptop backpack with USB charging port, fits up to 15.6-inch laptops. Multiple compartments for accessories and documents.",
    price: 1200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Optical Mouse",
    description:
      "Wired USB optical mouse with 1200 DPI, scroll wheel, ergonomic shape. Plug and play — compatible with all operating systems.",
    price: 350,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "USB Hub 4-Port",
    description:
      "Compact 4-port USB 3.0 hub with LED indicator and data transfer up to 5Gbps. Expand your laptop or desktop connectivity instantly.",
    price: 650,
    category: Category.Accessories,
    inStock: true,
  },
];

// ── Extra desktop products (batch 2) ─────────────────────────────────────────
const extraDesktopProducts = [
  {
    name: "Home Desktop Core i5",
    description:
      "Everyday home desktop with Intel Core i5 10th Gen, 8GB RAM, 512GB SSD, DVD drive, Windows 11. Great for family use and home tasks.",
    price: 32000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Slim Desktop Mini PC",
    description:
      "Ultra-compact mini PC with Intel Core i3 12th Gen, 8GB RAM, 256GB SSD. Fan-less, whisper-quiet, fits behind any monitor.",
    price: 18000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "High-End Workstation",
    description:
      "Professional workstation with Intel Core i9 13th Gen, 32GB ECC RAM, 1TB NVMe SSD + 2TB HDD, Quadro GPU. Built for CAD, video production and heavy computation.",
    price: 125000,
    category: Category.Desktop,
    inStock: true,
  },
];

// ── Extra laptop products (batch 2) ──────────────────────────────────────────
const extraLaptopProducts2 = [
  {
    name: 'Student Laptop 11.6"',
    description:
      "Affordable 11.6-inch student laptop with Intel Celeron N4020, 4GB RAM, 64GB eMMC, Windows 11 S. Lightweight and perfect for school.",
    price: 11500,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Laptop Core i7 16GB",
    description:
      "15.6-inch powerhouse laptop with Intel Core i7 12th Gen, 16GB RAM, 512GB SSD, Full HD IPS display. Handle demanding apps with ease.",
    price: 65000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: 'Slim Ultrabook 13"',
    description:
      "Premium 13.3-inch ultrabook with Intel Core i5, 8GB LPDDR5 RAM, 512GB NVMe SSD, fingerprint reader. Elegant, lightweight, all-day battery.",
    price: 58000,
    category: Category.Laptop,
    inStock: true,
  },
];

// ── Extra Desktop, Laptop, Monitor & Accessories (batch 3) ────────────────────
const extraProductsBatch3 = [
  // Desktops
  {
    name: "AMD Ryzen 7 Desktop",
    description:
      "Powerful desktop with AMD Ryzen 7 5800X, 32GB DDR4 RAM, 1TB NVMe SSD, RTX 3060. Excellent for gaming and creative workflows.",
    price: 72000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Budget Office Desktop i3",
    description:
      "Value-priced office desktop with Intel Core i3 10th Gen, 4GB RAM, 500GB HDD, Windows 11 Home. Handles everyday tasks reliably.",
    price: 15500,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Gaming PC RTX 4070",
    description:
      "Premium gaming PC with Intel Core i9 13th Gen, 32GB DDR5 RAM, 1TB NVMe SSD, NVIDIA RTX 4070 Ti. Runs any game at ultra settings.",
    price: 145000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "Small Form Factor PC",
    description:
      "Compact SFF PC with AMD Ryzen 5 5600, 16GB RAM, 512GB SSD. Tiny footprint, big performance. Great for space-constrained setups.",
    price: 38000,
    category: Category.Desktop,
    inStock: true,
  },
  // Laptops
  {
    name: "MacBook Air M2 (Refurbished)",
    description:
      "Certified refurbished MacBook Air with Apple M2 chip, 8GB Unified Memory, 256GB SSD. Fast, fanless, all-day battery.",
    price: 82000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "HP Pavilion 15 i5",
    description:
      "HP Pavilion 15.6-inch laptop, Intel Core i5 12th Gen, 16GB RAM, 512GB SSD, Full HD anti-glare display. Versatile everyday companion.",
    price: 48000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Lenovo IdeaPad Slim 5",
    description:
      "Sleek Lenovo IdeaPad Slim 5, AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD, 15.6-inch FHD display. Great balance of price and performance.",
    price: 38000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "Dell Inspiron 14 Core i7",
    description:
      "Dell Inspiron 14-inch laptop with Intel Core i7 12th Gen, 16GB RAM, 512GB SSD, Windows 11. Solid build for professionals.",
    price: 62000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: "ASUS VivoBook 15 Ryzen 5",
    description:
      "ASUS VivoBook 15 with AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD, Full HD IPS display, fingerprint login. Compact and capable.",
    price: 36000,
    category: Category.Laptop,
    inStock: true,
  },
  // Monitors
  {
    name: '19" HD Budget Monitor',
    description:
      "19-inch HD TN monitor with HDMI and VGA, 60Hz, eye-care filter. Ideal entry-level display for basic computing.",
    price: 4800,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: '24" FHD 165Hz Gaming Monitor',
    description:
      "24-inch Full HD 165Hz gaming monitor, 1ms response, IPS panel, G-Sync compatible, HDMI 2.0. Smooth visuals for competitive gaming.",
    price: 16500,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: '27" QHD IPS Monitor',
    description:
      "27-inch 2560×1440 QHD IPS monitor, 75Hz, Delta E<2 colour accuracy, USB-C + HDMI. Sharp detail for design and content creation.",
    price: 21000,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: '4K OLED Monitor 27"',
    description:
      "27-inch 4K OLED professional monitor, 120Hz, DCI-P3 99%, HDR True Black 400. Exceptional contrast and colour for creative pros.",
    price: 55000,
    category: Category.Monitors,
    inStock: true,
  },
  // Accessories
  {
    name: "Noise Cancelling Headphones",
    description:
      "Over-ear wireless headphones with active noise cancellation, 30-hour battery, Bluetooth 5.0. Clear audio for work and music.",
    price: 4500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Mechanical Keyboard Compact TKL",
    description:
      "Tenkeyless mechanical keyboard with blue switches, RGB per-key lighting, aluminium frame. Precise tactile feedback for typists and gamers.",
    price: 3200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Ergonomic Wrist Rest",
    description:
      "Memory foam keyboard and mouse wrist rest set. Non-slip base, comfortable support for long typing sessions.",
    price: 750,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Portable 20000mAh Power Bank",
    description:
      "20000mAh power bank with 65W USB-C PD fast charging, 2x USB-A + 1x USB-C ports. Charge laptops and phones on the go.",
    price: 2800,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Surge Protector 6-Socket",
    description:
      "6-socket surge protector with master switch, USB charging ports and 2-metre cable. Protects your equipment from voltage spikes.",
    price: 1100,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Cat6 Ethernet Cable 5m",
    description:
      "5-metre Cat6 flat ethernet cable, snag-less RJ45, supports Gigabit speeds. Clean cable management for home and office.",
    price: 280,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Laptop Privacy Screen Filter",
    description:
      "14-inch anti-spy privacy screen filter for laptops. Limits side viewing angles, reduces glare, protects screen from scratches.",
    price: 950,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Wireless Charging Pad",
    description:
      "15W fast wireless charger compatible with Qi-enabled devices — phones, earbuds, and more. Compact, non-slip base.",
    price: 1200,
    category: Category.Accessories,
    inStock: true,
  },
];

// ── New products to seed ─────────────────────────────────────────────────────
const newProductsToAdd = [
  {
    name: "Intel Core i5 CPU",
    description:
      "12th Gen Intel Core i5 processor, 6 cores, 12 threads, 3.3GHz base clock. Ideal for gaming and productivity.",
    price: 12500,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "DDR4 8GB RAM",
    description:
      "8GB DDR4 2666MHz RAM module. Compatible with most desktop and laptop systems.",
    price: 2800,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "1TB Hard Disk (HDD)",
    description:
      'Seagate 1TB 3.5" SATA hard drive, 7200RPM. Reliable storage for data, documents and media.',
    price: 3200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "256GB SSD",
    description:
      "Kingston 256GB SATA SSD. Fast boot times and application loading, major upgrade over HDD.",
    price: 2500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "120mm RGB Case Fan",
    description:
      "120mm RGB cooling fan for PC cases. Quiet operation, 1200RPM, colourful LED lighting.",
    price: 850,
    category: Category.Accessories,
    inStock: true,
  },
];

// ── Computer products to seed ─────────────────────────────────────────────────
const computerProductsToAdd = [
  {
    name: "Gaming Desktop PC",
    description:
      "High-performance gaming desktop with Intel Core i7, 16GB RAM, 512GB SSD, RGB lighting. Ready to play out of the box.",
    price: 45000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: "All-in-One Desktop",
    description:
      '27" all-in-one computer with Full HD display, Intel Core i5, 8GB RAM, 1TB HDD. Perfect for home and office use.',
    price: 38000,
    category: Category.Desktop,
    inStock: true,
  },
  {
    name: 'Business Laptop 14"',
    description:
      "14-inch slim business laptop, Intel Core i5 11th Gen, 8GB RAM, 512GB SSD, Full HD display. Lightweight and powerful.",
    price: 35000,
    category: Category.Laptop,
    inStock: true,
  },
  {
    name: '24" LED Monitor',
    description:
      "24-inch Full HD IPS LED monitor, 75Hz refresh rate, ultra-thin bezels, HDMI & VGA ports. Crisp and vibrant display.",
    price: 9500,
    category: Category.Monitors,
    inStock: true,
  },
  {
    name: "Mechanical Gaming Keyboard",
    description:
      "Full-size mechanical gaming keyboard with RGB backlight, tactile switches, anti-ghosting. Built to last.",
    price: 2200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Wireless Gaming Mouse",
    description:
      "Ergonomic wireless gaming mouse, 6 programmable buttons, adjustable DPI up to 6400, long battery life.",
    price: 1500,
    category: Category.Accessories,
    inStock: true,
  },
];

// ── Networking & peripherals batch 4 ────────────────────────────────────────
const networkingPeripheralsBatch4 = [
  {
    name: "Wired USB Mouse",
    description:
      "Plug-and-play USB optical mouse, 1200 DPI, symmetric design, silent click buttons. Compatible with Windows, Mac and Linux.",
    price: 350,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Wireless Mouse",
    description:
      "2.4GHz wireless optical mouse, nano USB receiver, 1600 DPI adjustable, 12-month battery life. Smooth gliding on any surface.",
    price: 650,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Gaming Mouse RGB",
    description:
      "Wired RGB gaming mouse, 7200 DPI optical sensor, 7 programmable buttons, braided cable. Precision control for competitive gaming.",
    price: 1200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "USB Wired Keyboard",
    description:
      "Full-size USB membrane keyboard with number pad, multimedia shortcut keys, spill-resistant. Quiet and comfortable for daily typing.",
    price: 450,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Wireless Keyboard & Mouse Combo",
    description:
      "2.4GHz wireless keyboard and mouse combo, single USB receiver, slim design, 1 year battery. Great for home and office.",
    price: 1100,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Network Switch 8-Port",
    description:
      "8-port unmanaged gigabit ethernet switch, plug-and-play, auto MDI/MDIX, metal housing. Expand your wired network instantly.",
    price: 2200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Network Switch 16-Port",
    description:
      "16-port gigabit unmanaged switch for office networks. Supports jumbo frames, VLAN ready, rackmount brackets included.",
    price: 4500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "WiFi Router AC1200",
    description:
      "Dual-band AC1200 wireless router, 2.4GHz + 5GHz, 4 antennas, 4 LAN ports. Fast and reliable internet for home and small office.",
    price: 2800,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "WiFi Router AC2100",
    description:
      "Tri-band AC2100 router with MU-MIMO, beamforming, USB 3.0 port for NAS sharing. Handles 50+ devices simultaneously.",
    price: 5500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Broadband Modem Router",
    description:
      "ADSL/VDSL modem router combo, dual-band WiFi, 4 LAN ports, compatible with BSNL, Airtel and Jio Fiber connections.",
    price: 3200,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "IP Desk Telephone",
    description:
      "Corded VoIP desk phone with HD voice, 2-line SIP, backlit LCD display. Ideal for office and business use.",
    price: 2500,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Cordless DECT Telephone",
    description:
      "Digital cordless phone with answering machine, caller ID, 300m range. Expandable to 5 handsets on one base.",
    price: 1800,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Laptop Charger 45W Universal",
    description:
      "45W universal laptop charger with multiple tips, compatible with HP, Dell, Lenovo, Acer, Asus. Auto voltage detection, safety certified.",
    price: 950,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "Laptop Charger 65W Universal",
    description:
      "65W universal laptop adapter with USB-C and barrel connectors. Supports most brands including HP, Dell, Lenovo, Samsung. Surge protected.",
    price: 1400,
    category: Category.Accessories,
    inStock: true,
  },
  {
    name: "USB-C Laptop Charger 90W",
    description:
      "90W USB-C PD fast charger compatible with MacBook, Dell XPS, HP Spectre, Lenovo ThinkPad. Compact design with LED indicator.",
    price: 1800,
    category: Category.Accessories,
    inStock: true,
  },
];

// ── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { data: products } = useGetAllProducts();
  const { mutate: seedData } = useSeedData();
  const { actor, isFetching } = useActor();
  const seeded = useRef(false);

  useEffect(() => {
    if (actor && !isFetching && !seeded.current && products !== undefined) {
      seeded.current = true;
      if (products.length === 0) {
        seedData();
      }
      // Add new products if "Intel Core i5 CPU" is not yet in the list
      const hasNewProducts = products.some((p) =>
        p.name.includes("Intel Core i5 CPU"),
      );
      if (!hasNewProducts) {
        for (const p of newProductsToAdd) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add computer products if "Gaming Desktop PC" is not yet in the list
      const hasComputerProducts = products.some((p) =>
        p.name.includes("Gaming Desktop PC"),
      );
      if (!hasComputerProducts) {
        for (const p of computerProductsToAdd) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add extra laptop & desktop products if not yet seeded
      const hasExtraProducts = products.some((p) =>
        p.name.includes("Gaming Laptop RTX 4060"),
      );
      if (!hasExtraProducts) {
        for (const p of extraLaptopDesktopProducts) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add monitor & accessory products if not yet seeded
      const hasMonitorProducts = products.some((p) =>
        p.name.includes('27" 4K IPS Monitor'),
      );
      if (!hasMonitorProducts) {
        for (const p of monitorAccessoryProducts) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add extra monitor & accessory products (batch 2)
      const hasExtraMonitorProducts = products.some((p) =>
        p.name.includes('34" Ultrawide Monitor'),
      );
      if (!hasExtraMonitorProducts) {
        for (const p of extraMonitorAccessoryProducts) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add extra desktop products (batch 2)
      const hasExtraDesktopProducts = products.some((p) =>
        p.name.includes("Home Desktop Core i5"),
      );
      if (!hasExtraDesktopProducts) {
        for (const p of extraDesktopProducts) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add extra laptop products (batch 2)
      const hasExtraLaptopProducts2 = products.some((p) =>
        p.name.includes('Student Laptop 11.6"'),
      );
      if (!hasExtraLaptopProducts2) {
        for (const p of extraLaptopProducts2) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add extra desktop, laptop, monitor & accessories (batch 3)
      const hasExtraProductsBatch3 = products.some((p) =>
        p.name.includes("AMD Ryzen 7 Desktop"),
      );
      if (!hasExtraProductsBatch3) {
        for (const p of extraProductsBatch3) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
      // Add networking, peripherals & telephone products (batch 4)
      const hasNetworkingBatch4 = products.some((p) =>
        p.name.includes("Wired USB Mouse"),
      );
      if (!hasNetworkingBatch4) {
        for (const p of networkingPeripheralsBatch4) {
          actor.addProduct(
            p.name,
            p.description,
            p.price,
            p.category,
            p.inStock,
          );
        }
      }
    }
  }, [actor, isFetching, products, seedData]);

  return (
    <div className="min-h-screen text-foreground font-body">
      {/* Full-screen background slideshow — fixed, behind all content */}
      <BackgroundSlideshow />
      <div className="relative z-10">
        <Toaster richColors position="top-right" />
        <Navigation />
        <main>
          <HeroSection />
          <ProductsSection />
          <ServicesSection />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
