import styles from './style.module.css'
import { Nav, AccountMenu } from '../index.js'
import Container from '../container'

const Header = ({ loginData, onSignOut, boardsData}) => {
  return <header
    className={styles.header}
  >
    <Container>
      <div className={styles.headerContent}>
        <Nav
          loginData={loginData}
          boardsData={boardsData}
        />
        <AccountMenu loginData={loginData} onSignOut={onSignOut} />
      </div>
    </Container>
  </header>
}

export default Header