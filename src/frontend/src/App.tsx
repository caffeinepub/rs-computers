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
    { icon: <Users className="h-4 w-4" />, text: "5,000+ Customers" },
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
            className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed"
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
};

function getProductImage(name: string): string | null {
  const lower = name.toLowerCase();
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
    { value: 5000, suffix: "+", label: "Happy Customers" },
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
                        <p className="text-foreground text-sm font-medium">
                          {item.value}
                        </p>
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
              href="https://www.openstreetmap.org/?mlat=19.22&mlon=74.67#map=14/19.22/74.67"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View Larger Map
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <iframe
              title="RS Computers Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=74.62%2C19.17%2C74.72%2C19.27&layer=mapnik&marker=19.22%2C74.67"
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              loading="lazy"
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
