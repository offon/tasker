import { Container, Group } from '../../components'
import styles from './styles.module.css'
import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'

const Board = ({
  getBoardData,
  getBoardsData,
  boardsData: {
    groups,
    current_board,
    setGroup,
    setCurrentBoard,
    setBoards,
    navigate
  },
  boardsData
}) => {
  const { id } = useParams()

  id && setCurrentBoard(id);

  useEffect(() => {
    getBoardData({ id, setGroup, navigate })
    getBoardsData(setBoards)
  }, [current_board]);

  if (!groups) {
    return <div className={styles.loading}>Загрузка</div>
  }
  const group_crate = (e) => {
    navigate('/create_group')
  }

  return <Container>
    <div className={styles.board}>
      {groups.map(group => <Group
        group={group}
        boardsData={boardsData}
      />)}
      <div className={styles.group}>
        <div className={styles.group_header} onClick={(e) => { group_crate(e) }}>
          Добавить группу</div>
      </div>
    </div>
  </Container>
}
export default Board

