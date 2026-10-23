import EmBreve from '../components/EmBreve'


// Grupos ainda não existem no backend; esta tela só explica o que vem.
function Groups() {
  return (
    <EmBreve
      titulo="Grupos"
      descricao="Compartilhe listas com quem faz as compras com você, como a família ou quem divide a casa."
      passos={[
        'Crie um grupo e convide pessoas pelo e-mail.',
        'Todos do grupo veem e editam as mesmas listas.',
        'Quem estiver no mercado marca os produtos, e o orçamento atualiza para todos.',
      ]}
    />
  )
}


export default Groups
