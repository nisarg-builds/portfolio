export interface TreemapColor {
  bg: string
  border: string
  text: string
}

export interface TreemapCell {
  type: 'project' | 'stub'
  projectIndex?: number
  gridArea: string
  color: TreemapColor
  size: 'lg' | 'md' | 'sm'
}

/* Toybox hue assignments per project order (docs/07 §3.3).
   `bg` is the cell surface, `border` is always ink, `text` is ink on light
   hues and paper on blurple/grape. */
export const TREEMAP_COLORS: TreemapColor[] = [
  { bg: '#4b48e8', border: '#101010', text: '#fbfdf7' }, // blurple — featured
  { bg: '#ddf163', border: '#101010', text: '#101010' }, // lime
  { bg: '#29b5ef', border: '#101010', text: '#101010' }, // sky
  { bg: '#ff7a1f', border: '#101010', text: '#101010' }, // tangerine
  { bg: '#c8bcf4', border: '#101010', text: '#101010' }, // lilac
  { bg: '#2fbe5b', border: '#101010', text: '#101010' }, // grass
]

/* Stubs sit on a deeper canvas well; `text` doubles as the sticker-shape hue */
export const STUB_COLORS: TreemapColor[] = [
  { bg: '#e2ecd2', border: '#e2ecd2', text: '#8655ec' }, // grape shape
  { bg: '#e2ecd2', border: '#e2ecd2', text: '#f421be' }, // punch shape
  { bg: '#e2ecd2', border: '#e2ecd2', text: '#29b5ef' }, // sky shape
  { bg: '#e2ecd2', border: '#e2ecd2', text: '#2fbe5b' }, // grass shape
  { bg: '#e2ecd2', border: '#e2ecd2', text: '#ff7a1f' }, // tangerine shape
]

const GRID_ROWS = 4
const GRID_COLS = 6

interface CellTemplate {
  rowStart: number
  colStart: number
  rowEnd: number
  colEnd: number
  size: 'lg' | 'md' | 'sm'
}

const LAYOUTS: Record<number, CellTemplate[]> = {
  3: [
    { rowStart: 1, colStart: 1, rowEnd: 4, colEnd: 4, size: 'lg' },
    { rowStart: 1, colStart: 4, rowEnd: 3, colEnd: 7, size: 'md' },
    { rowStart: 3, colStart: 4, rowEnd: 5, colEnd: 7, size: 'md' },
  ],
  4: [
    { rowStart: 1, colStart: 1, rowEnd: 4, colEnd: 4, size: 'lg' },
    { rowStart: 1, colStart: 4, rowEnd: 3, colEnd: 6, size: 'md' },
    { rowStart: 3, colStart: 4, rowEnd: 5, colEnd: 6, size: 'md' },
    { rowStart: 1, colStart: 6, rowEnd: 3, colEnd: 7, size: 'sm' },
  ],
  5: [
    { rowStart: 1, colStart: 1, rowEnd: 4, colEnd: 4, size: 'lg' },
    { rowStart: 1, colStart: 4, rowEnd: 3, colEnd: 6, size: 'md' },
    { rowStart: 3, colStart: 4, rowEnd: 5, colEnd: 6, size: 'md' },
    { rowStart: 1, colStart: 6, rowEnd: 3, colEnd: 7, size: 'sm' },
    { rowStart: 4, colStart: 1, rowEnd: 5, colEnd: 4, size: 'md' },
  ],
  6: [
    { rowStart: 1, colStart: 1, rowEnd: 4, colEnd: 4, size: 'lg' },
    { rowStart: 1, colStart: 4, rowEnd: 3, colEnd: 6, size: 'md' },
    { rowStart: 3, colStart: 4, rowEnd: 5, colEnd: 6, size: 'md' },
    { rowStart: 1, colStart: 6, rowEnd: 3, colEnd: 7, size: 'sm' },
    { rowStart: 3, colStart: 6, rowEnd: 5, colEnd: 7, size: 'sm' },
    { rowStart: 4, colStart: 1, rowEnd: 5, colEnd: 4, size: 'md' },
  ],
}

function toGridArea(t: CellTemplate): string {
  return `${t.rowStart} / ${t.colStart} / ${t.rowEnd} / ${t.colEnd}`
}

