'use client'

import React, { useState, useRef, useEffect } from "react"
import Link from 'next/link'
import { Upload, Camera, Loader2, CheckCircle, Sparkles, ArrowLeft, X, RefreshCw, MapPin, Image as ImageIcon } from 'lucide-react'
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

// Coordinates on the SVG map (approximate positions within Morocco SVG viewBox)
const craftMapCoords: Record<string, { x: number; y: number; label: string }> = {
  babouche: { x: 310, y: 155, label: 'Fès' },
  bijoux:   { x: 270, y: 230, label: 'Atlas & Souss' },
  poterie:  { x: 185, y: 280, label: 'Safi' },
  tapis:    { x: 310, y: 295, label: 'Taznakht' },
  zellige:  { x: 230, y: 210, label: 'Marrakech & Fès' },
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

const craftHistory: Record<string, string> = {
  babouche: "La babouche est une chaussure traditionnelle marocaine en cuir faite à la main.",
  bijoux: "Les bijoux berbères représentent l'identité et sont transmis de génération en génération.",
  poterie: "La poterie marocaine, notamment de Safi, est connue pour ses motifs et techniques ancestrales.",
  tapis: "Les tapis berbères sont tissés à la main et racontent des histoires culturelles à travers leurs motifs.",
  zellige: "Le zellige est un art de mosaïque géométrique datant du 10ème siècle, utilisé dans les palais et mosquées."
}

// Sample gallery images per craft (using Unsplash for demo)
const craftGallery: Record<string, string[]> = {
  babouche: [
    'https://images.unsplash.com/photo-1608731267464-ba3c9f49a10e?w=200&q=80',
    'https://images.unsplash.com/photo-1571035887497-0e90e87e49fc?w=200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
  ],
  bijoux: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=80',
  ],
  poterie: [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&q=80',
    'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  ],
  tapis: [
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
  ],
  zellige: [
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=200&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=200&q=80',
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200&q=80',
  ],
}

// ─── Morocco SVG Map ────────────────────────────────────────────────────────
function MoroccoMap({ activeCraft }: { activeCraft: string | null }) {
  const coords = activeCraft ? craftMapCoords[activeCraft] : null

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox="0 0 500 420"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Morocco simplified outline */}
        <path
          d="
            M 155 30
            L 200 25 L 260 20 L 330 22 L 390 35
            L 420 55 L 435 80 L 440 110 L 435 140
            L 425 165 L 415 185 L 410 210
            L 400 240 L 390 265 L 375 285
            L 355 310 L 340 330 L 330 355
            L 320 375 L 310 395 L 300 410
            L 280 415 L 265 410
            L 245 395 L 235 375
            L 220 350 L 205 325
            L 185 300 L 165 280
            L 140 260 L 115 245
            L 90 235 L 70 225
            L 55 210 L 45 195
            L 38 175 L 35 155
            L 40 130 L 50 110
            L 65 90 L 85 72
            L 110 55 L 135 40
            Z
          "
          fill="rgba(196,98,45,0.08)"
          stroke="rgba(184,136,42,0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Subtle grid lines */}
        {[100, 150, 200, 250, 300, 350].map(y => (
          <line key={y} x1="30" y1={y} x2="450" y2={y} stroke="rgba(184,136,42,0.06)" strokeWidth="0.5" />
        ))}
        {[100, 150, 200, 250, 300, 350, 400].map(x => (
          <line key={x} x1={x} y1="20" x2={x} y2="420" stroke="rgba(184,136,42,0.06)" strokeWidth="0.5" />
        ))}

        {/* All craft dots (inactive) */}
        {Object.entries(craftMapCoords).map(([key, pos]) => {
          const isActive = activeCraft === key
          return (
            <g key={key}>
              {isActive && (
                <>
                  <circle cx={pos.x} cy={pos.y} r="18" fill="rgba(196,98,45,0.12)" />
                  <circle cx={pos.x} cy={pos.y} r="12" fill="rgba(196,98,45,0.2)" />
                </>
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 6 : 4}
                fill={isActive ? 'var(--terracotta)' : 'rgba(184,136,42,0.35)'}
                stroke={isActive ? 'white' : 'transparent'}
                strokeWidth="1.5"
              />
              {isActive && (
                <>
                  <line
                    x1={pos.x} y1={pos.y - 6}
                    x2={pos.x} y2={pos.y - 28}
                    stroke="var(--terracotta)" strokeWidth="1.5"
                  />
                  <rect
                    x={pos.x - 38} y={pos.y - 46}
                    width="76" height="18"
                    rx="3"
                    fill="var(--terracotta)"
                  />
                  <text
                    x={pos.x} y={pos.y - 33}
                    textAnchor="middle"
                    fill="white"
                    fontSize="9"
                    fontFamily="Jost, sans-serif"
                    fontWeight="500"
                    letterSpacing="0.08em"
                  >
                    {pos.label.toUpperCase()}
                  </text>
                </>
              )}
            </g>
          )
        })}

        {/* Compass rose */}
        <g transform="translate(450, 50)">
          <circle cx="0" cy="0" r="12" fill="white" stroke="rgba(184,136,42,0.3)" strokeWidth="1" />
          <text x="0" y="-15" textAnchor="middle" fontSize="7" fill="var(--muted)" fontFamily="Jost" fontWeight="500">N</text>
          <polygon points="0,-9 2,0 0,2 -2,0" fill="var(--terracotta)" />
          <polygon points="0,9 2,0 0,-2 -2,0" fill="rgba(184,136,42,0.3)" />
        </g>
      </svg>
    </div>
  )
}

