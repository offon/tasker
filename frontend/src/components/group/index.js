import { React } from 'react'
import Task from '../task'
import styles from './style.module.css'
import { dragOverHandler, dropGroupHandler, dragStartHandlerGroup, dropHandlerGroup, edit_group } from '../../utils/group_handlers'

const Group = ({
  group,
  boardsData: {
    setCurrentGroup,
    current_task,
    navigate },
  boardsData
}) => {

  const create_task = (group) => {
    setCurrentGroup(group)
    navigate('/create_task')
  }

  return <div className={styles.group}
    key={group.id}
    onDragOver={(e) => dragOverHandler({ e, styles, current_task })}
    onDrop={(e) => dropGroupHandler({ e, group, boardsData })}
  ><div className={styles.group_header}
    draggable={true}
    onDragStart={(e) => dragStartHandlerGroup({ group, boardsData })}
    onDrop={(e) => dropHandlerGroup({ e, styles, group, boardsData })}
    onClick={(e) => edit_group({ e, group, boardsData })}
  >{group.title}</div>
    {group.tasks.map(task =>
      <Task
        task={task}
        group={group}
        boardsData={boardsData}
        dragOverHandler={dragOverHandler}
      />)}
    <div className={styles.task_add} onClick={() => {
      create_task(group)
    }} >Добавить задачу</div>
  </div>
}

export default Group