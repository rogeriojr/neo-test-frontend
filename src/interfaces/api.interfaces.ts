export interface BaseRequestParams {
  lang?: string;
}

export interface AuthRequestParams extends BaseRequestParams {
  email: string;
  senha: string;
  metodo?: string;
  mdi_id?: string | number;
}

export interface ProfileRequestParams extends BaseRequestParams {
  slug?: string;
}

export interface UpdateProfileRequestParams extends BaseRequestParams {
  slug: string;
  email: string;
  senha?: string;
  nome: string;
  sobrenome: string;
  nascimento: string;
  sexo: string;
  pais: number;
  cep: string;
  cidade: string;
  estado: string;
  endereco: string;
  numero: string;
  bairro: string;
  complemento: string;
  celular_ddi: string;
  celular_numero: string;
  telefone_ddi?: string;
  telefone_numero?: string;
  profissao?: string;
}

export interface CarouselRequestParams extends BaseRequestParams {
  mdi_id: string | number;
  tipo?: string;
  id?: string | number;
}

export interface TransmissaoRequestParams extends BaseRequestParams {
  elive_id?: string;
  user_tz?: string;
}

export interface DeviceRequestParams extends BaseRequestParams {
  numero_serie?: string;
}

export interface InviteRequestParams extends BaseRequestParams {
  convite: string;
}

export interface MailingRequestParams extends BaseRequestParams {
  mdi: number;
  recebe_mailing: number;
}

export interface ApiResponse<T = any> {
  retorno: boolean;
  erro?: string;
  descricao?: string;
  dados?: T;
}

export interface AuthData {
  codigo: number;
  nome: string;
  email: string;
  ativado: number;
  eula: number;
  token: string;
}

export interface ProfileData {
  codigo: number;
  nome: string;
  sobrenome: string;
  email: string;
  nascimento: string;
  sexo: string;
}


export interface CarouselItem {
  id: number;
  tipo: string;
  titulo: string;
  ordem: number;
  destaque: boolean;
  imagem: string;
  favorito: boolean;
}

export interface ContactData {
  endereco: string;
  telefone: string;
  email: string;
  horario_funcionamento: string;
  redes_sociais: {
    facebook: string;
    twitter: string;
  };
}

export interface ContactRequestParams extends BaseRequestParams {
  nome: string;
  email: string;
  mensagem: string;
}