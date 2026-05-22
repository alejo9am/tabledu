export const defaultSpecialTiles = {
  attack: {
    id: null,
    type: 'attack',
    name: 'Attack',
    icon: 'system/hacker.png',
    description: 'Cyber attack! Your team loses points.',
    enabled: true,
    scoreAttack: -5,
  },
  pipe: {
    id: null,
    type: 'pipe',
    name: 'Pipe',
    icon: 'system/pipe.png',
    description: 'Lucky break! Roll the dice again.',
    enabled: true,
  },
  challenge: {
    id: null,
    type: 'challenge',
    name: 'Challenge',
    icon: 'system/swords.png',
    description: 'Duel time. Challenge a rival team.',
    enabled: true,
    scoreChallengeWinner: 5,
    scoreChallengeLoser: -3,
    scoreChallengeDrawDefender: 1,
    scoreChallengeDrawAttacker: -1,
  },
}

export const specialTileLabels = {
  attack: 'Penalty tile',
  challenge: 'Duel tile',
  pipe: 'Bonus tile',
}

export const hydrateSpecialTiles = (savedTiles) => ({
  attack: {
    ...defaultSpecialTiles.attack,
    ...((savedTiles ?? []).find((tile) => tile.type === 'attack') ?? {}),
  },
  pipe: {
    ...defaultSpecialTiles.pipe,
    ...((savedTiles ?? []).find((tile) => tile.type === 'pipe') ?? {}),
  },
  challenge: {
    ...defaultSpecialTiles.challenge,
    ...((savedTiles ?? []).find((tile) => tile.type === 'challenge') ?? {}),
  },
})
