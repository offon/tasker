import { Container, Input, Title, Main, Form, Button } from '../../components'
import styles from './styles.module.css'
import { useFormWithValidation } from '../../utils'
import { AuthContext } from '../../contexts'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'


const SignIn = ({ onSignIn, loginData }) => {
  const { values, handleChange, isValid } = useFormWithValidation()
  const authContext = useContext(AuthContext)

  return <Main>
    {authContext && <Navigate to='/' />}
    <Container>
      <Title title='Войти на сайт' />
      <Form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          onSignIn({values, loginData})
        }}
      >
        <Input
          required
          label='Электронная почта'
          name='email'
          onChange={handleChange}
        />
        <Input
          required
          label='Пароль'
          type='password'
          name='password'
          onChange={handleChange}
        />
        <Button
          modifier='style_dark-blue'
          disabled={!isValid}
          type='submit'
          className={styles.button}
        >
          Войти
        </Button>
      </Form>
    </Container>
  </Main>
}

export default SignIn
