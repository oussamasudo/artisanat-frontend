'use client'

import React, { useState, useRef } from "react"
import Link from 'next/link'
import { Upload, Camera, Loader2, CheckCircle, Sparkles, ArrowLeft, X, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PredictionResult {
  class: string
  confidence: number
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

export default function ClassifierPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraOn, setCameraOn] = useState(false)

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
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
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg")
    setPreview(dataUrl)
    fetch(dataUrl).then(res => res.blob()).then(blob => {
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

  const confidencePct = result ? (result.confidence * 100).toFixed(1) : '0'

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

        .confidence-track {
          height: 7px;
          background: var(--sand-deep);
          border-radius: 99px;
          overflow: hidden;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }



        /* ================= MOBILE CLASSIFIER ================= */

@media (max-width: 768px) {


  /* HEADER */

  header > div > div {

    flex-direction: column;

    align-items: flex-start;

    gap: 1rem;

  }


  /* HERO */

  h2 {

    font-size: 2rem !important;

  }


  /* MAIN GRID -> devient vertical */

  main > div {

    grid-template-columns: 1fr !important;

  }


  /* CAMERA BUTTONS */

  video {

    width: 100% !important;

    height: auto !important;

  }


  /* RESULT CARD */

  .confidence-track {

    height: 6px;

  }


  /* BUTTONS */

  .btn-primary,
  .btn-ghost {

    width: 100%;

  }


  /* UPLOAD ZONE */

  .upload-zone {

    padding: 2rem 1rem !important;

  }


  /* CRAFT LEGEND */

  main > div:last-child > div {

    grid-template-columns: repeat(2, 1fr) !important;

  }


  /* FOOTER */

  footer div div {

    flex-direction: column;

    gap: 1rem;

    text-align: center;

  }

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
                Téléchargez une photo ou utilisez votre caméra — notre modèle de deep learning identifie l'artisanat .
              </p>
            </motion.div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            {/* LEFT COLUMN */}
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ background: 'white', borderRadius: 4, padding: '1.5rem', border: '1px solid rgba(184,136,42,0.2)', boxShadow: '0 8px 30px rgba(196,98,45,0.08)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E74C3C' }} />
                        <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>
                          Caméra active
                        </span>
                      </div>
                      <button onClick={stopCamera} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                        <X size={17} />
                      </button>
                    </div>
                    <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', borderRadius: 2, display: 'block' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                      <button onClick={stopCamera} className="btn-ghost" style={{ padding: '0.85rem', borderRadius: 2 }}>
                        Annuler
                      </button>
                      <button onClick={capturePhoto} className="btn-primary" style={{ padding: '0.85rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Camera size={15} />
                        Capturer
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image preview */}
              <AnimatePresence>
                {preview && !cameraOn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: 'white', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(184,136,42,0.2)', boxShadow: '0 8px 30px rgba(196,98,45,0.08)' }}
                  >
                    <div style={{ padding: '0.85rem 1.1rem', borderBottom: '1px solid var(--sand-deep)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>
                        Image sélectionnée
                      </span>
                      <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Jost, sans-serif' }}>
                        <RefreshCw size={13} />
                        Changer
                      </button>
                    </div>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              {!preview && !cameraOn && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
                >
                  <div
                    className="upload-zone"
                    style={{ borderRadius: 4, padding: '3.5rem 2rem', textAlign: 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 2, background: 'var(--sand)', border: '1px solid rgba(184,136,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                      <Upload size={24} color="var(--terracotta)" />
                    </div>
                    <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 6, fontFamily: 'Jost, sans-serif' }}>
                      Télécharger une image
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1.4rem', lineHeight: 1.7 }}>
                      Cliquez pour parcourir ou glissez-déposez une image
                    </p>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'Jost, sans-serif', border: '1px solid rgba(184,136,42,0.3)', padding: '7px 16px', borderRadius: 2 }}>
                      Choisir un fichier
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="gold-divider" style={{ flex: 1 }} />
                    <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>ou</span>
                    <div className="gold-divider" style={{ flex: 1 }} />
                  </div>

                  <div
                    className="upload-zone"
                    style={{ borderRadius: 4, padding: '1.6rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}
                    onClick={startCamera}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 2, background: 'var(--sand)', border: '1px solid rgba(184,136,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Camera size={20} color="var(--terracotta)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--ink)', marginBottom: 3, fontFamily: 'Jost, sans-serif' }}>
                        Capturer une photo
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        Utiliser votre caméra en direct
                      </p>
                    </div>
                    <ArrowLeft size={15} color="var(--muted)" style={{ marginLeft: 'auto', transform: 'rotate(180deg)' }} />
                  </div>
                </motion.div>
              )}

              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileInput} />

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ background: '#FEF2F0', border: '1px solid rgba(196,98,45,0.3)', borderRadius: 2, padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '0.9rem', color: 'var(--terracotta)', fontFamily: 'Jost, sans-serif' }}>{error}</span>
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                      <X size={15} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* RIGHT COLUMN */}
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePredict}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.2rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Lancer la Classification
                        <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} />
                      </>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Loading state */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: 'white', borderRadius: 4, padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid rgba(184,136,42,0.2)' }}
                  >
                    <div style={{ width: 58, height: 58, border: '2px solid var(--sand-deep)', borderTop: '2px solid var(--terracotta)', borderRadius: '50%', margin: '0 auto 1.8rem', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>
                      Analyse en cours…
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
                      Notre modèle examine votre image
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result card */}
              <AnimatePresence>
                {result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
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
                          {craftNames[result.class]}
                        </h3>
                      </div>
                    </div>

                    {/* Result body */}
                    <div style={{ padding: '2rem' }}>
                      {/* Confidence */}
                      <div style={{ marginBottom: '1.8rem', padding: '1.4rem', background: 'var(--sand)', borderRadius: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.9rem' }}>
                          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>
                            Niveau de confiance
                          </span>
                          <span style={{ fontSize: '2.2rem', fontWeight: 600, color: 'var(--terracotta)', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>
                            {confidencePct}%
                          </span>
                        </div>
                        <div className="confidence-track">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence * 100}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, var(--terracotta), var(--gold-light))', borderRadius: 99 }}
                          />
                        </div>
                      </div>

                      {/* Heritage badge */}
                      <div style={{ marginBottom: '1.8rem' }}>
                        <div style={{ padding: '1.1rem', background: 'white', border: '1px solid rgba(184,136,42,0.2)', borderRadius: 2, textAlign: 'center' }}>
                          <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 5, fontFamily: 'Jost, sans-serif' }}>Héritage</p>
                          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'Cormorant Garamond, serif' }}>{craftHeritage[result.class]}</p>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={handleReset}
                        className="btn-ghost"
                        style={{ width: '100%', padding: '1rem', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                      >
                        <RefreshCw size={14} />
                        Nouvelle analyse
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder */}
              <AnimatePresence>
                {!preview && !cameraOn && !result && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ background: 'white', borderRadius: 4, padding: '4.5rem 2rem', textAlign: 'center', border: '1px solid rgba(184,136,42,0.15)', boxShadow: '0 4px 20px rgba(196,98,45,0.04)' }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1.4rem', opacity: 0.25 }}>◆</div>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--ink)', marginBottom: 10, opacity: 0.6 }}>
                      Le résultat apparaîtra ici
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>
                      Importez une image ou capturez une photo pour démarrer l'identification
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Craft legend bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ marginTop: '4.5rem', paddingTop: '3.5rem', borderTop: '1px solid rgba(184,136,42,0.2)' }}
          >
            <p className="section-label" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              ✦ Artisanats Reconnus ✦
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {Object.keys(craftNames).map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  style={{ padding: '1.4rem 1rem', background: 'white', border: '1px solid rgba(184,136,42,0.15)', borderRadius: 12, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.25 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ fontSize: '2.2rem', marginBottom: '0.6rem', lineHeight: 1, display: 'inline-block' }}
                  >
                    {craftIcons[key]}
                  </motion.div>
                    <p style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    fontFamily: 'Cormorant Garamond, serif',
                    transition: 'color 0.3s'
                    }}>
                    {craftNames[key]}
                    </p>                </motion.div>
              ))}
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