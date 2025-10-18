"use client"

import { useState, useEffect } from "react"

const TAGS = [
  "DeFi",
  "DEX",
  "Perps",
  "L1",
  "L2",
  "L3",
  "ZK",
  "FHE",
  "RWA",
  "Framework",
  "Based Rollup",
  "Abstraction",
  "Wallet",
  "Payment",
  "Restaking",
  "Gambling",
  "AI",
  "Terminal",
  "Bridge",
  "Privacy",
  "Lending",
]

interface Project {
  id: number
  link: string
  date: string
  tags: string[]
  created_at: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError })
  }

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Loading error")

      const data = await response.json()
      setProjects(data)
      setLoading(false)
    } catch (error) {
      console.error("Error loading projects:", error)
      showToast("Error loading projects", true)
      setLoading(false)
    }
  }

  const toggleFilter = (tag: string) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(tag)) {
      newFilters.delete(tag)
    } else {
      newFilters.add(tag)
    }
    setActiveFilters(newFilters)
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.link.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = activeFilters.size === 0 || p.tags.some((tag) => activeFilters.has(tag))
    return matchesSearch && matchesTags
  })

  const copyToClipboard = (address: string, chain: string) => {
    navigator.clipboard.writeText(address)
    showToast(`${chain} address copied!`)
  }

  return (
    <>
      <div className="grid-background"></div>
      <div className="glow-orbs"></div>

      <div className="container">
        <header>
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-link"></i>
            </div>
            <h1>LaJota's Latest Alphas</h1>
          </div>
          <p className="subtitle">Discovering the latest web3 projects.</p>
        </header>

        <div className="controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              id="searchInput"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-glow"></div>
          </div>
        </div>

        <div className="filter-tags">
          {TAGS.map((tag) => (
            <div
              key={tag}
              className={`tag-filter ${activeFilters.has(tag) ? "active" : ""}`}
              onClick={() => toggleFilter(tag)}
            >
              {tag}
            </div>
          ))}
        </div>

        <div className="projects-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="loading-state">
              <i className={`fas fa-${searchTerm || activeFilters.size > 0 ? "search" : "rocket"}`}></i>
              <p>{searchTerm || activeFilters.size > 0 ? "No projects found" : "No projects yet."}</p>
            </div>
          ) : (
            filteredProjects.map((p) => {
              const url = new URL(p.link.startsWith("http") ? p.link : "https://" + p.link)
              const domain = url.hostname.replace("www.", "")

              return (
                <div key={p.id} className="project-card">
                  <div className="project-header">
                    <div className="project-logo">
                      <img
                        src={`https://logo.clearbit.com/${domain}`}
                        alt={`${domain} logo`}
                        onError={(e) => {
                          e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                        }}
                      />
                    </div>
                    <div className="project-title">
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        {p.link} <i className="fas fa-external-link-alt"></i>
                      </a>
                      <div className="project-date">
                        <i className="fas fa-calendar"></i>
                        {new Date(p.date).toLocaleDateString("en-US")}
                      </div>
                    </div>
                  </div>
                  <div className="project-tags">
                    {p.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <footer className="donation-section">
          <p className="donation-text">Thank you for using this dashboard ! If you want support the project:</p>
          <div className="wallet-list">
            <div
              className="wallet-item"
              onClick={() => copyToClipboard("bc1qys3654z5qxaxsestykx78jfpwzeut6q4jq0j88", "Bitcoin")}
            >
              <span className="wallet-label">BTC:</span>
              <code className="wallet-address">bc1qys3654z5qxaxsestykx78jfpwzeut6q4jq0j88</code>
            </div>
            <div
              className="wallet-item"
              onClick={() => copyToClipboard("0x6a5390FeFe51b3c102a65E80C570ac67a6b7ABbd", "EVM")}
            >
              <span className="wallet-label">EVM:</span>
              <code className="wallet-address">0x6a5390FeFe51b3c102a65E80C570ac67a6b7ABbd</code>
            </div>
            <div
              className="wallet-item"
              onClick={() => copyToClipboard("AacPVJ1XH9XXNzsLQRjCi5rN5hxZvXfSzT1HYAf3HpbH", "Solana")}
            >
              <span className="wallet-label">SOL:</span>
              <code className="wallet-address">AacPVJ1XH9XXNzsLQRjCi5rN5hxZvXfSzT1HYAf3HpbH</code>
            </div>
          </div>
        </footer>
      </div>

      {toast && <div className={`toast show ${toast.isError ? "error" : ""}`}>{toast.message}</div>}
    </>
  )
}
