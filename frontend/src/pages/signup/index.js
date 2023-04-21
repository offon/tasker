import { Container, Input, Title, Main, Form, Button } from '../../components'
import styles from './styles.module.css'
import { useFormWithValidation } from '../../utils'
import { useContext } from 'react'
import { AuthContext } from '../../contexts'

const SignUp = ({ onSignUp, loginData }) => {
  const { values, handleChange, isValid } = useFormWithValidation()
  const authContext = useContext(AuthContext)

  return <Main>
    <Container>
      <Title title='Регистрация' />
      <Form className={styles.form} onSubmit={e => {
        e.preventDefault()
        onSignUp({values, loginData})
      }}>
        <Input
          label='Имя'
          name='first_name'
          required
          onChange={handleChange}
        />
        <Input
          label='Фамилия'
          name='last_name'
          required
          onChange={handleChange}
        />
        <Input
          label='Имя пользователя'
          name='username'
          required
          onChange={handleChange}
        />

        <Input
          label='Адрес электронной почты'
          name='email'
          required
          onChange={handleChange}
        />
        <Input
          label='Пароль'
          type='password'
          name='password'
          required
          onChange={handleChange}
        />
        <Button
          modifier='style_dark-blue'
          type='submit'
          className={styles.button}
          disabled={!isValid}
        >
          Создать аккаунт
        </Button>
      </Form>
    </Container>
  </Main>
}

export default SignUp
