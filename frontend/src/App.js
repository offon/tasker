import { Routes, Route, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Header, ProtectedRoute } from './components'
import api from './api'
import styles from './styles.module.css'
// import cn from 'classnames'
import { AuthContext, UserContext } from './contexts'
import {
  Board, SignUp, SignIn,
  ChangePassword, TaskCreate,
  TaskEdit, GroupEdit, GroupCreate,
  Main, BoardCreate, BoardEdit
} from './pages'


function App() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState({})
  const [boards, setBoards] = useState(null);
  const [groups, setGroup] = useState(null);
  const [current_board, setCurrentBoard] = useState(null)
  const [current_group, setCurrentGroup] = useState(null)
  const [current_task, setCurrentTask] = useState(null)


  const registration = ({
    email,
    password,
    username,
    first_name,
    last_name
  }) => {
    api.signup({ email, password, username, first_name, last_name })
      .then(res => {
        navigate('/signin')
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
        setLoggedIn(false)
      })
  }
  const authorization = ({
    email, password
  }) => {
    api.signin({
      email, password
    }).then(res => {
      if (res.auth_token) {
        localStorage.setItem('token', res.auth_token)
        api.getUserData()
          .then(res => {
            setUser(res)
            setLoggedIn(true)
            // getBoardsData()
            navigate('/')
          })
          .catch(err => {
            setLoggedIn(false)
            navigate('/signin')
          })
      } else {
        setLoggedIn(false)
      }
    })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
        setLoggedIn(false)
      })
  }
  const onSignOut = () => {
    api
      .signout()
      .then(res => {
        localStorage.removeItem('token')
        setLoggedIn(false)
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }
  const changePassword = ({
    new_password,
    current_password
  }) => {
    api.changePassword({ new_password, current_password })
      .then(res => {
        navigate('/signin')
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }
  const getBoardData = (id) => {
    api.getBoardData(id)
      .then(res => {
        setGroup(res);
        navigate(`/board/${id}/`);
      })
      .catch(err => {
        const errors = Object.values(err);
        if (errors) {
          alert(errors.join(', '));
        }
      });
  };

  const getBoardsData = () => {
    
    api.getboards()
      .then(res => {
        console.log('res')
        console.log(res)
        setBoards(res)
      }).catch(errors => {
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }

  useEffect(_ => {
    const token = localStorage.getItem('token')
    if (token) {
      return api.getUserData()
        .then(res => {
          setUser(res)
          setLoggedIn(true)
          getBoardsData()
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
        loggedIn={loggedIn}
        boards={boards}
        current_board={current_board}
        setGroup={setGroup}
        setCurrentBoard={setCurrentBoard}
        onSignOut={onSignOut} />
      <Routes>
        <Route exact path="/signin" element={<SignIn onSignIn={authorization} />} />
        <Route exact path="/signup" element={<SignUp onSignUp={registration} />} />
        <Route exact path="/change-password" element={<ChangePassword onPasswordChange={changePassword} />} />
        <Route exact path="/" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/" element={
            <Main
              current_board={current_board}
              boards={boards}
              setCurrentBoard={setCurrentBoard}
              getBoardsData={getBoardsData}
            />} /></Route>
        <Route exact path="/board/:id" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/board/:id" element={
            <Board
              boards={boards}
              current_board={current_board}
              groups={groups}
              current_group={current_group}
              current_task={current_task}
              setGroup={setGroup}
              getBoardData={getBoardData}
              setCurrentGroup={setCurrentGroup}
              setCurrentTask={setCurrentTask}
              setCurrentBoard={setCurrentBoard}
            />} /></Route>

        <Route exact path="/boards/:id/edit" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/boards/:id/edit" element={
            <BoardEdit
              boards={boards}
              current_task={current_task}
              current_board={current_board}
              current_group={current_group}
              getBoardsData={getBoardsData}
              setCurrentTask={setCurrentTask}
            />} /></Route>


        <Route exact path="/create_board" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/create_board" element={
            <BoardCreate
              boards={boards}
              setCurrentBoard={setCurrentBoard}
            />} /></Route>

        <Route exact path="/create_task" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/create_task" element={
            <TaskCreate
              current_group={current_group}
              current_board={current_board}
              setCurrentGroup={setCurrentGroup}
            />} /></Route>
        <Route exact path="/create_group" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/create_group" element={
            <GroupCreate
              groups={groups}
              current_board={current_board}
              setGroup={setGroup}
            />} /></Route>
        <Route exact path="/task/:id/edit" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/task/:id/edit" element={
            <TaskEdit
              current_task={current_task}
              current_board={current_board}
              current_group={current_group}
              setCurrentTask={setCurrentTask}
            />} /></Route>
        <Route exact path="/groups/:id/edit" element={<ProtectedRoute loggedIn={loggedIn} />}>
          <Route path="/groups/:id/edit" element={
            <GroupEdit
              groups={groups}
              current_board={current_board}
              current_task={current_task}
              current_group={current_group}
              setCurrentTask={setCurrentTask}
              setGroup={setGroup}
            />} /></Route>
      </Routes>
    </UserContext.Provider>
  </AuthContext.Provider >
}
export default App;