function fillStubs(occupied: boolean[][], stubColors: TreemapColor[]): TreemapCell[] {
  const stubs: TreemapCell[] = []
  let colorIdx = 0

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (occupied[r][c]) continue

      // Try 1x2 (horizontal)
      if (c + 1 < GRID_COLS && !occupied[r][c + 1]) {
        stubs.push({
          type: 'stub',
          gridArea: `${r + 1} / ${c + 1} / ${r + 2} / ${c + 3}`,
          color: stubColors[colorIdx % stubColors.length],
          size: 'sm',
        })
        occupied[r][c] = true
        occupied[r][c + 1] = true
        colorIdx++
        continue
      }

      // Try 2x1 (vertical)
      if (r + 1 < GRID_ROWS && !occupied[r + 1][c]) {
        stubs.push({
          type: 'stub',
          gridArea: `${r + 1} / ${c + 1} / ${r + 3} / ${c + 2}`,
          color: stubColors[colorIdx % stubColors.length],
          size: 'sm',
        })
        occupied[r][c] = true
        occupied[r + 1][c] = true
        colorIdx++
        continue
      }

      // 1x1
      stubs.push({
        type: 'stub',
        gridArea: `${r + 1} / ${c + 1} / ${r + 2} / ${c + 2}`,
        color: stubColors[colorIdx % stubColors.length],
        size: 'sm',
      })
      occupied[r][c] = true
      colorIdx++
    }
  }

  return stubs
}

export function computeTreemapLayout(projectCount: number): TreemapCell[] {
  const clamped = Math.min(Math.max(projectCount, 0), 6)
  const templates = LAYOUTS[clamped] || LAYOUTS[4]
  const colors = TREEMAP_COLORS
  const stubColors = STUB_COLORS

  const occupied: boolean[][] = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(false)
  )

  const cells: TreemapCell[] = []

  // Place projects
  const projectTemplates = templates.slice(0, clamped)
  projectTemplates.forEach((t, i) => {
    cells.push({
      type: 'project',
      projectIndex: i,
      gridArea: toGridArea(t),
      color: colors[i % colors.length],
      size: t.size,
    })

    // Mark occupied
    for (let r = t.rowStart - 1; r < t.rowEnd - 1; r++) {
      for (let c = t.colStart - 1; c < t.colEnd - 1; c++) {
        if (r < GRID_ROWS && c < GRID_COLS) {
          occupied[r][c] = true
        }
      }
    }
  })

  // Fill remaining cells with stubs
  const stubs = fillStubs(occupied, stubColors)
  cells.push(...stubs)

  return cells
}

// Tablet layout (3-col, 4-row simplified)
export function computeTabletLayout(projectCount: number): TreemapCell[] {
  const clamped = Math.min(Math.max(projectCount, 0), 6)
  const colors = TREEMAP_COLORS
  const stubColors = STUB_COLORS
  const cells: TreemapCell[] = []

  // All possible slots: featured (index 0) + up to 5 more
  const allSlots: { gridArea: string; size: 'lg' | 'md' | 'sm' }[] = [
    { gridArea: '1 / 1 / 3 / 3', size: 'lg' },
    { gridArea: '1 / 3 / 2 / 4', size: 'sm' },
    { gridArea: '2 / 3 / 3 / 4', size: 'sm' },
    { gridArea: '3 / 1 / 4 / 3', size: 'md' },
    { gridArea: '3 / 3 / 4 / 4', size: 'sm' },
    { gridArea: '4 / 1 / 4 / 2', size: 'sm' },
  ]

  // Place projects in available slots
  for (let i = 0; i < Math.min(clamped, allSlots.length); i++) {
    cells.push({
      type: 'project',
      projectIndex: i,
      gridArea: allSlots[i].gridArea,
      color: colors[i % colors.length],
      size: allSlots[i].size,
    })
  }

  // Fill remaining slots with stubs
  let stubIdx = 0
  for (let i = clamped; i < allSlots.length; i++) {
    cells.push({
      type: 'stub',
      gridArea: allSlots[i].gridArea,
      color: stubColors[stubIdx % stubColors.length],
      size: 'sm',
    })
    stubIdx++
  }

  // Extra stubs in row 4 for visual balance
  const extraStubs = ['4 / 2 / 4 / 3', '4 / 3 / 4 / 4']
  extraStubs.forEach((area) => {
    cells.push({
      type: 'stub',
      gridArea: area,
      color: stubColors[stubIdx % stubColors.length],
      size: 'sm',
    })
    stubIdx++
  })

  return cells
}
