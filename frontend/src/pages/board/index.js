import { Container, Group } from '../../components'
import styles from './styles.module.css'
import { useNavigate, useParams } from 'react-router-dom'

const Board = ({
  getBoardData,
  groups,
  current_group,
  current_task,
  setCurrentGroup,
  setCurrentTask,
  setGroups,
  setCurrentBoard,
}) => {
  const navigate = useNavigate()
  const { id } = useParams()

  id && setCurrentBoard(id);

  if (!groups) {
    getBoardData(id)
    return <div className={styles.loading}>Загрузка</div>
  }
  const group_crate = (e) => {
    navigate('/create_group')
  }
  
  return <Container>
    <div className={styles.board}>
      {groups.map(group => <Group
        group={group}
        groups={groups}
        setGroups={setGroups}
        current_group={current_group}
        current_task={current_task}
        setCurrentGroup={setCurrentGroup}
        setCurrentTask={setCurrentTask}
      />)}
      <div className={styles.group}>
        <div className={styles.group_header} onClick={(e) => { group_crate(e) }}>
          Добавить группу</div>
      </div>
    </div>
  </Container>
}
export default Board

