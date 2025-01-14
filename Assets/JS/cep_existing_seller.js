window.onload = function () {
  const decreaseButton = document.getElementById('decrease');
  const increaseButton = document.getElementById('increase');
  const quantityInput = document.getElementById('quantity');

  decreaseButton.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value) || 0;
    if (currentValue > quantityInput.min) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseButton.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value) || 0;
    quantityInput.value = currentValue + 1;
  });
};
