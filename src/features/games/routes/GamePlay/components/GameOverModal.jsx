import { useEffect, useMemo, useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import { MedalFirstPlaceIcon, MedalSecondPlaceIcon, MedalThirdPlaceIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Token from '@/components/ui/token'
import qrImage from '@/assets/qr.png'

import { useGame } from '../context/GameContext'
import { TURN_PHASES } from '../constants/turnPhases'

const PODIUM_ICONS = [
  MedalFirstPlaceIcon,
  MedalSecondPlaceIcon,
  MedalThirdPlaceIcon,
]

function getRankTone(rank) {
  if (rank === 1) return 'border-primary bg-primary-200 text-primary-700'
  if (rank === 2) return 'border-warning bg-warning-200 text-warning-700'
  return 'border-destructive bg-destructive-200 text-destructive-700'
}

function getPodiumHeight(rank) {
  if (rank === 1) return 'h-32'
  if (rank === 2) return 'h-24'
  return 'h-20'
}

function GameOverModal() {
  const { teams, turnPhase } = useGame()
  const dialogRef = useRef(null)
  const feedbackDialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (turnPhase === TURN_PHASES.GAME_OVER && !dialog.open) dialog.showModal()
    return () => { if (dialog && dialog.open) dialog.close() }
  }, [turnPhase])

  const ranked = useMemo(() => {
    const sorted = [...teams].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.position - a.position
    })

    return sorted.map((team, index) => {
      const prev = sorted[index - 1]
      const next = sorted[index + 1]
      const isTied = (prev && prev.score === team.score) || (next && next.score === team.score)

      return { ...team, rank: index + 1, isTied }
    })
  }, [teams])

  const handleRestart = () => {
    const feedbackDialog = feedbackDialogRef.current
    if (feedbackDialog?.open) feedbackDialog.close()
    window.location.reload()
  }

  const handleOpenFeedback = () => {
    const dialog = dialogRef.current
    const feedbackDialog = feedbackDialogRef.current

    if (dialog?.open) dialog.close()
    if (feedbackDialog && !feedbackDialog.open) feedbackDialog.showModal()
  }

  const topThree = ranked.slice(0, 3)
  const podiumSlots = [
    topThree[1] ?? null,
    topThree[0] ?? null,
    topThree[2] ?? null,
  ]

  const remainingTeams = ranked.slice(3)

  if (turnPhase !== TURN_PHASES.GAME_OVER) return null;

  return (
    <>
      <dialog
        ref={dialogRef}
        onCancel={(e) => e.preventDefault()} // evita que el modal se cierre al hacer click fuera o presionar Esc
        className="fixed inset-0 m-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
        aria-modal="true"
        aria-label="Game over modal"
      >
        <header className="border-b border-border px-6 pt-6 pb-4">
          <p className="mb-1 text-sm font-medium text-muted-foreground">Match complete</p>
          <h2 className="font-display text-2xl font-bold text-primary">Final podium</h2>
        </header>

        <div className="flex flex-col gap-5 px-6 py-6">
          <section aria-label="Podium by points">
            <div className="grid grid-cols-3 items-end gap-3">
              {podiumSlots.map((team, index) => {
                if (!team) {
                  return <div key={`empty-${index}`} className="hidden sm:block" />
                }

                const medalIcon = PODIUM_ICONS[team.rank - 1] ?? null

                return (
                  <article key={team.id} className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1 ring-1 ring-border">
                      <Token color={team.color} className="size-6 border-[0.18em]" title={team.name} />
                      <p className="text-sm font-bold text-foreground">{team.name}</p>
                      {team.isTied && (
                        <span className="rounded-full border border-warning-700 bg-warning-200 px-1.5 py-0.5 text-[10px] font-bold text-warning-700">Tie</span>
                      )}
                    </div>

                    <p className="text-lg font-extrabold leading-none text-foreground">
                      {team.score}
                      <span className="ml-1 text-xs font-semibold text-muted-foreground">pts</span>
                    </p>

                    <div className={cn(
                      'w-full rounded-t-xl border-x border-t flex items-start justify-center pt-3',
                      getRankTone(team.rank),
                      getPodiumHeight(team.rank)
                    )}>
                      {medalIcon && (
                        <Icon icon={medalIcon} className="size-12 opacity-90" />
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="flex flex-col gap-2" aria-label="Full ranking by points">
            {ranked.slice(0, 3).map((team) => (
              <div
                key={`rank-${team.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-3 py-2',
                  getRankTone(team.rank)
                )}
              >
                <span className="w-10 text-sm font-bold">#{team.rank}</span>
                <Token color={team.color} className="size-6 border-[0.18em]" title={team.name} />
                <span className="flex-1 text-sm font-semibold text-foreground">{team.name}</span>
                {team.isTied && (
                  <span className="rounded-full border border-warning-700 bg-warning-200 px-1.5 py-0.5 text-[10px] font-bold text-warning-700">Tie</span>
                )}
                <span className="text-sm font-bold">{team.score} pts</span>
              </div>
            ))}

            {remainingTeams.map((team) => (
              <div
                key={`extra-${team.id}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-3 py-2"
              >
                <span className="w-10 text-sm font-bold text-muted-foreground">#{team.rank}</span>
                <Token color={team.color} className="size-6 border-[0.18em]" title={team.name} />
                <span className="flex-1 text-sm font-semibold text-foreground">{team.name}</span>
                {team.isTied && (
                  <span className="rounded-full border border-warning-700 bg-warning-200 px-1.5 py-0.5 text-[10px] font-bold text-warning-700">Tie</span>
                )}
                <span className="text-sm font-bold text-foreground">{team.score} pts</span>
              </div>
            ))}
          </section>
        </div>

        <footer className="flex justify-end border-t border-border px-6 py-4">
          <Button type="button" size="lg" onClick={handleOpenFeedback}>
            Finish the game
          </Button>
        </footer>
      </dialog>

      <dialog
        ref={feedbackDialogRef}
        className="fixed inset-0 m-auto w-[min(95vw,1100px)] rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm"
        onCancel={(e) => e.preventDefault()} // evita que el modal se cierre al hacer click fuera o presionar Esc
        aria-modal="true"
        aria-label="Feedback modal"
      >
        <header className="border-b border-border px-6 pt-6 pb-4 text-center">
          <h2 className="font-display text-2xl font-bold text-primary">Ayúdame con tu feedback</h2>
        </header>

        <div className="px-6 py-5">
          <img
            src={qrImage}
            alt="QR para enviar feedback"
            className="mx-auto h-auto max-h-[68vh] w-full object-contain"
          />
        </div>

        <footer className="flex justify-center border-t border-border px-6 py-4">
          <Button type="button" size="lg" onClick={handleRestart}>
            Start a new game
          </Button>
        </footer>
      </dialog>
    </>
  )
}

export default GameOverModal
