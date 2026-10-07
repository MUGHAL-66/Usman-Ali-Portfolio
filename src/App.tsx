import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import heroPortrait from "./assets/U.png";
import aboutPortrait from "./assets/U1.png";
import projectCatalog from "./data/projects.json";

const CALENDLY_URL = "https://calendly.com/dev-usman11/30min";
const pngAssets = import.meta.glob("./assets/*.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const aboutPagePortrait = pngAssets["./assets/U2.png"] ?? aboutPortrait;

type LinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

type Service = {
  slug: string;
  number: string;
  title: string;
  description: string;
  tech: string[];
};

type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image?: string;
  imageAlt?: string;
  overview: string;
  challenge: string;
  solution: string;
  role: string;
  features: { title: string; description: string }[];
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
};

type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  time: string;
};

const services: Service[] = [
  {
    slug: "full-stack-development",
    number: "01",
    title: "Full-Stack Development",
    description:
      "Modern, scalable web applications with strong frontend experiences and reliable backend architecture.",
    tech: ["React", "Next.js", "Node.js", "TypeScript"],
  },
  {
    slug: "ai-engineering",
    number: "02",
    title: "AI Engineering",
    description:
      "AI-powered applications, automation, intelligent workflows and API-based AI integrations.",
    tech: ["Python", "FastAPI", "OpenAI", "TensorFlow"],
  },
  {
    slug: "shopify-development",
    number: "03",
    title: "Shopify Development",
    description:
      "Custom Shopify stores, themes, apps, integrations and performance optimization.",
    tech: ["Liquid", "Shopify Plus", "APIs", "JavaScript"],
  },
  {
    slug: "dotnet-development",
    number: "04",
    title: ".NET / C# Development",
    description:
      "Modern backend systems, REST APIs and enterprise-ready applications.",
    tech: ["C#", "ASP.NET Core", "Entity Framework Core", "SQL"],
  },
  {
    slug: "cloud-solutions",
    number: "05",
    title: "Cloud Solutions",
    description:
      "Cloud-ready applications, deployments and infrastructure fundamentals.",
    tech: ["AWS", "Azure", "Docker"],
  },
  {
    slug: "api-development",
    number: "06",
    title: "API Development",
    description:
      "Reliable REST APIs, database integrations, authentication and third-party services.",
    tech: ["REST", "SQL", "MongoDB", "Supabase"],
  },
];

const projects = projectCatalog as Project[];
const featuredProjectSlugs = [
  "trendorauk",
  "ikhwan-unstitched",
  "glamvision-cosmetics",
  "luxury-homes",
  "aquaaid",
  "skysphere-weather-forecast",
  "adab-e-jahan",
  "student-evaluation-system",
];
const featuredProjects = projects.filter((project) => featuredProjectSlugs.includes(project.slug));
const articles: Article[] = [
  {
    slug: "better-full-stack-applications",
    title: "How to Build Better Full-Stack Applications",
    category: "Development",
    excerpt: "A practical look at architecture, clarity and the decisions that help software grow.",
    date: "[DATE]",
    time: "6 min read",
  },
  {
    slug: "shopify-store-performance",
    title: "5 Things That Make a Shopify Store Slow",
    category: "Shopify",
    excerpt: "The common performance bottlenecks that quietly damage a commerce experience.",
    date: "[DATE]",
    time: "5 min read",
  },
  {
    slug: "ai-in-modern-web-development",
    title: "Where AI Fits Into Modern Web Development",
    category: "AI",
    excerpt: "Using intelligent tools where they create value—not simply where they create noise.",
    date: "[DATE]",
    time: "7 min read",
  },
  {
    slug: "designing-reliable-apis",
    title: "Designing APIs That Teams Can Rely On",
    category: "Development",
    excerpt: "Simple principles for predictable, secure and maintainable service interfaces.",
    date: "[DATE]",
    time: "8 min read",
  },
  {
    slug: "dotnet-for-modern-products",
    title: ".NET for Modern Digital Products",
    category: ".NET",
    excerpt: "Why a mature ecosystem remains a strong choice for ambitious product teams.",
    date: "[DATE]",
    time: "6 min read",
  },
  {
    slug: "cloud-ready-from-day-one",
    title: "Thinking Cloud-Ready From Day One",
    category: "Cloud",
    excerpt: "Building for operational clarity without over-engineering the first release.",
    date: "[DATE]",
    time: "5 min read",
  },
];

const serviceCapabilities: Record<string, string[]> = {
  "full-stack-development": ["Modern web applications", "Frontend experiences", "Backend architecture", "React, Next.js and Node.js"],
  "ai-engineering": ["AI-powered applications", "Automation and intelligent workflows", "AI API integrations", "Python, FastAPI and OpenAI"],
  "shopify-development": ["Custom Shopify stores", "Theme and app development", "Store integrations", "Performance optimization"],
  "dotnet-development": ["C# and ASP.NET Core applications", "REST API development", "SQL data integrations", "Enterprise-ready systems"],
  "cloud-solutions": ["Cloud-ready applications", "Deployment support", "Infrastructure fundamentals", "AWS, Azure and Docker"],
  "api-development": ["REST APIs", "Authentication", "Database integrations", "Third-party services"],
};

function getRelatedProjects(service: Service) {
  return projects.filter((project) => {
    const searchable = `${project.title} ${project.description} ${project.tech.join(" ")}`;
    switch (service.slug) {
      case "full-stack-development": return project.category === "Full-Stack";
      case "ai-engineering": return /\b(ai|openai|fastapi|python)\b/i.test(searchable);
      case "shopify-development": return project.category === "Shopify";
      case "dotnet-development": return /(?:\.net|c#|asp\.net|sql server)/i.test(searchable);
      case "cloud-solutions": return /\b(aws|azure|docker|cloud)\b/i.test(searchable);
      case "api-development": return /\b(api|rest|supabase|firebase|mongodb)\b/i.test(searchable);
      default: return false;
    }
  }).slice(0, 3);
}

function hasArticleDate(article: Article) {
  return Boolean(article.date && !article.date.startsWith("["));
}

function Link({ to, children, className = "", onClick }: LinkProps) {
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
    onClick?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a href={to} className={className} onClick={navigate}>
      {children}
    </a>
  );
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">?</span>;
}

