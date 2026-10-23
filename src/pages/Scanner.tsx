import EmBreve from '../components/EmBreve'


// Leitura da NFC-e (Sefaz-AM) em desenvolvimento: ver docs/PLANO_ATE_11_11.md.
function Scanner() {
  return (
    <EmBreve
      titulo="Ler nota fiscal"
      descricao="Leia o QR code do cupom fiscal e registre a compra com os preços reais, sem digitar nada."
      passos={[
        'Aponte a câmera para o QR code da nota fiscal (NFC-e) ou cole o link dele.',
        'Confira os produtos da nota e a qual produto do seu catálogo cada um corresponde.',
        'Salve como compra concluída: os preços entram no seu histórico e no resumo do mês.',
      ]}
    />
  )
}


export default Scanner
