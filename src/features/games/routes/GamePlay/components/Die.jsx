import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import { useGame } from '../context/GameContext'
import { TURN_PHASES } from '../constants/turnPhases'

const ROLL_DURATION_MS = 2300
const FACE_ROTATIONS = {
  1: { x: 0, y: 180, z: 0 },
  2: { x: 0, y: 90, z: 0 },
  3: { x: -90, y: 0, z: 0 },
  4: { x: 90, y: 0, z: 0 },
  5: { x: 0, y: -90, z: 0 },
  6: { x: 0, y: 0, z: 0 }
}

const toTransform = ({ x, y, z }) => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`

const FACE_CLASSNAMES = {
  1: '[transform:rotateX(180deg)_translateZ(31.5px)]',
  2: '[transform:rotateY(-90deg)_translateZ(31.5px)]',
  3: '[transform:rotateX(90deg)_translateZ(31.5px)]',
  4: '[transform:rotateX(-90deg)_translateZ(31.5px)]',
  5: '[transform:rotateY(90deg)_translateZ(31.5px)]',
  6: '[transform:rotateY(0deg)_translateZ(31.5px)]'
}

const DOT_POSITIONS = {
  d1: 'top-[10px] left-[10px]',
  d2: 'top-[10px] right-[10px]',
  d3: 'top-[26px] left-[10px]',
  d4: 'top-[26px] left-[26px]',
  d5: 'top-[26px] right-[10px]',
  d6: 'bottom-[10px] left-[10px]',
  d7: 'bottom-[10px] right-[10px]'
}

const FACE_DOTS = {
  6: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7'],
  1: ['d4'],
  5: ['d1', 'd2', 'd4', 'd6', 'd7'],
  2: ['d2', 'd6'],
  3: ['d2', 'd4', 'd6'],
  4: ['d1', 'd2', 'd6', 'd7']
}

const FACE_ORDER = [6, 1, 5, 2, 3, 4]

function Die() {
  const dieRef = useRef(null)
  const animationRef = useRef(null)
  const settleTimeoutRef = useRef(null)
  const currentRotationRef = useRef(FACE_ROTATIONS[6])
  const [dieTransform, setDieTransform] = useState(toTransform(FACE_ROTATIONS[6]))
  const [isRolling, setIsRolling] = useState(false)

  const {
    turnPhase,
    handlers: { rollDie }
  } = useGame()

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel()
      }

      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current)
      }

      setIsRolling(false)
    }
  }, [])

  const animate = () => {
    if (!dieRef.current || isRolling || turnPhase !== TURN_PHASES.IDLE) {
      return
    }

    setIsRolling(true)

    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }

    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current)
      settleTimeoutRef.current = null
    }

    const dieValue = Math.floor(Math.random() * 6) + 1
    const targetFaceRotation = FACE_ROTATIONS[dieValue]

    const dirX = Math.random() < 0.5 ? -1 : 1
    const dirY = Math.random() < 0.5 ? -1 : 1
    const extraTurnsX = (1 + Math.floor(Math.random() * 2)) * 360 * dirX
    const extraTurnsY = (1 + Math.floor(Math.random() * 2)) * 360 * dirY
    const extraTurnsZ = (Math.floor(Math.random() * 3) - 1) * 90

    const fromRotation = currentRotationRef.current
    const spinRotation = {
      x: targetFaceRotation.x + extraTurnsX,
      y: targetFaceRotation.y + extraTurnsY,
      z: targetFaceRotation.z + extraTurnsZ
    }

    const nearFinalRotation = {
      x: targetFaceRotation.x + (dirX * 6),
      y: targetFaceRotation.y - (dirY * 5),
      z: targetFaceRotation.z + (extraTurnsZ === 0 ? 0 : extraTurnsZ * 0.15)
    }

    animationRef.current = dieRef.current.animate(
      [
        { transform: toTransform(fromRotation), offset: 0 },
        { transform: toTransform(spinRotation), offset: 0.7 },
        { transform: toTransform(nearFinalRotation), offset: 0.9 },
        { transform: toTransform(targetFaceRotation), offset: 1 }
      ],
      {
        duration: ROLL_DURATION_MS,
        fill: 'forwards',
        easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)'
      }
    )

    settleTimeoutRef.current = setTimeout(() => {
      currentRotationRef.current = targetFaceRotation
      setDieTransform(toTransform(targetFaceRotation))
      setIsRolling(false)
      rollDie(dieValue)
    }, ROLL_DURATION_MS)
  }

  return (
    <div className='flex items-center gap-4' aria-label='Die section'>
      <div
        className="m-3.75 inline-block select-none perspective-[580px]"
        aria-label="3D die"
      >
        <div
          className="relative h-16 w-16 origin-[50%_50%] transform-3d will-change-transform"
          ref={dieRef}
          style={{ transform: dieTransform }}
        >
          {FACE_ORDER.map((face) => (
            <div
              key={face}
              className={`absolute size-16 rounded-lg border border-border bg-primary backface-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-3px_6px_rgba(0,0,0,0.2)] ${FACE_CLASSNAMES[face]}`}
            >
              {FACE_DOTS[face].map((dot) => (
                <span
                  key={dot}
                  className={`absolute size-2.5 rounded-full bg-primary-foreground ${DOT_POSITIONS[dot]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={animate} disabled={turnPhase !== TURN_PHASES.IDLE || isRolling}>
        Roll die
      </Button>
    </div>
  )
}

export default Die
