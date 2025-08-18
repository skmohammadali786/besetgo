
export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>This Privacy Policy describes how SHILPIK. ("we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from besetgo.com (the "Site") or otherwise communicate with us (collectively, the "Services").</p>

            <h2>1. Information We Collect</h2>
            <p>We collect personal information about you from a variety of sources as set out below. This information includes:</p>
            <ul>
                <li><strong>Basic contact details</strong> including your name, address, phone number, email.</li>
                <li><strong>Order information</strong> including your name, billing address, shipping address, payment confirmation, email address, phone number.</li>
                <li><strong>Account information</strong> including your username, password, security questions.</li>
                <li><strong>Shopping information</strong> including the items you view, put in your cart, or add to your wishlist.</li>
            </ul>

            <h2>2. How We Use Your Personal Information</h2>
            <p>We use your personal information for the following purposes:</p>
            <ul>
                <li><strong>Providing Products and Services.</strong> We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, to send notifications to you related to you account, purchases, returns, exchanges or other transactions.</li>
                <li><strong>Marketing and Advertising.</strong> We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail.</li>
                <li><strong>Security and Fraud Prevention.</strong> We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity.</li>
            </ul>

             <h2>3. Your Rights</h2>
            <p>Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.</p>
            <ul>
                <li><strong>Right to Access / Know.</strong> You may have a right to request access to personal information that we hold about you, including details relating to the ways in which we use and share your information.</li>
                <li><strong>Right to Deletion.</strong> You may have a right to request that we delete personal information we maintain about you.</li>
                <li><strong>Right to Correction.</strong> You may have a right to request that we correct inaccurate personal information we maintain about you.</li>
            </ul>


            <h2>4. Contact</h2>
            <p>If you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please contact us at <a href="mailto:privacy@besetgo.com">privacy@besetgo.com</a>.</p>
        </div>
    </div>
  );
}
