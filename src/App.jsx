import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import welcome from './welcome.md?raw'
import mug from './stickers/mug.png'
import heart from './stickers/heart.png'
import goblet from './stickers/goblet.png'
import bow from './stickers/bow1.png'
import teacup from './stickers/teacup.png'
import heartmug from './stickers/heartmug.png'

// Stickers: [image, CSS position/size, rotation deg, mirrored?]. Edit/add/remove freely.
// Corner stickers hang off the content panel. Only at the start and end of a post.
const HANG = [
  [bow, { top: -32, left: -26, width: 84 }, -14],
  [bow, { top: -32, right: -26, width: 84 }, 14, true],
  [heart, { top: 80, left: -30, width: 44 }, -12],
  [mug, { top: 90, right: -32, width: 56 }, 8],
  [heartmug, { bottom: -46, left: -38, width: 58 }, -6],
  [goblet, { bottom: 130, left: -26, width: 44 }, -8],
  [heart, { bottom: 100, right: -28, width: 44 }, 12],
  [teacup, { bottom: -48, right: 40, width: 84 }, 6],
]

const Stickers = ({ items }) => items.map(([src, pos, rot, flip], i) => (
  <img key={i} src={src} alt="" className="stk"
    style={{ ...pos, transform: `rotate(${rot}deg)${flip ? ' scaleX(-1)' : ''}` }} />
))

// ---- Site settings: change these ----
const SITE = { title: 'CTF Writeups', tagline: 'Notes from the challenges I solve.' }

// One .md per CTF in src/writeups. Slug = filename. Each "## Heading" is a challenge.
const files = import.meta.glob('./writeups/*.md', { query: '?raw', import: 'default', eager: true })

// Minimal frontmatter: `key: value` lines between --- fences. tags: a, b, c
function parse(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta = {}
  if (m) for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m ? m[2] : raw }
}

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// "Title [web, sqli]" -> { title, tags }
const heading = t => {
  const m = t.match(/^(.*?)\s*\[([^\]]*)\]\s*$/)
  return m ? { title: m[1], tags: m[2].split(',').map(x => x.trim()).filter(Boolean) } : { title: t, tags: [] }
}

const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parse(raw)
    // challenge list = "## " headings outside code fences
    const challenges = body.replace(/```[\s\S]*?```/g, '')
      .split(/\r?\n/).filter(l => l.startsWith('## ')).map(l => heading(l.slice(3).trim()))
    return {
      slug, body, challenges,
      title: meta.title || slug,
      date: meta.date || '',
      description: meta.description || '',
      tags: (meta.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

const useHash = () => {
  const [h, setH] = useState(location.hash.slice(1))
  useEffect(() => {
    const f = () => { setH(location.hash.slice(1)); scrollTo(0, 0) }
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  return h
}

const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

// h2 gets an id so the sidebar can scroll to it (hash is taken by the router)
const H2 = ({ children }) => {
  const { title, tags } = heading([].concat(children).join(''))
  return <h2 id={slugify(title)}>{title}{tags.map(t => <span key={t} className="tag">{t}</span>)}</h2>
}

function Sidebar({ current, onNavigate }) {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const allTags = [...new Set(posts.flatMap(p => p.challenges.flatMap(c => c.tags)))].sort()
  const shown = posts.filter(p =>
    (!tag || p.challenges.some(c => c.tags.includes(tag))) &&
    `${p.title} ${p.tags.join(' ')} ${p.challenges.map(c => c.title + c.tags.join(' ')).join(' ')}`.toLowerCase().includes(q.toLowerCase()))
  const go = (slug, c) => {
    onNavigate()
    if (slug === current) return jump(slugify(c.title))
    location.hash = `/${slug}`
    setTimeout(() => jump(slugify(c.title)), 100)
  }
  // timeline: group by "Month Year", posts are already newest-first
  const groups = []
  for (const p of shown) {
    const d = new Date(p.date)
    const label = isNaN(d) ? 'Undated' : d.toLocaleString('en', { month: 'long', year: 'numeric' })
    if (groups.at(-1)?.label !== label) groups.push({ label, items: [] })
    groups.at(-1).items.push(p)
  }
  return (
    <nav className="side">
      <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="chips">
        {allTags.map(t => (
          <button key={t} className={t === tag ? 'tag on' : 'tag'} onClick={() => setTag(t === tag ? '' : t)}>{t}</button>
        ))}
      </div>
      {groups.map(g => (
        <div key={g.label} className="group">
          <div className="month">{g.label}</div>
          {g.items.map(p => (
            <div key={p.slug} className="entry">
              <a href={`#/${p.slug}`} onClick={onNavigate} className={p.slug === current ? 'on' : ''}>{p.title}</a>
              {(p.slug === current || tag) && p.challenges.filter(c => !tag || c.tags.includes(tag)).map(c => (
                <a key={c.title} className="chal" onClick={() => go(p.slug, c)}>
                  {c.title} <small>{c.tags.join(' · ')}</small>
                </a>
              ))}
            </div>
          ))}
        </div>
      ))}
      {!shown.length && <p className="meta">Nothing found.</p>}
    </nav>
  )
}

function List() {
  return <>
    <section className="welcome"><Markdown remarkPlugins={[remarkGfm]}>{welcome}</Markdown></section>
    {posts.map(p => (
    <a key={p.slug} className="card" href={`#/${p.slug}`}>
      <h2>{p.title}</h2>
      <div className="meta">{[p.date, `${p.challenges.length} challenges`].join(' · ')}</div>
      {p.description && <div>{p.description}</div>}
      <div>{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
    </a>
  ))}
  </>
}

// Photo with an enlarge button; click it (or the photo) for a popup, click/Esc to close
const Img = ({ src, alt }) => {
  const [big, setBig] = useState(false)
  useEffect(() => {
    if (!big) return
    const f = e => e.key === 'Escape' && setBig(false)
    addEventListener('keydown', f)
    return () => removeEventListener('keydown', f)
  }, [big])
  return (
    <span className="pic">
      <img src={src} alt={alt} onClick={() => setBig(true)} />
      <button className="zoom" onClick={() => setBig(true)} aria-label="Enlarge photo">🔍</button>
      {big && <span className="lightbox" onClick={() => setBig(false)}><img src={src} alt={alt} /></span>}
    </span>
  )
}

function Post({ slug }) {
  const p = posts.find(x => x.slug === slug)
  if (!p) return <p>Not found. <a href="#/">Back</a></p>
  return (
    <article>
      <h1>{p.title}</h1>
      <div className="meta">{p.date}</div>
      {p.description && <p className="desc">{p.description}</p>}
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{ h2: H2, img: Img }}>{p.body}</Markdown>
    </article>
  )
}

export default function App() {
  const slug = useHash().replace(/^\//, '')
  const [open, setOpen] = useState(innerWidth > 800)
  const closeOnMobile = () => innerWidth <= 800 && setOpen(false)
  return (
    <div className={open ? 'layout open' : 'layout'}>
      <header>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <a href="#/"><strong>{SITE.title}</strong></a>
        <span className="meta">{SITE.tagline}</span>
      </header>
      <Sidebar current={slug} onNavigate={closeOnMobile} />
      <main className={slug ? 'post' : ''}>{slug ? <><Post slug={slug} /><Stickers items={HANG} /></> : <List />}</main>
    </div>
  )
}
