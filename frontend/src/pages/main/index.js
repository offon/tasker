import { Container, Title } from '../../components'
import styles from './styles.module.css'
import { useParams } from 'react-router-dom'

const Main = ({
  current_board,
  boards,
  setCurrentBoard,
  getBoardsData
}) => {
  const { id } = useParams()
  
  return <Container>
    <Title title='Выберите или создайте доску' />
    {/* {getBoardsData()} */}
  </Container>
}
export default Main

