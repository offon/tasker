import styles from './style.module.css'
import { Nav, AccountMenu } from '../index.js'
import Container from '../container'

const Header = ({ loggedIn, onSignOut, boards, setGroup, current_board, setCurrentBoard }) => {
  return <header
    className={styles.header}
  >
    <Container>
      <div className={styles.headerContent}>
        <Nav
          loggedIn={loggedIn}
          boards={boards}
          setGroup={setGroup}
          current_board={current_board}
          setCurrentBoard={setCurrentBoard}
        />
        <AccountMenu onSignOut={onSignOut} />
      </div>
    </Container>
  </header>
}

export default Header