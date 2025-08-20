// frontend/src/services/notificationService.js
class NotificationService {
  constructor() {
    this.emailEnabled = true;
    this.smsEnabled = true;
  }

  // Simular envío de email
  async sendEmail(to, subject, body) {
    if (!this.emailEnabled) return;
    
    console.log(`📧 Email enviado a: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Cuerpo: ${body}`);
    
    // En producción, aquí conectarías con un servicio como:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    // - Mailgun
    
    return { success: true, messageId: 'email_' + Date.now() };
  }

  // Simular envío de SMS
  async sendSMS(to, message) {
    if (!this.smsEnabled) return;
    
    console.log(`📱 SMS enviado a: ${to}`);
    console.log(`Mensaje: ${message}`);
    
    // En producción, aquí conectarías con un servicio como:
    // - Twilio
    // - AWS SNS
    // - Nexmo
    
    return { success: true, messageId: 'sms_' + Date.now() };
  }

  // Notificaciones para reservas
  async sendBookingConfirmation(bookingData, userData) {
    const emailSubject = 'Confirmación de Reserva - Fitness Club';
    const emailBody = `
      Hola ${userData.name},
      
      Tu reserva para la clase "${bookingData.class.title}" ha sido confirmada.
      
      Detalles:
      - Fecha: ${new Date(bookingData.schedule.start_ts).toLocaleDateString('es-ES')}
      - Hora: ${new Date(bookingData.schedule.start_ts).toLocaleTimeString('es-ES')}
      - Instructor: ${bookingData.class.instructor?.name || 'Por asignar'}
      - Sala: ${bookingData.schedule.room || 'Por asignar'}
      
      ¡Nos vemos en clase!
      
      Equipo de Fitness Club
    `;

    const smsMessage = `Fitness Club: Reserva confirmada para ${bookingData.class.title} el ${new Date(bookingData.schedule.start_ts).toLocaleDateString('es-ES')}`;

    await this.sendEmail(userData.email, emailSubject, emailBody);
    if (userData.phone) {
      await this.sendSMS(userData.phone, smsMessage);
    }
  }

  // Notificaciones para cancelaciones
  async sendBookingCancellation(bookingData, userData) {
    const emailSubject = 'Cancelación de Reserva - Fitness Club';
    const emailBody = `
      Hola ${userData.name},
      
      Tu reserva para la clase "${bookingData.class.title}" ha sido cancelada.
      
      Detalles:
      - Fecha: ${new Date(bookingData.schedule.start_ts).toLocaleDateString('es-ES')}
      - Hora: ${new Date(bookingData.schedule.start_ts).toLocaleTimeString('es-ES')}
      
      Si necesitas ayuda o tienes preguntas, no dudes en contactarnos.
      
      Equipo de Fitness Club
    `;

    const smsMessage = `Fitness Club: Reserva cancelada para ${bookingData.class.title} el ${new Date(bookingData.schedule.start_ts).toLocaleDateString('es-ES')}`;

    await this.sendEmail(userData.email, emailSubject, emailBody);
    if (userData.phone) {
      await this.sendSMS(userData.phone, smsMessage);
    }
  }

  // Recordatorios automáticos
  async sendReminder(bookingData, userData) {
    const emailSubject = 'Recordatorio de Clase - Fitness Club';
    const emailBody = `
      Hola ${userData.name},
      
      Este es un recordatorio amistoso de tu clase:
      
      - Clase: ${bookingData.class.title}
      - Fecha: ${new Date(bookingData.schedule.start_ts).toLocaleDateString('es-ES')}
      - Hora: ${new Date(bookingData.schedule.start_ts).toLocaleTimeString('es-ES')}
      - Instructor: ${bookingData.class.instructor?.name || 'Por asignar'}
      - Sala: ${bookingData.schedule.room || 'Por asignar'}
      
      ¡No llegues tarde!
      
      Equipo de Fitness Club
    `;

    const smsMessage = `Fitness Club: Recordatorio - Clase ${bookingData.class.title} hoy a las ${new Date(bookingData.schedule.start_ts).toLocaleTimeString('es-ES')}`;

    await this.sendEmail(userData.email, emailSubject, emailBody);
    if (userData.phone) {
      await this.sendSMS(userData.phone, smsMessage);
    }
  }
}

export default new NotificationService();
