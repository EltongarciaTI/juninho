# JUNINHO MULTI MARCAS — CONFIGURAÇÃO

## 1. SUPABASE (Banco de Dados)

1. Acesse https://supabase.com e crie uma conta gratuita
2. Crie um novo projeto (nome: juninho-multimarcas)
3. Aguarde o projeto inicializar
4. Vá em **SQL Editor** e cole o conteúdo de `supabase/schema.sql` — clique em **Run**
5. Vá em **Settings > API** e copie:
   - `Project URL` → substituir `https://SEU_PROJETO.supabase.co`
   - `anon public key` → substituir `SUA_CHAVE_ANON_AQUI`
6. Abra o arquivo `js/config.js` e substitua as duas chaves acima

## 2. MERCADO PAGO (Pagamentos)

1. Acesse https://www.mercadopago.com.br/developers
2. Crie um aplicativo
3. Copie a **Public Key** de produção
4. Abra `js/config.js` e substitua `SUA_PUBLIC_KEY_MERCADO_PAGO`

## 3. CRIAR ADMIN NO SUPABASE

1. No Supabase, vá em **Authentication > Users**
2. Clique em **Invite user** ou **Add user**
3. Informe seu e-mail e senha
4. Use essas credenciais para logar em `admin/login.html`

## 4. GITHUB PAGES (Publicar o Site)

1. Crie um repositório no GitHub (ex: juninho-multimarcas)
2. Faça upload de todos os arquivos deste projeto
3. Vá em **Settings > Pages**
4. Em "Source", selecione **main branch** e pasta **/ (root)**
5. Clique em **Save**
6. Em alguns minutos, seu site estará em: `https://seu-usuario.github.io/juninho-multimarcas`

## 5. ADICIONAR PRODUTOS

1. Acesse `seu-site/admin/login.html`
2. Faça login com o e-mail e senha criados
3. Vá em **Produtos > Novo Produto**
4. Preencha: nome, categoria, marca, preço, foto (URL), tamanhos
5. Salve — o produto aparece automaticamente na loja!

## ESTRUTURA DO PROJETO

```
juninho-multimarcas/
├── index.html           ← Loja principal
├── checkout.html        ← Pagamento
├── css/
│   ├── style.css        ← Estilos da loja
│   └── admin.css        ← Estilos do painel
├── js/
│   ├── config.js        ← ← CONFIGURE AQUI AS CHAVES
│   ├── main.js
│   ├── carrinho.js
│   ├── produtos.js
│   └── admin/
│       └── auth.js
├── admin/
│   ├── login.html       ← Painel de login
│   ├── dashboard.html   ← Dashboard principal
│   ├── produtos.html    ← Gerenciar produtos
│   ├── pedidos.html     ← Ver pedidos online
│   ├── vendas.html      ← Anotar venda balcão
│   ├── promocoes.html   ← Gerenciar promoções
│   └── relatorios.html  ← Relatórios e gráficos
└── supabase/
    └── schema.sql       ← Estrutura do banco de dados
```
