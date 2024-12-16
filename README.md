
# labrizza

## Arquivos de configuração

O Storefront SSR possui os seguintes arquivos de configuração principais:

### pages.json

- Vínculo de rotas com templates e queries 
- Permite criar casos customizados com base na rota solicitada

### components.json

- Define os componentes disponíveis no template
- Especifica o arquivo de template associado a cada componente
- Os argumentos que podem ser utilizados
- Onde esses componentes podem ser utilizados

### emails.json

- Estabelece a associação entre os tipos de email e os templates correspondentes

### settings.json

- Arquivo genérico que contém chaves e valores que serão injetados no template. 
- Essas chaves podem ser utilizadas para personalizar o website, como configurações gerais, informações do usuário, preferências e outros dados relevantes


## Trabalhando com Git 

### Pré-requisitos

O Git é um sistema de controle de versão distribuído e é necessário para clonar e trabalhar com repositórios.
- Verifique se o Git está instalado no seu computador digitando o seguinte comando no terminal ou prompt de comando: `git --version`
- Se o Git estiver instalado, você verá a versão do Git sendo exibida. Caso contrário, você precisará instalá-lo. Você pode fazer o download e seguir as instruções de instalação no [site oficial do Git](https://git-scm.com/downloads)

## Processo para cópia local e edição do projeto
Para trabalhar com sistema git deste repositório, siga estas etapas:

1. No terminal, navegue até a pasta onde deseja copiar o projeto usando `cd {nome_pasta}`
2. Digite o seguinte comando, seguido pelo URL do repositório: `git clone URL_DO_REPOSITÓRIO`
3. Faça suas alterações e confirme-as usando: `git commit -m "<titulo do commit>" -m "<mensagem do commit>"`
4. Envie para o branch original: `git push origin <nome_do_projeto> / <local>`


## Iniciando o projeto

Para rodar em localmente o projeto, execute o seguinte comando na pasta raiz do site, após baixar o projeto para sua máquina, substitua "tcs_loja_xxxxxx" pelo token de sua loja:

```
fbits.storefront --token tcs_loja_xxxxxx
```

## Links Úteis
- [Documentação Geral Wake](https://wakecommerce.readme.io/docs)
- [StoreFront SSR Configuração](https://wakecommerce.readme.io/docs/local)
- [Documentação Scriban Wake](https://wakecommerce.readme.io/docs/scriban)
- [Documentação Scriban Oficial](https://github.com/scriban/scriban/tree/master/doc)