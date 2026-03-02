'use client'
 import { useDarkMode } from '@/hooks/useDarkMode' 
import React, { useState, useRef, useEffect } from "react"
import Link from 'next/link'
import {
  Upload, Camera, Loader2, CheckCircle, Sparkles, ArrowLeft, X,
  RefreshCw, MapPin, Image as ImageIcon, Moon, Sun, Share2, Download, Copy, Twitter, Check
} from 'lucide-react'
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

const craftMapCoords: Record<string, { lat: number; lng: number; label: string }> = {
  babouche: { lat: 34.0181, lng: -5.0078, label: 'Fès' },
  bijoux:   { lat: 30.9,    lng: -7.5,    label: 'Atlas & Souss' },
  poterie:  { lat: 32.2994, lng: -9.2372, label: 'Safi' },
  tapis:    { lat: 30.5833, lng: -7.2,    label: 'Taznakht' },
  zellige:  { lat: 31.6295, lng: -7.9811, label: 'Marrakech' },
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

// ─── Classification Counter ───────────────────────────────────────────────────
function ClassificationCounter({ count, dark }: { count: number; dark: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: dark ? 'rgba(255,255,255,0.06)' : 'white', border: `1px solid ${dark ? 'rgba(184,136,42,0.35)' : 'rgba(184,136,42,0.25)'}`, borderRadius: 2, padding: '0.5rem 1rem' }}>
      <motion.span key={count} initial={{ scale: 1.4, color: '#C4622D' }} animate={{ scale: 1, color: '#B8882A' }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ fontSize: '1.15rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: 'var(--gold)', minWidth: '1.4rem', textAlign: 'center' }}>
        {count}
      </motion.span>
      <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif', fontWeight: 500, lineHeight: 1.3 }}>
        Classification{count !== 1 ? 's' : ''}<br />effectuée{count !== 1 ? 's' : ''}
      </span>
    </motion.div>
  )
}

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────
function DarkModeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={onToggle}
      title={dark ? 'Mode clair' : 'Mode sombre'}
      style={{ width: 38, height: 38, borderRadius: 2, background: dark ? 'rgba(255,255,255,0.08)' : 'var(--sand)', border: `1px solid ${dark ? 'rgba(184,136,42,0.35)' : 'rgba(184,136,42,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s' }}>
      <AnimatePresence mode="wait">
        {dark
          ? <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun size={17} color="var(--gold)" /></motion.div>
          : <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon size={17} color="var(--muted)" /></motion.div>
        }
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Share + Download Bar ─────────────────────────────────────────────────────
function ShareDownloadBar({ result, preview, dark }: { result: PredictionResult; preview: string | null; dark: boolean }) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const shareText = `J'ai identifié un artisanat marocain avec Heritage AI ✦\n\n${craftIcons[result.class]} ${craftNames[result.class]} — ${craftRegions[result.class]} (${craftHeritage[result.class]})\nConfiance : ${(result.confidence * 100).toFixed(1)}%\n\n#HeritageAI #ArtisanatMarocain`

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = async () => {
    if (!preview) return
    setDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 800; canvas.height = 500
      const ctx = canvas.getContext('2d')!

      // Background
      ctx.fillStyle = dark ? '#100C06' : '#FAF6EE'
      ctx.fillRect(0, 0, 800, 500)

      // Terracotta header
      ctx.fillStyle = '#C4622D'
      ctx.fillRect(0, 0, 800, 140)
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      for (let x = 0; x < 800; x += 30) for (let y = 0; y < 140; y += 30) { ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill() }

      // Preview image (left square)
      const img = new Image(); img.crossOrigin = 'anonymous'
      await new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); img.src = preview })
      ctx.save(); ctx.beginPath(); (ctx as any).roundRect?.(30, 30, 200, 200, 8) ?? ctx.rect(30, 30, 200, 200); ctx.clip(); ctx.drawImage(img, 30, 30, 200, 200); ctx.restore()

      // Craft name
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 34px Georgia, serif'
      ctx.fillText(`${craftIcons[result.class]} ${craftNames[result.class]}`, 250, 80)
      ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.font = '16px Arial'
      ctx.fillText(`📍 ${craftRegions[result.class]}  ·  ${craftHeritage[result.class]}`, 252, 112)

      // Confidence badge
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(252, 122, 210, 34)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Georgia, serif'
      ctx.fillText(`Confiance : ${(result.confidence * 100).toFixed(1)}%`, 262, 146)

      // Divider
      ctx.strokeStyle = 'rgba(184,136,42,0.35)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(30, 258); ctx.lineTo(770, 258); ctx.stroke()

      // Top3 bars
      const top3 = result.top3 ?? [{ class: result.class, confidence: result.confidence }]
      top3.forEach((item, i) => {
        const y = 288 + i * 58
        ctx.fillStyle = dark ? 'rgba(255,255,255,0.7)' : '#1A1208'; ctx.font = `${i === 0 ? 'bold' : 'normal'} 14px Arial`
        ctx.fillText(`${craftIcons[item.class]} ${craftNames[item.class]}`, 30, y)
        ctx.fillStyle = 'var(--terracotta)' ?? '#C4622D'; ctx.font = 'bold 14px Arial'
        ctx.fillStyle = i === 0 ? '#C4622D' : '#8C7355'
        ctx.fillText(`${(item.confidence * 100).toFixed(1)}%`, 740, y)
        ctx.fillStyle = dark ? 'rgba(255,255,255,0.1)' : '#EBD9B4'
        ctx.fillRect(30, y + 7, 500, i === 0 ? 9 : 6)
        ctx.fillStyle = i === 0 ? '#C4622D' : 'rgba(184,136,42,0.4)'
        ctx.fillRect(30, y + 7, item.confidence * 500, i === 0 ? 9 : 6)
      })

      // Branding
      ctx.fillStyle = 'rgba(184,136,42,0.55)'; ctx.font = '12px Arial'
      ctx.fillText('✦ Heritage AI — Classificateur d\'Artisanat Marocain', 30, 480)

      const link = document.createElement('a')
      link.download = `heritage-ai-${craftNames[result.class].toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png'); link.click()
    } catch (e) { console.error(e) }
    setDownloading(false)
  }

  const btn = (active?: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 6, padding: '0.65rem 1rem', borderRadius: 2, cursor: 'pointer',
    fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', fontWeight: 400, transition: 'all 0.2s',
    background: active ? 'var(--terracotta)' : dark ? 'rgba(255,255,255,0.07)' : 'white',
    color: active ? 'white' : dark ? 'rgba(255,255,255,0.7)' : 'var(--muted)',
    border: `1px solid ${active ? 'var(--terracotta)' : dark ? 'rgba(184,136,42,0.3)' : 'rgba(184,136,42,0.25)'}`,
  })

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleCopy} style={btn(copied)}>
        {copied ? <><Check size={13} />Copié !</> : <><Copy size={13} />Copier</>}
      </motion.button>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleTwitter} style={btn()}>
        <Twitter size={13} />Twitter / X
      </motion.button>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleDownload} disabled={downloading} style={btn()}>
        {downloading ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />Export…</> : <><Download size={13} />Télécharger</>}
      </motion.button>
    </motion.div>
  )
}

// ─── Morocco Map — Leaflet ────────────────────────────────────────────────────
function MoroccoMap({ activeCraft, dark }: { activeCraft: string | null; dark: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link)
    }
    if (!document.getElementById('craft-map-styles')) {
      const style = document.createElement('style'); style.id = 'craft-map-styles'
      style.textContent = `
        @keyframes craftPulse { 0%{transform:scale(0.8);opacity:0.9;} 70%{transform:scale(2.6);opacity:0;} 100%{transform:scale(0.8);opacity:0;} }
        .craft-tooltip-label { background:white!important;border:1px solid rgba(184,136,42,0.35)!important;border-radius:3px!important;box-shadow:0 4px 14px rgba(196,98,45,0.18)!important;padding:4px 10px!important;font-family:'Jost',sans-serif!important;font-size:0.72rem!important;letter-spacing:0.14em!important;text-transform:uppercase!important;color:#1A1208!important;white-space:nowrap!important; }
        .craft-tooltip-label::before{display:none!important;}
        .leaflet-control-zoom{border:1px solid rgba(184,136,42,0.25)!important;border-radius:3px!important;}
        .leaflet-control-zoom a{color:#8C7355!important;}
        .leaflet-control-zoom a:hover{background:rgba(196,98,45,0.08)!important;color:#C4622D!important;}
        .leaflet-tile-pane{filter:sepia(0.18) saturate(0.9) brightness(1.04);}
        .leaflet-control-attribution{display:none!important;}
      `; document.head.appendChild(style)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' })
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current!, { center: [31.7917, -7.0926], zoom: 5, zoomControl: true, scrollWheelZoom: false, dragging: true, attributionControl: false })
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map)
        mapInstanceRef.current = map
      }
      const map = mapInstanceRef.current
      if (markerRef.current) { map.removeLayer(markerRef.current); markerRef.current = null }
      if (activeCraft && craftMapCoords[activeCraft]) {
        const { lat, lng, label } = craftMapCoords[activeCraft]
        const customIcon = L.divIcon({ className: '', html: `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(196,98,45,0.15);animation:craftPulse 2s ease-out infinite;"></div><div style="position:absolute;width:30px;height:30px;border-radius:50%;background:rgba(196,98,45,0.22);animation:craftPulse 2s ease-out infinite 0.45s;"></div><div style="position:relative;width:14px;height:14px;border-radius:50%;background:#C4622D;border:2.5px solid white;box-shadow:0 2px 10px rgba(196,98,45,0.65);z-index:10;"></div></div>`, iconSize: [44, 44], iconAnchor: [22, 22] })
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map).bindTooltip(`📍 ${label}`, { permanent: true, direction: 'top', offset: [0, -26], className: 'craft-tooltip-label' })
        markerRef.current = marker; map.flyTo([lat, lng], 7, { duration: 1.4, easeLinearity: 0.4 })
      } else { map.flyTo([31.7917, -7.0926], 5, { duration: 1.2 }) }
    })
  }, [activeCraft])

  useEffect(() => { return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } } }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '280px', borderRadius: 4, overflow: 'hidden', border: `1px solid ${dark ? 'rgba(184,136,42,0.3)' : 'rgba(184,136,42,0.2)'}` }} />
}

