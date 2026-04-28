
const resEntrada = document.querySelector('.resEntrada')
const resSaida = document.querySelector('.resSaida')
const resFinal = document.querySelector('.resSubtotal')

const btn = document.querySelector('#enviar')

const inputDesc = document.querySelector('.descricao')
const inputValor = document.querySelector('.valor')
const selectOpcao = document.querySelector('.options')

const listaInfo = document.getElementById('lista')

const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

const getInfo = () => JSON.parse(localStorage.getItem('GTitem')) ?? []

const setInfo = (lista) => localStorage.setItem('GTitem', JSON.stringify(lista))

const carregarInfo = () => {
    let listar = getInfo()
    listaInfo.innerHTML = ''
    
    listar.forEach((item, index) => {
    const tr = document.createElement('tr')

    const classeCor = item.tipo === 'Saida' ? 'negativo' : '';

    const valorNum = Number(item.valor)
    const valorParaExibir = item.tipo === 'Saida' ? -Math.abs(valorNum) : item.valor;
    
    let valorFinal = formatarMoeda(valorParaExibir)

    const iconeTipo = item.tipo === 'Entrada' ? '⬆️' : '⬇️';
   
    tr.innerHTML = `
            <td>${item.descricao}</td>
            <td class="${classeCor}">${valorFinal}</td>
            <td class='coluna-tipo'>${iconeTipo} </td>
    `
    const buttonDelete = document.createElement('button')
    const TdDelete = document.createElement('td')

    buttonDelete.innerHTML = `X`
    buttonDelete.classList.add('deleteItem')

    buttonDelete.addEventListener('click', () => {
        excluirItem(index)
        
    })

    TdDelete.appendChild(buttonDelete)
    tr.appendChild(TdDelete)
    listaInfo.appendChild(tr)

    })
}
    
function atualizarInfo(){
    let listar = getInfo()

    resEntrada.style.color = 'green'
    resSaida.style.color = 'red'

    const somaEntrada = listar
        .filter(item => item.tipo === 'Entrada') 
        .reduce((acc, item) => acc + item.valor, 0)

    const somaSaida = listar
        .filter(item => item.tipo === 'Saida')
        .reduce((acc, item) => acc + item.valor, 0)

    resEntrada.textContent = `${somaEntrada.toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    const valorNegativo = -Math.abs(somaSaida);

    resSaida.textContent = `${valorNegativo.toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`

    const resultadoFinal = somaEntrada - somaSaida
    resFinal.style.color = resultadoFinal < 0 ? 'red' : 'black'

    resFinal.textContent = resultadoFinal.toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

btn.addEventListener('click', () => {
    const valores = {
        descricao: inputDesc.value,
        valor: Number(inputValor.value.replace(",", ".")),
        tipo: selectOpcao.value
    };

    if(valores.descricao == "" || valores.valor == "" || valores.valor <= 0 || isNaN(valores.valor)){
        alert("Erro! Você deixou um dos campos vazios ou não digitou um valor válido")
        return
    }

    let listar = getInfo();
    listar.push(valores)
    setInfo(listar)

    carregarInfo()
    atualizarInfo()

    inputDesc.value = ''
    inputValor.value = ''
    
    })

window.addEventListener('load', () => {
    carregarInfo()
    atualizarInfo()
    
})

function excluirItem(index){
    let listar = getInfo()
    listar.splice(index, 1)
    setInfo(listar)

    carregarInfo()
    atualizarInfo()
}
