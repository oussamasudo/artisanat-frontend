'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Sparkles, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// ── Hook mobile ───────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

export default function HomePage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const timelineRef = useRef(null)
  const isTimelineInView = useInView(timelineRef, { once: true, margin: '-100px' })
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const crafts = [
    { name: 'Babouche', desc: 'Chaussure traditionnelle emblématique du Maroc, portée depuis des siècles dans les médinas.', heritage: '10+ siècles', icon: '🥿' },
    { name: 'Bijoux Berbères', desc: "Bijoux berbères symbolisant la richesse culturelle et l'identité des tribus marocaines.", heritage: '8+ siècles', icon: '💎' },
    { name: 'Poterie', desc: 'Art ancestral développé notamment à Safi, reflétant le savoir-faire marocain.', heritage: '12+ siècles', icon: '🏺' },
    { name: 'Tapis Berbère', desc: "Tissés à la main, ils racontent l'histoire et les traditions des femmes berbères.", heritage: '11+ siècles', icon: '🧵' },
    { name: 'Zellige', desc: 'Mosaïque géométrique raffinée décorant palais, fontaines et mosquées marocaines.', heritage: '9+ siècles', icon: '🟦' },
  ]

  const testimonials = [
    {
      name: 'Yasmine El Fassi',
      role: 'Conservatrice au Musée de Fès',
      avatar: 'Y',
      text: "Heritage AI m'a permis d'identifier en quelques secondes des pièces que j'aurais mis des heures à cataloguer. Un outil indispensable pour la préservation du patrimoine.",
      craft: 'Zellige',
      stars: 5,
    },
    {
      name: 'Pierre Dumont',
      role: 'Collectionneur, Paris',
      avatar: 'P',
      text: "J'ai découvert que le tapis acheté au souk était un authentique Taznakht du 19e siècle. La précision culturelle de l'analyse est bluffante.",
      craft: 'Tapis Berbère',
      stars: 5,
    },
    {
      name: 'Amina Bensouda',
      role: 'Professeure d\'histoire de l\'art, Rabat',
      avatar: 'A',
      text: "Un pont magnifique entre la technologie moderne et notre héritage ancestral. Mes étudiants l'utilisent désormais en cours.",
      craft: 'Poterie',
      stars: 5,
    },
    {
      name: 'Karim Tazi',
      role: 'Artisan maroquinier, Marrakech',
      avatar: 'K',
      text: "En tant qu'artisan, c'est émouvant de voir mon métier reconnu et valorisé par l'intelligence artificielle. Heritage AI honore notre tradition.",
      craft: 'Babouche',
      stars: 5,
    },
  ]

  const timeline = [
    {
      century: 'Xe siècle',
      year: '~980',
      title: 'Naissance du Zellige',
      desc: 'Les premiers ateliers de zellige apparaissent à Fès sous la dynastie des Idrissides, ornant les premières grandes mosquées.',
      icon: '🟦',
      side: 'left',
    },
    {
      century: 'XIe siècle',
      year: '~1050',
      title: 'Poterie de Safi',
      desc: 'Safi devient le centre névralgique de la poterie marocaine. Les techniques de cuisson et d\'émaillage atteignent une perfection remarquable.',
      icon: '🏺',
      side: 'right',
    },
    {
      century: 'XIIe siècle',
      year: '~1150',
      title: 'Tapis Berbères',
      desc: 'Les femmes berbères de l\'Atlas codifient les motifs géométriques dans leurs tissages, chaque symbole portant une signification spirituelle.',
      icon: '🧵',
      side: 'left',
    },
    {
      century: 'XIIIe siècle',
      year: '~1250',
      title: 'Bijoux de l\'Atlas',
      desc: "Les orfèvres berbères développent des techniques d'argenterie uniques. Les fibules et colliers deviennent marqueurs d'identité tribale.",
      icon: '💎',
      side: 'right',
    },
    {
      century: 'XIVe siècle',
      year: '~1350',
      title: 'Babouche de Fès',
      desc: "Les cordonniers de Fès perfectionnent la babouche en cuir tanné à la méthode ancestrale. La médina de Fès devient capitale mondiale du cuir.",
      icon: '🥿',
      side: 'left',
    },
    {
      century: 'Aujourd\'hui',
      year: '2026',
      title: 'Heritage AI',
      desc: "L'intelligence artificielle au service du patrimoine : chaque artisanat reconnu, chaque tradition préservée pour les générations futures.",
      icon: '◆',
      side: 'right',
      highlight: true,
    },
  ]

  const prev = () => setActiveTestimonial(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setActiveTestimonial(i => (i + 1) % testimonials.length)

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        :root {
          --terracotta: #C4622D;
          --terracotta-light: #E07A4F;
          --terracotta-dark: #8B3D18;
          --sand: #F5EDD8;
          --sand-deep: #EBD9B4;
          --gold: #B8882A;
          --gold-light: #D4A94A;
          --ink: #1A1208;
          --cream: #FAF6EE;
          --muted: #8C7355;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; font-size: 18px; }
        body { background: var(--cream); color: var(--ink); font-family: 'Jost', sans-serif; font-weight: 300; overflow-x: hidden; }

        .zellige-bg {
          background-color: var(--terracotta-dark);
          background-image:
            repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 90deg, rgba(255,255,255,0.03) 90deg 180deg),
            radial-gradient(circle at 25% 25%, rgba(212,169,74,0.15) 0%, transparent 60%),
            radial-gradient(circle at 75% 75%, rgba(196,98,45,0.2) 0%, transparent 60%);
        }
        .pattern-overlay {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0zM30 10L50 30L30 50L10 30L30 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .gold-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }

        .craft-card { background: white; border: 1px solid rgba(184,136,42,0.15); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .craft-card:hover { border-color: rgba(184,136,42,0.35); box-shadow: 0 20px 60px rgba(196,98,45,0.12), 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-5px) scale(1.04) rotate(1deg); }
        .craft-name { transition: color 0.3s ease; }
        .craft-card:hover .craft-name { color: var(--terracotta); }
        .craft-desc { transition: color 0.3s ease, opacity 0.3s ease; opacity: 0.75; }
        .craft-card:hover .craft-desc { color: var(--ink); opacity: 1; }

        .btn-primary { background: var(--terracotta); color: white; border: none; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.85rem; }
        .btn-primary:hover { background: var(--terracotta-dark); box-shadow: 0 8px 30px rgba(196,98,45,0.35); transform: translateY(-2px); }

        .btn-outline { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.85rem; padding: 1rem 2rem; border-radius: 2px; }
        .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.1); }

        .section-label { font-size: 0.78rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); font-weight: 500; display: block; }

        .nav-link { font-size: 0.82rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; font-family: 'Jost', sans-serif; }
        .nav-link:hover { color: var(--terracotta); }

        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .shimmer-text {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, #F5D78A 50%, var(--gold-light) 60%, var(--gold) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .stats-item { border-right: 1px solid rgba(184,136,42,0.25); padding: 0 3rem; flex: 1; text-align: center; }
        .stats-item:last-child { border-right: none; }
        .stats-item:first-child { padding-left: 0; }

        /* Timeline line pulse */
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196,98,45,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(196,98,45,0); }
        }
        .timeline-dot-active { animation: pulseDot 2s ease-in-out infinite; }

        /* Testimonial card */
        .testi-nav-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(184,136,42,0.3);
          background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s;
          color: var(--muted);
        }
        .testi-nav-btn:hover { border-color: var(--terracotta); color: var(--terracotta); background: rgba(196,98,45,0.04); }

        @media (max-width: 768px) {
          /* ── Général ── */
          nav { display: none; }
          header > div > div { flex-direction: column; align-items: flex-start; gap: 1rem; }
          header .btn-primary { width: 100%; justify-content: center; }
          .stats-container { flex-direction: column; }
          .stats-item { border-right: none; border-bottom: 1px solid rgba(184,136,42,0.2); padding: 1.5rem 0; }
          section { padding: 3rem 1rem !important; }
          h2 { font-size: 2.2rem !important; }

          /* ── Timeline : colonne verticale avec ligne à gauche ── */
          .timeline-center-line { display: none !important; }

          .timeline-grid {
            display: flex !important;
            flex-direction: column !important;
            padding-left: 1.5rem !important;
            border-left: 2px solid rgba(184,136,42,0.4) !important;
            gap: 0 !important;
          }

          .timeline-row {
            display: block !important;
            position: relative !important;
            min-height: unset !important;
            margin-bottom: 1rem !important;
          }

          .timeline-row::before {
            content: '';
            position: absolute;
            left: -2.1rem;
            top: 1.4rem;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--gold);
            border: 2px solid white;
            box-shadow: 0 0 0 3px rgba(184,136,42,0.2);
          }

          .timeline-cell-dot { display: none !important; }

          .timeline-cell-left,
          .timeline-cell-right {
            display: block !important;
            visibility: visible !important;
            padding: 0 0 0 0.5rem !important;
            text-align: left !important;
          }

          /* ── Témoignages ── */
          .testi-card { padding: 1.6rem 1.2rem !important; }
          .testi-quote-icon { display: none !important; }
          .testi-text { font-size: 1rem !important; line-height: 1.7 !important; margin-bottom: 1.4rem !important; }
          .testi-author { flex-wrap: wrap !important; gap: 0.8rem !important; }
          .testi-craft-badge { margin-left: 0 !important; }
          .testi-nav { flex-direction: column-reverse !important; align-items: center !important; gap: 1rem !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

        {/* TOP BAR */}
        {!isMobile && (
          <div style={{ background: 'var(--ink)', padding: '9px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
              ✦ Préservation du patrimoine artisanal marocain par l'intelligence artificielle ✦
            </p>
          </div>
        )}

        {/* HEADER */}
        <header style={{ background: 'white', borderBottom: '1px solid rgba(184,136,42,0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 38, height: 38, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: '1rem' }}>◆</span>
                </div>
                <div>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1, fontFamily: 'Cormorant Garamond, serif' }}>Heritage AI</h1>
                  <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Artisanat Marocain</p>
                </div>
              </div>

              {/* Nav — desktop only */}
              {!isMobile && (
                <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                  <a href="#" className="nav-link">Accueil</a>
                  <a href="#artisanat" className="nav-link">Artisanat</a>
                  <a href="#timeline" className="nav-link">Histoire</a>
                  <a href="#apropos" className="nav-link">À propos</a>
                </nav>
              )}

              {/* CTA button */}
              <button
                className="btn-primary"
                onClick={() => router.push('/classifier')}
                style={{
                  padding: isMobile ? '0.75rem 1rem' : '0.85rem 2rem',
                  borderRadius: 2,
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: isMobile ? '0.72rem' : '0.85rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {isMobile ? 'Classifier' : 'Classifier une Œuvre'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
          <div className="zellige-bg pattern-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, var(--cream), transparent)', zIndex: 1 }} />
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem', position: 'relative', zIndex: 2, width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '5rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: 'easeOut' }} style={{ color: 'white' }}>
                <span className="section-label" style={{ marginBottom: '1.5rem', opacity: 0.9 }}>✦ Intelligence Artificielle & Patrimoine</span>
                <h2 style={{ fontSize: 'clamp(3.2rem, 5.5vw, 5rem)', lineHeight: 1.1, fontWeight: 600, marginBottom: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
                  L'Art Ancestral<br />
                  <span className="shimmer-text" style={{ fontStyle: 'italic' }}>Marocain</span><br />
                  Révélé par l'IA
                </h2>
                <div className="gold-divider" style={{ marginBottom: '1.5rem', width: 80 }} />
                <p style={{ fontSize: '1.15rem', lineHeight: 1.9, opacity: 0.88, marginBottom: '2.5rem', maxWidth: 480, fontWeight: 300 }}>
                  Explorez des siècles de savoir-faire artisanal à travers une analyse culturelle intelligente. Chaque œuvre porte en elle l'âme d'une civilisation millénaire.
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" onClick={() => router.push('/classifier')} style={{ padding: '1.1rem 2.4rem', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={16} />Lancer le Classificateur<ArrowRight size={15} />
                  </motion.button>
                  <button className="btn-outline" onClick={() => document.getElementById('artisanat')?.scrollIntoView({ behavior: 'smooth' })}>
                    En savoir plus
                  </button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.2 }} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -16, left: -16, right: -16, bottom: -16, border: '1px solid rgba(212,169,74,0.4)', borderRadius: 4, zIndex: 0 }} />
                <div style={{ position: 'absolute', top: -8, left: -8, right: -8, bottom: -8, border: '1px solid rgba(212,169,74,0.2)', borderRadius: 3, zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1, borderRadius: 4, overflow: 'hidden', height: 'clamp(280px, 50vw, 520px)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(196,98,45,0.3), rgba(27,79,114,0.2))', zIndex: 1 }} />
                  <Image src="/moroccan-hero.jpg" alt="Artisanat marocain traditionnel" fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, background: 'linear-gradient(to top, rgba(26,18,8,0.9), transparent)', padding: '2.5rem 1.8rem 1.8rem' }}>
                    <p style={{ color: 'white', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 300, fontFamily: 'Cormorant Garamond, serif' }}>
                      "Chaque fil, chaque motif — une histoire transmise de mains en mains"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div style={{ background: 'var(--ink)', padding: '3rem 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="stats-container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { num: '5', label: 'Artisanats Classifiés' },
                { num: '12+', label: 'Siècles de Tradition' },
                { num: '98%', label: "Précision de l'IA" },
                { num: '10K+', label: 'Œuvres Analysées' },
              ].map((stat, i) => (
                <div key={i} className="stats-item">
                  <p className="shimmer-text" style={{ fontSize: '2.6rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>{stat.num}</p>
                  <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRAFTS SECTION */}
        <section id="artisanat" style={{ padding: '7rem 0', background: 'var(--sand)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="section-label" style={{ marginBottom: '1rem' }}>✦ Notre Collection ✦</span>
              <h3 style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, fontFamily: 'Cormorant Garamond, serif' }}>
                Les Trésors de l'Artisanat<br /><span style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>Marocain</span>
              </h3>
              <div className="gold-divider" style={{ margin: '1.5rem auto', width: 120 }} />
              <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 620, margin: '0 auto', lineHeight: 1.9 }}>
                Chaque artisanat représente des générations de savoir transmis et d'expression culturelle unique
              </p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {crafts.map((craft, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.2 }} whileHover={{ scale: 1.08, rotate: 1 }} className="craft-card" style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', padding: '1.6rem' }}>
                  <motion.div whileHover={{ scale: 1.25 }} transition={{ type: 'spring', stiffness: 300 }} style={{ fontSize: '2.8rem', marginBottom: '1rem', lineHeight: 1, display: 'inline-block' }}>{craft.icon}</motion.div>
                  <h4 className="craft-name" style={{ fontSize: '1.4rem', color: 'var(--ink)', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.6rem' }}>{craft.name}</h4>
                  <p className="craft-desc" style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.75 }}>{craft.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TIMELINE HISTORIQUE
        ═══════════════════════════════════════════════ */}
        <section id="timeline" style={{ padding: '8rem 0', background: 'white', overflow: 'hidden' }} ref={timelineRef}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <span className="section-label" style={{ marginBottom: '1rem' }}>✦ À Travers les Âges ✦</span>
              <h3 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, fontFamily: 'Cormorant Garamond, serif' }}>
                Dix Siècles de<br />
                <span style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>Savoir-Faire</span>
              </h3>
              <div className="gold-divider" style={{ margin: '1.5rem auto', width: 100 }} />
              <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.9 }}>
                Une odyssée à travers les siècles qui ont façonné l'artisanat marocain
              </p>
            </motion.div>

            {/* Timeline container */}
            <div style={{ position: 'relative' }}>

              {isMobile ? (
                /* ── MOBILE: vertical list with left border ── */
                <div style={{
                  paddingLeft: '1.8rem',
                  borderLeft: '2px solid rgba(184,136,42,0.35)',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                }}>
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isTimelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      style={{ position: 'relative' }}
                    >
                      {/* Dot on the left line */}
                      <div style={{
                        position: 'absolute',
                        left: '-2.05rem',
                        top: '1.3rem',
                        width: 12, height: 12,
                        borderRadius: item.highlight ? 2 : '50%',
                        background: item.highlight ? 'var(--terracotta)' : 'var(--gold)',
                        border: '2px solid white',
                        boxShadow: '0 0 0 3px rgba(184,136,42,0.2)',
                        transform: item.highlight ? 'rotate(45deg)' : undefined,
                      }} />
                      <TimelineCard item={item} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* ── DESKTOP: alternating left/right ── */
                <>
                  {/* Central vertical line */}
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, transform: 'translateX(-50%)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isTimelineInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 2, ease: 'easeInOut' }}
                      style={{ height: '100%', background: 'linear-gradient(to bottom, transparent, var(--gold), var(--terracotta), var(--gold), transparent)', transformOrigin: 'top' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: item.side === 'left' ? -50 : 50 }}
                        animate={isTimelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: item.side === 'left' ? -50 : 50 }}
                        transition={{ duration: 0.7, delay: index * 0.2 }}
                        style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', alignItems: 'center', minHeight: 120 }}
                      >
                        {/* Left cell */}
                        <div style={{ padding: '1.5rem 2.5rem 1.5rem 0', textAlign: 'right', visibility: item.side === 'left' ? 'visible' : 'hidden' }}>
                          {item.side === 'left' && <TimelineCard item={item} />}
                        </div>
                        {/* Center dot */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                          <div
                            className={item.highlight ? 'timeline-dot-active' : ''}
                            style={{
                              width: item.highlight ? 48 : 38, height: item.highlight ? 48 : 38,
                              borderRadius: item.highlight ? 4 : '50%',
                              background: item.highlight ? 'var(--terracotta)' : 'white',
                              border: item.highlight ? 'none' : '2px solid var(--gold)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: item.highlight ? '0.9rem' : '1.3rem',
                              boxShadow: item.highlight ? '0 8px 24px rgba(196,98,45,0.4)' : '0 2px 12px rgba(184,136,42,0.2)',
                              color: item.highlight ? 'white' : undefined,
                              transform: item.highlight ? 'rotate(45deg)' : undefined,
                            }}
                          >
                            <span style={{ transform: item.highlight ? 'rotate(-45deg)' : undefined }}>{item.icon}</span>
                          </div>
                        </div>
                        {/* Right cell */}
                        <div style={{ padding: '1.5rem 0 1.5rem 2.5rem', textAlign: 'left', visibility: item.side === 'right' ? 'visible' : 'hidden' }}>
                          {item.side === 'right' && <TimelineCard item={item} />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ABOUT / HOW IT WORKS */}
        <section style={{ padding: '7rem 0', background: 'var(--sand)' }} id="apropos">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '6rem', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, left: 20, right: -20, bottom: -20, background: 'var(--sand-deep)', borderRadius: 4, zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1, height: 500, borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(196,98,45,0.15)' }}>
                  <Image src="/moroccan-craft.jpg" alt="Artisan marocain au travail" fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', bottom: 40, right: -30, zIndex: 2, background: 'var(--terracotta)', color: 'white', padding: '1.4rem 1.8rem', borderRadius: 4, boxShadow: '0 12px 40px rgba(196,98,45,0.3)' }}>
                  <p style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1, fontFamily: 'Cormorant Garamond, serif' }}>98%</p>
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>Précision</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <span className="section-label" style={{ marginBottom: '1rem' }}>✦ Notre Technologie</span>
                <h3 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
                  Intelligence Culturelle<br />
                  <span style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>au Service du Patrimoine</span>
                </h3>
                <div className="gold-divider" style={{ marginBottom: '1.5rem', width: 80 }} />
                <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                  Notre plateforme combine l'analyse avancée par deep learning avec une érudition culturelle approfondie pour offrir des insights authentiques.
                </p>
                {[
                  { n: '01', title: 'Photographiez', desc: 'Capturez votre objet artisanal sous un bon éclairage' },
                  { n: '02', title: 'Analysez', desc: "L'IA identifie l'artisanat avec 98% de précision" },
                  { n: '03', title: 'Découvrez', desc: "Accédez à l'histoire et au patrimoine culturel associés" },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.3rem', alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 48, height: 48, border: '1.5px solid var(--terracotta)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--terracotta)', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>{step.n}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 3, fontFamily: 'Jost, sans-serif' }}>{step.title}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" onClick={() => router.push('/classifier')} style={{ padding: '1.1rem 2.2rem', borderRadius: 2, marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Classifier votre Découverte <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TÉMOIGNAGES
        ═══════════════════════════════════════════════ */}
        <section style={{ padding: '8rem 0', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative background */}
          <div className="pattern-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <div style={{ position: 'absolute', top: '20%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,98,45,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,136,42,0.06) 0%, transparent 70%)' }} />

          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="section-label" style={{ marginBottom: '1rem', color: 'rgba(212,169,74,0.9)' }}>✦ Ils Nous Font Confiance ✦</span>
              <h3 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 600, color: 'white', lineHeight: 1.2, fontFamily: 'Cormorant Garamond, serif' }}>
                Voix du<br />
                <span className="shimmer-text" style={{ fontStyle: 'italic' }}>Patrimoine</span>
              </h3>
              <div className="gold-divider" style={{ margin: '1.5rem auto', width: 100 }} />
            </motion.div>

            {/* Testimonial carousel */}
            <div style={{ position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="testi-card"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(184,136,42,0.2)',
                    borderRadius: 4,
                    padding: '3.5rem',
                    position: 'relative',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Quote mark */}
                  <div className="testi-quote-icon" style={{ position: 'absolute', top: '2rem', right: '2.5rem', opacity: 0.12 }}>
                    <Quote size={64} color="var(--gold)" />
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: '1.8rem' }}>
                    {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => (
                      <span key={i} style={{ color: 'var(--gold-light)', fontSize: '1rem' }}>★</span>
                    ))}
                  </div>

                  {/* Text */}
                  <p
                    className="testi-text"
                    style={{
                      fontSize: 'clamp(1rem, 2vw, 1.35rem)',
                      color: 'rgba(255,255,255,0.88)',
                      lineHeight: 1.85,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      marginBottom: '2.5rem',
                      position: 'relative', zIndex: 1,
                    }}
                  >
                    "{testimonials[activeTestimonial].text}"
                  </p>

                  {/* Author */}
                  <div className="testi-author" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{
                      width: 48, height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 600,
                      color: 'white', fontFamily: 'Cormorant Garamond, serif',
                      border: '2px solid rgba(212,169,74,0.3)',
                      flexShrink: 0,
                    }}>
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'white', fontFamily: 'Jost, sans-serif', marginBottom: 3 }}>
                        {testimonials[activeTestimonial].name}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', fontFamily: 'Jost' }}>
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                    <div className="testi-craft-badge" style={{ marginLeft: 'auto' }}>
                      <span style={{
                        fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'var(--gold)', border: '1px solid rgba(184,136,42,0.35)',
                        padding: '4px 10px', borderRadius: 2, fontFamily: 'Jost',
                        whiteSpace: 'nowrap',
                      }}>
                        {testimonials[activeTestimonial].craft}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="testi-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                {/* Dots */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      style={{
                        width: i === activeTestimonial ? 28 : 8,
                        height: 8, borderRadius: 4,
                        background: i === activeTestimonial ? 'var(--gold)' : 'rgba(184,136,42,0.25)',
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Arrow buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={prev} className="testi-nav-btn">
                    <ChevronLeft size={17} />
                  </button>
                  <button onClick={next} className="testi-nav-btn">
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </div>

            {/* Testimonial count */}
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontFamily: 'Jost' }}>
              {activeTestimonial + 1} / {testimonials.length}
            </p>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="zellige-bg pattern-overlay" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '8rem 2rem', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="section-label" style={{ marginBottom: '1.5rem', opacity: 0.9 }}>✦ Commencez Maintenant ✦</span>
              <h3 style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', color: 'white', fontWeight: 600, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
                Prêt à Explorer<br />
                <span className="shimmer-text" style={{ fontStyle: 'italic' }}>l'Artisanat Marocain ?</span>
              </h3>
              <div className="gold-divider" style={{ margin: '0 auto 2rem', width: 120 }} />
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.78)', maxWidth: 560, margin: '0 auto 3rem', lineHeight: 1.9, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
                Utilisez notre classificateur IA pour identifier et en apprendre davantage sur les artisanats marocains authentiques
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/classifier')} style={{ background: 'white', color: 'var(--terracotta)', border: 'none', padding: '1.2rem 3rem', borderRadius: 2, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <Sparkles size={16} />Lancer le Classificateur IA<ArrowRight size={15} />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: 'var(--ink)', color: 'white', padding: '5rem 0 2.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.2rem' }}>
                  <div style={{ width: 34, height: 34, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <span style={{ color: 'white', fontSize: '0.9rem' }}>◆</span>
                  </div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>Heritage AI</h4>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, maxWidth: 280 }}>
                  Préserver et partager les traditions artisanales marocaines grâce à l'intelligence artificielle.
                </p>
                <div className="gold-divider" style={{ marginTop: '1.5rem', width: 60 }} />
              </div>
              {[
                { title: 'Artisanats', links: ['Babouche', 'Bijoux Berbères', 'Poterie', 'Tapis', 'Zellige'] },
                { title: 'Explorer', links: ['À propos', 'Timeline', 'Blog', 'Galerie'] },
                { title: 'Support', links: ['Contact', 'FAQ', 'Confidentialité', 'Conditions'] },
              ].map((col, i) => (
                <div key={i}>
                  <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.2rem', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>{col.title}</h5>
                  <ul style={{ listStyle: 'none' }}>
                    {col.links.map((link, j) => (
                      <li key={j} style={{ marginBottom: '0.65rem' }}>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontFamily: 'Jost, sans-serif' }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="gold-divider" style={{ marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', fontFamily: 'Jost, sans-serif' }}>Célébrer le patrimoine marocain à travers la technologie</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Jost, sans-serif' }}>© 2026 Heritage AI — Tous droits réservés</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

// ── Sub-component: Timeline card ─────────────────────────────────────────────
function TimelineCard({ item }: { item: { century: string; year: string; title: string; desc: string; highlight?: boolean } }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background: item.highlight ? 'linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))' : 'white',
        border: item.highlight ? 'none' : '1px solid rgba(184,136,42,0.18)',
        borderRadius: 4,
        padding: '1.6rem 2rem',
        boxShadow: item.highlight
          ? '0 16px 48px rgba(196,98,45,0.25)'
          : '0 4px 20px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {item.highlight && (
        <div className="pattern-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'Jost', fontWeight: 500,
            color: item.highlight ? 'rgba(255,255,255,0.7)' : 'var(--gold)',
          }}>
            {item.century}
          </span>
          <span style={{
            fontSize: '0.62rem', color: item.highlight ? 'rgba(255,255,255,0.45)' : 'var(--muted)',
            fontFamily: 'Jost',
          }}>
            {item.year}
          </span>
        </div>
        <h4 style={{
          fontSize: '1.25rem', fontWeight: 600,
          fontFamily: 'Cormorant Garamond, serif',
          color: item.highlight ? 'white' : 'var(--ink)',
          marginBottom: '0.5rem', lineHeight: 1.3,
        }}>
          {item.title}
        </h4>
        <p style={{
          fontSize: '0.88rem', lineHeight: 1.7,
          color: item.highlight ? 'rgba(255,255,255,0.78)' : 'var(--muted)',
          fontFamily: 'Jost', fontWeight: 300,
        }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  )
}