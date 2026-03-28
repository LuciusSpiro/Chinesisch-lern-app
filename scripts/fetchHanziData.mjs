/**
 * One-time script to download hanzi-writer character data for all characters
 * in the vocabulary list. Run with: npm run fetch-hanzi
 *
 * Output: public/hanzi-data/{char}.json
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, '..', 'src', 'data', 'vokabeln-hsk-b1.json')
const outDir = path.join(__dirname, '..', 'public', 'hanzi-data')

const raw = await fs.readFile(dataPath, 'utf-8')
const vocab = JSON.parse(raw)

// Collect all unique characters
const chars = new Set()
for (const entry of vocab) {
  // All individual characters from the word
  for (const ch of entry.zeichen) {
    chars.add(ch)
  }
  // All component characters
  if (entry.komponenten) {
    for (const ch of Object.keys(entry.komponenten)) {
      chars.add(ch)
    }
  }
}

console.log(`Fetching data for ${chars.size} unique characters...`)
await fs.mkdir(outDir, { recursive: true })

let ok = 0, fail = 0
for (const char of chars) {
  const encoded = encodeURIComponent(char)
  const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encoded}.json`
  const outFile = path.join(outDir, `${char}.json`)

  // Skip if already downloaded
  try {
    await fs.access(outFile)
    ok++
    continue
  } catch { /* not cached, download it */ }

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  MISSING: ${char} (${res.status})`)
      fail++
      continue
    }
    const text = await res.text()
    await fs.writeFile(outFile, text, 'utf-8')
    ok++
    process.stdout.write(`  ✓ ${char}\r`)
  } catch (err) {
    console.error(`  ERROR: ${char}: ${err.message}`)
    fail++
  }
}

console.log(`\nDone: ${ok} downloaded, ${fail} failed`)
if (fail > 0) {
  console.log('Failed characters will show an empty box in the app.')
}
