import { Container, Input, Title, Main, Form, Button, Textarea } from '../../components'
import styles from './styles.module.css'
import { useFormWithValidation } from '../../utils'
import { AuthContext } from '../../contexts'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'

const GroupCreate = ({ groups, setGroup, current_board }) => {
  const [taskTitle, setTitle] = useState('')
  const navigate = useNavigate()
  const canselhandler = () => {
    navigate(`/board/${current_board}/`)
  }

  const group_create = (event, data) => {
    api.createGroups({
      ...data
    }).then(res => {
      setGroup(res)
      // setCurrentGroup(current_group)
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

  return <Container>
    <Title title='Создать Группу' />
    <Form
      className={styles.form}
      onSubmit={event => {
        event.preventDefault()
        const data = {
          board: current_board,
          title: taskTitle['value'],
          position: groups.length + 1
        }
        group_create(event, data)
      }}
    >
      <Input
        required
        label='Название группы'
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
}

export default GroupCreate
