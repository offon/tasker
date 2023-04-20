import styles from './style.module.css'

const Nav = ({ loginData: { loggedIn, navigate }, boardsData: { boards, current_board, setGroup } }) => {

  if (!loggedIn) {
    return <nav className={styles.nav}></nav>
  }
  const getSelectBoard = (e) => {
    setGroup(null)
    e.target.value === 'create_board' ? navigate('/create_board') : navigate(`/board/${e.target.value}/`)
  }
  return <nav className={styles.nav}>
    <div className={styles.lable}>Доступные доски: </div>
    <div className={styles.nav__container}>
      <select
        onChange={e => getSelectBoard(e)}
        className={styles.nav__select}>
        {current_board ? null : <option>Выберите доску</option>}
        {boards ? boards.map((board) => <option value={board.id}>{board.title}</option>) : null}
        <option value='create_board'>Создать доску</option>
      </select>
      {current_board ? <div
        className={styles.lable}
        onClick={(e) => navigate(`/boards/${current_board}/edit/`)}> Редактирование доски</div> : null}

    </div>
  </nav>
}

export default Nav