import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'

export interface DrawingCanvasHandle {
  getStrokes: () => [number, number][][]
  clear: () => void
}

interface Props {
  size?: number
  disabled?: boolean
}

// Normalize canvas pixel coords to 0–900 range (HanziLookupJS format)
function norm(val: number, max: number): number {
  return Math.round((val / max) * 900)
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, Props>(
  ({ size = 300, disabled = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const strokesRef = useRef<[number, number][][]>([])
    const currentStrokeRef = useRef<[number, number][]>([])
    const drawingRef = useRef(false)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 4
      ctx.strokeStyle = '#1e293b'
      drawGrid(ctx, canvas.width)
    }, [size])

    function drawGrid(ctx: CanvasRenderingContext2D, sz: number) {
      ctx.clearRect(0, 0, sz, sz)
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      // Cross guides
      ctx.beginPath()
      ctx.moveTo(sz / 2, 0); ctx.lineTo(sz / 2, sz)
      ctx.moveTo(0, sz / 2); ctx.lineTo(sz, sz / 2)
      ctx.stroke()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 4
    }

    function getPos(e: React.PointerEvent<HTMLCanvasElement>): [number, number] {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      return [norm(x, rect.width), norm(y, rect.height)]
    }

    function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
      if (disabled) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drawingRef.current = true
      currentStrokeRef.current = [getPos(e)]
    }

    function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!drawingRef.current || disabled) return
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const sz = canvas.width
      const [nx, ny] = getPos(e)
      const pts = currentStrokeRef.current
      const prev = pts[pts.length - 1]!
      currentStrokeRef.current.push([nx, ny])

      ctx.beginPath()
      ctx.moveTo((prev[0] / 900) * sz, (prev[1] / 900) * sz)
      ctx.lineTo((nx / 900) * sz, (ny / 900) * sz)
      ctx.stroke()
    }

    function onPointerUp() {
      if (!drawingRef.current) return
      drawingRef.current = false
      if (currentStrokeRef.current.length > 1) {
        strokesRef.current = [...strokesRef.current, currentStrokeRef.current]
      }
      currentStrokeRef.current = []
    }

    useImperativeHandle(ref, () => ({
      getStrokes: () => strokesRef.current,
      clear: () => {
        strokesRef.current = []
        currentStrokeRef.current = []
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        drawGrid(ctx, canvas.width)
      },
    }))

    return (
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ width: size, height: size, touchAction: 'none', cursor: disabled ? 'default' : 'crosshair' }}
        className="rounded-2xl bg-white border-2 border-gray-200 shadow-inner block"
      />
    )
  }
)

DrawingCanvas.displayName = 'DrawingCanvas'
