import { Container, Input, Title, Form, Button, Textarea } from '../../components'
import styles from './styles.module.css'
import { useFormWithValidation } from '../../utils'
import { AuthContext } from '../../contexts'
import {  useParams } from 'react-router-dom'
import { useState } from 'react'
import api from '../../api'

const GroupEdit = ({ boardsData: { current_group, groups, current_board, navigate } }) => {
  const [groupTitle, setTitle] = useState('')
  const canselhandler = () => {
    navigate(`/board/${current_board}/`)
  }
  const { id } = useParams()

  const delete_group = (event) => {
    api.deleteGroup({
      id
    }).then(res => {
      const current_index = groups.indexOf(current_group)
      groups.splice(current_index, 1)
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

  const edit_group = (event, title, id) => {
    api.editGroup(
      title,
      id
    ).then(res => {
      const current_index = groups.indexOf(current_group)
      groups[current_index].title = res['title']
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
    return groupTitle === ''
  }

  return <Container>
      <Title title='Редактирование группы' />
      <Form
        className={styles.form}
        onSubmit={event => {
          event.preventDefault()
          const title = groupTitle['value']
          edit_group(event, title, id)
        }}
      >
        <Input
          required
          label='Задача'
          name='title'
          value={current_group.title}
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
          clickHandler={delete_group}
        >
          Удалить
        </Button>
      </Form>
    </Container>
}

export default GroupEdit
