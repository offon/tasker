import { React } from 'react'
import Task from '../task'
import styles from './style.module.css'
import { dragLeaveHandler, dragOverHandler, set_index_for_tasks, set_index_for_boards } from '../../utils/use-handlers.js'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import classnames from 'classnames';

const Group = ({
  group,
  groups,
  setCurrentGroup,
  setCurrentTask,
  current_group,
  current_task,
  setGroup }) => {
  const navigate = useNavigate()
  const dragstartHandler = ({ task, group }) => {
    setCurrentGroup(group)
    setCurrentTask(task)
  }
  const dropHandler = ({ e, task, styles }) => {
    e.preventDefault()
    e.stopPropagation()
    if (classnames(e.target.className) === classnames(styles.task) && current_task) {
      setCurrentGroup(task.group.id)
      const current_index = current_group.tasks.indexOf(current_task)
      setCurrentGroup(current_group.tasks.splice(current_index, 1))
      set_index_for_tasks(current_group)
      const drop_index = group.tasks.indexOf(task)
      current_task.group = group.id
      group.tasks.splice(drop_index + 1, 0, current_task)
      set_index_for_tasks(group)
      api.moveTasks(current_group.tasks, group.tasks)
      setCurrentTask(null)
      setCurrentGroup(null)
    }
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
  }
  const dropGroupHandler = ({ e, group }) => {
    if (current_task) {
      current_task.group = group.id
      setCurrentTask(current_task)
      group.tasks.push(current_task)
      set_index_for_tasks(group)
      let edit_group = current_group
      setCurrentGroup(edit_group)
      const current_index = current_group.tasks.indexOf(current_task)
      setCurrentGroup(current_group.tasks.splice(current_index, 1))
      set_index_for_tasks(current_group)
      api.moveTasks(current_group.tasks, group.tasks)
    }
  }

  const dragStartHandlerGroup = ({ group }) => {
    setCurrentGroup(group)
  }
  const dropHandlerGroup = ({ e, group }) => {
    e.preventDefault()
    e.stopPropagation()
    if (classnames(e.target.className) === classnames(styles.group_header)) {
      const current_index = groups.indexOf(current_group)
      setCurrentGroup(groups.splice(current_index, 1))
      const drop_index = groups.indexOf(group)
      groups.splice(drop_index + 1, 0, current_group)
      set_index_for_boards(groups)
      setCurrentTask(null)
      setCurrentGroup(null)
      api.moveGroups(groups)
    }
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
  }
  const create_task = (group) => {
    setCurrentGroup(group)
    navigate('/create_task')
  }
  const edit_group = ({ e, group }) => {
    if (e.detail === 2) {
      setCurrentGroup(group)
      navigate('/groups/' + group.id + '/edit')
    }
  }
  return <div className={styles.group}
    key={group.id}
    onDragOver={(e) => dragOverHandler({ e, styles, current_task })}
    onDrop={(e) => dropGroupHandler({ e, group })}
  ><div className={styles.group_header}
    draggable={true}
    onDragStart={(e) => dragStartHandlerGroup({ group })}
    onDrop={(e) => dropHandlerGroup({ e, group })}
    onClick={(e) => edit_group({ e, group })}
  >{group.title}</div>
    {group.tasks.map(task =>
      <Task
        task={task}
        group={group}
        current_group={current_group}
        groups={groups}
        current_task={current_task}
        dragstartHandler={dragstartHandler}
        dragLeaveHandler={dragLeaveHandler}
        dragOverHandler={dragOverHandler}
        dropHandler={dropHandler}
        setCurrentTask={setCurrentTask}
        setCurrentGroup={setCurrentGroup}
      />)}
    <div className={styles.task_add} onClick={() => {
      create_task(group)
    }} >Добавить задачу</div>
  </div>
}

export default Group