// ─── Top 3 Bars ───────────────────────────────────────────────────────────────
function Top3Bars({ top3, dark }: { top3: { class: string; confidence: number }[]; dark: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      {top3.map((item, i) => {
        const isFirst = i === 0
        return (
          <motion.div key={item.class} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {isFirst && <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'white', padding: '2px 6px', borderRadius: 2, fontFamily: 'Jost' }}>✦ Top</span>}
                <span style={{ fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: isFirst ? 600 : 400, color: isFirst ? (dark ? '#F5EDD8' : 'var(--ink)') : 'var(--muted)' }}>
                  {craftIcons[item.class]} {craftNames[item.class]}
                </span>
              </div>
              <span style={{ fontSize: isFirst ? '1.2rem' : '0.9rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: isFirst ? 'var(--terracotta)' : 'var(--muted)' }}>
                {(item.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ height: isFirst ? 7 : 5, background: dark ? 'rgba(255,255,255,0.1)' : 'var(--sand-deep)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.confidence * 100}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                style={{ height: '100%', background: isFirst ? 'linear-gradient(90deg, var(--terracotta), var(--gold-light))' : 'rgba(184,136,42,0.3)', borderRadius: 99 }} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
function CraftGallery({ onImageSelect, dark }: { onImageSelect: (url: string) => void; dark: boolean }) {
  const [activeTab, setActiveTab] = useState<string>('babouche')
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{ background: dark ? '#231A0F' : 'white', border: `1px solid ${dark ? 'rgba(184,136,42,0.3)' : 'rgba(184,136,42,0.2)'}`, borderRadius: 4, overflow: 'hidden', marginTop: '1rem' }}>
      <div style={{ padding: '1rem 1.4rem', borderBottom: `1px solid ${dark ? 'rgba(184,136,42,0.2)' : 'var(--sand-deep)'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ImageIcon size={15} color="var(--gold)" />
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>Galerie d'exemples — cliquez pour analyser</span>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: `1px solid ${dark ? 'rgba(184,136,42,0.2)' : 'var(--sand-deep)'}`, scrollbarWidth: 'none' }}>
        {Object.keys(craftNames).map(key => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '0.65rem 1.1rem', background: 'none', border: 'none', borderBottom: activeTab === key ? '2px solid var(--terracotta)' : '2px solid transparent', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', color: activeTab === key ? 'var(--terracotta)' : 'var(--muted)', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {craftIcons[key]} {craftNames[key]}
          </button>
        ))}
      </div>
      <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        {craftGallery[activeTab].map((url, i) => (
          <motion.div key={url} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.04 }} onClick={() => onImageSelect(url)}
            style={{ aspectRatio: '1', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(184,136,42,0.15)' }}>
            <img src={url} alt={craftNames[activeTab]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200/F5EDD8/B8882A?text=${craftIcons[activeTab]}` }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function ClassifierCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => { setIsTouch('ontouchstart' in window) }, [])
  useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const over = (e: MouseEvent) => { const el = e.target as HTMLElement; setIsHovering(!!(el.closest('button') || el.closest('a') || el.closest('.upload-zone'))) }
    const leave = () => setVisible(false)
    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', over); window.addEventListener('mousedown', down); window.addEventListener('mouseup', up); document.addEventListener('mouseleave', leave)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up); document.removeEventListener('mouseleave', leave) }
  }, [])

  if (isTouch || (!isHovering && !isClicking)) return null
  return (
    <>
      <motion.div animate={{ x: pos.x - 10, y: pos.y - 10, scale: isClicking ? 2 : 1.8, opacity: visible ? 1 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.3 }}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, width: 20, height: 20, pointerEvents: 'none', transform: 'rotate(45deg)', background: isClicking ? 'rgba(196,98,45,0.35)' : 'rgba(196,98,45,0.15)', border: '2px solid var(--terracotta)', transition: 'background 0.15s' }} />
      <motion.div animate={{ x: pos.x - 3, y: pos.y - 3, opacity: visible ? 0.7 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 0.6 }}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 99998, width: 6, height: 6, borderRadius: '50%', background: 'var(--terracotta)', pointerEvents: 'none' }} />
    </>
  )
}

// ─── Feedback Form ────────────────────────────────────────────────────────────
function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return; setSending(true)
    try { await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, message }) }); setSent(true) } catch {} finally { setSending(false) }
  }

  if (sent) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{ maxWidth: 560, margin: '0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,136,42,0.25)', borderRadius: 4, padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>✦</div>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, color: 'white', marginBottom: 8 }}>Merci pour votre retour !</p>
      <button onClick={() => { setSent(false); setMessage(''); setEmail('') }}
        style={{ marginTop: '1.4rem', background: 'none', border: '1px solid rgba(184,136,42,0.3)', color: 'var(--gold)', padding: '0.65rem 1.4rem', borderRadius: 2, cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
        Envoyer un autre message
      </button>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <input type="email" placeholder="Votre email (optionnel)" value={email} onChange={e => setEmail(e.target.value)}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,136,42,0.2)', borderRadius: 2, padding: '0.85rem 1.1rem', color: 'white', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', fontWeight: 300, outline: 'none', width: '100%' }}
        onFocus={e => (e.target.style.borderColor = 'rgba(184,136,42,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(184,136,42,0.2)')} />
      <textarea placeholder="Partagez votre remarque…" value={message} onChange={e => setMessage(e.target.value)} rows={4}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,136,42,0.2)', borderRadius: 2, padding: '0.85rem 1.1rem', color: 'white', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', fontWeight: 300, outline: 'none', resize: 'vertical', width: '100%', lineHeight: 1.7 }}
        onFocus={e => (e.target.style.borderColor = 'rgba(184,136,42,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(184,136,42,0.2)')} />
      <motion.button whileHover={message.trim() ? { scale: 1.02 } : {}} whileTap={message.trim() ? { scale: 0.97 } : {}} onClick={handleSubmit} disabled={!message.trim() || sending}
        style={{ background: message.trim() ? 'var(--terracotta)' : 'rgba(255,255,255,0.07)', color: message.trim() ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 2, padding: '1rem', cursor: message.trim() ? 'pointer' : 'not-allowed', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif', fontWeight: 400, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {sending ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />Envoi…</> : <>✦ Envoyer ma remarque</>}
      </motion.button>
    </motion.div>
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
  const [showGallery, setShowGallery] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [classificationCount, setClassificationCount] = useState(0)
  const { dark, toggle: toggleDark } = useDarkMode() 

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file); setError(null); setResult(null)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) handleFileSelect(e.target.files[0]) }

  const handleGallerySelect = async (url: string) => {
    setError(null); setResult(null); setPreview(url)
    try { const res = await fetch(url); const blob = await res.blob(); setSelectedFile(new File([blob], 'gallery.jpg', { type: blob.type })) }
    catch { setError("Impossible de charger l'image de la galerie") }
    setShowGallery(false)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraOn(true)
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.onloadedmetadata = () => videoRef.current?.play() } }, 100)
    } catch { setError("Impossible d'accéder à la caméra") }
  }

  const capturePhoto = () => {
    const video = videoRef.current; const canvas = canvasRef.current
    if (!video || !canvas || video.videoWidth === 0) return
    const stream = video.srcObject as MediaStream
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext("2d")?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg")
    setPreview(dataUrl)
    fetch(dataUrl).then(r => r.blob()).then(blob => { setSelectedFile(new File([blob], "camera.jpg", { type: "image/jpeg" })) })
    stream.getTracks().forEach(t => t.stop()); setCameraOn(false)
  }

  const stopCamera = () => { if (videoRef.current?.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()) }; setCameraOn(false) }

  const handlePredict = async () => {
    if (!selectedFile) return setError("Sélectionnez une image")
    setLoading(true); setError(null)
    const formData = new FormData(); formData.append("file", selectedFile)
    try {
      const res = await fetch("/api/predict", { method: "POST", body: formData })
      const data = await res.json()
      if (!data.top3) {
        const allClasses = Object.keys(craftNames).filter(c => c !== data.class)
        data.top3 = [{ class: data.class, confidence: data.confidence }, { class: allClasses[0], confidence: data.confidence * 0.35 }, { class: allClasses[1], confidence: data.confidence * 0.15 }]
      }
      setResult(data); setClassificationCount(prev => prev + 1)
    } catch { setError("Erreur lors de la prédiction. Veuillez réessayer.") }
    setLoading(false)
  }

  const handleReset = () => { setPreview(null); setResult(null); setSelectedFile(null); setError(null); stopCamera() }
  const top3 = result?.top3 ?? (result ? [{ class: result.class, confidence: result.confidence }] : [])

  const craftBg: Record<string, string> = {
    babouche: 'radial-gradient(ellipse at 80% 20%, rgba(196,98,45,0.07) 0%, transparent 60%)',
    bijoux:   'radial-gradient(ellipse at 70% 30%, rgba(100,120,180,0.07) 0%, transparent 60%)',
    poterie:  'radial-gradient(ellipse at 60% 40%, rgba(139,61,24,0.08) 0%, transparent 60%)',
    tapis:    'radial-gradient(ellipse at 80% 60%, rgba(120,60,20,0.07) 0%, transparent 60%)',
    zellige:  'radial-gradient(ellipse at 30% 30%, rgba(30,100,160,0.07) 0%, transparent 60%)',
  }

  // Dark mode dynamic background
  const pageBg = dark ? '#100C06' : '#FAF6EE'
  const cardBg = dark ? '#231A0F' : 'white'
  const cardBorder = dark ? 'rgba(184,136,42,0.3)' : 'rgba(184,136,42,0.2)'
  const headingColor = dark ? '#F5EDD8' : 'var(--ink)'

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        :root {
          --terracotta: #C4622D; --terracotta-light: #E07A4F; --terracotta-dark: #8B3D18;
          --sand: #F5EDD8; --sand-deep: #EBD9B4; --gold: #B8882A; --gold-light: #D4A94A;
          --ink: #1A1208; --cream: #FAF6EE; --muted: #8C7355;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; font-size: 18px; }
        body { color: var(--ink); font-family: 'Jost', sans-serif; font-weight: 300; overflow-x: hidden; }
        a, button { cursor: pointer; }
        .zellige-bg { background-color: var(--terracotta-dark); background-image: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 90deg, rgba(255,255,255,0.03) 90deg 180deg), radial-gradient(circle at 25% 25%, rgba(212,169,74,0.15) 0%, transparent 60%), radial-gradient(circle at 75% 75%, rgba(196,98,45,0.2) 0%, transparent 60%); }
        .pattern-overlay { background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0zM30 10L50 30L30 50L10 30L30 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
        .gold-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .upload-zone { border: 1.5px dashed rgba(184,136,42,0.4); transition: all 0.3s ease; cursor: pointer; }
        .upload-zone:hover { border-color: var(--terracotta); box-shadow: 0 12px 40px rgba(196,98,45,0.08); }
        .btn-primary { background: var(--terracotta); color: white; border: none; cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.85rem; }
        .btn-primary:hover:not(:disabled) { background: var(--terracotta-dark); box-shadow: 0 8px 30px rgba(196,98,45,0.35); transform: translateY(-2px); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-ghost { background: transparent; border: 1px solid rgba(184,136,42,0.25); cursor: pointer; transition: all 0.3s ease; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Jost', sans-serif; font-weight: 400; font-size: 0.8rem; }
        .btn-ghost:hover { border-color: var(--terracotta); color: var(--terracotta); }
        .section-label { font-size: 0.78rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); font-weight: 500; display: block; }
        .nav-link { font-size: 0.82rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; font-family: 'Jost', sans-serif; display: flex; align-items: center; gap: 6px; }
        .nav-link:hover { color: var(--terracotta) !important; }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .shimmer-text { background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, #F5D78A 50%, var(--gold-light) 60%, var(--gold) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { h2 { font-size: 2rem !important; } main > div { grid-template-columns: 1fr !important; } .btn-primary, .btn-ghost { width: 100%; } .upload-zone { padding: 2rem 1rem !important; } }
      `}</style>

      <motion.div animate={{ backgroundColor: pageBg }} transition={{ duration: 0.35 }} style={{ minHeight: '100vh', position: 'relative' }}>
        <ClassifierCursor />

        <AnimatePresence>
          {result && (
            <motion.div key={result.class} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
              style={{ position: 'fixed', inset: 0, zIndex: 0, background: craftBg[result.class], pointerEvents: 'none' }} />
          )}
        </AnimatePresence>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* TOP BAR */}
          <div style={{ background: 'var(--ink)', padding: '9px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
              ✦ Classificateur d'Artisanat Marocain — Propulsé par Deep Learning ✦
            </p>
          </div>

          {/* HEADER */}
          <motion.header animate={{ backgroundColor: dark ? '#1A1208' : '#ffffff' }} transition={{ duration: 0.35 }}
            style={{ borderBottom: `1px solid ${cardBorder}`, position: 'sticky', top: 0, zIndex: 50 }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 0', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 38, height: 38, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <span style={{ color: 'white', fontSize: '1rem' }}>◆</span>
                  </div>
                  <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 600, color: headingColor, lineHeight: 1, fontFamily: 'Cormorant Garamond, serif' }}>Heritage AI</h1>
                    <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Classificateur</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <ClassificationCounter count={classificationCount} dark={dark} />
                  <DarkModeToggle dark={dark} onToggle={toggleDark} />
                  <Link href="/" className="nav-link" style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>
                    <ArrowLeft size={15} />Retour à l'accueil
                  </Link>
                </div>
              </div>
            </div>
          </motion.header>

          {/* HERO */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="zellige-bg pattern-overlay" style={{ position: 'absolute', inset: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '4.5rem 2rem', textAlign: 'center' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="section-label" style={{ marginBottom: '0.85rem', color: 'rgba(212,169,74,0.9)' }}>✦ Intelligence Artificielle & Patrimoine</span>
                <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, color: 'white', lineHeight: 1.2, fontFamily: 'Cormorant Garamond, serif' }}>
                  Identifiez un{' '}<span className="shimmer-text" style={{ fontStyle: 'italic' }}>Artisanat Marocain</span>
                </h2>
                <div className="gold-divider" style={{ margin: '1.2rem auto', width: 100 }} />
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto', lineHeight: 1.9, fontWeight: 300 }}>
                  Téléchargez une photo ou utilisez votre caméra — notre modèle de deep learning identifie l'artisanat.
                </p>
              </motion.div>
            </div>
          </div>

          {/* MAIN */}
          <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>

              {/* LEFT COLUMN */}
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span className="section-label" style={{ marginBottom: '0.5rem' }}>✦ Étape 1</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: headingColor, fontFamily: 'Cormorant Garamond, serif' }}>Choisissez une image</h3>
                </div>
                <div className="gold-divider" />

                <AnimatePresence>
                  {cameraOn && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      style={{ background: cardBg, borderRadius: 4, padding: '1.5rem', border: `1px solid ${cardBorder}`, boxShadow: '0 8px 30px rgba(196,98,45,0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E74C3C' }} />
                          <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Caméra active</span>
                        </div>
                        <button onClick={stopCamera} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={17} /></button>
                      </div>
                      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', borderRadius: 2, display: 'block' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                        <button onClick={stopCamera} className="btn-ghost" style={{ padding: '0.85rem', borderRadius: 2, color: 'var(--muted)' }}>Annuler</button>
                        <button onClick={capturePhoto} className="btn-primary" style={{ padding: '0.85rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Camera size={15} />Capturer
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {preview && !cameraOn && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ background: cardBg, borderRadius: 4, overflow: 'hidden', border: `1px solid ${cardBorder}`, boxShadow: '0 8px 30px rgba(196,98,45,0.08)' }}>
                      <div style={{ padding: '0.85rem 1.1rem', borderBottom: `1px solid ${dark ? 'rgba(184,136,42,0.15)' : 'var(--sand-deep)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>Image sélectionnée</span>
                        <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
                          <RefreshCw size={13} />Changer
                        </button>
                      </div>
                      <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!preview && !cameraOn && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <motion.div className="upload-zone"
                      animate={isDragging ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.2 }}
                      style={{ borderRadius: 4, padding: '3.5rem 2rem', textAlign: 'center', border: '1.5px dashed rgba(184,136,42,0.4)', background: cardBg }}
                      onClick={() => fileInputRef.current?.click()}
                      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }}
                      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file && file.type.startsWith('image/')) handleFileSelect(file); else setError('Veuillez déposer une image valide') }}>
                      <div style={{ width: 56, height: 56, borderRadius: 2, background: dark ? '#2E2010' : 'var(--sand)', border: '1px solid rgba(184,136,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                        <Upload size={24} color="var(--terracotta)" />
                      </div>
                      <p style={{ fontSize: '1.05rem', fontWeight: 500, color: headingColor, marginBottom: 6, fontFamily: 'Jost, sans-serif' }}>Télécharger une image</p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1.4rem', lineHeight: 1.7 }}>Glissez-déposez ou cliquez pour parcourir</p>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'Jost, sans-serif', border: '1px solid rgba(184,136,42,0.3)', padding: '7px 16px', borderRadius: 2 }}>Choisir un fichier</span>
                    </motion.div>
                  </motion.div>
                )}

                <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileInput} />
                <AnimatePresence>{showGallery && !preview && <CraftGallery onImageSelect={handleGallerySelect} dark={dark} />}</AnimatePresence>
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ background: '#FEF2F0', border: '1px solid rgba(196,98,45,0.3)', borderRadius: 2, padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--terracotta)', fontFamily: 'Jost, sans-serif' }}>{error}</span>
                      <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={15} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* RIGHT COLUMN */}
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span className="section-label" style={{ marginBottom: '0.5rem' }}>✦ Étape 2</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: headingColor, fontFamily: 'Cormorant Garamond, serif' }}>Résultat de l'analyse</h3>
                </div>
                <div className="gold-divider" />

                <AnimatePresence>
                  {preview && !result && (
                    <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handlePredict} disabled={loading} className="btn-primary"
                      style={{ width: '100%', padding: '1.2rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      {loading ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />Analyse en cours...</> : <><Sparkles size={16} />Lancer la Classification<ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} /></>}
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ background: cardBg, borderRadius: 4, padding: '3.5rem 2rem', textAlign: 'center', border: `1px solid ${cardBorder}` }}>
                      <div style={{ width: 58, height: 58, border: `2px solid ${dark ? 'rgba(184,136,42,0.2)' : 'var(--sand-deep)'}`, borderTop: '2px solid var(--terracotta)', borderRadius: '50%', margin: '0 auto 1.8rem', animation: 'spin 1s linear infinite' }} />
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontStyle: 'italic', color: headingColor, marginBottom: 8 }}>Analyse en cours…</p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>Notre modèle examine votre image</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {result && !loading && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 80 }}
                      style={{ background: cardBg, borderRadius: 4, overflow: 'hidden', border: `1px solid ${cardBorder}` }}>
                      {/* Result header */}
                      <div style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--terracotta-dark))', padding: '2.2rem 2rem', position: 'relative', overflow: 'hidden' }}>
                        <div className="pattern-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <CheckCircle size={20} color="rgba(255,255,255,0.9)" />
                              <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: 'Jost, sans-serif' }}>Artisanat Identifié</span>
                            </div>
                            <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><X size={17} /></button>
                          </div>
                          <h3 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 600, color: 'white', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>
                            {craftIcons[result.class]} {craftNames[result.class]}
                          </h3>
                          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginTop: 8, fontFamily: 'Jost', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MapPin size={13} />{craftRegions[result.class]} · {craftHeritage[result.class]}
                          </p>
                        </div>
                      </div>

                      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                        {/* Share + Download */}
                        <div>
                          <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Share2 size={12} color="var(--gold)" />Partager & Exporter
                          </p>
                          <ShareDownloadBar result={result} preview={preview} dark={dark} />
                        </div>

                        <div className="gold-divider" />

                        {/* Top 3 */}
                        <div>
                          <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '1rem' }}>✦ Top 3 Prédictions</p>
                          <Top3Bars top3={top3} dark={dark} />
                        </div>

                        <div className="gold-divider" />

                        {/* Map */}
                        <div>
                          <p style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MapPin size={12} color="var(--gold)" />Région d'origine — Maroc
                          </p>
                          <MoroccoMap activeCraft={result.class} dark={dark} />
                        </div>

                        {/* Heritage */}
                        <div style={{ padding: '1.1rem', background: dark ? '#2E2010' : 'var(--sand)', border: `1px solid ${dark ? 'rgba(184,136,42,0.2)' : 'rgba(184,136,42,0.15)'}`, borderRadius: 2, textAlign: 'center' }}>
                          <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5, fontFamily: 'Jost' }}>Héritage</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: headingColor, fontFamily: 'Cormorant Garamond, serif' }}>{craftHeritage[result.class]}</p>
                        </div>

                        <button onClick={handleReset} className="btn-ghost" style={{ width: '100%', padding: '1rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--muted)' }}>
                          <RefreshCw size={14} />Nouvelle analyse
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {!preview && !cameraOn && !result && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ background: cardBg, borderRadius: 4, padding: '4.5rem 2rem', textAlign: 'center', border: `1px solid ${dark ? 'rgba(184,136,42,0.2)' : 'rgba(184,136,42,0.15)'}`, boxShadow: '0 4px 20px rgba(196,98,45,0.04)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1.4rem', opacity: 0.25 }}>◆</div>
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: headingColor, marginBottom: 10, opacity: 0.6 }}>Le résultat apparaîtra ici</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>Importez une image ou utilisez la galerie d'exemples pour démarrer</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </main>

          {/* FOOTER */}
          <footer style={{ background: 'var(--ink)', color: 'white', padding: '3.5rem 0 2.5rem', marginTop: '2rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>✦ Vos Remarques</span>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600, color: 'white', marginTop: 6, lineHeight: 1.3 }}>Une suggestion ? Un retour ?</p>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', marginTop: 6, fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>Votre avis nous aide à améliorer Heritage AI</p>
                </div>
                <FeedbackForm />
              </div>
              <div className="gold-divider" style={{ marginBottom: '1.5rem' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <span style={{ color: 'white', fontSize: '0.75rem' }}>◆</span>
                  </div>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600 }}>Heritage AI</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Jost, sans-serif' }}>© 2026 Heritage AI — Tous droits réservés</p>
              </div>
            </div>
          </footer>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </motion.div>
    </>
  )
}