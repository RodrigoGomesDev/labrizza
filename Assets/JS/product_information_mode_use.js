function toggleModeUse() {
    const descriptionContainer = document.getElementById("mode-use-container");
    const iconContainer = document.getElementById("icon-container-mode-use");
  
    // Verifica o estado atual da descrição
    if (descriptionContainer.style.display === "none" || !descriptionContainer.style.display) {
      // Expande a descrição
      descriptionContainer.style.display = "block";
  
      // Troca para o ícone de "-"
      iconContainer.innerHTML = `

      
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="19" height="19" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
        </svg>
      `;
    } else {
      // Contrai a descrição
      descriptionContainer.style.display = "none";
  
      // Troca para o ícone de "+"
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" width="19" height="19" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      `;
    }
  }