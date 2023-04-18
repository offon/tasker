import styles from './styles.module.css'
import cn from 'classnames'
import { useNavigate } from 'react-router-dom'

const Task = ({
  task,
  group,
  current_task,
  current_group,
  dragstartHandler,
  dragLeaveHandler,
  dragOverHandler,
  dropHandler,
  setCurrentTask,
  setCurrentGroup
}) => {
  const navigate = useNavigate()
  const editTask = ({ e, task, group }) => {
    if (e.detail === 2) {
      setCurrentTask(task)
      setCurrentGroup(group)
      navigate('/task/' + task.id + '/edit')
    }
  }
  return <div className={cn(styles.task)}
    key={task.id}
    draggable={true}
    onDragStart={(e) => dragstartHandler({ task, group })}
    onDragLeave={(e) => dragLeaveHandler({ e })}
    onDragOver={(e) => dragOverHandler({ e, styles, current_task })}
    onDrop={(e) => dropHandler({ e, task, styles })}
    onClick={(e) => editTask({ e, task, group })}
  > {task.title}
  </div>
}

export default Task
