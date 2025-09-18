{
  // Versão do formato do manifesto (obrigatório)
  "manifest_version": 3,

  // Nome da extensão que aparece na Chrome Web Store e nas configurações
  "name": "Reserva de Salas",

  // Versão atual da extensão
  "version": "1.0",

  // Descrição breve sobre a funcionalidade da extensão
  "description": "Extensão para reservar salas diretamente no navegador.",

  // Configurações da ação principal (ícone e popup)
  "action": {
    // Arquivo HTML que será exibido como popup ao clicar no ícone da extensão
    "default_popup": "popup.html",

    // Ícones da extensão em diferentes tamanhos
    "default_icon": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
    }
  },

  // Script de segundo plano que roda como service worker
  "background": {
    "service_worker": "background.js"
  },

  // Permissões necessárias para funcionamento da extensão
  "permissions": [
    "storage",        // Permite salvar e recuperar dados localmente
    "notifications"   // Permite exibir notificações no navegador
  ]
}
