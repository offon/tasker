import { Routes, Route, useNavigate, Redirect, useLocation } from 'react-router-dom'
import React, { useState, useEffect, createState } from 'react'
import { Header, Footer, ProtectedRoute } from './components'
import api from './api'
import styles from './styles.module.css'
import cn from 'classnames'
import { AuthContext, UserContext } from './contexts'
import { Main, SignUp, SignIn, ChangePassword, CreateTask } from './pages'


function App() {
  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState({})
  const [menuToggled, setMenuToggled] = useState(false)
  const [boards, setBoards] = useState(null);
  const [current_group, setCurrentGroup] = useState(null)
  const [current_task, setCurrentTask] = useState(null)

  const navigate = useNavigate()


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
            // getOrders()
          })
          .catch(err => {
            setLoggedIn(false)
            navigate.push('/signin')
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
        // history.push('/signin')
      })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }

  const getGroupsData = () => {
    api.getGroupsData()
      .then(res => {
        setBoards(res)
      }).catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
  }

  useEffect(_ => {
    if (loggedIn) {
      // navigate('/groups')
    }
  }, [loggedIn])

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
          // navigate('/signin')
        })
    }
    setLoggedIn(false)
  }, [])

  if (loggedIn === null) {
    return <div className={styles.loading}>Загрузка</div>
  }

  return <AuthContext.Provider value={loggedIn}>
    <UserContext.Provider value={user}>
      <div className={cn("App", {
        [styles.appMenuToggled]: menuToggled
      })}>
        <div
          className={styles.menuButton}
          onClick={_ => setMenuToggled(!menuToggled)}
        >
        </div>
        <Header loggedIn={loggedIn} onSignOut={onSignOut} />
        <Routes>
          <Route exact path="/signin" element={<SignIn onSignIn={authorization} />} />
          <Route exact path="/signup" element={<SignUp onSignUp={registration} />} />
          <Route exact path="/change-password" element={<ChangePassword onPasswordChange={changePassword} />} />
          <Route exact path="/groups" element={<ProtectedRoute loggedIn={loggedIn} />}>
            <Route path="/groups" element={
              <Main
                boards={boards}
                current_group={current_group}
                current_task={current_task}
                setBoards={setBoards}
                getGroupsData={getGroupsData}
                setCurrentGroup={setCurrentGroup}
                setCurrentTask={setCurrentTask}
              />} /></Route>
          <Route exact path="/create_task" element={<ProtectedRoute loggedIn={loggedIn} />}>
            <Route path="/create_task" element={
              <CreateTask
                boards={boards}
                current_group={current_group}
                setBoards={setBoards}
              />} /></Route>
        </Routes>
      </div>
    </UserContext.Provider>
  </AuthContext.Provider >
}
export default App;