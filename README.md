# Sistematizacao
O objetivo principal deste projeto foi focar em aplicação de reservas, toda estrutura cria uma 
extensão para o navegador Google Chrome que permite reversar as salas de forma prática e rápida.
Suas funcionalidades se resume em:
- Cadastro: sala, data, hora, duração (em minutos) e finalidade;
- Quando o cadastro é concluído, terar uma notificação gerada pelo Google Chrome;
- Quando o cadastro for concluído, é possivel editar ou apagar;
- Pode gerar um arquivo de excel (.CSV), para visualizar em planilhas;

A estrutura do projeto se resume em:
- manifest.json: configurações da extensão;
- popup.html: interface principal;
- popup.js: lógica de funcionamento;
- style.css: estilos visuais;
- background.js: script de instalação;
- Ícones: icon16.png, icon48.png, icon128.png;

Para testar a extensão “Reserva de Salas” localmente no navegador Google Chrome, siga os passos abaixo:
1. Abra o Google Chrome
2. Acesse o Gerenciador de Extensões:
- Digite chrome://extensions na barra de endereços e pressione Enter
3. Ative o Modo de Desenvolvedor
-  No canto superior direito da página, habilite a opção “Modo de desenvolvedor”
4. Clique em “Carregar sem compactação”
- Selecione a pasta onde estão todos os arquivos da extensão (manifest.json, popup.html, popup.js, style.css, etc.)
5. A extensão será carregada e exibida na barra de ferramentas do Chrome
- Clique no ícone para abrir o popup e testar as funcionalidades
Certifique-se de que todos os arquivos estejam organizados corretamente dentro da pasta raiz da extensão. Qualquer erro no manifest.json impedirá o carregamento.
