import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, 'data', 'books.json')
const PORT = 3001
const ADMIN_PASSWORD = 'admin123'
const ADMIN_TOKEN = 'demo-admin-token'

const app = express()
app.use(cors())
app.use(express.json())

function readBooks() {
  const books = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
  if (!Array.isArray(books)) throw new Error('books.json must contain a list')
  return books
}

function writeBooks(books) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(books, null, 2))
}

function requireAdmin(req, res, next) {
  if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Please sign in as admin' })
  }
  next()
}

function cleanBook(body) {
  const title = String(body.title ?? '').trim()
  const author = String(body.author ?? '').trim()
  const category = String(body.category ?? '').trim() || 'General'
  const description = String(body.description ?? '').trim()
  const cover = String(body.cover ?? '').trim()
  const price = Number(body.price)
  const stock = Number(body.stock)

  if (!title || !author) return { error: 'Title and author are required' }
  if (title.length > 120 || author.length > 80) return { error: 'Title or author is too long' }
  if (!Number.isFinite(price) || price < 0 || price > 10000) {
    return { error: 'Enter a price from 0 to 10000' }
  }
  if (!Number.isInteger(stock) || stock < 0 || stock > 10000) {
    return { error: 'Stock must be a whole number from 0 to 10000' }
  }
  if (category.length > 40) return { error: 'Category must be 40 characters or less' }
  if (description.length > 400) return { error: 'Description must be 400 characters or less' }
  if (cover && !/^https?:\/\//i.test(cover)) {
    return { error: 'Cover link must start with http:// or https://' }
  }

  return {
    value: {
      title,
      author,
      category,
      description,
      cover,
      price: Math.round(price * 100) / 100,
      stock
    }
  }
}

function nextId(books) {
  const max = books.reduce((highest, book) => Math.max(highest, Number(book.id) || 0), 0)
  return String(max + 1)
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/login', (req, res) => {
  if (String(req.body?.password ?? '') !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' })
  }
  res.json({ token: ADMIN_TOKEN })
})

app.get('/api/books', (_req, res) => {
  try {
    res.json(readBooks())
  } catch {
    res.status(500).json({ error: 'Could not read the library' })
  }
})

app.get('/api/books/:id', (req, res) => {
  try {
    const book = readBooks().find((item) => item.id === req.params.id)
    if (!book) return res.status(404).json({ error: 'Book not found' })
    res.json(book)
  } catch {
    res.status(500).json({ error: 'Could not read the library' })
  }
})

app.post('/api/books', requireAdmin, (req, res) => {
  const parsed = cleanBook(req.body || {})
  if (parsed.error) return res.status(400).json({ error: parsed.error })

  try {
    const books = readBooks()
    const book = { id: nextId(books), ...parsed.value }
    books.unshift(book)
    writeBooks(books)
    res.status(201).json(book)
  } catch {
    res.status(500).json({ error: 'Could not save the book' })
  }
})

app.put('/api/books/:id', requireAdmin, (req, res) => {
  const parsed = cleanBook(req.body || {})
  if (parsed.error) return res.status(400).json({ error: parsed.error })

  try {
    const books = readBooks()
    const index = books.findIndex((item) => item.id === req.params.id)
    if (index === -1) return res.status(404).json({ error: 'Book not found' })
    books[index] = { id: books[index].id, ...parsed.value }
    writeBooks(books)
    res.json(books[index])
  } catch {
    res.status(500).json({ error: 'Could not update the book' })
  }
})

app.delete('/api/books/:id', requireAdmin, (req, res) => {
  try {
    const books = readBooks()
    const next = books.filter((item) => item.id !== req.params.id)
    if (next.length === books.length) return res.status(404).json({ error: 'Book not found' })
    writeBooks(next)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Could not delete the book' })
  }
})

app.post('/api/checkout', (req, res) => {
  const items = req.body?.items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty' })
  }

  try {
    const books = readBooks()
    const planned = []

    for (const item of items) {
      const qty = Number(item.qty)
      const book = books.find((entry) => entry.id === String(item.id ?? ''))
      if (!book) {
        return res.status(400).json({ error: 'A book in your cart is no longer available' })
      }
      if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ error: 'Invalid quantity' })
      }
      if (qty > book.stock) {
        return res.status(400).json({ error: `Only ${book.stock} left for ${book.title}` })
      }
      planned.push({ book, qty })
    }

    for (const { book, qty } of planned) book.stock -= qty
    writeBooks(books)
    res.json({ message: 'Order placed' })
  } catch {
    res.status(500).json({ error: 'Could not place the order' })
  }
})

app.listen(PORT, () => {
  console.log(`Bookstore API running at http://localhost:${PORT}`)
})
