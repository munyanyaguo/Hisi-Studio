"""Email service for sending notifications"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional


class EmailService:
    """Service for sending emails"""
    
    def __init__(self):
        self.smtp_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('MAIL_PORT', 587))
        self.use_tls = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
        self.username = os.getenv('MAIL_USERNAME')
        self.password = os.getenv('MAIL_PASSWORD')
        self.default_sender = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@hisistudio.com')
        self.admin_email = os.getenv('ADMIN_EMAIL', 'admin@hisistudio.com')
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
        from_email: Optional[str] = None
    ) -> bool:
        """
        Send an email
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_body: HTML email body
            text_body: Plain text email body (optional)
            from_email: Sender email (optional, uses default if not provided)
        
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Skip if email not configured
            if not self.username or not self.password:
                print("Email not configured. Skipping email send.")
                return False
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = from_email or self.default_sender
            msg['To'] = to_email
            
            # Add text and HTML parts
            if text_body:
                part1 = MIMEText(text_body, 'plain')
                msg.attach(part1)
            
            part2 = MIMEText(html_body, 'html')
            msg.attach(part2)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            
            print(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_contact_form_admin_notification(self, contact_data: dict) -> bool:
        """Send admin notification for new contact form submission"""
        subject = f"New Contact Form Submission - {contact_data['category'].title()}"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #8B5CF6; }}
                .value {{ margin-top: 5px; }}
                .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Contact Form Submission</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="label">Category:</div>
                        <div class="value">{contact_data['category'].title()}</div>
                    </div>
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">{contact_data['name']}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{contact_data['email']}</div>
                    </div>
                    {f'''<div class="field">
                        <div class="label">Phone:</div>
                        <div class="value">{contact_data.get('phone', 'N/A')}</div>
                    </div>''' if contact_data.get('phone') else ''}
                    {f'''<div class="field">
                        <div class="label">Consultation Type:</div>
                        <div class="value">{contact_data.get('consultation_type', 'N/A')}</div>
                    </div>''' if contact_data.get('consultation_type') else ''}
                    {f'''<div class="field">
                        <div class="label">Order Details:</div>
                        <div class="value">{contact_data.get('order_details', 'N/A')}</div>
                    </div>''' if contact_data.get('order_details') else ''}
                    {f'''<div class="field">
                        <div class="label">Partnership Type:</div>
                        <div class="value">{contact_data.get('partnership_type', 'N/A')}</div>
                    </div>''' if contact_data.get('partnership_type') else ''}
                    <div class="field">
                        <div class="label">Message:</div>
                        <div class="value">{contact_data['message']}</div>
                    </div>
                    <div class="footer">
                        <p>Submitted on {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(self.admin_email, subject, html_body)
    
    def send_contact_form_confirmation(self, contact_data: dict) -> bool:
        """Send confirmation email to customer who submitted contact form"""
        subject = "We've Received Your Message - Hisi Studio"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
                .message-box {{ background: white; padding: 20px; border-left: 4px solid #8B5CF6; margin: 20px 0; }}
                .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank You for Contacting Us!</h1>
                </div>
                <div class="content">
                    <p>Hi {contact_data['name']},</p>
                    <p>We've received your message and will get back to you as soon as possible.</p>
                    
                    <div class="message-box">
                        <h3>Your Message:</h3>
                        <p>{contact_data['message']}</p>
                    </div>
                    
                    <p>Our team typically responds within 24-48 hours. If your inquiry is urgent, please don't hesitate to call us at +254 700 123 456.</p>
                    
                    <p>Best regards,<br>
                    The Hisi Studio Team</p>
                    
                    <div class="footer">
                        <p>Hisi Studio - Adaptive Fashion for Everyone</p>
                        <p>Westlands, Nairobi | hello@hisistudio.com</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(contact_data['email'], subject, html_body)
    
    def send_consultation_admin_notification(self, consultation_data: dict) -> bool:
        """Send admin notification for new consultation booking"""
        subject = f"New Consultation Booking - {consultation_data['consultation_type'].title()}"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #8B5CF6; }}
                .value {{ margin-top: 5px; }}
                .highlight {{ background: #fff; padding: 15px; border-left: 4px solid #EC4899; margin: 20px 0; }}
                .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Consultation Booking</h2>
                </div>
                <div class="content">
                    <div class="highlight">
                        <div class="label">Consultation Type:</div>
                        <div class="value" style="font-size: 18px; font-weight: bold;">{consultation_data['consultation_type'].title()}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Client Name:</div>
                        <div class="value">{consultation_data['name']}</div>
                    </div>
                    <div class="field">
                        <div class="label">Email:</div>
                        <div class="value">{consultation_data['email']}</div>
                    </div>
                    {f'''<div class="field">
                        <div class="label">Phone:</div>
                        <div class="value">{consultation_data.get('phone', 'N/A')}</div>
                    </div>''' if consultation_data.get('phone') else ''}
                    <div class="field">
                        <div class="label">Meeting Type:</div>
                        <div class="value">{consultation_data['meeting_type'].title()}</div>
                    </div>
                    <div class="field">
                        <div class="label">Preferred Date:</div>
                        <div class="value">{consultation_data['preferred_date']}</div>
                    </div>
                    <div class="field">
                        <div class="label">Preferred Time:</div>
                        <div class="value">{consultation_data['preferred_time']}</div>
                    </div>
                    {f'''<div class="field">
                        <div class="label">Notes:</div>
                        <div class="value">{consultation_data.get('notes', 'N/A')}</div>
                    </div>''' if consultation_data.get('notes') else ''}
                    
                    <div class="footer">
                        <p>Booked on {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}</p>
                        <p><strong>Action Required:</strong> Please confirm this booking with the client.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(self.admin_email, subject, html_body)
    
    def send_consultation_confirmation(self, consultation_data: dict) -> bool:
        """Send confirmation email to customer who booked consultation"""
        subject = "Consultation Booking Confirmed - Hisi Studio"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
                .booking-details {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .detail-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
                .detail-label {{ font-weight: bold; color: #8B5CF6; }}
                .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✓ Consultation Booked!</h1>
                </div>
                <div class="content">
                    <p>Hi {consultation_data['name']},</p>
                    <p>Your consultation has been successfully booked. We're excited to meet with you!</p>
                    
                    <div class="booking-details">
                        <h3 style="margin-top: 0; color: #8B5CF6;">Booking Details</h3>
                        <div class="detail-row">
                            <span class="detail-label">Consultation Type:</span>
                            <span>{consultation_data['consultation_type'].title()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Meeting Type:</span>
                            <span>{consultation_data['meeting_type'].title()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date:</span>
                            <span>{consultation_data['preferred_date']}</span>
                        </div>
                        <div class="detail-row" style="border-bottom: none;">
                            <span class="detail-label">Time:</span>
                            <span>{consultation_data['preferred_time']}</span>
                        </div>
                    </div>
                    
                    <p><strong>What's Next?</strong></p>
                    <ul>
                        <li>You'll receive a confirmation call or email within 24 hours</li>
                        <li>{'We\'ll send you a video call link before your appointment' if consultation_data['meeting_type'] == 'virtual' else 'Our showroom is located at Westlands, Ring Road Parklands, Nairobi'}</li>
                        <li>Feel free to prepare any questions you'd like to discuss</li>
                    </ul>
                    
                    <p>If you need to reschedule or have any questions, please contact us at hello@hisistudio.com or +254 700 123 456.</p>
                    
                    <p>Best regards,<br>
                    The Hisi Studio Team</p>
                    
                    <div class="footer">
                        <p>Hisi Studio - Adaptive Fashion for Everyone</p>
                        <p>Westlands, Nairobi | hello@hisistudio.com</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(consultation_data['email'], subject, html_body)


# Create a singleton instance
email_service = EmailService()
