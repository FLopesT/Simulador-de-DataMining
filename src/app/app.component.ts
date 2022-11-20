import { Component, OnInit, ViewChild } from '@angular/core';
import { type } from 'os';
import { GeradorDeBancoService } from './gerador-de-banco.service';
import { Conta, Faixa, NovoObj } from './models/models';

export interface Compra { }
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  contas: any[] = [];
  itemsMaisVendidos: any
  categoriasMaisVendidas: any
  compras: NovoObj = {}
  categorias: NovoObj = {}
  pesquisas: NovoObj = {};
  gerou: boolean = false;
  mostrarVendasdeFE: boolean = false;
  contaSelecionada: Conta | any;
  faixaEtariaDaConta: string = "";


  @ViewChild('selectFaixa') selectFaixa: any;
  @ViewChild('selectFaixa1') selectFaixa1: any;
  @ViewChild('porIndice') indice: any;
  @ViewChild('porId') id: any;


  maisVendidosPorFaixaEtária: NovoObj = {};
  categoriasMaisVendidasPorFaixaEtária: NovoObj = {};
  produtosRecomendados: any = []

  categoriasDeFaixaetaria: NovoObj = {
    jovemAdulto: {},
    adulto: {},
    meiaIdade: {},
    terceiraIdade: {}
  }

  comprasDeFaixaetaria: NovoObj = {
    jovemAdulto: {},
    adulto: {},
    meiaIdade: {},
    terceiraIdade: {}
  }

  idadeSelecionada: any;
  idadeSelecionada1: any;

  constructor(private gerarBanco: GeradorDeBancoService) { }

  ngOnInit(): void {

  }

  gerar() {
    if (this.categoriasMaisVendidas) {
      this.produtosRecomendados = [];
      this.categoriasMaisVendidas = undefined;
      this.itemsMaisVendidos = undefined;
      this.maisVendidosPorFaixaEtária = {}
      this.gerou = false;
      this.mostrarVendasdeFE = false;
    }
    this.gerarBanco.startRandom(); //embaralhar produtos pra melhorar aleatoriedade
    let max = 10000;
    let index = 0
    let contas = []
    while (index < max) {
      contas.push(this.gerarBanco.gerar());
      this.gerarBanco.startRandom()
      index++
      this.gerarBanco.numeroDeContas++;
    }
    this.contas = contas;
    console.log('-')
    console.log('LISTA DE CONTAS GERADAS', this.contas)
    console.log('-')
    return this.levantamento();
  }

  levantamento() {
    this.getComprasECategorias();
    this.gerou = true;
  }

  getComprasECategorias() {
    let results = this.gerarBanco.getProductCategoryName();
    this.compras = results.produtosList;
    this.categorias = results.categoriasList;

    Object.keys(this.comprasDeFaixaetaria).forEach(entrie => {
      this.comprasDeFaixaetaria[entrie] = { ...results.produtosList }
    })
    Object.keys(this.categoriasDeFaixaetaria).forEach(entrie => {
      this.categoriasDeFaixaetaria[entrie] = { ...results.categoriasList }
    })

    this.contas.forEach(conta => {
      for (let compra of conta.compras) {
        this.compras[compra.produto]++;
        this.categorias[compra.categoria]++;
      }
    })

    console.log('PRODUTOS E SEUS NÚMEROS DE VENDA', this.compras)
    console.log('-')
    console.log('CATEGORIAS E SEUS NÚMEROS DE VENDA', this.categorias)
    console.log('-')
    this.itemsMaisVendidos = this.top5Etop3(0);
    this.categoriasMaisVendidas = this.top5Etop3(1);
    this.faixaOtária()

    Object.entries(this.comprasDeFaixaetaria).forEach(entrie => {
      let top = []
      top = this.top5Etop3(2, entrie[1]);
      this.maisVendidosPorFaixaEtária[entrie[0]] = top
    })

    Object.entries(this.categoriasDeFaixaetaria).forEach(entrie => {
      let top = []
      top = this.top5Etop3(3, entrie[1])
      this.categoriasMaisVendidasPorFaixaEtária[entrie[0]] = top;
    })
    console.log('-')
    console.log('TOP3 PRODUTOS MAIS VENDIDAS EM GERAL', this.itemsMaisVendidos)
    console.log('-')
    console.log('TOP3 CATEGORIAS MAIS VENDIDAS EM GERAL', this.categoriasMaisVendidas)
    console.log('-')
    console.log('TOP5 PRODUTOS MAIS VENDIDOS PARA CADA FAIXA ETÁRIA', this.maisVendidosPorFaixaEtária)
    console.log('-')
    console.log('TOP3 CATEGORIAS MAIS VENDIDAS PARA CADA FAIXA ETÁRIA', this.categoriasMaisVendidasPorFaixaEtária)
    console.log('-')
    this.idadeSelecionada = this.maisVendidosPorFaixaEtária['jovemAdulto']
    this.idadeSelecionada1 = this.categoriasMaisVendidasPorFaixaEtária['jovemAdulto']
    this.mostrarVendasdeFE = true;

  }

  faixaObj = ['jovemAdulto', 'adulto', 'meiaIdade', 'terceiraIdade']
  faixaString = ['Jovem adulto', 'Adulto', 'Meia Idade', 'Terceira idade']

  confereFaixa(idade: number, text?: boolean) {
    if (idade <= 25) {
      if (text) return this.faixaString[0]
      return this.faixaObj[0]
    }
    if (idade <= 40) {
      if (text) return this.faixaString[1]
      return this.faixaObj[1]
    }
    if (idade <= 65) {
      if (text) return this.faixaString[2]
      return this.faixaObj[2]
    }
    else if (text) return this.faixaString[3]
    return this.faixaObj[3]
  }

  faixaOtária() {
    this.contas.forEach(conta => {
      let faixa = this.confereFaixa(conta.idade)
      for (let pesquisa of conta.pesquisas) {
        this.categoriasDeFaixaetaria[faixa][pesquisa.categoria]++
      }
      for (let compra of conta.compras) {
        this.comprasDeFaixaetaria[faixa][compra.produto]++
      }
    })

    console.log('PRODUTOS DE FAIXA ETÁRIA E SEUS NÚMEROS DE VENDA', this.comprasDeFaixaetaria)
    console.log('-')
    console.log('CATEGORIAS DE FAIXA ETÁRIA E SEUS NÚMEROS DE VENDA', this.categoriasDeFaixaetaria)
  }

  getMaior = (obj: NovoObj, maior: any[]) => {
    Object.entries(obj).forEach((key) => {
      if (key[1] > maior[0])
        maior = [key[1], key[0]]
    })
    return maior
  }

  top5Etop3(option: number, nObj?: NovoObj) {
    let items = []
    let maior = [0, ""];
    let obj;
    let max;
    switch (option) {
      case (0):
        obj = { ...this.compras }
        max = 5
        break;
      case (1):
        obj = { ...this.categorias }
        max = 3
        break;
      case (2):
        obj = { ...nObj }
        max = 5
        break;
      default:
        obj = { ...nObj }
        max = 3
    }
    let i = 1
    while (i <= max) {
      maior = this.getMaior(obj, maior);
      items.push(maior)
      delete obj[maior[1]]
      maior = [0, ""];
      i++
    }
    return items;
  }

  selecionaFaixa() {
    let faixa = this.selectFaixa.nativeElement.value
    this.idadeSelecionada = this.maisVendidosPorFaixaEtária[faixa]
  }

  selecionaFaixa1() {
    let faixa = this.selectFaixa1.nativeElement.value
    this.idadeSelecionada1 = this.categoriasMaisVendidasPorFaixaEtária[faixa]
  }

  getContaPorIndice() {
    let ind = Number(this.indice.nativeElement.value);
    if (ind <= 9999) {
      this.produtosRecomendados = [];
      this.contaSelecionada = this.contas[ind]
      this.faixaEtariaDaConta = this.confereFaixa(this.contaSelecionada.idade, true)
      this.recomendaParaUser();
    }
  }


  recomendaParaUser() {
    this.contaSelecionada.pesquisas.forEach((pesq: any) => {
      let have = false;
      for (let comp of this.contaSelecionada.compras) {
        if (pesq.produto === comp.produto) {
          have = true;
          break;
        }
      }
      if (!have) { //não vamos recomendar oque a pessoa já comprou
        this.produtosRecomendados.push(pesq.produto);
      }
    })
    let fe;
    switch (this.faixaEtariaDaConta) {
      case (this.faixaString[0]): { fe = this.faixaObj[0]; break; }
      case (this.faixaString[1]): { fe = this.faixaObj[1]; break; }
      case (this.faixaString[2]): { fe = this.faixaObj[2]; break; }
      default: fe = this.faixaObj[3];
    }
    //recomendando item mais vendidos por faixa estária correspondente
    this.maisVendidosPorFaixaEtária[fe].forEach((prod: any) => {
      this.produtosRecomendados.push(prod[1]);
    })
    //recomendando 3 items aleatóreos das categorias mais populares correpondentes a faixa etária
    this.categoriasMaisVendidasPorFaixaEtária[fe].forEach((prod:any)=>{
      for(let cat of this.gerarBanco.produtos){
        if(prod[1] == cat.categoria){
          this.produtosRecomendados.push(cat.produtos[0])
          this.produtosRecomendados.push(cat.produtos[1])
          this.produtosRecomendados.push(cat.produtos[2])
          break;
        }
      }
    })
    //recomendando item mais vendidos
    this.itemsMaisVendidos.forEach((prod:any)=>{
      this.produtosRecomendados.push(prod[1]);
    })
    //recomendando 2 items aleatóreos das categorias mais populares
    this.categoriasMaisVendidas.forEach((prod:any)=>{
      for(let cat of this.gerarBanco.produtos){
        if(prod[1] == cat.categoria){
          this.produtosRecomendados.push(cat.produtos[0])
          this.produtosRecomendados.push(cat.produtos[1])
          break;
        }
      }
    })
    let result = this.removeDuplicata(this.produtosRecomendados)
    if (result) {
      this.produtosRecomendados = result;
    }
    console.log('-')
    console.log(`PRODUTOS RECOMENDADOS PARA ${(this.contaSelecionada.nome).toUpperCase()} ${this.contaSelecionada.sobreNome.toUpperCase()}`,this.produtosRecomendados)
  }

  removeDuplicata(arrayOriginal: string[]) {
    let array: string[] = []

    arrayOriginal.forEach((item: string) => {

      let have = false
      if (array.length == 0) {
        array.push(item)
      }

      for (let arr of array) {
        if (item == arr) {
          have = true
          break;
        }
      }

      if (!have) {
        array.push(item);
      }

    })

    if (array.length != arrayOriginal.length) {
      return array;
    }
    return undefined;
  }

}
