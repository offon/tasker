const dragLeaveHandler = ({ e }) => {
    e.target.style.boxShadow = 'none'
    e.target.style.marginBottom = '0px'
}

const dragOverHandler = ({ e }) => {
    e.preventDefault()
    if (e.target.className === 'task') {
        e.target.style.boxShadow = '0 4px 3px gray'
        e.target.style.marginBottom = '30px'
    }
}

const dragstartHandler = ({ task, group, setCurrentGroup, setCurrentTask }) => {
    setCurrentGroup(group)
    setCurrentTask(task)
}

export { dragLeaveHandler, dragOverHandler, dragstartHandler }




