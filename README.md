# Neo Idea - Plataforma de Streaming de Vídeos

<p align="center">
  <img src="https://app.neoidea.com.br/neoidea/images/neo-idea.png" alt="Neo Idea Logo" width="200"/>
</p>

## 📋 Sobre o Projeto

Neo Idea é uma plataforma moderna de streaming de vídeos desenvolvida com React e TypeScript. A aplicação oferece uma experiência de usuário intuitiva com autenticação segura, carrossel de conteúdo em destaque, galeria de vídeos e player integrado.

## 🖼️ Screenshots

### Tela de Login

<p align="center">
  <img src="image-4.png" alt="Tela de Login" width="800"/>
</p>

_Descrição: Interface de autenticação com suporte a login tradicional e QR Code._

### Carrossel de Conteúdo

<p align="center">
  <img src="image-3.png" alt="Carrossel de Conteúdo" width="800"/>
</p>

_Descrição: Carrossel interativo exibindo conteúdos em destaque com navegação intuitiva._

### Dados do usuário

<p align="center">
  <img src="image-2.png" alt="Dados do usuário" width="800"/>
</p>

_Descrição: Carrossel interativo exibindo conteúdos em destaque com navegação intuitiva._

### Galeria de Vídeos

<p align="center">
  <img src="image-5.jpg" alt="Galeria de Vídeos" width="800"/>
</p>

_Descrição: Visualização em grid de vídeos disponíveis com informações detalhadas._

### Player de Vídeo

<p align="center">
  <img src="image-6.jpg" alt="Player de Vídeo" width="800"/>
</p>

_Descrição: Player de vídeo com controles avançados e interface personalizada._

## 🚀 Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **Styled Components** - Estilização com CSS-in-JS
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP para requisições à API
- **React Slick** - Implementação do carrossel
- **React Icons** - Biblioteca de ícones

## 🔧 Requisitos

- Node.js (versão 14 ou superior)
- Yarn ou NPM
- Acesso à API Neo Idea

## ⚙️ Instalação

1. Clone o repositório:

```bash
git clone https://gitlab.com/mastercase/teste-frontend
cd teste-frontend
```

2. Instale as dependências:

```bash
yarn install
# ou
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as configurações apropriadas para seu ambiente.

4. Inicie o servidor de desenvolvimento:

```bash
yarn dev
# ou
npm run dev
```

5. Acesse a aplicação em [http://localhost:5173](http://localhost:5173)

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos React
│   ├── interfaces/      # Interfaces TypeScript
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Serviços e integrações com API
│   ├── stores/          # Stores Zustand para gerenciamento de estado
│   ├── types/           # Tipos TypeScript
│   ├── App.tsx          # Componente principal e rotas
│   └── main.tsx         # Ponto de entrada da aplicação
├── .env.example         # Exemplo de variáveis de ambiente
├── index.html           # Template HTML
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
└── vite.config.ts       # Configuração do Vite
```

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em token com suporte a:

- Login com email e senha
- Autenticação de dois fatores (2FA)
- Login via QR Code

## 🌐 Endpoints da API

A aplicação consome os seguintes endpoints da API Neo Idea:

- Autenticação: `VITE_ENDPOINT_AUTH`
- Perfil do usuário: `VITE_ENDPOINT_GET_PROFILE`
- Atualização de perfil: `VITE_ENDPOINT_UPDATE_PROFILE`
- Listagem de conteúdos: `VITE_ENDPOINT_GET_NEOS`
- Vinculação de dispositivos: `VITE_ENDPOINT_LINK_DEVICE`

## 🔄 Fluxo de Dados

A aplicação utiliza o Zustand para gerenciamento de estado, com stores separadas para:

- `authStore`: Gerenciamento de autenticação e dados do usuário
- `themeStore`: Configurações de tema e layout
- `carouselStore`: Dados do carrossel de conteúdo
- `videoStore`: Gerenciamento de vídeos e reprodução

## 🧪 Testes

_Instruções para execução de testes serão adicionadas em breve._

## 📱 Responsividade

A aplicação é totalmente responsiva, adaptando-se a diferentes tamanhos de tela:

- Desktop (1024px e acima)
- Tablet (600px a 1023px)
- Mobile (abaixo de 600px)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está com licença livre do autor e a depender de autorização da equipe Neo Idea.

## 📞 Contato

- **Email**: <rogeriojr1100@gmail.com>
- **Website**: [https://rj-dev-portfolio-20.vercel.app/]

---

<p align="center">Desenvolvido com ❤️ para equipe Neo Idea</p>
#   n e o - t e s t - f r o n t e n d  
 