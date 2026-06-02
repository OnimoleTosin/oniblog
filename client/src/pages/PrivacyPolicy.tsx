import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground page-transition">
      {/* Header */}
      <section className="border-b border-neon-cyan/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-neon-cyan" />
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold">
              <span className="text-neon-cyan">PRIVACY</span>
              <span className="text-neon-magenta"> POLICY</span>
            </h1>
          </div>
          <p className="font-space-mono text-muted-foreground">
            Last updated: June 2, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="p-6 border-neon-cyan/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                INTRODUCTION
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed">
                ONIBlog ("we", "us", "our", or "Company") operates the ONIBlog website and mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </Card>

            {/* Information Collection */}
            <Card className="p-6 border-neon-magenta/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                INFORMATION WE COLLECT
              </h2>
              <div className="space-y-4 font-space-mono text-sm text-foreground">
                <div>
                  <h3 className="font-bold text-neon-cyan mb-2">Email Addresses</h3>
                  <p className="text-muted-foreground">
                    We collect email addresses when you subscribe to our newsletter or create an account. Your email is used to send you updates about new blog posts, anime and movie recommendations, and occasional promotional content. You can unsubscribe at any time by clicking the unsubscribe link in our emails.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-neon-cyan mb-2">User Account Data</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your name, email, and any profile information you choose to provide. This data helps us personalize your experience and track your reading history.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-neon-cyan mb-2">Comments and Interactions</h3>
                  <p className="text-muted-foreground">
                    When you leave comments on blog posts, we collect your name (or username if logged in), comment content, and timestamp. Comments are stored to facilitate community discussion.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-neon-cyan mb-2">Analytics and Usage Data</h3>
                  <p className="text-muted-foreground">
                    We use Google Analytics and similar tools to collect anonymized data about how you interact with our site, including pages visited, time spent, device type, and browser information. This helps us improve our content and user experience. We do not collect personally identifiable information through analytics.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-neon-cyan mb-2">Cookies</h3>
                  <p className="text-muted-foreground">
                    We use cookies to maintain your session, remember your preferences, and track your activity for analytics purposes. You can control cookie settings through your browser.
                  </p>
                </div>
              </div>
            </Card>

            {/* How We Use Information */}
            <Card className="p-6 border-neon-cyan/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                HOW WE USE YOUR INFORMATION
              </h2>
              <ul className="font-space-mono text-sm text-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Send newsletter updates and new post notifications</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Personalize your browsing experience and reading history</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Analyze site usage and improve content quality</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Respond to your inquiries and provide customer support</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Detect and prevent fraudulent activity or abuse</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Comply with legal obligations and enforce our terms</span>
                </li>
              </ul>
            </Card>

            {/* Affiliate Links & Monetization */}
            <Card className="p-6 border-neon-magenta/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                AFFILIATE LINKS & MONETIZATION
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mb-4">
                ONIBlog may contain affiliate links to external platforms such as IMDb, streaming services, and merchandise retailers. When you click these links and make a purchase, we may earn a commission at no additional cost to you. We only recommend products and services we genuinely believe in.
              </p>
              <p className="font-space-mono text-sm text-foreground leading-relaxed">
                All affiliate relationships are clearly disclosed. We are transparent about our monetization methods and will never recommend content solely for commission purposes.
              </p>
            </Card>

            {/* Data Retention */}
            <Card className="p-6 border-neon-cyan/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                DATA RETENTION
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mb-4">
                We retain your personal data only as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
              </p>
              <ul className="font-space-mono text-sm text-foreground space-y-2 mb-4">
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">Account data:</span> Retained while your account is active and for 12 months after deletion</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">Email subscriptions:</span> Retained until you unsubscribe</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">Comments:</span> Retained indefinitely unless you request deletion</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">Analytics data:</span> Retained for 26 months in aggregated, anonymized form</span>
                </li>
              </ul>
              <p className="font-space-mono text-sm text-foreground leading-relaxed">
                If you request data deletion, we will remove your personal information within 30 days, except where retention is required by law.
              </p>
            </Card>

            {/* Your Rights & Data Deletion */}
            <Card className="p-6 border-neon-magenta/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                YOUR RIGHTS & DATA DELETION
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="font-space-mono text-sm text-foreground space-y-2 mb-6">
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Access your personal data and receive a copy</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Correct inaccurate or incomplete information</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Opt-out of marketing communications</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span>Withdraw consent at any time</span>
                </li>
              </ul>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mb-4">
                To exercise any of these rights or request data deletion, please contact us at:
              </p>
              <div className="bg-black/50 border border-neon-cyan/30 p-4 rounded-sm">
                <p className="font-space-mono text-sm text-neon-cyan font-bold">
                  Email: Onimolesodiq282@gmail.com
                </p>
                <p className="font-space-mono text-sm text-neon-cyan font-bold">
                  WhatsApp: +234 916 962 3604
                </p>
              </div>
            </Card>

            {/* Third-Party Services */}
            <Card className="p-6 border-neon-cyan/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                THIRD-PARTY SERVICES
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mb-4">
                Our website uses third-party services that may collect data:
              </p>
              <ul className="font-space-mono text-sm text-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">Google Analytics:</span> Tracks anonymized usage patterns</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">IMDb/OMDB:</span> Provides movie and anime data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-magenta">▸</span>
                  <span><span className="text-neon-cyan">Email service providers:</span> Deliver newsletters securely</span>
                </li>
              </ul>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mt-4">
                We do not share your personal data with third parties for marketing purposes without your consent.
              </p>
            </Card>

            {/* Security */}
            <Card className="p-6 border-neon-magenta/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                SECURITY
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal data, including SSL encryption, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </Card>

            {/* Changes to Policy */}
            <Card className="p-6 border-neon-cyan/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-cyan mb-4">
                CHANGES TO THIS POLICY
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes your acceptance of the updated Privacy Policy.
              </p>
            </Card>

            {/* Contact */}
            <Card className="p-6 border-neon-magenta/30 bg-background/50">
              <h2 className="font-orbitron text-2xl font-bold text-neon-magenta mb-4">
                CONTACT US
              </h2>
              <p className="font-space-mono text-sm text-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-black/50 border border-neon-magenta/30 p-4 rounded-sm space-y-2">
                <p className="font-space-mono text-sm text-neon-magenta font-bold">
                  Email: Onimolesodiq282@gmail.com
                </p>
                <p className="font-space-mono text-sm text-neon-magenta font-bold">
                  WhatsApp: +234 916 962 3604
                </p>
                <p className="font-space-mono text-sm text-neon-magenta font-bold">
                  GitHub: github.com/OnimoleTosin
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
