import classnames from 'classnames';

const dragLeaveHandler = ({ e }) => {
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
}

const dragOverHandler = ({ e, styles, current_task }) => {
    e.preventDefault()
    if (classnames(e.target.className) === classnames(styles.task) && current_task != null) {
        e.target.style.boxShadow = '0 4px 3px gray'
        e.target.style.marginBottom = '10px'
    }

}
const dragstartHandler = ({ task, group, setCurrentGroup, setCurrentTask }) => {
    setCurrentGroup(group)
    setCurrentTask(task)
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

// const set_index_for_tasks = (group) => {
//     group.tasks.forEach((task, index) => {
//         task.index = index
//     })

export { dragLeaveHandler, dragOverHandler, dragstartHandler, set_index_for_tasks, set_index_for_boards }




