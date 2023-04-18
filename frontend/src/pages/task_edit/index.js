import { Container, Input, Title, Main, Form, Button, Textarea } from '../../components'
import styles from './styles.module.css'
import { useFormWithValidation } from '../../utils'
import { AuthContext } from '../../contexts'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'

const TaskEdit = ({ promt, current_task, current_group, setCurrentTask, setCurrentGroup, current_board }) => {
  const [taskTitle, setTitle] = useState('')
  const navigate = useNavigate()
  const canselhandler = () => {
    navigate(`/board/${current_board}/`)
  }

  const { id } = useParams()

  const delete_task = (event) => {
    api.deleteTasks({
      id
    }).then(res => {
      const current_index = current_group.tasks.indexOf(current_task)
      current_group.tasks.splice(current_index, 1)
      navigate(`/board/${current_board}/`)
    })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
    event.preventDefault();
  }

  const edit_task = (event, title, id) => {
    api.editTasks(
      title,
      id
    ).then(res => {
      setCurrentTask(res)
      const current_index = current_group.tasks.indexOf(current_task)
      current_group.tasks[current_index] = res
      navigate(`/board/${current_board}/`)
    })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
    event.preventDefault();
  }

  const checkIfDisabled = () => {
    return taskTitle === ''
  }

  return <Main>
    <Container>
      <Title title='Редактирование задачи' />
      <Form
        className={styles.form}
        onSubmit={event => {
          event.preventDefault()
          const title = taskTitle['value']
          edit_task(event, title, id)
        }}
      >
        <Input
          required
          label='Задача'
          name='title'
          value={current_task.title}
          onChange={e => {
            const value = e.target.value
            setTitle({ value })
          }}
        />
        <Button
          modifier='style_dark-blue'
          type='submit'
          disabled={checkIfDisabled()}
          className={styles.button}
        >
          Сохранить
        </Button>

        <Button
          modifier='style_dark-blue'
          className={styles.button}
          type='reset'
          clickHandler={canselhandler}
        >
          Отменить
        </Button>

        <Button
          modifier='style_delete'
          className={styles.button}
          type='reset'
          clickHandler={delete_task}
        >
          Удалить
        </Button>
      </Form>
    </Container>
  </Main>
}

export default TaskEdit
