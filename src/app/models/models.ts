export interface PesquisasComprasFaixaEtária {
  faixa: string
  produtos: NovoObj
}

export interface Faixa {
  jovemAdulto: NovoObj
  adulto: NovoObj
  meiaIdade: NovoObj
  terceiraIdade: NovoObj
}

export interface Conta {
  id: string
  nome: string
  sobreNome: string
  idade: number
  compras: any[]
  pesquisas: any[]
}

export interface CategoriaProd {
  categoria: string
  produtos: string[]
}

export interface PesquisasCompras {
  categoria: string
  produto: string
}

export interface NovoObj {
  [key: string]: any
}
