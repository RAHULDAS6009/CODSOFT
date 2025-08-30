class Calculator {
  constructor() {
    this.displayElement = document.getElementById("display");
    this.currentInput = "0";
    this.previousInput = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justCalculated = false;

    this.bindEvents();
    this.createParticles();
  }

  bindEvents() {
    document.querySelector(".buttons").addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) return;

      this.addButtonAnimation(e.target);
      this.handleButtonClick(e.target);
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });
  }

  addButtonAnimation(button) {
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 150);

    if (button.dataset.action === "number") {
      button.classList.add("animate");
      setTimeout(() => button.classList.remove("animate"), 600);
    }
  }

  handleButtonClick(button) {
    const action = button.dataset.action;

    switch (action) {
      case "number":
        this.inputNumber(button.dataset.number);
        break;
      case "operator":
        this.inputOperator(button.dataset.operator);
        break;
      case "decimal":
        this.inputDecimal();
        break;
      case "clear":
        this.clear();
        break;
      case "delete":
        this.delete();
        break;
      case "calculate":
        this.calculate();
        break;
    }
  }

  handleKeyPress(e) {
    const key = e.key;

    if (key >= "0" && key <= "9") this.inputNumber(key);
    else if (["+", "-", "*", "/", "%"].includes(key)) this.inputOperator(key);
    else if (key === ".") this.inputDecimal();
    else if (key === "Enter" || key === "=") this.calculate();
    else if (key === "Escape") this.clear();
    else if (key === "Backspace") this.delete();
  }

  inputNumber(num) {
    if (this.waitingForOperand) {
      this.currentInput = num;
      this.waitingForOperand = false;
    } else {
      this.currentInput =
        this.currentInput === "0" ? num : this.currentInput + num;
    }

    this.justCalculated = false;
    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput === null) {
      this.previousInput = inputValue;
    } else if (this.operator && !this.waitingForOperand) {
      const currentValue = this.previousInput || 0;
      const newValue = this.performCalculation(
        currentValue,
        inputValue,
        this.operator
      );

      this.currentInput = String(newValue);
      this.previousInput = newValue;
      this.updateDisplay();
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
    this.justCalculated = false;
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.currentInput = "0.";
      this.waitingForOperand = false;
    } else if (this.currentInput.indexOf(".") === -1) {
      this.currentInput += ".";
    }

    this.justCalculated = false;
    this.updateDisplay();
  }

  clear() {
    this.currentInput = "0";
    this.previousInput = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.justCalculated = false;
    this.updateDisplay();
    this.createParticleExplosion();
  }

  delete() {
    if (this.justCalculated) {
      this.clear();
      return;
    }

    this.currentInput = this.currentInput.slice(0, -1) || "0";
    this.updateDisplay();
  }

  calculate() {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput !== null && this.operator) {
      const newValue = this.performCalculation(
        this.previousInput,
        inputValue,
        this.operator
      );

      this.currentInput = String(newValue);
      this.previousInput = null;
      this.operator = null;
      this.waitingForOperand = true;
      this.justCalculated = true;

      this.updateDisplay();
      this.createParticleExplosion();
    }
  }

  performCalculation(firstOperand, secondOperand, operator) {
    let result;

    switch (operator) {
      case "+":
        result = firstOperand + secondOperand;
        break;
      case "-":
        result = firstOperand - secondOperand;
        break;
      case "*":
        result = firstOperand * secondOperand;
        break;
      case "/":
        if (secondOperand === 0) {
          this.showError();
          return 0;
        }
        result = firstOperand / secondOperand;
        break;
      case "%":
        result = firstOperand % secondOperand;
        break;
      default:
        return;
    }

    return Math.round(result * 100000000) / 100000000;
  }

  updateDisplay() {
    const value = parseFloat(this.currentInput);
    const displayValue = isNaN(value)
      ? "0"
      : this.formatNumber(this.currentInput);

    this.displayElement.textContent = displayValue;
    this.displayElement.classList.add("updated");
    setTimeout(() => this.displayElement.classList.remove("updated"), 500);
  }

  formatNumber(num) {
    const number = parseFloat(num);
    if (
      Math.abs(number) > 999999999 ||
      (Math.abs(number) < 0.000001 && number !== 0)
    ) {
      return number.toExponential(2);
    }
    return num.toString();
  }

  showError() {
    this.displayElement.classList.add("error");
    setTimeout(() => this.displayElement.classList.remove("error"), 500);
  }

  createParticles() {
    const particlesContainer = document.getElementById("particles");

    setInterval(() => {
      if (Math.random() > 0.7) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 2 + "s";
        particle.style.animationDuration = Math.random() * 3 + 2 + "s";

        particlesContainer.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode) particle.remove();
        }, 5000);
      }
    }, 300);
  }

  createParticleExplosion() {
    const particlesContainer = document.getElementById("particles");

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = 45 + Math.random() * 10 + "%";
        particle.style.top = "70%";
        particle.style.animationDuration = "0.8s";

        particlesContainer.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode) particle.remove();
        }, 1000);
      }, i * 50);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Calculator();
});
