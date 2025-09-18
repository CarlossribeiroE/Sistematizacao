// Este script é executado em segundo plano pela extensão.
// Ele escuta o evento de instalação da extensão no navegador.

chrome.runtime.onInstalled.addListener(() => {
  // Quando a extensão é instalada ou atualizada, esta mensagem aparece no console.
  console.log("Extensão instalada.");
});
