import { Routes, Route, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Header, ProtectedRoute } from './components'
import api from './api'
import styles from './styles.module.css'
import { authorization, registration, onSignOut, changePassword } from './utils/login_utils'
import { getBoardsData, getBoardData } from './utils/boards_utils'
import { AuthContext, UserContext } from './contexts'
import {
  Board, SignUp, SignIn,
  ChangePassword, TaskCreate,
  TaskEdit, GroupEdit, GroupCreate,
  Main, BoardCreate, BoardEdit
} from './pages'

function App() {
  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState({})
  const [boards, setBoards] = useState(null);
  const [groups, setGroup] = useState(null);
  const [current_board, setCurrentBoard] = useState(null)
  const [current_group, setCurrentGroup] = useState(null)
  const [current_task, setCurrentTask] = useState(null)
  const navigate = useNavigate();

  const loginData = {
    'loggedIn': loggedIn,
    'user': user,
    'setLoggedIn': setLoggedIn,
    'setUser': setUser,
    'navigate': navigate
  }

  const boardsData = {
    'boards': boards,
    'groups': groups,
    'current_board': current_board,
    'current_group': current_group,
    'current_task': current_task,
    'navigate': navigate,
    'setBoards': setBoards,
    'setGroup': setGroup,
    'setCurrentBoard': setCurrentBoard,
    'setCurrentGroup': setCurrentGroup,
    'setCurrentTask': setCurrentTask
  }

  useEffect(_ => {
    const token = localStorage.getItem('token')
    if (token) {
      return api.getUserData()
        .then(res => {
          setUser(res)
          setLoggedIn(true)
        })
        .catch(err => {
          setLoggedIn(false)
        })
    }
    setLoggedIn(false)
  }, [])

  if (loggedIn === null) {
    return <div className={styles.loading}>Загрузка</div>
  }

  return <AuthContext.Provider value={loggedIn}>
    <UserContext.Provider value={user}>
      <Header
        onSignOut={onSignOut}
        loginData={loginData}
        boardsData={boardsData}
      />
      <Routes>
        <Route exact path="/signin" element={
          <SignIn onSignIn={authorization}
            loggedIn={loggedIn}
            loginData={loginData}
            navigate={navigate}
          />} />
        <Route exact path="/signup" element={<SignUp onSignUp={registration} loginData={loginData} />} />
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={Main}
              getBoardsData={getBoardsData}
              setBoards={setBoards}
            />}
        />
        <Route
          exact
          path="/change-password"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={ChangePassword}
              onPasswordChange={changePassword}
              navigate={navigate}
            />}
        />
        <Route
          exact
          path="/board/:id"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={Board}
              boardsData={boardsData}
              getBoardData={getBoardData}
              getBoardsData={getBoardsData}
            />}
        />
        <Route
          exact path="/boards/:id/edit"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={BoardEdit}
              getBoardsData={getBoardsData}
              boardsData={boardsData}
            />}
        />
        <Route
          exact path="/create_board"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={BoardCreate}
              boardsData={boardsData}
            />}
        />
        <Route
          exact path="/create_task"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={TaskCreate}
              boardsData={boardsData}
            />}
        />
        <Route
          exact path="/create_group"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={GroupCreate}
              boardsData={boardsData}
            />}
        />
        <Route
          exact path="/task/:id/edit"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={TaskEdit}
              boardsData={boardsData}
            />}
        />
        <Route
          exact path="/groups/:id/edit"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              element={GroupEdit}
              boardsData={boardsData}
            />}
        />
      </Routes>
    </UserContext.Provider>
  </AuthContext.Provider >
}
export default App;