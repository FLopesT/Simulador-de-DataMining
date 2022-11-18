import { Injectable } from '@angular/core';
import { CategoriaProd, Conta, NovoObj, PesquisasCompras } from './models/models';
const { v4: uuidv4 } = require('uuid');

@Injectable({
  providedIn: 'root'
})
export class GeradorDeBancoService {

  constructor() { }

  pessoa: Conta | any
  faker = require('faker-br')
  objProdutosFinal:any;
  começou:boolean = false

  embaralhar(array: any[]) {
    let i = array.length, iRandom;
    while (i != 0) {
      iRandom = Math.floor(Math.random() * i);
      i--;
      [array[i], array[iRandom]] = [array[iRandom], array[i]];
    }
  }


  getProductCategoryName() {
    let categoriasList: NovoObj = {}
    let produtosList: NovoObj = {};
    this.produtos.forEach(item => {
      categoriasList[item.categoria] = 0;
      item.produtos.forEach(i=> {
         produtosList[i] = 0;
       })
    })
    return { produtosList, categoriasList };
  }

  produtos: CategoriaProd[] = [
    { categoria: 'Eletrodomésticos', produtos: ["Tv", "NoteBook", "Geladeira", "Ventilador", "Ar-condicionado", "Computador", "Máquina de Lavar", "Secadora", "Celular", "Batedeira"] },
    { categoria: 'Móveis', produtos: ["Cama", "Armário", "Mesa", "Escrivaninha", "Sofá", "Poltrona", "Cadeira Gamer", "Cabide", "Criado mudo", "Beliche"] },
    { categoria: 'Items de cozinha', produtos: ["Jogo de talheres", "Jogo de copos", "Caneca Personalizada", "Jogo de pratos", "Panela", "Porta Copos", "Toalha de prato", "Vasilhame", "Escorredor", "Armario de cozinha"] },
    { categoria: 'Roupas', produtos: ["Camiseta", "Calça", "Bermuda", "Paletó", "Vestido", "Cueca", "Calçinha", "Uniforme de Clube", "Meia", "Boné"] },
    { categoria: 'Ferramentas', produtos: ["Caixa de ferramentas", "Chave de impacto", "Furadeira", "Martelo", "Kit de chaves", "Máquina de solda", "Esmeril", "Voltimetro", "Marreta", "Kit Chaves de boca"] }
  ]

  startRandom() {
    this.embaralhar(this.produtos)
    this.produtos.forEach(item => {
      this.embaralhar(item.produtos)
    })
    this.começou = true;
  }


  addComprasEmPesquisas(pesq: PesquisasCompras[], comp: PesquisasCompras[]) {
    comp.forEach((c => {
      pesq.push(c)
    }))
    return pesq
  }

  gerar(): Conta {
    let compras = this.gerarPesqCompras(false);
    let pesquisas = this.gerarPesqCompras(false)
    pesquisas = this.addComprasEmPesquisas(pesquisas, compras);
    let conta: Conta = {
      id: uuidv4(),
      nome: this.faker.name.firstName(),
      sobreNome: this.faker.name.lastName(),
      idade: this.gerarIdade(),
      compras: compras,
      pesquisas: pesquisas
    }
    if (conta.compras.length == 0) { //se não existir compra, precisamos garantir que existam pesquisas
      conta.pesquisas = this.gerarPesqCompras(true);
    }
    return conta
  }

  gerarPesqCompras(value: boolean) {
    let numDePesquisas;
    //se não existir compra, tem que haver pesquisa
    if (value) {
      numDePesquisas = 4;
    } else {
      numDePesquisas = this.gerarValor(6);
    }
    let index = 1
    let pesquisas: PesquisasCompras[] = [];
    if (numDePesquisas != 0) {
      while (index <= numDePesquisas) {
        let produtos = this.produtos[this.gerarValor(this.produtos.length - 1)]
        let prodName = produtos.produtos[this.gerarValor(produtos.produtos.length - 1)]
        pesquisas.push({
          categoria: produtos.categoria,
          produto: prodName
        })
        index++;
      }
    }
    return pesquisas;
  }


  gerarIdade(): number {
    let f = ['jovemAdulto','adulto','MeiaIdade','terceiraIdade'];
    this.embaralhar(f)
    switch (f[0]) { //decidi sortear assim, para ter uma distribuição mais aleatórea
      case ('jovemAdulto'): return 18 + this.gerarValor(8) //18 a 25 anos, Jovem Adulto
      case ('adulto'): return 26 + this.gerarValor(15) //26 a 40 anos, Adulto
      case ('MeiaIdade'): return 41 + this.gerarValor(25) //41 a 65 anos, Meia Idade
      default:
        return 66 + this.gerarValor(20) //66 ao resto da vida , Terceira Idade
    }

  }

  gerarValor(value: number) {
    let random = Math.random() * value;
    random = Math.round(random);
    return random
  }

}
