// Evento ao clicar no botão "Salvar Reserva"
document.getElementById("reservar").addEventListener("click", function () {
  // Coleta os dados do formulário
  const reserva = {
    sala: document.getElementById("sala").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value,
    finalidade: document.getElementById("finalidade").value,
    duracao: parseInt(document.getElementById("duracao").value) || 30
  };

  // Validação dos campos
  if (!reserva.sala || !reserva.data || !reserva.hora || !reserva.finalidade || isNaN(reserva.duracao)) {
    alert("Preencha todos os campos corretamente antes de salvar.");
    return;
  }

  // Salva a reserva no armazenamento local
  chrome.storage.local.get({ reservas: [] }, function (data) {
    const novasReservas = data.reservas;
    novasReservas.push(reserva);
    chrome.storage.local.set({ reservas: novasReservas }, function () {
      document.getElementById("mensagem").textContent = "Reserva salva com sucesso!";
      atualizarLista();

      // Exibe uma notificação no navegador
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon128.png",
        title: "Reserva salva!",
        message: "Sua reserva foi registrada com sucesso."
      });
    });
  });
});

// Evento ao clicar no botão "Exportar para CSV"
document.getElementById("exportar").addEventListener("click", function () {
  chrome.storage.local.get({ reservas: [] }, function (data) {
    const linhas = ["Sala,Data,Hora,Finalidade,Duração"];
    data.reservas.forEach(r => {
      linhas.push(`${r.sala},${r.data},${r.hora},${r.finalidade},${r.duracao}`);
    });

    // Cria e baixa o arquivo CSV
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reservas.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Atualiza a lista de reservas exibida no popup
function atualizarLista() {
  chrome.storage.local.get({ reservas: [] }, function (data) {
    const reservas = Array.isArray(data.reservas) ? data.reservas : [];
    const lista = document.getElementById("lista-reservas");
    lista.innerHTML = "<strong>Reservas Salvas:</strong><br>";

    // Exibe cada reserva com botões de editar e excluir
    reservas.forEach((r, i) => {
      const div = document.createElement("div");
      div.innerHTML = `
        ${i + 1}. Sala ${r.sala} em ${r.data} às ${r.hora} — ${r.finalidade} (${r.duracao} min)
        <button class="editar" data-index="${i}">✏️</button>
        <button class="excluir" data-index="${i}">🗑️</button>
      `;
      lista.appendChild(div);
    });

    // Adiciona eventos aos botões dinâmicos
    document.querySelectorAll(".editar").forEach(btn => {
      btn.addEventListener("click", () => editarReserva(Number(btn.dataset.index)));
    });

    document.querySelectorAll(".excluir").forEach(btn => {
      btn.addEventListener("click", () => excluirReserva(Number(btn.dataset.index)));
    });

    // Gera o resumo das reservas
    const resumo = document.getElementById("resumo-reservas");
    const total = reservas.length;

    let proxima = "Nenhuma reserva futura";
    let somaDuracao = 0;

    if (total > 0) {
      const agora = new Date();
      const futuras = reservas.filter(r => new Date(`${r.data}T${r.hora}`) > agora);
      futuras.sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`));
      if (futuras.length > 0) {
        const r = futuras[0];
        proxima = `Sala ${r.sala} em ${r.data} às ${r.hora}`;
      }

      somaDuracao = reservas.reduce((acc, r) => acc + (r.duracao || 30), 0);
    }

    const media = total > 0 ? Math.round(somaDuracao / total) : 0;

    // Exibe o resumo no popup
    resumo.innerHTML = `
      <hr>
      <strong>Resumo:</strong><br>
      Total de reservas: ${total}<br>
      Próxima reserva: ${proxima}<br>
      Duração média: ${media} min
    `;
  });
}

// Remove uma reserva pelo índice
function excluirReserva(index) {
  chrome.storage.local.get({ reservas: [] }, function (data) {
    data.reservas.splice(index, 1);
    chrome.storage.local.set({ reservas: data.reservas }, atualizarLista);
  });
}

// Preenche o formulário com dados da reserva e remove a original
function editarReserva(index) {
  chrome.storage.local.get({ reservas: [] }, function (data) {
    const r = data.reservas[index];
    document.getElementById("sala").value = r.sala;
    document.getElementById("data").value = r.data;
    document.getElementById("hora").value = r.hora;
    document.getElementById("finalidade").value = r.finalidade;
    document.getElementById("duracao").value = r.duracao || 30;
    excluirReserva(index);
  });
}

// Evento ao clicar no botão "Sincronizar com Google Calendar"
document.getElementById("sincronizar").addEventListener("click", function () {
  const sala = document.getElementById("sala").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const finalidade = document.getElementById("finalidade").value;
  const duracao = parseInt(document.getElementById("duracao").value) || 30;

  // Validação dos campos
  if (!sala || !data || !hora || isNaN(duracao)) {
    alert("Preencha sala, data, hora e duração antes de sincronizar.");
    return;
  }

  // Calcula horário de início e fim do evento
  const startDateTime = new Date(`${data}T${hora}:00`);
  const endDateTime = new Date(startDateTime.getTime() + duracao * 60000);

  // Formata datas para o padrão do Google Calendar
  const formatDate = dt => dt.toISOString().replace(/-|:|\.\d{3}/g, "");
  const start = formatDate(startDateTime);
  const end = formatDate(endDateTime);

  // Gera o link para criar o evento no Google Calendar
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reserva+Sala+${sala}&dates=${start}/${end}&details=${encodeURIComponent(finalidade)}&location=${encodeURIComponent("Sala " + sala)}&sf=true&output=xml`;

  // Abre o link em nova aba
  window.open(url, "_blank");
});