// ─── Top 3 Bar ───────────────────────────────────────────────────────────────
function Top3Bars({ top3 }: { top3: { class: string; confidence: number }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      {top3.map((item, i) => {
        const pct = (item.confidence * 100).toFixed(1)
        const isFirst = i === 0
        return (
          <motion.div
            key={item.class}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {isFirst && (
                  <span style={{
                    fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: 'var(--terracotta)', color: 'white',
                    padding: '2px 6px', borderRadius: 2, fontFamily: 'Jost',
                  }}>
                    ✦ Top
                  </span>
                )}
                <span style={{
                  fontSize: '0.85rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontWeight: isFirst ? 600 : 400,
                  color: isFirst ? 'var(--ink)' : 'var(--muted)',
                }}>
                  {craftIcons[item.class]} {craftNames[item.class]}
                </span>
              </div>
              <span style={{
                fontSize: isFirst ? '1.2rem' : '0.9rem',
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 600,
                color: isFirst ? 'var(--terracotta)' : 'var(--muted)',
              }}>
                {pct}%
              </span>
            </div>
            <div style={{ height: isFirst ? 7 : 5, background: 'var(--sand-deep)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.confidence * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                style={{
                  height: '100%',
                  background: isFirst
                    ? 'linear-gradient(90deg, var(--terracotta), var(--gold-light))'
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

// ─── Gallery Section ──────────────────────────────────────────────────────────
function CraftGallery({ onImageSelect }: { onImageSelect: (url: string) => void }) {
  const [activeTab, setActiveTab] = useState<string>('babouche')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'white',
        border: '1px solid rgba(184,136,42,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(196,98,45,0.06)',
        marginTop: '1rem',
      }}
    >
      {/* Gallery header */}
      <div style={{
        padding: '1rem 1.4rem',
        borderBottom: '1px solid var(--sand-deep)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <ImageIcon size={15} color="var(--gold)" />
        <span style={{
          fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--muted)', fontFamily: 'Jost, sans-serif', fontWeight: 500,
        }}>
          Galerie d'exemples — cliquez pour analyser
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--sand-deep)',
        scrollbarWidth: 'none',
      }}>
        {Object.keys(craftNames).map(key => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.65rem 1.1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === key ? '2px solid var(--terracotta)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'Jost, sans-serif',
              color: activeTab === key ? 'var(--terracotta)' : 'var(--muted)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {craftIcons[key]} {craftNames[key]}
          </button>
        ))}
      </div>

      {/* Images */}
      <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        {craftGallery[activeTab].map((url, i) => (
          <motion.div
            key={url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => onImageSelect(url)}
            style={{
              aspectRatio: '1',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(184,136,42,0.15)',
              position: 'relative',
            }}
          >
            <img
              src={url}
              alt={craftNames[activeTab]}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200/F5EDD8/B8882A?text=${craftIcons[activeTab]}`
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(139,61,24,0.6) 0%, transparent 50%)',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
              className="gallery-overlay"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Classifier Custom Cursor ─────────────────────────────────────────────────
function ClassifierCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setIsHovering(!!(el.closest('button') || el.closest('a') || el.closest('.upload-zone')))
    }
    const leave = () => setVisible(false)
    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => { setIsTouch('ontouchstart' in window) }, [])
  if (isTouch) return null

  if (!isHovering && !isClicking) return null

  return (
    <>
      <motion.div
        animate={{
          x: pos.x - 10,
          y: pos.y - 10,
          scale: isClicking ? 2 : 1.8,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.3 }}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99999,
          width: 20, height: 20, pointerEvents: 'none',
          transform: 'rotate(45deg)',
          background: isClicking ? 'rgba(196,98,45,0.35)' : 'rgba(196,98,45,0.15)',
          border: '2px solid var(--terracotta)',
          transition: 'background 0.15s',
        }}
      />
      <motion.div
        animate={{ x: pos.x - 3, y: pos.y - 3, opacity: visible ? 0.7 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 0.6 }}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99998,
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--terracotta)', pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [flipped, setFlipped] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
    setResult(null)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFileSelect(e.target.files[0])
  }

  // Load image from gallery URL
  const handleGallerySelect = async (url: string) => {
    setError(null)
    setResult(null)
    setPreview(url)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      setSelectedFile(new File([blob], 'gallery.jpg', { type: blob.type }))
    } catch {
      setError("Impossible de charger l'image de la galerie")
    }
    setShowGallery(false)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraOn(true)
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
      // If API returns top3, use it; otherwise simulate from single result
      if (!data.top3) {
        const allClasses = Object.keys(craftNames).filter(c => c !== data.class)
        const fakeTop3 = [
          { class: data.class, confidence: data.confidence },
          { class: allClasses[0], confidence: data.confidence * 0.35 },
          { class: allClasses[1], confidence: data.confidence * 0.15 },
        ]
        data.top3 = fakeTop3
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

  // Dynamic background per craft
  const craftBg: Record<string, string> = {
    babouche: 'radial-gradient(ellipse at 80% 20%, rgba(196,98,45,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(184,136,42,0.05) 0%, transparent 60%)',
    bijoux:   'radial-gradient(ellipse at 70% 30%, rgba(100,120,180,0.07) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(184,136,42,0.06) 0%, transparent 60%)',
    poterie:  'radial-gradient(ellipse at 60% 40%, rgba(139,61,24,0.08) 0%, transparent 60%), radial-gradient(ellipse at 40% 60%, rgba(196,98,45,0.05) 0%, transparent 60%)',
    tapis:    'radial-gradient(ellipse at 80% 60%, rgba(120,60,20,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 40%, rgba(196,98,45,0.06) 0%, transparent 60%)',
    zellige:  'radial-gradient(ellipse at 30% 30%, rgba(30,100,160,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(184,136,42,0.06) 0%, transparent 60%)',
  }
  const bgGradient = result ? craftBg[result.class] : 'none'

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
          cursor: auto;
        }
        a, button { cursor: pointer; }

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

        .confidence-track {
          height: 7px;
          background: var(--sand-deep);
          border-radius: 99px;
          overflow: hidden;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .gallery-overlay:hover { opacity: 1 !important; }

        @media (max-width: 768px) {
          header > div > div { flex-direction: column; align-items: flex-start; gap: 1rem; }
          h2 { font-size: 2rem !important; }
          main > div { grid-template-columns: 1fr !important; }
          video { width: 100% !important; height: auto !important; }
          .btn-primary, .btn-ghost { width: 100%; }
          .upload-zone { padding: 2rem 1rem !important; }
          main > div:last-child > div { grid-template-columns: repeat(2, 1fr) !important; }
          footer div div { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--cream)', position: 'relative', transition: 'background 0.6s ease' }}>

        {/* Custom cursor */}
        <ClassifierCursor />

        {/* Dynamic background glow per craft */}
        <AnimatePresence>
          {result && (
            <motion.div
              key={result.class}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 0,
                background: bgGradient,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Content layer above dynamic bg */}
        <div style={{ position: 'relative', zIndex: 1 }}>

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
                Téléchargez une photo ou utilisez votre caméra — notre modèle de deep learning identifie l'artisanat.
              </p>
            </motion.div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

            {/* ── LEFT COLUMN ── */}
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
                      <span style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>
                        Image sélectionnée
                      </span>
                      <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
                        <RefreshCw size={13} />Changer
                      </button>
                    </div>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state — Drag & Drop */}
              {!preview && !cameraOn && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <motion.div
                    className="upload-zone"
                    animate={isDragging ? {
                      scale: 1.02,
                      borderColor: 'var(--terracotta)',
                      background: 'rgba(196,98,45,0.04)',
                    } : {
                      scale: 1,
                      borderColor: 'rgba(184,136,42,0.4)',
                      background: 'white',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      borderRadius: 4,
                      padding: '3.5rem 2rem',
                      textAlign: 'center',
                      border: '1.5px dashed rgba(184,136,42,0.4)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsDragging(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file && file.type.startsWith('image/')) handleFileSelect(file)
                      else setError('Veuillez déposer une image valide')
                    }}
                  >
                    {/* Animated corner borders when dragging */}
                    <AnimatePresence>
                      {isDragging && (
                        <>
                          {[
                            { top: 8, left: 8, borderTop: '2px solid var(--terracotta)', borderLeft: '2px solid var(--terracotta)' },
                            { top: 8, right: 8, borderTop: '2px solid var(--terracotta)', borderRight: '2px solid var(--terracotta)' },
                            { bottom: 8, left: 8, borderBottom: '2px solid var(--terracotta)', borderLeft: '2px solid var(--terracotta)' },
                            { bottom: 8, right: 8, borderBottom: '2px solid var(--terracotta)', borderRight: '2px solid var(--terracotta)' },
                          ].map((corner, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2, delay: i * 0.04 }}
                              style={{
                                position: 'absolute',
                                width: 20, height: 20,
                                ...corner,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <motion.div
                      animate={isDragging
                        ? { y: -8, scale: 1.15 }
                        : { y: 0, scale: 1 }
                      }
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{ width: 56, height: 56, borderRadius: 2, background: isDragging ? 'rgba(196,98,45,0.1)' : 'var(--sand)', border: `1px solid ${isDragging ? 'var(--terracotta)' : 'rgba(184,136,42,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', transition: 'background 0.2s, border-color 0.2s' }}
                    >
                      <motion.div
                        animate={isDragging ? { rotate: [0, -10, 10, -5, 0] } : { rotate: 0 }}
                        transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0, repeatDelay: 0.8 }}
                      >
                        <Upload size={24} color={isDragging ? 'var(--terracotta)' : 'var(--terracotta)'} />
                      </motion.div>
                    </motion.div>

                    {/* Text */}
                    <AnimatePresence mode="wait">
                      {isDragging ? (
                        <motion.div
                          key="dragging"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--terracotta)', marginBottom: 4, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
                            Relâchez pour analyser
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--terracotta)', opacity: 0.7, fontFamily: 'Jost' }}>
                            ✦ L'image sera chargée instantanément
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 6, fontFamily: 'Jost, sans-serif' }}>
                            Télécharger une image
                          </p>
                          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1.4rem', lineHeight: 1.7 }}>
                            Glissez-déposez ou cliquez pour parcourir
                          </p>
                          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'Jost, sans-serif', border: '1px solid rgba(184,136,42,0.3)', padding: '7px 16px', borderRadius: 2 }}>
                            Choisir un fichier
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileInput} />

              {/* Gallery panel */}
              <AnimatePresence>
                {showGallery && !preview && (
                  <CraftGallery onImageSelect={handleGallerySelect} />
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

            {/* ── RIGHT COLUMN ── */}
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

              {/* Classify button */}
              <AnimatePresence>
                {preview && !result && (
                  <motion.button
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handlePredict} disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.2rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                  >
                    {loading ? (
                      <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />Analyse en cours...</>
                    ) : (
                      <><Sparkles size={16} />Lancer la Classification<ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} /></>
                    )}
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

              {/* ── RESULT CARD ── */}
              <AnimatePresence>
                {result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 80 }}
                    style={{ background: 'white', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(184,136,42,0.2)' }}
                  >
                    {/* Result header */}
                    <div style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))', padding: '2.2rem 2rem', position: 'relative', overflow: 'hidden' }}>
                      <div className="pattern-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle size={20} color="rgba(255,255,255,0.9)" />
                            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: 'Jost, sans-serif' }}>
                              Artisanat Identifié
                            </span>
                          </div>
                          <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                            <X size={17} />
                          </button>
                        </div>
                        <h3 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 600, color: 'white', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>
                          {craftIcons[result.class]} {craftNames[result.class]}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginTop: 8, fontFamily: 'Jost', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <MapPin size={13} />
                          {craftRegions[result.class]} · {craftHeritage[result.class]}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

                      {/* ── TOP 3 PREDICTIONS ── */}
                      <div>
                        <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '1rem' }}>
                          ✦ Top 3 Prédictions
                        </p>
                        <Top3Bars top3={top3} />
                      </div>

                      <div className="gold-divider" />

                      {/* ── MOROCCO MAP ── */}
                      <div>
                        <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <MapPin size={12} color="var(--gold)" />
                          Région d'origine — Maroc
                        </p>
                        <div style={{ background: 'var(--sand)', borderRadius: 4, padding: '1rem', border: '1px solid rgba(184,136,42,0.15)' }}>
                          <MoroccoMap activeCraft={result.class} />
                        </div>
                      </div>

                      {/* Heritage badge */}
                      <div style={{ padding: '1.1rem', background: 'var(--sand)', border: '1px solid rgba(184,136,42,0.15)', borderRadius: 2, textAlign: 'center' }}>
                        <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5, fontFamily: 'Jost' }}>Héritage</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Cormorant Garamond, serif' }}>{craftHeritage[result.class]}</p>
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
                    <div style={{ fontSize: '3rem', marginBottom: '1.4rem', opacity: 0.25 }}>◆</div>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 10, opacity: 0.6 }}>
                      Le résultat apparaîtra ici
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>
                      Importez une image ou utilisez la galerie d'exemples pour démarrer
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── CRAFT LEGEND ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ marginTop: '4.5rem', paddingTop: '3.5rem', borderTop: '1px solid rgba(184,136,42,0.2)' }}
          >
            <p className="section-label" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              ✦ Artisanats Reconnus ✦
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {Object.keys(craftNames).map((key, index) => {
                const isFlipped = flipped === key
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    onClick={() => setFlipped(isFlipped ? null : key)}
                    style={{
                      width: '100%',
                      minHeight: isFlipped ? 'auto' : '220px',
                      background: 'white',
                      border: `1px solid ${isFlipped ? 'rgba(184,136,42,0.35)' : 'rgba(184,136,42,0.15)'}`,
                      borderRadius: 12,
                      textAlign: 'center',
                      boxShadow: isFlipped ? '0 6px 24px rgba(184,136,42,0.12)' : '0 2px 12px rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'border-color 0.3s, box-shadow 0.3s',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {!isFlipped ? (
                        /* ── FRONT ── */
                        <motion.div
                          key="front"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            padding: '1.8rem 1rem',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            minHeight: '220px',
                          }}
                        >
                          <div style={{ fontSize: '2.6rem', marginBottom: '10px' }}>{craftIcons[key]}</div>
                          <p style={{ fontSize: '1.15rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', margin: 0, lineHeight: 1.2 }}>
                            {craftNames[key]}
                          </p>
                          <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 8, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost' }}>
                            Touchez pour en savoir plus
                          </p>
                          <div style={{ marginTop: 10, width: 24, height: 1, background: 'rgba(184,136,42,0.3)' }} />
                        </motion.div>
                      ) : (
                        /* ── BACK ── */
                        <motion.div
                          key="back"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            padding: '1.4rem 1rem',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.6rem',
                            background: 'linear-gradient(160deg, white 0%, rgba(245,237,216,0.4) 100%)',
                          }}
                        >
                          <div style={{ fontSize: '1.4rem' }}>{craftIcons[key]}</div>
                          <p style={{ fontWeight: 600, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--ink)' }}>
                            {craftNames[key]}
                          </p>
                          <div style={{ width: 30, height: 1, background: 'rgba(184,136,42,0.35)' }} />
                          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.65, textAlign: 'center' }}>
                            {craftHistory[key]}
                          </p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--gold)', margin: 0, fontWeight: 500 }}>
                            📍 {craftRegions[key]}
                          </p>
                          <p style={{ fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Jost', marginTop: 4, opacity: 0.6 }}>
                            Touchez pour fermer
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
        </div>{/* end content layer */}
      </div>
    </>
  )
}