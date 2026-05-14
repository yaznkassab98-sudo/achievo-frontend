import { Link } from 'react-router-dom'
import { IcArrowLeft, IcAward } from '../components/Icons'

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="font-display font-black text-text mb-3" style={{ fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{title}</h2>
    <div className="text-text-muted text-sm leading-relaxed space-y-3">{children}</div>
  </div>
)

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted text-sm hover:text-text mb-10 transition-colors group">
          <IcArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back home
        </Link>

        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">
            <IcAward size={15} className="text-white" />
          </div>
          <span className="font-display font-black text-text text-lg" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
        </div>

        <h1 className="font-display font-black text-text mb-2" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.04em' }}>
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm mb-10">Last updated: May 2026</p>

        <Section title="1. Who We Are">
          <p>Achievo ("we", "us", "our") operates the Achievo loyalty platform at achievo.app. We are committed to protecting your personal information and being transparent about how we use it.</p>
          <p>For any privacy-related enquiries, contact us at <a href="mailto:hello@achievo.app" className="text-blue hover:underline">hello@achievo.app</a>.</p>
        </Section>

        <Section title="2. Data We Collect">
          <p><strong className="text-text">Account data:</strong> When you register, we collect your name, email address, and password (stored as a secure hash). Optionally, you may provide a phone number, city, and profile photo.</p>
          <p><strong className="text-text">Usage data:</strong> We collect information about how you interact with the Service, including challenges completed, points earned, and pages visited.</p>
          <p><strong className="text-text">Business data:</strong> If you register as a business owner, we also collect your business name, address, category, and any images you upload.</p>
          <p><strong className="text-text">Communications:</strong> We store verification codes and transactional emails we send you for account security purposes.</p>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use your data to: (a) provide and improve the Service; (b) verify your identity and secure your account; (c) send transactional emails such as verification codes and password resets; (d) display your profile and progress to you and relevant businesses; and (e) generate anonymised analytics to improve the platform.</p>
          <p>We do not sell your personal data to third parties.</p>
        </Section>

        <Section title="4. Data Sharing">
          <p><strong className="text-text">With businesses:</strong> When you complete a challenge, the business can see that your challenge was submitted and confirmed. Your name and avatar may be visible to business owners you interact with.</p>
          <p><strong className="text-text">Service providers:</strong> We use trusted third-party services to operate the platform, including cloud hosting (Railway), email delivery (SendGrid), and frontend hosting (Netlify). These providers process data on our behalf and are contractually bound to protect it.</p>
          <p><strong className="text-text">Legal requirements:</strong> We may disclose data if required by law or to protect the rights and safety of our users.</p>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:hello@achievo.app" className="text-blue hover:underline">hello@achievo.app</a>. We will process deletion requests within 30 days.</p>
          <p>Some data may be retained for longer periods where required by law or for legitimate business purposes (e.g. fraud prevention).</p>
        </Section>

        <Section title="6. Cookies and Tracking">
          <p>We use only essential cookies and local storage to maintain your session and authentication state. We do not use advertising cookies or cross-site tracking technologies.</p>
        </Section>

        <Section title="7. Security">
          <p>We take the security of your data seriously. Passwords are hashed using bcrypt. Data is transmitted over HTTPS. We regularly review our security practices. However, no system is completely secure and we cannot guarantee absolute security.</p>
        </Section>

        <Section title="8. Your Rights">
          <p>Depending on your location, you may have rights to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to or restrict certain processing; and data portability.</p>
          <p>To exercise any of these rights, please contact us at <a href="mailto:hello@achievo.app" className="text-blue hover:underline">hello@achievo.app</a>.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>The Service is not directed at children under 16. We do not knowingly collect data from children under 16. If you believe we have inadvertently collected such data, please contact us immediately.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the platform. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
        </Section>
      </div>
    </div>
  )
}
