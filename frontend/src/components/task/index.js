import styles from './styles.module.css'
import cn from 'classnames'
import { useEffect, useState } from 'react'

const Task = ({
  task,
  group,
  dragstartHandler,
  dragLeaveHandler,
  dragOverHandler,
  dropHandler
}) => {
  // useEffect(_ => {
  // }, [])

  return <div className={cn(styles.task)}
    key={task.id}
    draggable={true}
    onDragStart={(e) => dragstartHandler({ task, group })}
    onDragLeave={(e) => dragLeaveHandler({ e })}
    onDragOver={(e) => dragOverHandler({ e })}
    onDrop={(e) => dropHandler({ e, task })}
  > {task.title}
  </div>
}

export default Task
