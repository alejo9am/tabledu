export const specialTileMetaByType = {
  duel: {
    label: 'Duel tile',
    descriptions: {
      default:
        'When a team lands here, it challenges another team in a duel made of two questions. Duel scoring is resolved with board-level winner/loser/draw values.',
      specialTiles:
        'Landing here triggers a two-question duel against another team. Winner, loser, and draw points come from the board scoring rules.',
      boardDetails:
        'Landing here starts a two-question duel. The score change uses this board\'s duel rules (win, loss, and draw values).',
      boardCreate:
        'This tile triggers a two-question duel. Points are applied using the scoring values configured here for this board.',
    },
  },
  penalty: {
    label: 'Penalty tile',
    descriptions: {
      default:
        'When a team lands here, it immediately receives the penalty score configured during board setup.',
      specialTiles:
        'Landing here applies an immediate penalty. The amount is controlled by each board\'s scoring configuration.',
      boardDetails:
        'Landing here applies the penalty value configured for this board.',
      boardCreate:
        'This tile subtracts points immediately. The exact value comes from the penalty score set in this board setup.',
    },
  },
  reroll: {
    label: 'Reroll tile',
    descriptions: {
      default:
        'When a team lands here, it gets an extra die roll and moves again right away.',
      specialTiles:
        'Landing here grants an immediate extra die roll and movement.',
      boardDetails:
        'Landing here gives the team one extra roll and instant movement on this board.',
      boardCreate:
        'This tile gives an immediate extra roll so teams move again right away.',
    },
  },
}

export function getSpecialTileDescription(type, context = 'default') {
  const tileMeta = specialTileMetaByType[type]
  if (!tileMeta) return ''

  return tileMeta.descriptions?.[context] ?? tileMeta.descriptions?.default ?? ''
}

export function getSpecialTileMeta(type, context = 'default') {
  const tileMeta = specialTileMetaByType[type]

  if (!tileMeta) {
    return {
      label: 'Special tile',
      description: '',
    }
  }

  return {
    label: tileMeta.label,
    description: tileMeta.descriptions?.[context] ?? tileMeta.descriptions?.default ?? '',
  }
}
