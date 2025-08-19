
export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>1. Overview</h2>
            <p>This website is operated by BESETGO.. Throughout the site, the terms “we”, “us” and “our” refer to BESETGO.. BESETGO. offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
            <p>By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and policies referenced herein. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.</p>

            <h2>2. General Conditions</h2>
            <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.</p>

            <h2>3. Accuracy of Information</h2>
            <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.</p>
            
            <h2>4. Products or Services</h2>
            <p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction.</p>

            <h2>5. Governing Law</h2>
            <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India and jurisdiction of Jaipur, Rajasthan.</p>

             <h2>6. Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at <a href="mailto:legal@besetgo.com">legal@besetgo.com</a>.</p>
        </div>
    </div>
  );
}
