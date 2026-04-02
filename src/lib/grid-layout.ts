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

export type ThemeMode = 'dark' | 'light'

const TREEMAP_COLORS_DARK: TreemapColor[] = [
  { bg: '#2d1f1e', border: '#ce796b', text: '#ce796b' },
  { bg: '#1e2a2d', border: '#6bcec4', text: '#6bcec4' },
  { bg: '#2d2a1e', border: '#ceb86b', text: '#ceb86b' },
  { bg: '#1e2d22', border: '#6bce8a', text: '#6bce8a' },
  { bg: '#2a1e2d', border: '#b86bce', text: '#b86bce' },
  { bg: '#1e222d', border: '#6b8ace', text: '#6b8ace' },
]

const TREEMAP_COLORS_LIGHT: TreemapColor[] = [
  { bg: '#f5e5e3', border: '#b85a4c', text: '#8c3e32' },
  { bg: '#e2f2f0', border: '#3da89c', text: '#2b7a70' },
  { bg: '#f3f0e0', border: '#b8a04c', text: '#8a7635' },
  { bg: '#e2f3e7', border: '#4aad66', text: '#357a49' },
  { bg: '#f0e3f5', border: '#9e4cb8', text: '#763690' },
  { bg: '#e3e8f5', border: '#4c6fb8', text: '#365090' },
]

const STUB_COLORS_DARK: TreemapColor[] = [
  { bg: '#ce796b', border: '#ce796b', text: '#ce796b' },
  { bg: '#ea8589', border: '#ea8589', text: '#ea8589' },
  { bg: '#6bcec4', border: '#6bcec4', text: '#6bcec4' },
  { bg: '#ceb86b', border: '#ceb86b', text: '#ceb86b' },
  { bg: '#b86bce', border: '#b86bce', text: '#b86bce' },
]

const STUB_COLORS_LIGHT: TreemapColor[] = [
  { bg: '#b85a4c', border: '#b85a4c', text: '#b85a4c' },
  { bg: '#c96468', border: '#c96468', text: '#c96468' },
  { bg: '#3da89c', border: '#3da89c', text: '#3da89c' },
  { bg: '#b8a04c', border: '#b8a04c', text: '#b8a04c' },
  { bg: '#9e4cb8', border: '#9e4cb8', text: '#9e4cb8' },
]

export function getTreemapColors(mode: ThemeMode): TreemapColor[] {
  return mode === 'light' ? TREEMAP_COLORS_LIGHT : TREEMAP_COLORS_DARK
}

export function getStubColors(mode: ThemeMode): TreemapColor[] {
  return mode === 'light' ? STUB_COLORS_LIGHT : STUB_COLORS_DARK
}

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

export function computeTreemapLayout(projectCount: number, mode: ThemeMode = 'dark'): TreemapCell[] {
  const clamped = Math.min(Math.max(projectCount, 0), 6)
  const templates = LAYOUTS[clamped] || LAYOUTS[4]
  const colors = getTreemapColors(mode)
  const stubColors = getStubColors(mode)

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
export function computeTabletLayout(projectCount: number, mode: ThemeMode = 'dark'): TreemapCell[] {
  const clamped = Math.min(Math.max(projectCount, 0), 6)
  const colors = getTreemapColors(mode)
  const stubColors = getStubColors(mode)
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
