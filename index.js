document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpfInput = document.getElementById("cpf").value;
  const dataInput = document.getElementById("date").value;
  const hora = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [ano, mes, dia] = dataInput.split("-");
  const data = `${dia}/${mes}/${ano}`;

  function formatarCPF(cpf) {
    return cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  const cpf = formatarCPF(cpfInput);

  fetch("template.docx")
    .then((res) => res.arrayBuffer())
    .then((data) => {
      const zip = new PizZip(data);
      const doc = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.setData({
        nome: nome,
        cpf: cpf,
        hora: hora,
        data: dataInput,
      });

      try {
        doc.render();
      } catch (error) {
        console.error("Erro ao renderizar o documento:", error);
        alert("Erro ao gerar o documento. Verifique o template.");
        return;
      }

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      console.log("Nome:", nome);
      console.log("CPF:", cpf);
      console.log("Data Input:", dataInput);
      console.log("Data Formatada:", data);
      console.log("Hora:", hora);

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(out);
      downloadLink.download = `Beneficio_${nome}.docx`;
      downloadLink.click();
    })
    .catch((error) => {
      console.error("Erro ao carregar o arquivo:", error);
      console.error(JSON.stringify(error.properties));
      alert("Erro ao gerar o documento. Verifique o template.");
      return;
    });
});
