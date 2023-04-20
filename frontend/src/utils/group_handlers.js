import classnames from 'classnames';
import api from '../api'

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

const dragOverHandler = ({ e, styles, current_task }) => {
    e.preventDefault()
    if (classnames(e.target.className) === classnames(styles.task) && current_task != null) {
        e.target.style.boxShadow = '0 4px 3px gray'
        e.target.style.marginBottom = '10px'
    }
}

const dropGroupHandler = ({ e, group, boardsData: { current_task, setCurrentTask, current_group, setCurrentGroup } }) => {
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

const dragStartHandlerGroup = ({ group, boardsData: { setCurrentGroup } }) => {
    setCurrentGroup(group)
}

const dropHandlerGroup = ({
    e,
    group,
    styles,
    boardsData: {
        groups,
        setCurrentGroup,
        current_group,
        setCurrentTask } }) => {
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

const edit_group = ({ e, group, boardsData: { setCurrentGroup, navigate } }) => {
    if (e.detail === 2) {
        setCurrentGroup(group)
        navigate('/groups/' + group.id + '/edit')
    }
}

export { dragOverHandler, dropGroupHandler, dragStartHandlerGroup, dropHandlerGroup, edit_group }




