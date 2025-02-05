class AlertPopup {
    constructor() {
      this.activeAlerts = [];
    }

    show(message, type = 'success') {
      // Create alert element
      const alert = document.createElement('div');
      alert.className = `alert-popup ${type}`;
      
      // Create message text
      const messageText = document.createElement('span');
      messageText.textContent = message;
      
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '×';
      closeBtn.onclick = () => this.hide(alert);
      
      // Assemble alert
      alert.appendChild(messageText);
      alert.appendChild(closeBtn);
      document.body.appendChild(alert);
      
      // Show alert with animation
      setTimeout(() => alert.classList.add('show'), 10);
      
      // Auto-hide after 3 seconds
      setTimeout(() => this.hide(alert), 3000);
      
      this.activeAlerts.push(alert);
      
      // Adjust positions of existing alerts
      this.updateAlertPositions();
    }

    hide(alert) {
      alert.classList.remove('show');
      setTimeout(() => {
        alert.remove();
        this.activeAlerts = this.activeAlerts.filter(a => a !== alert);
        this.updateAlertPositions();
      }, 300);
    }

    updateAlertPositions() {
      this.activeAlerts.forEach((alert, index) => {
        const topPosition = 20 + (index * (alert.offsetHeight + 10));
        alert.style.top = `${topPosition}px`;
      });
    }
}

const alertPopup = new AlertPopup();

function showAlert(message, type) {
    alertPopup.show(message, type);
}