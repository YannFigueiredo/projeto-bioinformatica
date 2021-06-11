# Yellow Fever Genome Database
![yellow-fever](bioinfo_project/bioinfo_web/static/imagens/yellow-fever.jpg)

## Documentação

> ### Requisitos:

#### Python
![python](/bioinfo_project/bioinfo_web/static/imagens/python_logo.png)
- <b>Instalação no Windows:</b> Para instalar o Python no  Windows é necessário baixar o mesmo [clicando aqui](https://www.python.org/downloads/). No Linux o Python já  vem instalado.

#### BioPython (versão 1.77)
![biopython_logo](/bioinfo_project/bioinfo_web/static/imagens/biopython_logo.png)
- <b>Instalação no Linux Ubuntu e Windows:</b> Inserir um dos comandos abaixo no terminal.
<p align="center">Python 2: <i>pip install biopython==1.77</i></p>
<p align="center">Python 3: <i>pip3 install biopython==1.77</i></p>

#### Django
![django_logo](/bioinfo_project/bioinfo_web/static/imagens/django_logo.png)
- <b>Instalação no Linux Ubuntu e Windows:</b> Inserir um dos comandos abaixo no terminal.
<p align="center">Python 2: <i>pip install django</i></p>
<p align="center">Python 3: <i>pip3 install django</i></p>

### NodeJS
![nodejs_logo](bioinfo_project/bioinfo_web/static/imagens/nodejs-logo.png)
- <b>Instalação no Windows:</b> Baixar o instalador [clicando aqui](https://nodejs.org/pt-br/#home-downloadhead).
- <b>Instalação no Linux Ubuntu:</b> Inserir o comando abaixo abaixo no terminal.
<p align="center"><i>sudo apt install nodejs</i></p>

⚠️<b>Atenção:</b> Caso a máquina com Linux não tenha o gerenciador de pacotes pip é necessário fazer a instalação executando um dos comandos abaixo no terminal.
<p align="center">Python 2: <i>sudo apt install python-pip</i></p>
<p align="center">Python 3: <i>sudo apt install python3-pip</i></p>

> ### Execução da aplicação web no servidor local:

Para acessar a aplicação web é necessário ativar a mesma no servidor local da máquina, sendo feito isso a partir dos passos a seguir.

- <b>Baixar o projeto:</b> A imagem abaixo mostra como deve ser feito.
![baixar_projeto](/bioinfo_project/bioinfo_web/static/imagens/baixar_projeto.gif)

- <b>Navegar até o diretório do arquivo que executa o servidor:</b> Após baixar o projeto é necessário descompactar o mesmo, e posteriormente acessar a pasta descompactada pelo terminal. Ainda no terminal é necessário navegar dentro da pasta descompactada até o caminho "projeto-bioinformatica-main/bioinfo_project", onde se encontra o arquivo "manage.py", como mostra a imagem abaixo.
![acessando-pasta-manage](/bioinfo_project/bioinfo_web/static/imagens/acessando_pasta_manage.gif)

- <b>Executar o arquivo "manage.py" para ativar o servidor local:</b> Estando na pasta onde está o arquivo "manage.py" é preciso executar o comando "python3 manage.py runserver", se a máquina tiver Python 3 instalado, ou "python manage.py runserver", se a máquina tiver Python 2 instalado. A imagem abaixo mostra os comandos sendo executados.
![ativando-servidor](/bioinfo_project/bioinfo_web/static/imagens/ativando-servidor.gif)

- <b>Acessar o servidor local:</b> Depois de ativar a aplicação web no servidor local é possível acessá-la pelo seu navegador ao informar a url "http://localhost:8000/", responsável por direcionar ao servidor local. A imagem abaixo mostra como é feito.
![acessando-localhost](/bioinfo_project/bioinfo_web/static/imagens/acessando-localhost.gif)

> ### Ativação de um servidor para acessar a ferramenta JBrowse

Para acessar o JBrowse no site é necessário ativar o mesmo em um outro servidor local, fora o que roda o site em si. Após ter instalado o NodeJS é necessário navegar até o diretório do Jbrowse no projeto, como mostra a imagem abaixo.
![acessando-pasta-jbrowse](/bioinfo_project/bioinfo_web/static/imagens/acessando-pasta-jbrowse.gif)
Para ativar o JBrowse, já estando no diretório do mesmo, basta digitar o comando "npx serve". Feito isso já é possível acessar o JBrowse no site. As imagens abaixo mostram essas últimas duas etapas.
- <b>Ativando JBrowse</b>
![ativando-jbrowse](/bioinfo_project/bioinfo_web/static/imagens/ativando-servidor-jbrowse.gif)
- <b>Acessando JBrowse</b>
![acessando-jbrowse](/bioinfo_project/bioinfo_web/static/imagens/acessando-ferramenta-jbrowse.gif)

> ### Execução via Docker

Para acessar toda a aplicação via Docker, é preciso ter também o docker-compose instalado. Dentro da pasta do projeto, basta executar...
```
docker-compose up
```

> ### Funcionalidades:
- Blast
- JBrowse
- Árvore Filogenética
- Download dos dados