// import cn from 'classnames'
import styles from './styles.module.css'
import { useContext } from 'react'
import { LinkComponent } from '../index.js'
import { AuthContext } from '../../contexts'

const AccountMenu = ({ loginData: { setLoggedIn }, onSignOut }) => {
  const authContext = useContext(AuthContext)
  if (!authContext) {
    return <div className={styles.menu}>
      <LinkComponent
        className={styles.menuLink}
        href='/signin'
        title='Войти'
      />
      <LinkComponent
        href='/signup'
        title='Создать аккаунт'
        className={styles.menuLink}
      />
    </div>
  }
  return <div className={styles.menu}>
    <LinkComponent
      className={styles.menuLink}
      href='/change-password'
      title='Изменить пароль'
    />
    <a
      href='/signin'
      className={styles.menuLink}
      onClick={()=>{
        onSignOut(setLoggedIn)
      }}
    >
      Выход
    </a>
  </div>
}

export default AccountMenu