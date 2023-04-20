import styles from './styles.module.css'
import cn from 'classnames'
import { dragstartHandler, dropHandler, dragLeaveHandler, editTask } from '../../utils/task-handlers'

const Task = ({
  task,
  group,
  boardsData: {
    current_task,
    dragOverHandler,
  },
  boardsData
}) => {
  return <div className={cn(styles.task)}
    key={task.id}
    draggable={true}
    onDragStart={(e) => dragstartHandler({ task, group, boardsData })}
    onDragLeave={(e) => dragLeaveHandler({ e })}
    onDragOver={(e) => dragOverHandler({ e, styles, current_task })}
    onDrop={(e) => dropHandler({ e, task, group, styles, boardsData })}
    onClick={(e) => editTask({ e, task, group, boardsData })}
  > {task.title}
  </div>
}

export default Task
