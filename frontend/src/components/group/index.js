import { React } from 'react'
import Task from '../task'
import styles from './style.module.css'
import { dragLeaveHandler, dragOverHandler } from '../../utils/use-handlers.js'
import { useNavigate } from 'react-router-dom'

const Group = ({ group, boards, setCurrentGroup, setCurrentTask, current_group, current_task, setBoards }) => {
  const navigate = useNavigate()


  const dragstartHandler = ({ task, group }) => {
    setCurrentGroup(group)
    setCurrentTask(task)
  }

  const dropHandler = ({ e, task }) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentGroup(task.group.id)
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
    const current_index = current_group.tasks.indexOf(current_task)
    setCurrentGroup(current_group.tasks.splice(current_index, 1))
    const drop_index = group.tasks.indexOf(task)
    group.tasks.splice(drop_index + 1, 0, current_task)
  }

  const dropGroupHandler = ({ e, group }) => {
    current_task.group = group.id
    setCurrentTask(current_task)
    group.tasks.push(current_task)
    let edit_group = current_group
    setCurrentGroup(edit_group)
    const current_index = current_group.tasks.indexOf(current_task)
    setCurrentGroup(current_group.tasks.splice(current_index, 1))
  }

  const create_task = (group) => {
    setCurrentGroup(group)
    navigate('/create_task')
  }
  return <div className={styles.group}
    key={group.id}
    onDragOver={(e) => dragOverHandler({ e })}
    onDrop={(e) => dropGroupHandler({ e, group })}
  >
    <div className={styles.group_header}>{group.title}</div>
    {group.tasks.map(task =>
      <Task
        task={task}
        group={group}
        boards={boards}
        dragstartHandler={dragstartHandler}
        dragLeaveHandler={dragLeaveHandler}
        dragOverHandler={dragOverHandler}
        dropHandler={dropHandler}
      />)}
    <div className={styles.task_add} onClick={() => { 
      create_task(group) }} >Добавить задачу</div>
  </div>
}

export default Group