import { useParams } from 'react-router-dom'
import NewGameBoardSelectPage from '@/features/games/routes/NewGame/pages/NewGameBoardSelect.page'
import NewGameSetupPage from '@/features/games/routes/NewGame/pages/NewGameSetup.page'

function NewGameRoute() {
  const { boardId } = useParams()

  if (boardId) {
    return <NewGameSetupPage boardId={boardId} />
  }

  return <NewGameBoardSelectPage />
}

export default NewGameRoute