function ButtonLink({
  to,
  children,
  secondary = false,
  dark = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  dark?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`button ${secondary ? "button-secondary" : ""} ${dark ? "button-dark" : ""}`}
    >
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

function CalendlyLink({
  children = "Book a Call",
  dark = false,
  className,
  onClick,
}: {
  children?: ReactNode;
  dark?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? `button ${dark ? "button-dark" : ""}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label">{children}</div>;
}

function ImagePlaceholder({
  label = "[PROJECT IMAGE]",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`image-placeholder ${className}`}>
      <span className="image-mark">UA</span>
      <span>{label}</span>
      <span className="image-cross" aria-hidden="true" />
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="tag-list">
      {items.map((item) => <span className="tag" key={item}>{item}</span>)}
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onRouteChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onRouteChange);
    return () => window.removeEventListener("popstate", onRouteChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(mobileNavRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    requestAnimationFrame(() => focusable()[0]?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuToggleRef.current?.focus();
    };
  }, [mobileOpen]);

  const isActive = (path: string) => path === "/" ? currentPath === "/" : currentPath === path || currentPath.startsWith(`${path}/`);

  const close = () => {
    setMobileOpen(false);
    setMobilePanel(null);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-shell">
        <Link to="/" className="brand" onClick={close}>
          Usman Ali <span className="brand-dot" aria-hidden="true" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/" className={isActive("/") ? "is-active" : ""} aria-current={isActive("/") ? "page" : undefined}>Home</Link>
          <div className="nav-group">
            <button className={`nav-trigger ${isActive("/services") ? "is-active" : ""}`} aria-haspopup="true">Services <span>?</span></button>
            <div className="dropdown services-dropdown">
              {services.map((service) => (
                <Link to={`/services/${service.slug}`} className={`dropdown-item ${isActive(`/services/${service.slug}`) ? "is-active" : ""}`} aria-current={isActive(`/services/${service.slug}`) ? "page" : undefined} key={service.slug}>
                  <span>{service.number}</span>
                  <div>
                    <strong>{service.title}</strong>
                    <small>{service.description}</small>
                  </div>
                  <Arrow />
                </Link>
              ))}
              <Link to="/services" className={`dropdown-all ${isActive("/services") ? "is-active" : ""}`} aria-current={isActive("/services") ? "page" : undefined}>View All Services <span>?</span></Link>
            </div>
          </div>
          <Link to="/blog" className={isActive("/blog") ? "is-active" : ""} aria-current={isActive("/blog") ? "page" : undefined}>Blog</Link>
          <div className="nav-group">
            <button className={`nav-trigger ${["/about", "/projects", "/faq"].some(isActive) ? "is-active" : ""}`} aria-haspopup="true">Pages <span>?</span></button>
            <div className="dropdown pages-dropdown">
              <Link to="/about" className={isActive("/about") ? "is-active" : ""} aria-current={isActive("/about") ? "page" : undefined}>About <Arrow /></Link>
              <Link to="/projects" className={isActive("/projects") ? "is-active" : ""} aria-current={isActive("/projects") ? "page" : undefined}>Projects <Arrow /></Link>
              <Link to="/faq" className={isActive("/faq") ? "is-active" : ""} aria-current={isActive("/faq") ? "page" : undefined}>FAQ <Arrow /></Link>
            </div>
          </div>
          <Link to="/contact" className={isActive("/contact") ? "is-active" : ""} aria-current={isActive("/contact") ? "page" : undefined}>Contact</Link>
        </nav>
        <CalendlyLink />
        <button
          ref={menuToggleRef}
          className="menu-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
        </button>
      </div>
      {mobileOpen && (
        <div className="mobile-menu-layer">
          <div className="mobile-menu-backdrop" aria-hidden="true" onClick={close} />
          <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" role="dialog" aria-modal="true" ref={mobileNavRef}>
          <div className="mobile-nav-heading"><span>Navigation / 01—05</span><button type="button" className="mobile-nav-dismiss" onClick={close} aria-label="Close mobile navigation">Close <span aria-hidden="true">×</span></button></div>
          <Link to="/" onClick={close} className={`mobile-nav-link ${isActive("/") ? "is-active" : ""}`} aria-current={isActive("/") ? "page" : undefined}><span className="mobile-nav-index">01</span><span>Home</span><Arrow /></Link>
          <button
            className={`mobile-accordion-trigger ${mobilePanel === "services" ? "is-expanded" : ""}`}
            aria-expanded={mobilePanel === "services"}
            aria-controls="mobile-services-panel"
            onClick={() => setMobilePanel(mobilePanel === "services" ? null : "services")}
          >
            <span className="mobile-nav-index">02</span><span>Services</span><span className="mobile-accordion-icon">{mobilePanel === "services" ? "−" : "+"}</span>
          </button>
          {mobilePanel === "services" && (
            <div className="mobile-subnav" id="mobile-services-panel">
              <Link to="/services" onClick={close} className={isActive("/services") ? "is-active" : ""} aria-current={currentPath === "/services" ? "page" : undefined}>All Services <Arrow /></Link>
              {services.map((service) => (
                <Link to={`/services/${service.slug}`} onClick={close} className={isActive(`/services/${service.slug}`) ? "is-active" : ""} aria-current={isActive(`/services/${service.slug}`) ? "page" : undefined} key={service.slug}>
                  {service.number} — {service.title}
                </Link>
              ))}
            </div>
          )}
          <Link to="/blog" onClick={close} className={`mobile-nav-link ${isActive("/blog") ? "is-active" : ""}`} aria-current={isActive("/blog") ? "page" : undefined}><span className="mobile-nav-index">03</span><span>Blog</span><Arrow /></Link>
          <button
            className={`mobile-accordion-trigger ${mobilePanel === "pages" ? "is-expanded" : ""}`}
            aria-expanded={mobilePanel === "pages"}
            aria-controls="mobile-pages-panel"
            onClick={() => setMobilePanel(mobilePanel === "pages" ? null : "pages")}
          >
            <span className="mobile-nav-index">04</span><span>Explore</span><span className="mobile-accordion-icon">{mobilePanel === "pages" ? "−" : "+"}</span>
          </button>
          {mobilePanel === "pages" && (
            <div className="mobile-subnav" id="mobile-pages-panel">
              <Link to="/about" onClick={close} className={isActive("/about") ? "is-active" : ""} aria-current={isActive("/about") ? "page" : undefined}>About</Link>
              <Link to="/projects" onClick={close} className={isActive("/projects") ? "is-active" : ""} aria-current={isActive("/projects") ? "page" : undefined}>Projects</Link>
              <Link to="/faq" onClick={close} className={isActive("/faq") ? "is-active" : ""} aria-current={isActive("/faq") ? "page" : undefined}>FAQ</Link>
            </div>
          )}
          <Link to="/contact" onClick={close} className={`mobile-nav-link ${isActive("/contact") ? "is-active" : ""}`} aria-current={isActive("/contact") ? "page" : undefined}><span className="mobile-nav-index">05</span><span>Contact</span><Arrow /></Link>
          <div className="mobile-nav-bottom"><div className="mobile-nav-cta"><span>Have a project in mind?</span><CalendlyLink onClick={close}>Book a Call</CalendlyLink></div><div className="mobile-nav-socials" aria-label="Social links"><a href="https://github.com/MUGHAL-66" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a><a href="https://www.linkedin.com/in/usmanali66/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://wa.me/923107243590" target="_blank" rel="noopener noreferrer">WhatsApp <Arrow /></a><a href="mailto:dev.usman11@gmail.com">Email <Arrow /></a></div><div className="mobile-nav-meta"><span>© 2026 Usman Ali</span><span>Frontend · Shopify · Software</span></div></div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-hero">
          <div className="footer-hero-main">
            <div className="footer-kicker"><span>Let&apos;s work together</span><span className="footer-monogram" aria-hidden="true">UA</span></div>
            <h2 id="footer-heading">LET&apos;S BUILD<br /><em>SOMETHING<br />GREAT.</em></h2>
          </div>
          <div className="footer-hero-aside">
            <p>Have an idea, project, or problem to solve? Let&apos;s turn it into something useful.</p>
            <div className="footer-hero-actions">
              <CalendlyLink className="button footer-cta-primary">Book a Call</CalendlyLink>
              <Link to="/contact" className="button footer-cta-secondary"><span>Get in Touch</span><Arrow /></Link>
            </div>
          </div>
        </div>

        <div className="footer-brand">
          <Link to="/" className="footer-name">Usman Ali<span className="brand-dot" /></Link>
          <p>Frontend Developer · Shopify Developer · Software Developer</p>
        </div>

        <nav className="footer-grid" aria-label="Footer navigation">
          <div className="footer-column">
            <span className="footer-label">Navigate</span>
            <div className="footer-link-list footer-nav-links">
              <Link to="/">Home</Link>
              <Link to="/services">Services</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="footer-column">
            <span className="footer-label">Services</span>
            <div className="footer-link-list">
              {services.slice(0, 5).map((service) => (
                <Link to={`/services/${service.slug}`} key={service.slug}>{service.title}</Link>
              ))}
            </div>
          </div>
          <div className="footer-column footer-connect">
            <span className="footer-label">Connect</span>
            <div className="footer-connect-links">
              <a href="https://github.com/MUGHAL-66" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>
              <a href="https://www.linkedin.com/in/usmanali66/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>
              <a href="mailto:dev.usman11@gmail.com">Email <Arrow /></a>
              <a href="https://wa.me/923107243590" target="_blank" rel="noopener noreferrer">WhatsApp <Arrow /></a>
              <CalendlyLink className="footer-social-link">Book a Call</CalendlyLink>
            </div>
          </div>
        </nav>

        <div className="footer-bottom">
          <span>© 2026 Usman Ali. All rights reserved.</span>
          <span>Built with intention.</span>
        </div>
      </div>
    </footer>
  );
}

function PageHero({
  eyebrow,
  title,
  italic,
  description,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <SectionLabel>{eyebrow}</SectionLabel>
      <div className="page-hero-grid">
        <h1>{title}<br /><em>{italic}</em></h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function ArticleArtwork({ article, className = "" }: { article: Article; className?: string }) {
  return (
    <div className={`article-art ${className}`} aria-hidden="true">
      <span className="article-art-category">{article.category} / NOTES</span>
      <span className="article-art-mark">&lt; / &gt;</span>
      <span className="article-art-index">{article.time}</span>
    </div>
  );
}

function ServiceList({ limit }: { limit?: number }) {
  return (
    <div className="service-list">
      {services.slice(0, limit).map((service) => (
        <article className="service-row" key={service.slug}>
          <span className="service-number">{service.number}</span>
          <div className="service-main">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <div className="service-meta">
            <TagList items={service.tech} />
            <Link to={`/services/${service.slug}`} className="text-link">
              Explore Service <Arrow />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={`project-card ${featured ? "project-card-featured" : ""}`}>
      <Link to={`/projects/${project.slug}`} className="project-image-link" aria-label={`View ${project.title}`}>
        {project.image ? (
          <img src={project.image} alt={project.imageAlt ?? `${project.title} preview`} className="project-card-image" loading="lazy" />
        ) : (
          <ImagePlaceholder label={`${project.category} project`} />
        )}
        <span className="project-index">{project.number}</span>
      </Link>
      <div className="project-card-head">
        <div>
          <span className="project-category">{project.category}</span>
          <h3>{project.title}</h3>
        </div>
        <Link to={`/projects/${project.slug}`} className="circle-link" aria-label={`View ${project.title}`}>
          <Arrow />
        </Link>
      </div>
      <p>{project.description}</p>
      <TagList items={project.tech} />
      <Link to={`/projects/${project.slug}`} className="text-link">View Case Study <Arrow /></Link>
      <div className="project-external-links" aria-label="Project links">
        {project.liveUrl ? <a className="project-action" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo <Arrow /></a> : <span className="project-action project-action-disabled" aria-disabled="true">Live Demo</span>}
        {project.githubUrl ? <a className="project-action" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View Code <Arrow /></a> : <span className="project-action project-action-disabled" aria-disabled="true">View Code</span>}
      </div>
    </article>
  );
}

function EditorialProject({ project, index }: { project: Project; index: number }) {
  return <article className={`editorial-project ${index % 2 ? "is-reversed" : ""}`}><Link to={`/projects/${project.slug}`} className="editorial-project-media" aria-label={`View ${project.title}`}>{project.image ? <img src={project.image} alt={project.imageAlt ?? `${project.title} preview`} loading="lazy" /> : <ImagePlaceholder label={`${project.category} project`} />}<span>{project.number} / {project.category}</span></Link><div className="editorial-project-copy"><span className="project-category">{project.category} / {project.number}</span><h2><Link to={`/projects/${project.slug}`}>{project.title}</Link></h2><p>{project.description}</p><TagList items={project.tech} /><div className="project-external-links">{project.liveUrl ? <a className="project-action" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo <Arrow /></a> : <span className="project-action project-action-disabled" aria-disabled="true">Live Demo</span>}{project.githubUrl ? <a className="project-action" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View Code <Arrow /></a> : <span className="project-action project-action-disabled" aria-disabled="true">View Code</span>}<Link to={`/projects/${project.slug}`} className="project-action">Case Study <Arrow /></Link></div></div></article>;
}

function EditorialArticle({ article, index }: { article: Article; index: number }) {
  return <article className="editorial-article"><span className="editorial-article-index">{String(index + 1).padStart(2, "0")}</span><div className="editorial-article-topic"><span>{article.category}</span>{hasArticleDate(article) && <time>{article.date}</time>}</div><div className="editorial-article-copy"><h2><Link to={`/blog/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p></div><Link to={`/blog/${article.slug}`} className="editorial-article-link" aria-label={`Read ${article.title}`}>Read <Arrow /></Link><span className="editorial-article-time">{article.time}</span></article>;
}

function BlogCard({ article }: { article: Article }) {
  return (
    <article className="blog-card">
      <div className="blog-meta">
        <span>{article.category}</span>
        {hasArticleDate(article) && <time>{article.date}</time>}
      </div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <div className="blog-card-bottom">
        <span>{article.time}</span>
        <Link to={`/blog/${article.slug}`} className="text-link">Read Article <Arrow /></Link>
      </div>
    </article>
  );
}

function HomePage() {
  const skillGroups = [
    ["Frontend", "React", "Angular", "TypeScript", "Next.js", "Tailwind CSS", "Figma"],
    ["Backend", "Node.js", "Python", "FastAPI", "ASP.NET Core", "C#"],
    ["AI", "OpenAI", "TensorFlow", "AI APIs", "AI Automation"],
    ["Database", "SQL", "MongoDB", "Supabase", "Firebase", "NoSQL"],
    ["Cloud & DevOps", "Docker", "AWS", "Azure"],
    ["Shopify", "Liquid", "Shopify Plus", "Theme Development", "App Development", "API Integration", "Performance Optimization"],
  ];

  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="availability"><span /> Available for new projects</div>
            <h1>FULL-STACK<br />DEVELOPER<br />&amp; <em>AI ENGINEER.</em></h1>
            <p>I build scalable web applications, high-performing Shopify stores, and intelligent AI-powered solutions.</p>
            <div className="button-row">
              <ButtonLink to="/projects">View My Work</ButtonLink>
              <CalendlyLink className="button button-secondary">Book a Call</CalendlyLink>
            </div>
            <TagList items={["React", "Node.js", "Python", "AI", "Shopify", ".NET", "Cloud"]} />
          </div>
          <div className="hero-visual">
            <img
              src={heroPortrait}
              alt="Usman Ali"
              className="portrait-placeholder"
            />
            <span className="float-tag tag-one">FULL-STACK</span>
            <span className="float-tag tag-two">SHOPIFY</span>
            <span className="float-tag tag-three">AI</span>
          </div>
          <div className="scroll-note">Scroll to explore <span>?</span></div>
        </section>

<section className="intro-strip">
  <h2>
    Building digital products that solve <em>real business problems.</em>
  </h2>

  <div className="stats-grid">
    <div className="stat">
      <strong>10+</strong>
      <span>Projects</span>
    </div>

    <div className="stat">
      <strong>2</strong>
      <span>Years Experience</span>
    </div>

    <div className="stat">
      <strong>10+</strong>
      <span>Technologies</span>
    </div>

    <div className="stat">
      <strong>3</strong>
      <span>Development Areas</span>
    </div>
  </div>
</section>

        <section className="section">
          <SectionLabel>01 — Services</SectionLabel>
          <div className="section-heading">
            <h2>WHAT I CAN<br /><em>BUILD FOR YOU.</em></h2>
            <p>Modern software solutions designed around performance, scalability and business goals.</p>
          </div>
          <ServiceList />
        </section>

        <section className="section about-preview">
          <SectionLabel>02 — About</SectionLabel>
          <div className="section-heading">
            <h2>A DEVELOPER WHO<br /><em>THINKS BEYOND CODE.</em></h2>
          </div>
          <div className="about-grid">
            <img src={aboutPortrait} alt="Usman Ali" className="about-image about-photo" />
            <div className="about-copy">
              <p className="lead">I&apos;m Usman Ali, a software developer focused on building modern digital products across web development, Shopify and AI engineering.</p>
              <p>My focus isn&apos;t simply writing code. It&apos;s understanding the problem, designing the right solution and building software that can grow with the people and business behind it.</p>
              <p className="pull-quote">Clean code. Thoughtful products. <em>Real impact.</em></p>
              <ButtonLink to="/about" secondary>More About Me</ButtonLink>
            </div>
          </div>
        </section>

        <section className="section skills-section">
          <SectionLabel>03 — Skills</SectionLabel>
          <div className="section-heading">
            <h2>MY SPECIAL<br /><em>SKILL FIELD.</em></h2>
            <p>A versatile technology toolkit, selected to fit the problem rather than follow the trend.</p>
          </div>
          <div className="skills-grid">
            {skillGroups.map(([title, ...skills], index) => (
              <article className="skill-group" key={title}>
                <div className="skill-title"><span>0{index + 1}</span><h3>{title}</h3></div>
                <div className="skill-items">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="section projects-section">
          <SectionLabel>04 — Selected Work</SectionLabel>
          <div className="section-heading">
            <h2>PROJECTS I&apos;VE<br /><em>BUILT.</em></h2>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project) => <ProjectCard project={project} key={project.slug} />)}
          </div>
          <div className="button-row projects-cta">
            <ButtonLink to="/projects" secondary>View All Projects</ButtonLink>
          </div>
        </section>

        <section className="section why-section">
          <SectionLabel>05 — Why Me</SectionLabel>
          <div className="why-layout">
            <div className="why-heading">
              <h2>WHY CLIENTS<br /><em>CHOOSE TO WORK WITH ME.</em></h2>
              <span className="why-count">04 <i>Principles</i></span>
            </div>
            <div className="why-grid why-feature-grid">
            {[
              ["Business Focused", "I focus on solving the actual business problem, not just writing code.", "?"],
              ["Modern Technology", "I use modern frameworks, APIs, AI tools and cloud technologies.", "?"],
              ["Performance First", "Fast, responsive and scalable experiences from the first release.", "?"],
              ["Long-Term Thinking", "Clean architecture that can evolve with the product.", "8"],
            ].map(([title, text, symbol], index) => (
              <article className={`why-card ${index === 0 ? "why-card-featured" : ""}`} key={title}>
                <div className="why-card-meta"><span>0{index + 1}</span><i aria-hidden="true">{symbol}</i></div><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
            </div>
          </div>
        </section>

        <section className="section process-section">
          <SectionLabel>06 — Process</SectionLabel>
          <div className="process-heading-row">
            <div className="section-heading">
              <h2>FROM IDEA<br /><em>TO PRODUCT.</em></h2>
            </div>
            <div className="process-summary"><span>01 — 05</span><p>One continuous process</p></div>
          </div>
          <div className="process-grid">
            {[
              ["Discover", "Understand goals, users and requirements.", "?"],
              ["Plan", "Define architecture, technology and roadmap.", "?"],
              ["Build", "Develop, test and iterate.", "?"],
              ["Launch", "Deploy, optimize and monitor.", "?"],
              ["Improve", "Continue improving based on real feedback.", "?"],
            ].map(([title, text, symbol], index) => (
              <article className={`process-step ${index === 0 ? "process-step-start" : ""} ${index === 4 ? "process-step-end" : ""}`} key={title}>
                <span className="process-dot">0{index + 1}</span>
                <span className="process-glyph" aria-hidden="true">{symbol}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section blog-preview">
          <SectionLabel>07 — Insights</SectionLabel>
          <div className="section-heading">
            <h2>LATEST TIPS<br /><em>&amp; TRICKS.</em></h2>
            <ButtonLink to="/blog" secondary>View All Articles</ButtonLink>
          </div>
          <div className="blog-grid">
            {articles.slice(0, 3).map((article) => <BlogCard article={article} key={article.slug} />)}
          </div>
        </section>
      </main>
    </>
  );
}

function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="DIGITAL PRODUCTS,"
        italic="BUILT RIGHT."
        description="I build robust web applications, intelligent AI solutions, high-performing Shopify experiences, APIs and cloud-ready systems—always shaped around real business goals."
      />
      <section className="section page-section">
        <div className="section-heading compact">
          <h2>SIX WAYS I CAN<br /><em>HELP YOU BUILD.</em></h2>
          <p>From early product thinking through deployment and iteration.</p>
        </div>
        <ServiceList />
      </section>
    </main>
  );
}

function ServiceDetailPage({ service }: { service: Service }) {
  const capabilities = serviceCapabilities[service.slug] ?? [];
  const related = getRelatedProjects(service);
  return (
    <main>
      <section className="detail-hero">
        <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/services">Services</Link><span>/</span><strong>{service.title}</strong></div>
        <div className="service-hero-grid"><div><span className="detail-number">{service.number} — Service</span>
        <h1>{service.title.toUpperCase()}<br /><em>BUILT AROUND YOUR GOALS.</em></h1>
        <p>{service.description}</p><div className="button-row"><CalendlyLink>Discuss Your Project</CalendlyLink><ButtonLink to="/projects" secondary>View Projects</ButtonLink></div></div>
        <aside className="service-stack"><SectionLabel>Tools & Technologies</SectionLabel><TagList items={service.tech} /></aside></div>
      </section>
      <section className="section service-capabilities"><div><SectionLabel>Capabilities / {service.number}</SectionLabel><h2>DETAILS THAT<br /><em>MAKE THE WORK.</em></h2></div><ol>{capabilities.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><p>{service.description}</p></li>)}</ol></section>
      <section className="section service-process-section">
        <SectionLabel>Process / From brief to launch</SectionLabel>
        <div className="service-timeline">
          {[["Discover", "Understand the goal and constraints."], ["Plan", "Agree on scope and technical direction."], ["Build", "Develop in clear, useful iterations."], ["Refine", "Review details and validate behavior."], ["Launch", "Ship and prepare for what comes next."]].map(([title, text], index) => (
            <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>
      <FAQSection compact />
      {related.length > 0 && <section className="section related-section">
        <SectionLabel>Related Projects</SectionLabel>
        <div className="project-grid">
          {related.map((project) => <ProjectCard project={project} key={project.slug} />)}
        </div>
      </section>}
    </main>
  );
}

function AboutPage() {
  return (
    <main>
      <section className="section about-profile-hero"><div className="about-profile-copy"><SectionLabel>About / 01</SectionLabel><h1>I BUILD DIGITAL EXPERIENCES THAT SOLVE REAL PROBLEMS.</h1><p>I&apos;m Usman Ali, a software developer focused on building modern digital products across web development, Shopify and AI engineering.</p><div className="button-row"><ButtonLink to="/projects">View Projects</ButtonLink><CalendlyLink>Book a Call</CalendlyLink></div><div className="about-role-row"><span>Frontend Developer</span><span>Shopify Developer</span><span>Software Developer</span></div></div><figure className="about-profile-photo"><img src={aboutPagePortrait} alt="Usman Ali" /><figcaption><strong>Usman Ali</strong><span>Developer / Digital products</span></figcaption><i aria-hidden="true" /></figure></section>
      <section className="section about-story"><div className="about-story-label"><SectionLabel>01 — Who I Am</SectionLabel></div><div className="about-story-copy"><p>I work across full-stack applications, Shopify commerce and AI-powered systems. I start by understanding the problem and the people around it, then make technical choices that serve the product.</p><p>My focus isn&apos;t simply writing code. It&apos;s designing a clear solution and building software that can grow with the people and business behind it.</p></div></section>
      <section className="section about-pillars"><div className="about-story-label"><SectionLabel>02 — How I Work</SectionLabel></div><ol className="about-principles"><li><span>01</span><strong>Think clearly</strong></li><li><span>02</span><strong>Build simply</strong></li><li><span>03</span><strong>Refine relentlessly</strong></li><li><span>04</span><strong>Ship intentionally</strong></li></ol></section>
      <section className="section about-journey"><div><SectionLabel>Toolbox / 03</SectionLabel><h2>TOOLS I USE<br /><em>WITH INTENTION.</em></h2></div><div><p>My work spans a growing range of technologies. I choose tools to suit the problem and keep learning through hands-on building.</p><TagList items={["React", "TypeScript", "Node.js", "Python", "Shopify", ".NET", "Azure", "AWS"]} /></div></section>
    </main>
  );
}

function ProjectsPage() {
  const filters = ["All", ...new Set(projects.map((project) => project.category))];
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <main>
      <PageHero
        eyebrow="Selected Work / 02"
        title="A SELECTION OF"
        italic="THINGS I’VE BUILT."
        description="Digital products and experiments across frontend, full-stack and Shopify development."
      />
      <section className="section page-section">
        <div className="filter-bar" aria-label="Filter projects">
          {filters.map((item) => (
            <button className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{item}</button>
          ))}
        </div>
        <div className="projects-page-grid">{visible[0] && <ProjectCard project={visible[0]} featured />}</div>
        <div className="editorial-project-list">{visible.slice(1).map((project, index) => <EditorialProject project={project} index={index} key={project.slug} />)}</div>
      </section>
    </main>
  );
}

function ProjectDetailPage({ project }: { project: Project }) {
  const nextIndex = (projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length;
  const next = projects[nextIndex];

  return (
    <main>
      <section className="case-hero">
        <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/projects">Projects</Link><span>/</span><strong>{project.title}</strong></div>
        <div className="case-title-row">
          <div><SectionLabel>{project.category} — Case Study</SectionLabel><h1>{project.title.toUpperCase()}</h1></div>
          <p>{project.description}</p>
        </div>
        {project.image ? (
          <img src={project.image} alt={project.imageAlt ?? `${project.title} preview`} className="case-hero-image project-detail-image" />
        ) : (
          <ImagePlaceholder label="[ADD PROJECT HERO IMAGE]" className="case-hero-image" />
        )}
      </section>
      <section className="section case-overview">
        <SectionLabel>Overview</SectionLabel>
        <p className="display-copy">{project.overview}</p>
        <div className="case-facts">
          <div><span>My Role</span><strong>{project.role}</strong></div>
          <div><span>Services</span><strong>{project.category}</strong></div>
          <div><span>Stack</span><strong>{project.tech.join(" · ")}</strong></div>
        </div>
      </section>
      <section className="dark-detail case-story">
        <div><SectionLabel>The Challenge</SectionLabel><h2>THE PROJECT<br /><em>CHALLENGE.</em></h2></div>
        <p>{project.challenge}</p>
      </section>
      <section className="section case-story">
        <div><SectionLabel>The Solution</SectionLabel><h2>THE APPROACH<br /><em>AND SOLUTION.</em></h2></div>
        <p>{project.solution}</p>
      </section>
      <section className="section">
        <SectionLabel>Key Features</SectionLabel>
        <div className="why-grid">
          {project.features.map((feature, index) => (
            <article key={`${feature.title}-${index}`}><span>0{index + 1}</span><h3>{feature.title}</h3><p>{feature.description}</p></article>
          ))}
        </div>
      </section>
      <section className="section screenshot-section">
        <SectionLabel>Screenshots</SectionLabel>
        <div className="screenshot-grid">
          {project.screenshots.length > 0 ? project.screenshots.map((screenshot, index) => (
            <img src={screenshot} alt={`${project.title} screenshot ${index + 1}`} key={screenshot} className="project-screenshot" />
          )) : <ImagePlaceholder label="[ADD PROJECT SCREENSHOTS]" />}
        </div>
      </section>
      {(project.liveUrl || project.githubUrl) && <section className="section results-section">
        <div><SectionLabel>Project Links</SectionLabel><h2>EXPLORE THE<br /><em>PROJECT.</em></h2></div>
        <div className="button-row">
          {project.liveUrl && <a className="button" href={project.liveUrl} target="_blank" rel="noreferrer"><span>Live Demo</span><Arrow /></a>}
          {project.githubUrl && <a className="button button-secondary" href={project.githubUrl} target="_blank" rel="noreferrer"><span>GitHub</span><Arrow /></a>}
        </div>
      </section>}
      <Link to={`/projects/${next.slug}`} className="next-project">
        <span>Next Project</span><strong>{next.title}</strong><span className="next-arrow">?</span>
      </Link>
    </main>
  );
}

function BlogPage() {
  const categories = ["All", ...new Set(articles.map((article) => article.category))];
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? articles : articles.filter((article) => article.category === category);
  const [featured, ...remaining] = visible;
  return (
    <main>
      <PageHero
        eyebrow="Notes / 04"
        title="THOUGHTS ON BUILDING"
        italic="BETTER DIGITAL PRODUCTS."
        description="Practical perspectives on software, AI, commerce and the decisions behind useful digital products."
      />
      {featured && <section className="section featured-article">
        <SectionLabel>Featured Article</SectionLabel>
        <div className="featured-grid">
          <ArticleArtwork article={featured} />
          <div>
            <span className="project-category">{featured.category} · {featured.time}</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <ButtonLink to={`/blog/${featured.slug}`} secondary>Read Article</ButtonLink>
          </div>
        </div>
      </section>}
      <section className="section">
        <div className="article-categories">
          {categories.map((item) => <button type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}
        </div>
        <div className="editorial-article-list">{remaining.map((article, index) => <EditorialArticle article={article} index={index} key={article.slug} />)}</div>
      </section>
    </main>
  );
}

function ArticlePage({ article }: { article: Article }) {
  return (
    <main>
      <article className="article-page">
        <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/blog">Blog</Link><span>/</span><strong>{article.category}</strong></div>
        <header className="article-header">
          <SectionLabel>{article.category}</SectionLabel>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div>{hasArticleDate(article) && <span>{article.date}</span>}<span>{article.time}</span><span>By Usman Ali</span></div>
        </header>
        <ArticleArtwork article={article} className="article-image" />
        <div className="article-body">
          <p className="article-lead">{article.excerpt}</p>
          <h2>Start with the problem, not the technology</h2>
          <p>Strong digital products begin with context. Before choosing a framework, service or architecture, clarify the user need and the business constraint. Technology becomes valuable when it serves that understanding.</p>
          <blockquote>“The best technical decision is the one that makes the product clearer, more reliable and easier to evolve.”</blockquote>
          <h2>Make complexity earn its place</h2>
          <p>Every layer of abstraction creates a maintenance cost. Build enough structure for the current problem and the most credible next step, but avoid designing for imaginary scale.</p>
          <pre><code>{`// Clear intent over clever abstraction
const solution = understand(problem)
  .then(plan)
  .then(build)
  .then(improve);`}</code></pre>
          <h2>Build for the people after you</h2>
          <p>Readable code, concise documentation and predictable patterns are part of the product. They help future teams move quickly and make better decisions with confidence.</p>
          <Link to="/blog" className="text-link">? Back to Blog</Link>
        </div>
      </article>
      <section className="section related-articles">
        <SectionLabel>Related Articles</SectionLabel>
        <div className="blog-grid">
          {articles.filter((item) => item.slug !== article.slug).slice(0, 3).map((item) => <BlogCard article={item} key={item.slug} />)}
        </div>
      </section>
    </main>
  );
}

const faqItems = [
  ["What type of projects do you work on?", "I work on full-stack web applications, AI-powered products, Shopify stores and customizations, APIs, .NET systems and cloud-ready digital products."],
  ["Do you work with startups?", "Yes. I can support startups from early product definition through implementation, launch and iteration."],
  ["Can you build custom Shopify solutions?", "Yes. This includes custom themes, Shopify Plus work, app integrations, API connections and performance optimization."],
  ["Can you integrate AI into an existing application?", "Yes. I can identify practical AI opportunities and integrate model APIs, automation and intelligent workflows into an existing product."],
  ["Do you provide API development?", "Yes. I build reliable REST APIs, authentication systems, database integrations and connections to third-party services."],
  ["Do you work with .NET / C#?", "Yes. I work with C#, ASP.NET Core, Entity Framework Core, SQL and the wider modern .NET ecosystem."],
  ["How does your development process work?", "The process moves through discovery, planning, building, launch and continued improvement—with clear communication throughout."],
  ["How can I start a project with you?", "Visit the contact page and share a short overview of what you are building, your priorities and where you need support."],
];

function FAQSection({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<number[]>(compact ? [0] : [0, 1]);
  const displayed = compact ? faqItems.slice(0, 4) : faqItems;

  const toggle = (index: number) => {
    setOpen((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <section className={`section faq-section ${compact ? "compact-faq" : ""}`}>
      {!compact && <div className="faq-page-heading"><SectionLabel>Frequently Asked Questions</SectionLabel><h1>QUESTIONS BEFORE<br /><em>WE BUILD?</em></h1><p>Clear answers about the work, collaboration and what happens next.</p></div>}
      {compact && <SectionLabel>Frequently Asked Questions</SectionLabel>}
      <div className="faq-grid">
        <div className="faq-intro"><h2>{compact ? <>GOOD QUESTIONS.<br /><em>CLEAR ANSWERS.</em></> : <>LET&apos;S CLEAR<br /><em>THINGS UP.</em></>}</h2>{!compact && <><p>Have a question that isn&apos;t covered here? Tell me a little about what you have in mind.</p><CalendlyLink>Book a Call</CalendlyLink></>}</div>
        <div className="accordion">
          {displayed.map(([question, answer], index) => {
            const expanded = open.includes(index);
            const answerId = `faq-answer-${compact ? "compact-" : ""}${index}`;
            return (
              <article className={expanded ? "is-open" : ""} key={question}>
                <button id={`${answerId}-trigger`} onClick={() => toggle(index)} aria-expanded={expanded} aria-controls={answerId}>
                  <span className="faq-question-number">{String(index + 1).padStart(2, "0")}</span><span>{question}</span><strong>{expanded ? "−" : "+"}</strong>
                </button>
                <div className="accordion-answer" id={answerId} role="region" aria-labelledby={`${answerId}-trigger`}><p>{answer}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQPage() {
  return (
    <main>
      <FAQSection />
    </main>
  );
}

function ContactPage() {
  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmittingState, setIsSubmittingState] = useState(false);
  const isSubmitting = useRef(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting.current) return;

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
    if (!accessKey) {
      setFormFeedback({
        type: "error",
        message: "The contact form is not configured yet. Please email dev.usman11@gmail.com directly.",
      });
      return;
    }

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.access_key = accessKey;
    payload.subject = "New project inquiry from Usman Ali's portfolio";

    isSubmitting.current = true;
    setIsSubmittingState(true);
    setFormFeedback(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result: { success?: boolean; message?: string } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Web3Forms could not accept this submission.");
      }

      form.reset();
      setFormFeedback({
        type: "success",
        message: "Thanks! Your project inquiry has been sent. I'll get back to you shortly.",
      });
    } catch {
      setFormFeedback({
        type: "error",
        message: "Sorry, your inquiry could not be sent. Please try again, or email dev.usman11@gmail.com directly.",
      });
    } finally {
      isSubmitting.current = false;
      setIsSubmittingState(false);
    }
  };

  return (
    <main>
      <section className="section contact-grid contact-layout">
        <aside className="contact-aside contact-intro">
          <div className="contact-intro-top">
            <SectionLabel>Contact</SectionLabel>
            <span className="contact-availability"><i /> Open to select projects</span>
          </div>
          <h1>LET&apos;S BUILD<br /><em>SOMETHING<br />GREAT.</em></h1>
          <p className="contact-intro-copy">Have a product, platform, or idea in mind? Tell me what you&apos;re building and where you need a hand.</p>
          <CalendlyLink />
          <div className="contact-note">
            <span>A focused conversation is a good place to start.</span>
            <strong>Usually replies within 1–2 business days</strong>
          </div>
        </aside>
        <form className="contact-form" onSubmit={onSubmit} aria-busy={isSubmittingState}>
          <div className="contact-form-heading">
            <div>
              <SectionLabel>Project inquiry</SectionLabel>
              <p>Share a few details and I&apos;ll follow up soon.</p>
            </div>
            <span>01 — 05</span>
          </div>
          <div className="form-row contact-fields-row">
            <label><span className="contact-field-label">Name</span><input required name="name" autoComplete="name" placeholder="Your name" /></label>
            <label><span className="contact-field-label">Email</span><input required type="email" name="email" autoComplete="email" placeholder="you@company.com" /></label>
          </div>
          <div className="form-row contact-fields-row">
            <label><span className="contact-field-label">Company <em>(optional)</em></span><input name="company" autoComplete="organization" placeholder="Company or project" /></label>
            <label>
              <span className="contact-field-label">Project Type</span>
              <span className="contact-select-wrap">
                <select name="projectType" defaultValue="" required>
                  <option value="" disabled>Select a service</option>
                  {services.map((service) => <option key={service.slug}>{service.title}</option>)}
                </select>
                <i aria-hidden="true">?</i>
              </span>
            </label>
          </div>
          <label className="contact-message-field"><span className="contact-field-label">Message</span><textarea required name="message" rows={5} placeholder="Tell me about the project, problem and priorities..." /></label>
          <button className="button submit-button" type="submit" disabled={isSubmittingState}>
            <span>{isSubmittingState ? "Sending Inquiry…" : "Send Project Inquiry"}</span>
            <span aria-hidden="true">{isSubmittingState ? "···" : "?"}</span>
          </button>
          {formFeedback && (
            <p
              className={`form-feedback form-${formFeedback.type}`}
              role={formFeedback.type === "error" ? "alert" : "status"}
              aria-live={formFeedback.type === "error" ? "assertive" : "polite"}
            >
              {formFeedback.message}
            </p>
          )}
        </form>
      </section>
      <section className="section connect-section">
        <div className="connect-heading">
          <div>
            <SectionLabel>Connect</SectionLabel>
            <h2>Find me <em>elsewhere.</em></h2>
          </div>
          <p>Choose the channel that works best for you.</p>
        </div>
        <div className="connect-grid">
          {[
            ["email", "Email", "dev.usman11@gmail.com", "mailto:dev.usman11@gmail.com", "@"],
            ["github", "GitHub", "GitHub Profile", "https://github.com/MUGHAL-66", "GH"],
            ["linkedin", "LinkedIn", "LinkedIn Profile", "https://www.linkedin.com/in/usmanali66/", "in"],
            ["whatsapp", "WhatsApp", "Chat on WhatsApp", "https://wa.me/923107243590", "?"],
          ].map(([kind, label, value, href, symbol]) => (
            <a className="connect-card" href={href} key={kind} target={kind === "email" ? undefined : "_blank"} rel={kind === "email" ? undefined : "noopener noreferrer"}>
              <span className={`connect-icon connect-icon-${kind}`} aria-hidden="true">{symbol}</span>
              <span className="connect-copy"><span>{label}</span><strong>{value}</strong></span>
              <span className="connect-card-arrow"><Arrow /></span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found">
      <SectionLabel>404 — Page not found</SectionLabel>
      <h1>LOST IN THE<br /><em>CODEBASE?</em></h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <ButtonLink to="/">Return Home</ButtonLink>
    </main>
  );
}

function RouteView({ path }: { path: string }) {
  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const service = services.find((item) => item.slug === serviceMatch[1]);
    return service ? <ServiceDetailPage service={service} /> : <NotFoundPage />;
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const project = projects.find((item) => item.slug === projectMatch[1]);
    return project ? <ProjectDetailPage project={project} /> : <NotFoundPage />;
  }

  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = articles.find((item) => item.slug === articleMatch[1]);
    return article ? <ArticlePage article={article} /> : <NotFoundPage />;
  }

  switch (path) {
    case "/": return <HomePage />;
    case "/services": return <ServicesPage />;
    case "/about": return <AboutPage />;
    case "/projects": return <ProjectsPage />;
    case "/blog": return <BlogPage />;
    case "/faq": return <FAQPage />;
    case "/contact": return <ContactPage />;
    default: return <NotFoundPage />;
  }
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname.replace(/\/+$/, "") || "/");

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname.replace(/\/+$/, "") || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Usman Ali — Full-Stack Developer, Shopify Expert & AI Engineer",
      "/services": "Services — Usman Ali",
      "/about": "About — Usman Ali",
      "/projects": "Projects — Usman Ali",
      "/blog": "Insights — Usman Ali",
      "/faq": "FAQ — Usman Ali",
      "/contact": "Contact — Usman Ali",
    };
    document.title = titles[path] || `${path.includes("/blog/") ? "Article" : "Case Study"} — Usman Ali`;
  }, [path]);

  return (
    <div className="site">
      <Header />
      <RouteView path={path} />
      <Footer />
    </div>
  );
}


