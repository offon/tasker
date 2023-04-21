import classnames from 'classnames';
import api from '../api'

const dragLeaveHandler = ({ e }) => {
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
}
const set_index_for_tasks = (group) => {
    for (let i = 0; i < group.tasks.length; i++) {
        group.tasks[i].position = i + 1
    }
}
const set_index_for_boards = (boards) => {
    for (let i = 0; i < boards.length; i++) {
        boards[i].position = i + 1
    }
}
const dragstartHandler = ({ task, group, boardsData: { setCurrentGroup, setCurrentTask } }) => {
    setCurrentGroup(group)
    setCurrentTask(task)
}
const dropHandler = ({
    e, task, group, styles, boardsData: {
        current_task,
        setCurrentGroup,
        current_group,
        setCurrentTask
    } }) => {
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
const editTask = ({ e, task, group, boardsData: { setCurrentTask, setCurrentGroup, navigate } }) => {
    if (e.detail === 2) {
        setCurrentTask(task)
        setCurrentGroup(group)
        navigate('/task/' + task.id + '/edit')
    }
}

export { dragLeaveHandler, dragstartHandler, set_index_for_tasks, set_index_for_boards, dropHandler, editTask }




