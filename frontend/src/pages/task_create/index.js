import { Container, Input, Main, Form, Button } from '../../components'
import styles from './styles.module.css'

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'

const TaskCreate = ({ boardsData: { current_group, setCurrentGroup, current_board } }) => {
  const [taskTitle, setTitle] = useState('')
  const navigate = useNavigate()
  const canselhandler = () => {
    navigate(`/board/${current_board}/`)
  }

  const create_task = (event, task) => {
    api.createTasks({
      task
    }).then(res => {
      current_group.tasks.push(res)
      setCurrentGroup(current_group)
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
      <Form
        className={styles.form}
        onSubmit={event => {
          event.preventDefault()
          const data = {
            title: taskTitle['value'],
            group: current_group.id,
            position: current_group.tasks.length + 1
          }
          create_task(event, data)
        }}
      >
        <Input
          required
          label='Задача'
          name='title'
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
          Создать
        </Button>

        <Button
          modifier='style_dark-blue'
          className={styles.button}
          type='reset'
          clickHandler={canselhandler}
        >
          Отменить
        </Button>

      </Form>
    </Container>
  </Main>
}

export default TaskCreate
