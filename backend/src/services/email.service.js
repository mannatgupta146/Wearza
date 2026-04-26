import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderConfirmationEmail = async (order, userEmail) => {
    try {
        const orderItemsList = order.orderItems.map(item => `
            <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <p style="margin: 0; font-weight: bold;">${item.title}</p>
                <p style="margin: 0; color: #666;">Quantity: ${item.quantity} | ${order.price.currency} ${item.price.amount.toLocaleString()}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: `"Wearza Marketplace" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Acquisition Confirmed: ${order.razorpay.orderId}`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <div style="text-align: center; padding: 20px 0;">
                        <h1 style="color: #000; font-weight: 200; letter-spacing: 2px;">WEARZA</h1>
                        <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 4px; color: #999;">The Registry Archive</p>
                    </div>
                    
                    <div style="background: #fafafa; padding: 30px; border-radius: 20px; margin-bottom: 30px;">
                        <h2 style="font-weight: 300; margin-top: 0;">Order Confirmed.</h2>
                        <p style="color: #666; line-height: 1.6;">Your acquisition has been verified and added to the Registry. We are preparing your items for dispatch with full tracking logistics.</p>
                        
                        <div style="margin-top: 30px;">
                            <p style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 5px;">Reference ID</p>
                            <p style="font-family: monospace; font-size: 16px; margin: 0;">${order.razorpay.orderId}</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="font-weight: 300; border-bottom: 2px solid #000; padding-bottom: 10px;">Selection Summary</h3>
                        ${orderItemsList}
                    </div>

                    <div style="text-align: right; padding: 20px 0;">
                        <p style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 5px;">Total Investment</p>
                        <p style="font-size: 24px; font-weight: 300; margin: 0;">${order.price.currency} ${order.price.amount.toLocaleString()}</p>
                    </div>

                    <div style="text-align: center; border-top: 1px solid #eee; padding-top: 30px; color: #999; font-size: 12px;">
                        <p>A confirmation email has been dispatched with full tracking logistics.</p>
                        <p>© 2026 Wearza Marketplace. All rights reserved.</p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
