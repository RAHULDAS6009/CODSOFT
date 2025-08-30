// Scroll reveal animation
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach((reveal) => {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("active");
    }
  });
}

// Add scroll event listener
window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Run on load

// Smooth hover effects for skill items
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".skills li").forEach((skill) => {
    skill.addEventListener("mouseenter", function () {
      this.style.animationDelay = Math.random() * 0.3 + "s";
    });
  });

  // Project card tilt effect
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1) rotateX(0) rotateY(0)";
    });
  });

  // Add ripple animation keyframes to document
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple {
      to {
        width: 200px;
        height: 200px;
        opacity: 0;
      }
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
});

// Copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Create temporary notification
      const notification = document.createElement("div");
      notification.textContent = "Copied to clipboard!";
      notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 2000);
    })
    .catch((err) => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        // Show success notification
        const notification = document.createElement("div");
        notification.textContent = "Copied to clipboard!";
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
      `;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      document.body.removeChild(textArea);
    });
}

// Resume download handler
function handleResumeDownload(e) {
  e.preventDefault();
  // Add ripple effect
  const button = e.target;
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: absolute;
    background: rgba(255,255,255,0.6);
    border-radius: 50%;
    width: 10px;
    height: 10px;
    animation: ripple 0.6s linear;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  `;
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  // Simulate download
  setTimeout(() => {
    alert("Resume download would start here!");
  }, 300);
}

// Parallax effect for header
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const header = document.querySelector("header");
  const rate = scrolled * -0.5;
  header.style.transform = `translateY(${rate}px)`;
});

// Add smooth scroll behavior for anchor links
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Performance optimization: throttle scroll events
let ticking = false;

function updateOnScroll() {
  revealOnScroll();

  // Parallax effect for header
  const scrolled = window.pageYOffset;
  const header = document.querySelector("header");
  const rate = scrolled * -0.5;
  header.style.transform = `translateY(${rate}px)`;

  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}

// Replace the previous scroll event listener with throttled version
window.removeEventListener("scroll", revealOnScroll);
window.addEventListener("scroll", requestTick);

// Initialize on page load
window.addEventListener("load", function () {
  // Add entrance animations
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease-in-out";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);

  // Run initial scroll reveal
  revealOnScroll();
});

// Add keyboard navigation support
document.addEventListener("keydown", function (e) {
  // Navigate through project cards with arrow keys
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    const cards = document.querySelectorAll(".project-card");
    const focusedIndex = Array.from(cards).findIndex(
      (card) => card === document.activeElement
    );

    if (focusedIndex !== -1) {
      e.preventDefault();
      let nextIndex;

      if (e.key === "ArrowLeft") {
        nextIndex = focusedIndex > 0 ? focusedIndex - 1 : cards.length - 1;
      } else {
        nextIndex = focusedIndex < cards.length - 1 ? focusedIndex + 1 : 0;
      }

      cards[nextIndex].focus();
    }
  }
});

// Make project cards focusable for accessibility
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.addEventListener("focus", function () {
      this.style.outline = `2px solid var(--accent)`;
      this.style.outlineOffset = "2px";
    });
    card.addEventListener("blur", function () {
      this.style.outline = "none";
    });
  });
});
