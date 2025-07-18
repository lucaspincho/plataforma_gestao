import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;

  private static getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true para 465, false para outros
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
    return this.transporter;
  }

  /**
   * Envia email
   */
  static async send(options: EmailOptions): Promise<void> {
    const transporter = this.getTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Email enviado para: ${options.to}`);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  /**
   * Envia notificação de prazo vencendo
   */
  static async sendDeadlineNotification(
    email: string,
    userName: string,
    deadlineTitle: string,
    deadlineDate: Date,
    processNumber?: string
  ): Promise<void> {
    const formattedDate = deadlineDate.toLocaleDateString('pt-BR');
    
    const subject = `⚠️ Prazo vencendo: ${deadlineTitle}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⚠️ Prazo Vencendo</h2>
        
        <p>Olá, <strong>${userName}</strong>!</p>
        
        <p>Este é um lembrete de que o seguinte prazo está vencendo:</p>
        
        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0; color: #dc2626;">${deadlineTitle}</h3>
          <p style="margin: 8px 0 0 0;"><strong>Data:</strong> ${formattedDate}</p>
          ${processNumber ? `<p style="margin: 4px 0 0 0;"><strong>Processo:</strong> ${processNumber}</p>` : ''}
        </div>
        
        <p>Por favor, tome as ações necessárias antes do vencimento.</p>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 14px;">
          Este é um email automático da Plataforma de Gestão Jurídica.
        </p>
      </div>
    `;

    await this.send({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Envia notificação de audiência
   */
  static async sendAudienceNotification(
    email: string,
    userName: string,
    audienceTitle: string,
    audienceDate: Date,
    location?: string,
    processNumber?: string
  ): Promise<void> {
    const formattedDate = audienceDate.toLocaleDateString('pt-BR');
    const formattedTime = audienceDate.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const subject = `📅 Lembrete: Audiência - ${audienceTitle}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📅 Lembrete de Audiência</h2>
        
        <p>Olá, <strong>${userName}</strong>!</p>
        
        <p>Este é um lembrete da seguinte audiência:</p>
        
        <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0; color: #2563eb;">${audienceTitle}</h3>
          <p style="margin: 8px 0 0 0;"><strong>Data:</strong> ${formattedDate}</p>
          <p style="margin: 4px 0 0 0;"><strong>Horário:</strong> ${formattedTime}</p>
          ${location ? `<p style="margin: 4px 0 0 0;"><strong>Local:</strong> ${location}</p>` : ''}
          ${processNumber ? `<p style="margin: 4px 0 0 0;"><strong>Processo:</strong> ${processNumber}</p>` : ''}
        </div>
        
        <p>Certifique-se de estar preparado e pontual.</p>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 14px;">
          Este é um email automático da Plataforma de Gestão Jurídica.
        </p>
      </div>
    `;

    await this.send({
      to: email,
      subject,
      html,
    });
  }
} 