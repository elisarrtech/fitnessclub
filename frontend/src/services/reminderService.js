// frontend/src/services/reminderService.js
class ReminderService {
  constructor() {
    this.reminders = [];
    this.checkInterval = null;
  }

  // Iniciar verificación de recordatorios
  startReminderCheck() {
    // Verificar recordatorios cada minuto
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000); // 1 minuto
  }

  // Detener verificación de recordatorios
  stopReminderCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Verificar recordatorios pendientes
  async checkReminders() {
    const now = new Date();
    
    // Filtrar recordatorios que deben enviarse ahora
    const dueReminders = this.reminders.filter(reminder => {
      const reminderTime = new Date(reminder.sendAt);
      return reminderTime <= now && !reminder.sent;
    });

    // Enviar recordatorios pendientes
    for (const reminder of dueReminders) {
      try {
        await this.sendReminder(reminder);
        reminder.sent = true;
      } catch (error) {
        console.error('Error sending reminder:', error);
      }
    }
  }

  // Programar un nuevo recordatorio
  scheduleReminder(bookingData, userData, minutesBefore = 60) {
    const reminderTime = new Date(bookingData.schedule.start_ts);
    reminderTime.setMinutes(reminderTime.getMinutes() - minutesBefore);

    const reminder = {
      id: `reminder_${Date.now()}`,
      bookingData,
      userData,
      sendAt: reminderTime,
      sent: false,
      minutesBefore
    };

    this.reminders.push(reminder);
    return reminder;
  }

  // Enviar recordatorio
  async sendReminder(reminder) {
    // Importar el servicio de notificaciones
    const notificationService = (await import('./notificationService')).default;
    
    // Enviar notificación
    await notificationService.sendReminder(reminder.bookingData, reminder.userData);
    
    console.log(`🔔 Recordatorio enviado para la clase: ${reminder.bookingData.class.title}`);
  }

  // Cancelar recordatorio
  cancelReminder(reminderId) {
    this.reminders = this.reminders.filter(r => r.id !== reminderId);
  }

  // Obtener recordatorios pendientes
  getPendingReminders() {
    return this.reminders.filter(r => !r.sent);
  }
}

export default new ReminderService();
