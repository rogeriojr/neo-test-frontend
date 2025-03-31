export interface LayoutData {
  nome: string;
  background: string;
  corBackground: string;
  logo: string;
  text: string;
  text2: string;
  color: string;
  color2: string;
  box: string;
}

export interface AuthData {
  email: string;
  senha: string;
  mdi_id?: string | number;
  metodo?: string;
  lang?: string;
}

export interface AuthResponse {
  retorno: boolean;
  erro?: string;
  descricao?: string;
  dados?: {
    codigo: number;
    nome: string;
    email: string;
    ativado: number;
    eula: number;
    token: string;
  };
}

export interface ApiResponse {
  retorno: boolean;
  erro?: string;
  descricao?: string;
  dados?: any;
}

export interface Auth2Challenge {
  desafio: string;
}

export interface Auth2ValidateData {
  desafio: string;
  numero_serie: string;
  lang?: string;
}

export interface Auth2ValidateWithEmailData {
  desafio: string;
  email: string;
  mdi: number | string;
  lang?: string;
}

export interface CarouselItem {
  url: any;
  id: string;
  titulo: string;
  descricao?: string;
  imagem: string;
  tipo: string;
  link?: string;
  ordem: number;
  destaque?: boolean;
  autor?: string;
  categoria?: string;
  favorito?: boolean;
  url_compra?: string | null;
}

export interface Video {
  id: string;
  titulo: string;
  descricao?: string;
  thumbnail?: string;
  url: string;
  duracao?: string;
  categoria?: string;
}

export interface ThemeContextType {
  layout: LayoutData;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id: string;
    nome: string;
    email: string;
  } | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  verificarAutenticacao: (lang?: string) => Promise<boolean>;
  recuperarSenha: (email: string, lang?: string) => Promise<void>;
  gerarDesafioQRCode: (email: string, lang?: string) => Promise<{ desafio: string }>;
  validarDesafioQRCode: (desafio: string, numero_serie: string, lang?: string) => Promise<boolean>;
  gerarDesafioApp: (mdi: number | string, numero_serie: string, lang?: string) => Promise<{ desafio: string }>;
  validarDesafioApp: (desafio: string, email: string, mdi: number | string, lang?: string) => Promise<boolean>;
}