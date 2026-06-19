import { Route, Routes } from 'react-router-dom'
import GamePlayRoute from '@/features/games/routes/GamePlay/GamePlay.route'
import BoardsListRoute from '@/features/boards/routes/BoardsList/BoardsList.route'
import BoardCreateRoute from '@/features/boards/routes/BoardCreate/BoardCreate.route'
import BoardDetailsRoute from '@/features/boards/routes/BoardDetails/BoardDetails.route'
import GamesListRoute from '@/features/games/routes/GamesList/GamesList.route'
import NewGameRoute from '@/features/games/routes/NewGame/NewGame.route'
import HomeRoute from '@/features/home/routes/Home/Home.route'
import SpecialTilesRoute from '@/features/specialTiles/routes/SpecialTiles/SpecialTiles.route'
import QuestionTilesRoute from '@/features/questionTiles/routes/QuestionTiles/QuestionTiles.route'
import QuestionTileDetailRoute from '@/features/questionTiles/routes/QuestionTileDetail/QuestionTileDetail.route'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginRoute from '@/features/auth/routes/Login/Login.route'
import NotFoundRoute from '@/features/system/routes/NotFound/NotFound.route'
import RegisterRoute from '@/features/auth/routes/Register/Register.route'
import ProtectedRoute from '@/router/ProtectedRoute'
import PublicRoute from '@/router/PublicRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/boards" element={<BoardsListRoute />} />
          <Route path="/boards/new" element={<BoardCreateRoute />} />
          <Route path="/boards/:boardId" element={<BoardDetailsRoute />} />
          <Route path="/tiles/special" element={<SpecialTilesRoute />} />
          <Route path="/tiles/questions" element={<QuestionTilesRoute />} />
          <Route path="/tiles/questions/:tileId" element={<QuestionTileDetailRoute />} />
          <Route path="/games" element={<GamesListRoute />} />
        </Route>
        <Route path="/games/new/:boardId" element={<NewGameRoute />} />
        <Route path="/games/:gameId/play" element={<GamePlayRoute />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
      </Route>

      <Route path="*" element={<NotFoundRoute />} />
    </Routes>
  )
}

export default AppRoutes
