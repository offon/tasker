import { Container, Input, Title, Main, Form, Button, Textarea } from '../../components'
import styles from './styles.module.css'
import { useFormWithValidation } from '../../utils'
import { AuthContext } from '../../contexts'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'

const BoardCreate = ({ current_board, boards, setCurrentBoard }) => {
  const [taskTitle, setTitle] = useState('')
  const navigate = useNavigate()
  const canselhandler = () => {
    current_board ? navigate(`/board/${current_board}/`) : navigate('/')
  }
  const board_create = (event, data) => {
    // setCurrentBoard(null)
    api.createBoard({
      ...data
    }).then(res => {
      boards.push(res)
      setCurrentBoard(res)
      navigate(`/board/${res.id}/`)
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
      <Title title='Создать Доску' />
      <Form
        className={styles.form}
        onSubmit={event => {
          event.preventDefault()
          const data = {
            title: taskTitle['value'],
          }
          board_create(event, data)
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

export default BoardCreate
