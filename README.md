# Consulta de Boleto com NodeJS

​	Aplicação Back-End desenvolvida com NodeJS para consultar linhas digitáveis de boleto de título bancário e pagamento de concessionárias, verificando se a mesma é válida ou não. Sendo válida e
possuindo valor e/ou data de vencimento ter o retorno desses dados.

## Como executar

* #### Instalar dependências
	Tendo o Node instalado, execute no terminal o comando **`npm install`** para instalar as dependências do projeto.
	
* #### Iniciar API
	Após instalar as dependências basta executar **`npm start`** no terminal para a API começar a rodar em http://localhost:8080
	
* #### Executar testes da API 
	O projeto conta com  testes unitários desenvolvidos utilizando Jest, para executar basta rodar **`npm test`** no terminal.



## Como utilizar

​	Para consultar um boleto faça uma request GET para http://localhost:8080/boleto/ utilizando a linha digitável do boleto como parâmetro.

> **Exemplo de resquest**:
>
> GET/ http://localhost:8080/boleto/21290001192110001210904475617405975870000002000
>
> **Exemplo de response:**
>
> status 200
> {
> 	“barCode”: “21299758700000020000001121100012100447561740”,
> 	“amount”: “20.00”,
> 	“expirationDate”: “2018-07-16”
> }