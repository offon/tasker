import { Container, Main, Group } from '../../components'
import styles from './styles.module.css'


const HomePage = ({ promt, getGroupsData, boards, current_group, current_task, setCurrentGroup, setCurrentTask, setBoards }) => {
  if (boards === null) {
    getGroupsData()
    return <div className={styles.loading}>Загрузка</div>
  }
  return <Main>
    <Container>
      <div className={styles.board}>
        {boards.map(group => <Group
          group={group}
          boards={boards}
          setBoards={setBoards}
          current_group={current_group}
          current_task={current_task}
          setCurrentGroup={setCurrentGroup}
          setCurrentTask={setCurrentTask}
        />)}
      </div>
    </Container>
  </Main>
}

export default HomePage

