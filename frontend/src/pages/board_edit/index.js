import { Container, Input, Title, Form, Button, Textarea } from '../../components'
import styles from './styles.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'

const BoardEdit = ({ current_board, boards, getBoardsData }) => {
  const [groupTitle, setTitle] = useState('')

  const navigate = useNavigate()
  const canselhandler = () => {
    navigate(`/board/${current_board}/`)
  }
  const { id } = useParams()
  const delete_board = (event) => {
    api.deleteBoard(
      current_board
    ).then(res => {
      navigate(`/`)
    })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
    event.preventDefault();
  }

  const edit_board = (event, title, id) => {
    api.editBoard(
      title,
      id
    ).then(res => {
      navigate(`/board/${id}/`)
    })
      .catch(err => {
        const errors = Object.values(err)
        if (errors) {
          alert(errors.join(', '))
        }
      })
    event.preventDefault()
  }

  const checkIfDisabled = () => {
    return groupTitle === ''
  }

  if (!boards || !current_board) {
    return <div className={styles.loading}>Загрузка</div>
  }
  let dict = {};
  if (boards) {
    boards.forEach((item) => {
      dict[item.id] = item;
    });
  }
  console.log()
  return <Container>
    <Title title='Редактирование доски' />
    <Form
      className={styles.form}
      onSubmit={event => {
        event.preventDefault()
        const title = groupTitle['value']
        edit_board(event, title, id)
      }}
    >
      <Input
        required
        label='Название'
        name='title'
        value={dict[current_board]['title']}
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
        clickHandler={delete_board}
      >
        Удалить
      </Button>
    </Form>
  </Container>
}

export default BoardEdit
