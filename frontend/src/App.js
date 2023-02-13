import { Routes, Route, useNavigate , Redirect, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Header, Footer, ProtectedRoute } from './components'
import api from './api'
import styles from './styles.module.css'
import cn from 'classnames'
import { AuthContext, UserContext } from './contexts'
import { SignUp, SignIn } from './pages'


function App() {
  const [ loggedIn, setLoggedIn ] = useState(null)
  const [ user, setUser ] = useState({})
  const [ menuToggled, setMenuToggled ] = useState(false)

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

  useEffect(_ => {
    if (loggedIn) {
      // history.push('/recipes')
    }
  }, [loggedIn])
  
  useEffect(_ => {
    const token = localStorage.getItem('token')
    if (token) {
      return api.getUserData()
        .then(res => {
          setUser(res)
          setLoggedIn(true)
          // getOrders()
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
  {/* <div className={cn("App", {
        [styles.appMenuToggled]: menuToggled
      })}>
          <div
          className={styles.menuButton}
          onClick={_ => setMenuToggled(!menuToggled)}>
        </div> */}
  <Header loggedIn={loggedIn} onSignOut={onSignOut} />
    {/* <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <span class="fs-4">TASKER</span>
      <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
      </ul>

      <div class="col-md-3 text-end">
        <button type="button" class="btn btn-outline-primary me-2">Войти</button>
        <button type="button" class="btn btn-outline-primary me-2">Зарегистрироваться</button>
      </div>
    </header>
    </div> */}

  <Routes>
  <Route path="/signup" element={<SignUp onSignUp={registration}/>} />
  <Route path="/signin" element={<SignIn onSignUp={authorization}/>} />
  </Routes>
  {/* </div> */}
  </UserContext.Provider>
  </AuthContext.Provider>
}
export default App;