import { Link } from 'react-router-dom'
import { IcArrowLeft, IcAward } from '../components/Icons'

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="font-display font-black text-text mb-3" style={{ fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{title}</h2>
    <div className="text-text-muted text-sm leading-relaxed space-y-3">{children}</div>
  </div>
)

export default function Terms() {
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
          Terms of Service
        </h1>
        <p className="text-text-muted text-sm mb-10">Last updated: May 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using Achievo ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>Achievo is a loyalty platform that connects customers with local businesses. Members earn points and rewards by completing challenges set by participating businesses. Business owners can create and manage loyalty challenges, confirm completions, and engage with their customers.</p>
        </Section>

        <Section title="3. Accounts">
          <p>You must provide accurate, complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.</p>
          <p>You must be at least 16 years old to use the Service. By creating an account, you confirm that you meet this age requirement.</p>
          <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
        </Section>

        <Section title="4. Rewards and Points">
          <p>Points and rewards have no monetary value and cannot be exchanged for cash. They are granted at the discretion of participating businesses and are subject to the terms set by each business.</p>
          <p>Achievo does not guarantee the availability, accuracy, or fulfilment of any reward offered by a business. Disputes regarding reward fulfilment should be resolved directly with the business.</p>
          <p>Rewards and points may expire or be forfeited if your account is terminated or remains inactive.</p>
        </Section>

        <Section title="5. Business Owners">
          <p>Business owners are responsible for the challenges they create, the rewards they offer, and the confirmation of completions. Achievo acts as a platform facilitator and is not liable for disputes between business owners and customers.</p>
          <p>Business owners must not create misleading challenges or fail to honour rewards that have been legitimately earned. Repeated violations may result in account suspension.</p>
        </Section>

        <Section title="6. Prohibited Conduct">
          <p>You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to manipulate points or rewards through fraudulent means; (c) impersonate any person or entity; (d) interfere with or disrupt the Service; or (e) collect data from the Service for any unauthorised purpose.</p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>All content, trademarks, and data on the Service are the property of Achievo or its licensors. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
        </Section>

        <Section title="8. Disclaimers and Limitation of Liability">
          <p>The Service is provided "as is" without warranties of any kind. To the fullest extent permitted by law, Achievo shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
          <p>Our total liability to you for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim, or £100, whichever is greater.</p>
        </Section>

        <Section title="9. Governing Law">
          <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </Section>

        <Section title="10. Contact">
          <p>If you have questions about these Terms, please contact us at <a href="mailto:hello@achievo.app" className="text-blue hover:underline">hello@achievo.app</a>.</p>
        </Section>
      </div>
    </div>
  )
}
