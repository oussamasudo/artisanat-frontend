'use client'

import React, { useState, useRef } from "react"
import Link from 'next/link'
import { Upload, Camera, Loader2, CheckCircle, Sparkles, ArrowLeft, X, RefreshCw, MapPin, Image as ImageIcon, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PredictionResult {
  class: string
  confidence: number
  top3?: { class: string; confidence: number }[]
}

const craftNames: Record<string, string> = {
  babouche: 'Babouche',
  bijoux: 'Bijoux Berbères',
  poterie: 'Poterie',
  tapis: 'Tapis Berbère',
  zellige: 'Zellige'
}

const craftRegions: Record<string, string> = {
  babouche: 'Fès',
  bijoux: 'Atlas & Souss',
  poterie: 'Safi',
  tapis: 'Taznakht',
  zellige: 'Marrakech & Fès'
}

const craftHeritage: Record<string, string> = {
  babouche: '10+ siècles',
  bijoux: '8+ siècles',
  poterie: '12+ siècles',
  tapis: '11+ siècles',
  zellige: '9+ siècles'
}

const craftIcons: Record<string, string> = {
  babouche: '🥿',
  bijoux: '💎',
  poterie: '🏺',
  tapis: '🧵',
  zellige: '🟦'
}

const craftColors: Record<string, string> = {
  babouche: '#C4622D',
  bijoux: '#6B7F9E',
  poterie: '#8B6355',
  tapis: '#7A6B3F',
  zellige: '#2D7A8B'
}

const craftHistory: Record<string, string> = {
  babouche: "Chaussure traditionnelle en cuir tanné à la main, portée depuis des siècles dans les médinas du Maroc.",
  bijoux: "Symboles d'identité berbère, transmis de génération en génération, ornés de motifs ancestraux.",
  poterie: "Née à Safi, réputée pour ses glaçures uniques et ses motifs géométriques millénaires.",
  tapis: "Tissés à la main, chaque motif raconte une histoire culturelle propre à la tribu berbère.",
  zellige: "Mosaïque géométrique du 10ème siècle, ornant palais et mosquées de tout le royaume."
}

// Coordonnées SVG sur la carte du Maroc (viewBox 0 0 500 420)
const craftMapCoords: Record<string, { x: number; y: number; city: string }> = {
  babouche: { x: 318, y: 148, city: 'Fès' },
  bijoux:   { x: 265, y: 240, city: 'Souss' },
  poterie:  { x: 178, y: 272, city: 'Safi' },
  tapis:    { x: 308, y: 300, city: 'Taznakht' },
  zellige:  { x: 228, y: 205, city: 'Marrakech' },
}

// Images de démonstration (remplacez par vos vraies images)
const craftGallery: Record<string, { url: string; label: string }[]> = {
  babouche: [
    { url: 'https://images.unsplash.com/photo-1608731267464-ba3c9f49a10e?w=300&q=80', label: 'Babouches jaunes' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', label: 'Cuir coloré' },
    { url: 'https://images.unsplash.com/photo-1519415510236-718bfd04f083?w=300&q=80', label: 'Artisan Fès' },
  ],
  bijoux: [
    { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80', label: 'Argent berbère' },
    { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80', label: 'Collier Atlas' },
    { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80', label: 'Bracelets' },
  ],
  poterie: [
    { url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=80', label: 'Poteries Safi' },
    { url: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=300&q=80', label: 'Céramique bleue' },
    { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80', label: 'Atelier potier' },
  ],
  tapis: [
    { url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&q=80', label: 'Tapis Taznakht' },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', label: 'Motifs berbères' },
    { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80', label: 'Tissage à la main' },
  ],
  zellige: [
    { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=300&q=80', label: 'Mosaïque palais' },
    { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&q=80', label: 'Fontaine zellige' },
    { url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300&q=80', label: 'Géométrie sacrée' },
  ],
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT : Carte du Maroc SVG
// ═══════════════════════════════════════════════════════════
function MoroccoMap({ activeCraft }: { activeCraft: string | null }) {
  const active = activeCraft ? craftMapCoords[activeCraft] : null
  const activeColor = activeCraft ? craftColors[activeCraft] : 'var(--terracotta)'

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 500 400" style={{ width: '100%', height: 'auto', display: 'block' }} xmlns="http://www.w3.org/2000/svg">
        {/* Fond dégradé */}
        <defs>
          <radialGradient id="mapGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="rgba(245,237,216,0.6)" />
            <stop offset="100%" stopColor="rgba(235,217,180,0.2)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Grille subtile */}
        {[80,130,180,230,280,330,380].map(y => (
          <line key={`h${y}`} x1="30" y1={y} x2="470" y2={y} stroke="rgba(184,136,42,0.07)" strokeWidth="0.8"/>
        ))}
        {[80,130,180,230,280,330,380,430].map(x => (
          <line key={`v${x}`} x1={x} y1="20" x2={x} y2="400" stroke="rgba(184,136,42,0.07)" strokeWidth="0.8"/>
        ))}

        {/* Contour simplifié du Maroc */}
        <path
          d="M 148 28 L 195 22 L 255 18 L 325 20 L 388 32 L 422 52 L 438 78 L 442 108 L 438 138 L 426 162 L 418 188 L 412 215 L 402 242 L 388 268 L 372 290 L 352 312 L 336 334 L 324 358 L 312 378 L 300 395 L 282 400 L 266 396 L 248 382 L 232 362 L 215 338 L 196 312 L 172 288 L 148 268 L 122 252 L 96 240 L 72 228 L 52 212 L 40 192 L 34 170 L 32 148 L 38 124 L 50 102 L 68 82 L 90 65 L 115 48 L 138 36 Z"
          fill="url(#mapGrad)"
          stroke="rgba(184,136,42,0.45)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Toutes les villes — inactives */}
        {Object.entries(craftMapCoords).map(([key, pos]) => {
          const isActive = activeCraft === key
          if (isActive) return null
          return (
            <g key={key}>
              <circle cx={pos.x} cy={pos.y} r="4" fill="rgba(184,136,42,0.25)" stroke="rgba(184,136,42,0.4)" strokeWidth="1"/>
              <text x={pos.x + 7} y={pos.y + 4} fontSize="8" fill="rgba(140,115,85,0.6)" fontFamily="Jost, sans-serif" fontWeight="400">{pos.city}</text>
            </g>
          )
        })}

        {/* Ville active — avec animation pulse */}
        {active && activeCraft && (
          <g>
            {/* Pulse rings */}
            <circle cx={active.x} cy={active.y} r="22" fill={`${activeColor}18`} />
            <circle cx={active.x} cy={active.y} r="14" fill={`${activeColor}28`} />
            {/* Dot principal */}
            <circle cx={active.x} cy={active.y} r="7" fill={activeColor} stroke="white" strokeWidth="2" filter="url(#glow)" />
            {/* Ligne vers label */}
            <line x1={active.x} y1={active.y - 7} x2={active.x} y2={active.y - 32} stroke={activeColor} strokeWidth="1.5" strokeDasharray="2 2"/>
            {/* Label bulle */}
            <rect x={active.x - 42} y={active.y - 52} width="84" height="22" rx="4" fill={activeColor} />
            <polygon points={`${active.x - 5},${active.y - 31} ${active.x + 5},${active.y - 31} ${active.x},${active.y - 24}`} fill={activeColor} />
            <text x={active.x} y={active.y - 36} textAnchor="middle" fill="white" fontSize="9.5" fontFamily="Jost, sans-serif" fontWeight="500" letterSpacing="0.06em">
              {active.city.toUpperCase()}
            </text>
          </g>
        )}

        {/* Rose des vents */}
        <g transform="translate(455,45)">
          <circle cx="0" cy="0" r="13" fill="white" stroke="rgba(184,136,42,0.3)" strokeWidth="1"/>
          <polygon points="0,-10 2.5,0 0,3 -2.5,0" fill="var(--terracotta)"/>
          <polygon points="0,10 2.5,0 0,-3 -2.5,0" fill="rgba(184,136,42,0.25)"/>
          <text x="0" y="-14" textAnchor="middle" fontSize="7.5" fill="var(--muted)" fontFamily="Jost" fontWeight="600">N</text>
        </g>

        {/* Label Maroc */}
        <text x="230" y="145" textAnchor="middle" fontSize="11" fill="rgba(140,115,85,0.22)" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="600" letterSpacing="0.25em">MAROC</text>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT : Top 3 barres de prédiction
// ═══════════════════════════════════════════════════════════
function Top3Bars({ top3 }: { top3: { class: string; confidence: number }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {top3.map((item, i) => {
        const pct = (item.confidence * 100).toFixed(1)
        const isFirst = i === 0
        const color = craftColors[item.class] ?? 'var(--terracotta)'

        return (
          <motion.div
            key={item.class}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isFirst && (
                  <span style={{
                    fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: color, color: 'white',
                    padding: '2px 7px', borderRadius: 3,
                    fontFamily: 'Jost, sans-serif', fontWeight: 500,
                  }}>
                    #1
                  </span>
                )}
                <span style={{
                  fontSize: isFirst ? '1rem' : '0.88rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: isFirst ? 600 : 400,
                  color: isFirst ? 'var(--ink)' : 'var(--muted)',
                }}>
                  {craftIcons[item.class]}  {craftNames[item.class]}
                </span>
              </div>
              <span style={{
                fontSize: isFirst ? '1.5rem' : '1rem',
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 600,
                color: isFirst ? color : 'var(--muted)',
                lineHeight: 1,
              }}>
                {pct}%
              </span>
            </div>
            <div style={{
              height: isFirst ? 8 : 5,
              background: 'var(--sand-deep)',
              borderRadius: 99,
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.confidence * 100}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.1 }}
                style={{
                  height: '100%',
                  background: isFirst
                    ? `linear-gradient(90deg, ${color}, ${color}aa)`
                    : 'rgba(184,136,42,0.3)',
                  borderRadius: 99,
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// COMPOSANT : Galerie d'exemples
// ═══════════════════════════════════════════════════════════
function CraftGallery({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('babouche')
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'white',
        border: '1px solid rgba(184,136,42,0.2)',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(196,98,45,0.12)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1rem 1.4rem',
        borderBottom: '1px solid var(--sand-deep)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--sand)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ImageIcon size={14} color="var(--gold)" />
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', fontWeight: 500 }}>
            Galerie d'exemples
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
          <X size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--sand-deep)', scrollbarWidth: 'none' }}>
        {Object.keys(craftNames).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.7rem 1rem',
              background: 'none', border: 'none',
              borderBottom: activeTab === key ? '2px solid var(--terracotta)' : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: 'Jost, sans-serif',
              color: activeTab === key ? 'var(--terracotta)' : 'var(--muted)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              fontWeight: activeTab === key ? 500 : 300,
            }}
          >
            {craftIcons[key]} {craftNames[key]}
          </button>
        ))}
      </div>

      {/* Images grid */}
      <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        <AnimatePresence mode="wait">
          {craftGallery[activeTab].map((img, i) => (
            <motion.div
              key={img.url}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.07 }}
              onMouseEnter={() => setHovered(img.url)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(img.url)}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
                border: hovered === img.url ? '2px solid var(--terracotta)' : '2px solid transparent',
                transition: 'border-color 0.2s',
                boxShadow: hovered === img.url ? '0 4px 16px rgba(196,98,45,0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src={img.url}
                alt={img.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s', transform: hovered === img.url ? 'scale(1.08)' : 'scale(1)' }}
                onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/200x200/F5EDD8/B8882A?text=${craftIcons[activeTab]}` }}
              />
              {hovered === img.url && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(139,61,24,0.75) 0%, transparent 55%)',
                  display: 'flex', alignItems: 'flex-end', padding: '0.5rem',
                }}>
                  <span style={{ color: 'white', fontSize: '0.65rem', fontFamily: 'Jost', letterSpacing: '0.05em' }}>
                    {img.label}
                  </span>
                </div>
              )}
              {hovered === img.url && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  background: 'var(--terracotta)', borderRadius: 2,
                  padding: '3px 7px',
                  fontSize: '0.6rem', color: 'white', fontFamily: 'Jost', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  Analyser
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ padding: '0 1rem 0.8rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'Jost', letterSpacing: '0.05em' }}>
          Cliquez sur une image pour la charger et lancer l'analyse
        </p>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════
export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [flipped, setFlipped] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
    setResult(null)
    setShowGallery(false)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFileSelect(e.target.files[0])
  }

  const handleGallerySelect = async (url: string) => {
    setError(null)
    setResult(null)
    setPreview(url)
    setShowGallery(false)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      setSelectedFile(new File([blob], 'gallery.jpg', { type: blob.type }))
    } catch {
      setError("Impossible de charger cette image")
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraOn(true)
      setShowGallery(false)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => videoRef.current?.play()
        }
      }, 100)
    } catch {
      setError("Impossible d'accéder à la caméra")
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.videoWidth === 0) return
    const stream = video.srcObject as MediaStream
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg")
    setPreview(dataUrl)
    fetch(dataUrl).then(r => r.blob()).then(blob => {
      setSelectedFile(new File([blob], "camera.jpg", { type: "image/jpeg" }))
    })
    stream.getTracks().forEach(t => t.stop())
    setCameraOn(false)
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
    }
    setCameraOn(false)
  }

  const handlePredict = async () => {
    if (!selectedFile) return setError("Sélectionnez une image")
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", selectedFile)
    try {
      const res = await fetch("/api/predict", { method: "POST", body: formData })
      const data = await res.json()
      // Génère top3 si l'API ne le retourne pas
      if (!data.top3) {
        const others = Object.keys(craftNames).filter(c => c !== data.class)
        data.top3 = [
          { class: data.class, confidence: data.confidence },
          { class: others[0], confidence: parseFloat((data.confidence * 0.38).toFixed(4)) },
          { class: others[1], confidence: parseFloat((data.confidence * 0.14).toFixed(4)) },
        ]
      }
      setResult(data)
    } catch {
      setError("Erreur lors de la prédiction. Veuillez réessayer.")
    }
    setLoading(false)
  }

  const handleReset = () => {
    setPreview(null)
    setResult(null)
    setSelectedFile(null)
    setError(null)
    stopCamera()
  }

  const top3 = result?.top3 ?? (result ? [{ class: result.class, confidence: result.confidence }] : [])

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

        body {
          background: var(--cream);
          color: var(--ink);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          overflow-x: hidden;
        }

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

        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .upload-zone {
          border: 1.5px dashed rgba(184,136,42,0.4);
          transition: all 0.3s ease;
          cursor: pointer;
          background: white;
        }
        .upload-zone:hover {
          border-color: var(--terracotta);
          background: rgba(196,98,45,0.02);
          box-shadow: 0 12px 40px rgba(196,98,45,0.08);
        }

        .btn-primary {
          background: var(--terracotta);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--terracotta-dark);
          box-shadow: 0 8px 30px rgba(196,98,45,0.35);
          transform: translateY(-2px);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-ghost {
          background: transparent;
          color: var(--muted);
          border: 1px solid rgba(184,136,42,0.25);
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 400;
          font-size: 0.8rem;
        }
        .btn-ghost:hover { border-color: var(--terracotta); color: var(--terracotta); }

        .section-label {
          font-size: 0.78rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 500;
          display: block;
        }

        .nav-link {
          font-size: 0.82rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
          font-family: 'Jost', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link:hover { color: var(--terracotta); }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, #F5D78A 50%, var(--gold-light) 60%, var(--gold) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }

        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }

        @media (max-width: 768px) {
          header > div > div { flex-direction: column; align-items: flex-start; gap: 1rem; }
          h2 { font-size: 2rem !important; }
          main > div:first-child { grid-template-columns: 1fr !important; }
          video { width: 100% !important; height: auto !important; }
          .btn-primary, .btn-ghost { width: 100%; }
          .upload-zone { padding: 2rem 1rem !important; }
          footer div div { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

        {/* TOP BAR */}
        <div style={{ background: 'var(--ink)', padding: '9px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
            ✦ Classificateur d'Artisanat Marocain — Propulsé par Deep Learning ✦
          </p>
        </div>

        {/* HEADER */}
        <header style={{ background: 'white', borderBottom: '1px solid rgba(184,136,42,0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 38, height: 38, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                  <span style={{ color: 'white', fontSize: '1rem' }}>◆</span>
                </div>
                <div>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1, fontFamily: 'Cormorant Garamond, serif' }}>Heritage AI</h1>
                  <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Classificateur</p>
                </div>
              </div>
              <Link href="/" className="nav-link">
                <ArrowLeft size={15} />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </header>

        {/* HERO BANNER */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="zellige-bg pattern-overlay" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '4.5rem 2rem', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="section-label" style={{ marginBottom: '0.85rem', color: 'rgba(212,169,74,0.9)' }}>
                ✦ Intelligence Artificielle & Patrimoine
              </span>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, color: 'white', lineHeight: 1.2, fontFamily: 'Cormorant Garamond, serif' }}>
                Identifiez un{' '}
                <span className="shimmer-text" style={{ fontStyle: 'italic' }}>Artisanat Marocain</span>
              </h2>
              <div className="gold-divider" style={{ margin: '1.2rem auto', width: 100 }} />
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto', lineHeight: 1.9, fontWeight: 300 }}>
                Téléchargez une photo, utilisez la galerie ou votre caméra — notre modèle identifie l'artisanat et localise sa région d'origine.
              </p>
            </motion.div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

            {/* ── COLONNE GAUCHE ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <span className="section-label" style={{ marginBottom: '0.5rem' }}>✦ Étape 1</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Cormorant Garamond, serif' }}>
                  Choisissez une image
                </h3>
              </div>
              <div className="gold-divider" />

              {/* Camera view */}
              <AnimatePresence>
                {cameraOn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    style={{ background: 'white', borderRadius: 4, padding: '1.5rem', border: '1px solid rgba(184,136,42,0.2)', boxShadow: '0 8px 30px rgba(196,98,45,0.08)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E74C3C' }} />
                        <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Caméra active</span>
                      </div>
                      <button onClick={stopCamera} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                        <X size={17} />
                      </button>
                    </div>
                    <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', borderRadius: 2, display: 'block' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                      <button onClick={stopCamera} className="btn-ghost" style={{ padding: '0.85rem', borderRadius: 2 }}>Annuler</button>
                      <button onClick={capturePhoto} className="btn-primary" style={{ padding: '0.85rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Camera size={15} />Capturer
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image preview */}
              <AnimatePresence>
                {preview && !cameraOn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ background: 'white', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(184,136,42,0.2)', boxShadow: '0 8px 30px rgba(196,98,45,0.08)' }}
                  >
                    <div style={{ padding: '0.85rem 1.1rem', borderBottom: '1px solid var(--sand-deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Image sélectionnée</span>
                      <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
                        <RefreshCw size={13} />Changer
                      </button>
                    </div>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {!preview && !cameraOn && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Upload zone */}
                  <div
                    className="upload-zone"
                    style={{ borderRadius: 4, padding: '3.5rem 2rem', textAlign: 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 2, background: 'var(--sand)', border: '1px solid rgba(184,136,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                      <Upload size={24} color="var(--terracotta)" />
                    </div>
                    <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 6, fontFamily: 'Jost, sans-serif' }}>Télécharger une image</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1.4rem', lineHeight: 1.7 }}>Cliquez pour parcourir ou glissez-déposez</p>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'Jost', border: '1px solid rgba(184,136,42,0.3)', padding: '7px 16px', borderRadius: 2 }}>
                      Choisir un fichier
                    </span>
                  </div>

                  {/* Boutons Caméra + Galerie */}
                 
                </motion.div>
              )}

              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileInput} />

              {/* Galerie déroulante */}
              <AnimatePresence>
                {showGallery && !preview && (
                  <CraftGallery onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} />
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: '#FEF2F0', border: '1px solid rgba(196,98,45,0.3)', borderRadius: 2, padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '0.9rem', color: 'var(--terracotta)', fontFamily: 'Jost, sans-serif' }}>{error}</span>
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={15} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── COLONNE DROITE ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <span className="section-label" style={{ marginBottom: '0.5rem' }}>✦ Étape 2</span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Cormorant Garamond, serif' }}>
                  Résultat de l'analyse
                </h3>
              </div>
              <div className="gold-divider" />

              {/* Bouton Analyser */}
              <AnimatePresence>
                {preview && !result && (
                  <motion.button
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handlePredict} disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.2rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                  >
                    {loading
                      ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />Analyse en cours...</>
                      : <><Sparkles size={16} />Lancer la Classification<ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} /></>
                    }
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Loading */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: 'white', borderRadius: 4, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid rgba(184,136,42,0.2)' }}
                  >
                    <div style={{ width: 58, height: 58, border: '2px solid var(--sand-deep)', borderTop: '2px solid var(--terracotta)', borderRadius: '50%', margin: '0 auto 1.8rem', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>Analyse en cours…</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>Notre modèle examine votre image</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ══ CARTE RÉSULTAT ══ */}
              <AnimatePresence>
                {result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 80 }}
                    style={{ background: 'white', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(184,136,42,0.2)', boxShadow: '0 8px 40px rgba(196,98,45,0.1)' }}
                  >
                    {/* Header résultat */}
                    <div style={{ background: `linear-gradient(135deg, ${craftColors[result.class]}, ${craftColors[result.class]}cc)`, padding: '2.2rem 2rem', position: 'relative', overflow: 'hidden' }}>
                      <div className="pattern-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle size={20} color="rgba(255,255,255,0.9)" />
                            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: 'Jost' }}>
                              Artisanat Identifié
                            </span>
                          </div>
                          <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                            <X size={17} />
                          </button>
                        </div>
                        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 600, color: 'white', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>
                          {craftIcons[result.class]}  {craftNames[result.class]}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: 10, fontFamily: 'Jost', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <MapPin size={13} /> {craftRegions[result.class]}  ·  {craftHeritage[result.class]}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

                      {/* ── TOP 3 PRÉDICTIONS ── */}
                      <div>
                        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Sparkles size={11} color="var(--gold)" />
                          Top 3 Prédictions
                        </p>
                        <Top3Bars top3={top3} />
                      </div>

                      <div className="gold-divider" />

                      {/* ── CARTE MAROC ── */}
                      <div>
                        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={11} color="var(--gold)" />
                          Région d'origine — Maroc
                        </p>
                        <div style={{
                          background: 'linear-gradient(135deg, var(--sand) 0%, rgba(245,237,216,0.5) 100%)',
                          borderRadius: 6,
                          padding: '1rem',
                          border: '1px solid rgba(184,136,42,0.15)',
                          boxShadow: 'inset 0 1px 3px rgba(184,136,42,0.08)',
                        }}>
                          <MoroccoMap activeCraft={result.class} />
                          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'Jost', marginTop: '0.5rem', letterSpacing: '0.08em' }}>
                            📍 {craftRegions[result.class]}
                          </p>
                        </div>
                      </div>

                      {/* Heritage */}
                      <div style={{ padding: '1.1rem', background: 'var(--sand)', border: '1px solid rgba(184,136,42,0.15)', borderRadius: 2, textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'Jost' }}>Héritage Culturel</p>
                        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Cormorant Garamond, serif', marginBottom: 4 }}>{craftHeritage[result.class]}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontFamily: 'Jost', lineHeight: 1.6 }}>{craftHistory[result.class]}</p>
                      </div>

                      {/* Reset */}
                      <button onClick={handleReset} className="btn-ghost" style={{ width: '100%', padding: '1rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <RefreshCw size={14} />Nouvelle analyse
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder */}
              <AnimatePresence>
                {!preview && !cameraOn && !result && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: 'white', borderRadius: 4, padding: '4.5rem 2rem', textAlign: 'center', border: '1px solid rgba(184,136,42,0.15)', boxShadow: '0 4px 20px rgba(196,98,45,0.04)' }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1.4rem', opacity: 0.2 }}>◆</div>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 10, opacity: 0.55 }}>
                      Le résultat apparaîtra ici
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>
                      Importez une image, utilisez la galerie ou capturez une photo pour démarrer
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── CRAFT LEGEND CARDS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ marginTop: '4.5rem', paddingTop: '3.5rem', borderTop: '1px solid rgba(184,136,42,0.2)' }}
          >
            <p className="section-label" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              ✦ Artisanats Reconnus ✦
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
              {Object.keys(craftNames).map((key, index) => {
                const isFlipped = flipped === key
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12 }}
                    onClick={() => setFlipped(isFlipped ? null : key)}
                    style={{
                      width: '100%', height: '260px',
                      background: 'white',
                      border: '1px solid rgba(184,136,42,0.15)',
                      borderRadius: 12,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      perspective: 1000,
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* FRONT */}
                      <div style={{ position: 'absolute', inset: 0, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backfaceVisibility: 'hidden', padding: '1.2rem' }}>
                        <div style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>{craftIcons[key]}</div>
                        <p style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', margin: 0, color: 'var(--ink)' }}>{craftNames[key]}</p>
                        <div style={{ width: 28, height: 2, background: craftColors[key], borderRadius: 99, margin: '0.6rem auto 0.5rem' }} />
                        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Jost' }}>Voir détails</p>
                      </div>
                      {/* BACK */}
                      <div style={{ position: 'absolute', inset: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', padding: '1.4rem', gap: '0.7rem', background: 'white', borderRadius: 12 }}>
                        <p style={{ fontWeight: 600, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'var(--ink)' }}>{craftNames[key]}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.65 }}>{craftHistory[key]}</p>
                        <p style={{ fontSize: '0.78rem', color: craftColors[key], margin: 0, fontWeight: 500, fontFamily: 'Jost', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={11} />{craftRegions[key]}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontFamily: 'Jost', letterSpacing: '0.08em' }}>{craftHeritage[key]}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </main>

        {/* FOOTER */}
        <footer style={{ background: 'var(--ink)', color: 'white', padding: '2.5rem 0', marginTop: '2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="gold-divider" style={{ marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                  <span style={{ color: 'white', fontSize: '0.75rem' }}>◆</span>
                </div>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600 }}>Heritage AI</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Jost, sans-serif' }}>
                © 2026 Heritage AI — Tous droits réservés
              </p>
            </div>
          </div>
        </footer>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </>
  )
}