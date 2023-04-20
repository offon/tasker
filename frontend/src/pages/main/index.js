import { Container, Title } from '../../components'
import React, { useEffect } from 'react'
const Main = ({ getBoardsData, setBoards
}) => {
  useEffect(() => {
    getBoardsData(setBoards)
  }, [getBoardsData, setBoards])

  return <Container>
    <Title title='Выберите или создайте доску' />
  </Container>
}
export default Main

