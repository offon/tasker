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

  // const getBoardData = (id) => {
  //   api.getBoardData(id)
  //     .then(res => {
  //       setGroup(res);
  //       navigate(`/board/${id}/`);
  //     })
  //     .catch(err => {
  //       const errors = Object.values(err);
  //       if (errors) {
  //         alert(errors.join(', '));
  //       }
  //     });
  // };

  useEffect(_ => {
    const token = localStorage.getItem('token')
    if (token) {
      return api.getUserData()
        .then(res => {
          setUser(res)
          setLoggedIn(true)
          getBoardsData(setBoards)
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
        <Route exact path="/signin" element={<SignIn onSignIn={authorization} loginData={loginData} />} />
        <Route exact path="/signup" element={<SignUp onSignUp={registration} loginData={loginData} />} />
        <Route exact path="/change-password" element={<ChangePassword onPasswordChange={changePassword} navigate={navigate} />} />
        <Route exact path="/" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/" element={
            <Main />} /></Route>
        <Route exact path="/board/:id" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/board/:id" element={
            <Board
              boardsData={boardsData}
              getBoardData={getBoardData}
            />} /></Route>
        <Route exact path="/boards/:id/edit" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/boards/:id/edit" element={
            <BoardEdit
              boardsData={boardsData}
            />} /></Route>
        <Route exact path="/create_board" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/create_board" element={
            <BoardCreate
              boardsData={boardsData}
            />} /></Route>
        <Route exact path="/create_task" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/create_task" element={
            <TaskCreate
              boardsData={boardsData}
            />} /></Route>
        <Route exact path="/create_group" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/create_group" element={
            <GroupCreate
              boardsData={boardsData}
            />} /></Route>
        <Route exact path="/task/:id/edit" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/task/:id/edit" element={
            <TaskEdit
              boardsData={boardsData}
            />} /></Route>
        <Route exact path="/groups/:id/edit" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/groups/:id/edit" element={
            <GroupEdit
              boardsData={boardsData}
            />} /></Route>
      </Routes>
    </UserContext.Provider>
  </AuthContext.Provider >
}
export default App;