import { Link } from 'react-router-dom';
import { Lock, Scale } from 'lucide-react';

// Copy for the Privacy Policy and Terms of Use pages. Both are rendered by
// components/LegalPage.jsx, so wording changes only happen here.
//
// Sections are JSX rather than plain strings because legal text needs inline
// links, emphasis and sub-headings. Styling comes from the `legal-prose`
// wrapper in LegalPage, so the markup here stays unstyled.
//
// Both documents are the client's own approved wording. Keep their section
// order: the numbering rendered on the page (01-17 for privacy, 01-15 for
// terms) then matches the numbering in their source documents. `navTitle` is
// the short label for the sidebar; `title` stays as the client wrote it.
//
// [TO CONFIRM: ...] marks a gap the client left in their draft. It renders
// visibly on the page so it cannot ship by accident.

// Both legal documents name this address for questions and data protection
// requests. The shared info@ inbox is the footer's general enquiry route.
const LEGAL_EMAIL = 'agbolade@foperspectives.co.uk';
const LAST_UPDATED = '5 November 2026';

export const privacy_policy = {
  eyebrow: 'Legal · Privacy',
  title: 'Privacy Policy',
  intro:
    'How FO Perspectives collects, uses and protects your personal information, and the choices you have.',
  icon: Lock,
  lastUpdated: LAST_UPDATED,
  effectiveDate: LAST_UPDATED,
  contactNote:
    'Send us a message through our contact form. We review requests and respond within applicable legal timeframes.',
  related: {
    to: '/terms',
    label: 'Terms of Use',
    description: 'The rules for using our website, events and early-careers services.',
  },
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      navTitle: 'Introduction',
      content: (
        <>
          <p>
            FO Perspectives Ltd (<strong>"FO Perspectives"</strong>, "we", "us" or "our") is
            committed to protecting your personal information and respecting your privacy.
          </p>
          <p>
            We are a UK-based early careers talent attraction and career development organisation.
            We work with students, graduates, school leavers, educational institutions and employers
            to provide career opportunities, recruitment events, workshops, mentoring, application
            support and professional development resources.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, store, share and protect personal
            information when you interact with our website, register for our services, attend our
            events or participate in our programmes.
          </p>
          <p>
            We process personal information in accordance with applicable UK data protection
            legislation, including the UK General Data Protection Regulation (UK GDPR) and the Data
            Protection Act 2018.
          </p>
        </>
      ),
    },
    {
      id: 'who-we-are',
      title: 'Who we are',
      navTitle: 'Who we are',
      content: (
        <>
          <p>FO Perspectives Ltd is a company registered in England and Wales.</p>
          <ul>
            <li>
              <strong>Company registration number</strong> — 15959959
            </li>
            <li>
              <strong>Website</strong> —{' '}
              <a href="https://www.foperspectives.co.uk" target="_blank" rel="noreferrer">
                www.foperspectives.co.uk
              </a>
            </li>
            <li>
              <strong>Email</strong> —{' '}
              <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
            </li>
          </ul>
          <p>
            For activities where we determine why and how personal data is processed, FO
            Perspectives acts as a data controller.
          </p>
          <p>
            Where we process personal data on behalf of an employer or another organisation in
            accordance with its instructions, we may act as a data processor.
          </p>
        </>
      ),
    },
    {
      id: 'information-we-collect',
      title: 'What personal information we collect',
      navTitle: 'What we collect',
      content: (
        <>
          <p>
            Depending on how you interact with FO Perspectives, we may collect the following
            information.
          </p>
          <h3>Personal and contact information</h3>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Telephone number</li>
            <li>Age or age range, where relevant</li>
            <li>General location or region</li>
          </ul>
          <h3>Educational information</h3>
          <ul>
            <li>School, college or university</li>
            <li>Degree subject or course of study</li>
            <li>Current year of study</li>
            <li>Expected graduation year</li>
            <li>Relevant academic qualifications</li>
          </ul>
          <h3>Career and employment information</h3>
          <ul>
            <li>Career interests and preferred industries</li>
            <li>Employment or education status</li>
            <li>Work experience and professional background</li>
            <li>CVs and application information, where provided</li>
            <li>Recruitment preferences and application progress, where relevant</li>
          </ul>
          <h3>Event and programme information</h3>
          <ul>
            <li>Event registrations and attendance records</li>
            <li>Programme applications</li>
            <li>Workshop participation</li>
            <li>Feedback surveys and evaluation responses</li>
            <li>Career development goals and areas of interest</li>
          </ul>
          <h3>Demographic information</h3>
          <p>
            Where appropriate and voluntarily provided, we may collect demographic information,
            including gender, ethnicity or other diversity-related information, to support programme
            evaluation, accessibility and diversity monitoring.
          </p>
          <p>
            Certain information, including ethnicity and health-related information, may qualify as
            special category personal data under UK GDPR. We only process such information where we
            have an appropriate lawful basis and an additional legal condition permitting its use.
          </p>
          <h3>Communication and technical information</h3>
          <ul>
            <li>Newsletter subscriptions</li>
            <li>Communication preferences</li>
            <li>Email engagement information, where enabled</li>
            <li>Enquiries and correspondence</li>
            <li>
              Technical information required for website operation and security, such as IP
              addresses and relevant access logs
            </li>
          </ul>
          <p>
            We aim to collect only personal information reasonably necessary for the relevant
            activity.
          </p>
        </>
      ),
    },
    {
      id: 'how-we-collect',
      title: 'How we collect personal information',
      navTitle: 'How we collect it',
      content: (
        <>
          <p>We primarily collect personal information directly from you through:</p>
          <ul>
            <li>registration and account creation on our website;</li>
            <li>applications for career events, insight days and workshops;</li>
            <li>online surveys and feedback forms;</li>
            <li>newsletter and community subscriptions;</li>
            <li>career coaching and application support services;</li>
            <li>email correspondence and direct enquiries.</li>
          </ul>
          <p>
            In certain circumstances, we may also receive relevant personal information from
            educational institutions, university societies, employers and authorised programme
            partners.
          </p>
          <p>
            Where we receive information indirectly, we take steps to ensure that its collection and
            use are lawful and appropriately communicated to the individuals concerned.
          </p>
          <p>
            We do not purchase personal information from data brokers or undertake automated
            personal data scraping as part of our standard operations.
          </p>
        </>
      ),
    },
    {
      id: 'how-we-use',
      title: 'How we use your personal information',
      navTitle: 'How we use it',
      content: (
        <ul>
          <li>
            <strong>Career development and recruitment</strong> — to provide access to internships,
            graduate opportunities, apprenticeships, employer insight events, career workshops and
            other professional development programmes.
          </li>
          <li>
            <strong>Event and programme administration</strong> — to manage registrations, assess
            eligibility where relevant, confirm attendance, communicate event details and provide
            appropriate follow-up support.
          </li>
          <li>
            <strong>Employer partnerships</strong> — to facilitate introductions and engagement
            between individuals and employer partners, including organisations such as Accenture,
            Barclays and Aon, where relevant to the programme or opportunity.
          </li>
          <li>
            <strong>Community engagement</strong> — to administer our community services, provide
            access to career resources and communicate relevant service information.
          </li>
          <li>
            <strong>Newsletter and career updates</strong> — to send career opportunities, events,
            educational content and other updates where permitted by applicable marketing and data
            protection laws.
          </li>
          <li>
            <strong>Programme evaluation</strong> — to collect feedback, assess participation,
            understand programme effectiveness and produce reports for internal improvement and
            relevant employer partners.
          </li>
          <li>
            <strong>Legal and security requirements</strong> — to maintain appropriate records,
            protect our systems, respond to data protection requests and comply with applicable
            legal obligations.
          </li>
        </ul>
      ),
    },
    {
      id: 'legal-basis',
      title: 'Our legal basis for processing personal information',
      navTitle: 'Our legal basis',
      content: (
        <>
          <p>
            We rely on appropriate lawful bases under UK GDPR depending on the purpose of
            processing. These may include:
          </p>
          <ul>
            <li>
              <strong>Consent</strong> — where you have given valid consent for a particular
              activity, such as receiving optional marketing communications or certain uses of your
              information.
            </li>
            <li>
              <strong>Contractual necessity</strong> — where processing is required to provide a
              service you have requested or to take steps towards entering into a contract.
            </li>
            <li>
              <strong>Legitimate interests</strong> — where processing is necessary for our
              legitimate business interests, such as administering programmes, improving services,
              maintaining security and facilitating relevant career development activities, provided
              these interests are not overridden by your rights and freedoms.
            </li>
            <li>
              <strong>Legal obligations</strong> — where processing is required to comply with
              applicable laws or regulatory requirements.
            </li>
          </ul>
          <p>
            Where we rely on legitimate interests, these include operating our career development
            services, evaluating programme outcomes and supporting engagement between prospective
            candidates and employers.
          </p>
          <p>
            Where we process special category personal data, we also identify an applicable
            condition under Article 9 of UK GDPR, such as explicit consent where appropriate.
          </p>
          <p>
            You may withdraw consent at any time where consent is the legal basis for processing.
            Withdrawal does not affect processing carried out lawfully before withdrawal.
          </p>
        </>
      ),
    },
    {
      id: 'sharing',
      title: 'Sharing personal information with employers and partners',
      navTitle: 'Sharing with employers',
      content: (
        <>
          <p>
            FO Perspectives works with employers, educational institutions and other organisations
            to provide career development and recruitment opportunities.
          </p>
          <p>
            Where relevant to an event, programme or application, we may share appropriate personal
            information with the employer or organisation responsible for the opportunity.
          </p>
          <p>
            For example, where you register for an employer insight event, relevant registration
            information may be shared with that employer to support event administration,
            participation, eligibility assessment or recruitment-related activities. This may
            include your name, contact details, educational background, career interests and
            relevant registration responses.
          </p>
          <p>
            We aim to inform individuals of relevant employer data sharing at the point of
            registration and obtain consent where legally required.
          </p>
          <p>
            Employers receiving personal information may act as independent data controllers and
            process that information in accordance with their own privacy notices.
          </p>
          <p>
            We do <strong>not</strong> sell personal information to third parties.
          </p>
        </>
      ),
    },
    {
      id: 'service-providers',
      title: 'Third-party service providers',
      navTitle: 'Service providers',
      content: (
        <>
          <p>
            We use third-party technology providers to support the delivery, operation and security
            of our services. These include:
          </p>
          <ul>
            <li>
              <strong>Google Workspace</strong> — business communications, email and document
              management.
            </li>
            <li>
              <strong>Tally</strong> — online registration forms, programme applications and
              feedback surveys.
            </li>
            <li>
              <strong>Beehiiv</strong> — newsletter distribution, subscriber management and email
              communications.
            </li>
            <li>
              <strong>Render</strong> — website and application hosting infrastructure.
            </li>
            <li>
              <strong>Cloudflare</strong> — website security, traffic management and infrastructure
              protection.
            </li>
          </ul>
          <p>
            These providers may process personal information where necessary to deliver their
            services. We use relevant contractual data protection arrangements and seek to limit
            access to personal information to what is necessary for the services being provided.
          </p>
        </>
      ),
    },
    {
      id: 'international-transfers',
      title: 'International data transfers',
      navTitle: 'International transfers',
      content: (
        <>
          <p>
            Some of our third-party service providers may process or store personal information
            outside the United Kingdom.
          </p>
          <p>
            Where international transfers of personal data are subject to UK data protection
            restrictions, we take steps to ensure that an appropriate legal transfer mechanism
            applies. Depending on the circumstances, this may include applicable UK adequacy
            regulations or recognised contractual safeguards, such as the UK International Data
            Transfer Agreement or the UK Addendum to standard contractual clauses.
          </p>
          <p>
            You may contact us to request further information about applicable international data
            transfer arrangements.
          </p>
        </>
      ),
    },
    {
      id: 'security',
      title: 'How we protect your information',
      navTitle: 'How we protect it',
      content: (
        <>
          <p>
            We take reasonable and proportionate technical and organisational measures to protect
            personal information against unauthorised access, disclosure, alteration, loss or
            misuse. These measures include:
          </p>
          <ul>
            <li>restricting access to authorised personnel;</li>
            <li>using established service providers with relevant security controls;</li>
            <li>applying appropriate data handling and confidentiality requirements;</li>
            <li>managing access permissions to personal information;</li>
            <li>reviewing information security and data protection practices;</li>
            <li>responding to suspected security incidents and personal data breaches.</li>
          </ul>
          <p>
            Although we take steps to protect personal information, no method of electronic storage
            or transmission can be guaranteed to be completely secure.
          </p>
        </>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep your information',
      navTitle: 'How long we keep it',
      content: (
        <>
          <p>
            We retain personal information only for as long as reasonably necessary for the purposes
            for which it was collected, subject to applicable legal and contractual requirements.
            Retention periods depend on the type of information and the relevant activity. For
            example:
          </p>
          <ul>
            <li>
              Community account information may be retained while your account remains active and
              for any additional period required to meet legitimate or legal obligations.
            </li>
            <li>
              Event registration and application information is retained for the period necessary to
              administer the relevant event or programme, complete appropriate follow-up activities
              and meet applicable reporting requirements.
            </li>
            <li>
              Newsletter subscription information is retained while you remain subscribed, with
              limited records potentially retained to respect unsubscribe requests.
            </li>
            <li>
              Business and contractual records may be retained for longer where necessary to comply
              with legal obligations.
            </li>
          </ul>
          <p>
            When personal information is no longer required, we take steps to securely delete or
            anonymise it.
          </p>
          <p>
            You may contact us for further information about the retention period applicable to your
            personal information.
          </p>
        </>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your data protection rights',
      navTitle: 'Your rights',
      content: (
        <>
          <p>
            Under UK GDPR, you may have the following rights in relation to your personal
            information:
          </p>
          <ul>
            <li>the right to access personal information we hold about you;</li>
            <li>the right to request correction of inaccurate or incomplete information;</li>
            <li>
              the right to request deletion of personal information in certain circumstances;
            </li>
            <li>the right to request restriction of certain processing activities;</li>
            <li>the right to object to processing based on certain lawful grounds;</li>
            <li>the right to receive certain personal information in a portable format;</li>
            <li>the right to withdraw consent where processing relies on consent;</li>
            <li>rights relating to certain automated decisions.</li>
          </ul>
          <p>
            You also have the right to object to the use of your personal information for direct
            marketing at any time.
          </p>
          <p>
            If you have an account with us, you can review and update many of your account details
            directly in your <Link to="/settings">Settings</Link>. To exercise your rights, please
            contact us at <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
          </p>
          <p>
            We will review requests and respond within applicable legal timeframes. Some rights are
            subject to exceptions or limitations under data protection legislation.
          </p>
        </>
      ),
    },
    {
      id: 'marketing',
      title: 'Marketing communications',
      navTitle: 'Marketing',
      content: (
        <>
          <p>
            If you subscribe to our newsletter or opt in to relevant communications, we may send you
            career opportunities, event announcements, educational resources and information about
            our programmes.
          </p>
          <p>
            We send marketing communications only where permitted by applicable data protection and
            electronic marketing requirements.
          </p>
          <p>
            You can unsubscribe from marketing emails at any time using the unsubscribe link
            provided in our communications. You may also contact us directly to request changes to
            your communication preferences.
          </p>
          <p>
            Unsubscribing from marketing communications will not necessarily prevent us from sending
            essential administrative messages relating to events, applications or services you have
            requested.
          </p>
        </>
      ),
    },
    {
      id: 'young-people',
      title: "Children's and young people's privacy",
      navTitle: 'Children & young people',
      content: (
        <>
          <p>
            FO Perspectives supports young people, including school and college students who may be
            under the age of 18. We recognise the importance of providing additional protection for
            children's personal information.
          </p>
          <p>Where we collect information from young people, we aim to ensure that:</p>
          <ul>
            <li>the information requested is relevant and proportionate to the activity;</li>
            <li>the purposes of collection are explained clearly;</li>
            <li>personal information is shared only where appropriate and lawful;</li>
            <li>additional safeguards are considered where necessary;</li>
            <li>young people can exercise their applicable data protection rights.</li>
          </ul>
          <p>
            If you are under 18 and have questions about how your information is used, you may
            contact us directly or seek support from a parent, guardian or trusted adult.
          </p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies and website technologies',
      navTitle: 'Cookies',
      content: (
        <>
          <p>
            Our website uses technical infrastructure to support website functionality, security and
            performance. Some necessary cookies or similar technologies may be used to enable
            essential website functions and protect against security threats.
          </p>
          <p>
            We do not currently use non-essential website analytics or advertising cookies as part
            of our intended website configuration.
          </p>
          <p>
            If we introduce technologies requiring consent, we will implement appropriate consent
            mechanisms and update the relevant privacy information in accordance with applicable
            legislation.
          </p>
        </>
      ),
    },
    {
      id: 'automated-processing',
      title: 'Automated processing',
      navTitle: 'Automated processing',
      content: (
        <>
          <p>
            We use software and digital systems to support activities such as event registration,
            communications, data management and programme reporting.
          </p>
          <p>
            We do not use solely automated decision-making to make recruitment decisions about
            individuals that produce legal or similarly significant effects.
          </p>
          <p>
            Recruitment and hiring decisions are generally managed by the relevant employers in
            accordance with their own recruitment procedures and privacy notices.
          </p>
        </>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this privacy policy',
      navTitle: 'Changes to this policy',
      content: (
        <>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our services, data
            processing activities or applicable legal requirements.
          </p>
          <p>
            The latest version will be published on our website with the relevant update date. Where
            changes materially affect how we use personal information, we will take appropriate
            steps to notify affected individuals.
          </p>
        </>
      ),
    },
  ],
};

export const terms_of_use = {
  eyebrow: 'Legal · Terms',
  title: 'Terms of Use',
  intro:
    'The ground rules for using the FO Perspectives website, events and early-careers services.',
  icon: Scale,
  lastUpdated: LAST_UPDATED,
  effectiveDate: LAST_UPDATED,
  contactNote:
    'Send us a message about anything in these Terms through our contact form.',
  related: {
    to: '/privacy',
    label: 'Privacy Policy',
    description: 'How we collect, use and protect your personal information.',
  },
  sections: [
    {
      id: 'about-us',
      title: 'About us',
      navTitle: 'About us',
      content: (
        <>
          <p>
            <a href="https://www.foperspectives.co.uk" target="_blank" rel="noreferrer">
              www.foperspectives.co.uk
            </a>{' '}
            (the <strong>"Website"</strong>) is operated by FO Perspectives Ltd (
            <strong>"FO Perspectives"</strong>, "we", "us" or "our"), a company registered in
            England and Wales under company number 15959959. Our registered office is [TO CONFIRM:
            registered office address].
          </p>
          <p>
            We provide career information, employer opportunities, events, application support and
            other early-careers resources for students, school leavers, graduates and job seekers.
          </p>
        </>
      ),
    },
    {
      id: 'acceptance',
      title: 'Acceptance of these Terms',
      navTitle: 'Accepting these Terms',
      content: (
        <>
          <p>
            These Terms apply when you visit our Website, create an account, register for an event
            or use our online services. Please read them before using the Website. If you do not
            agree, please do not use our services.
          </p>
          <p>
            We may provide separate conditions for particular events, programmes or paid services.
            If they apply, we will make them available before you register or purchase.
          </p>
        </>
      ),
    },
    {
      id: 'eligibility',
      title: 'Eligibility and accounts',
      navTitle: 'Eligibility & accounts',
      content: (
        <>
          <p>
            You must provide accurate and current information when registering and keep your
            account details secure. You are responsible for activity carried out using your
            account, except where the law provides otherwise. Let us know if you suspect
            unauthorised access.
          </p>
          <p>
            Our services may be used by young people under 18. If you are under 18, please ask a
            parent or guardian for help where appropriate, particularly before purchasing a service
            or accepting obligations you do not understand. We may request further information
            where necessary to check eligibility for a specific programme.
          </p>
        </>
      ),
    },
    {
      id: 'using-our-services',
      title: 'Using our services',
      navTitle: 'Using our services',
      content: (
        <>
          <p>
            Our Website may provide job listings, apprenticeship and internship opportunities,
            career resources, workshops, coaching, newsletters and employer insight events.
            Information is intended as general career guidance and may change without notice.
          </p>
          <p>
            You are responsible for checking the eligibility criteria, deadlines and terms of any
            opportunity before applying. We do not guarantee interviews, employment offers,
            admission to programmes or any other recruitment outcome.
          </p>
        </>
      ),
    },
    {
      id: 'employers',
      title: 'Employers and third-party opportunities',
      navTitle: 'Employers & partners',
      content: (
        <>
          <p>
            We work with employers and other partners to make opportunities available. Applications
            and recruitment decisions may be managed by those organisations, which may have their
            own terms and privacy notices.
          </p>
          <p>
            We seek to keep information accurate but cannot guarantee the availability, content or
            outcome of opportunities run by third parties. Where we share relevant registration or
            candidate information with an employer, we do so as explained in our{' '}
            <Link to="/privacy">Privacy Policy</Link> and applicable event or application notices.
          </p>
        </>
      ),
    },
    {
      id: 'events',
      title: 'Events and programmes',
      navTitle: 'Events & programmes',
      content: (
        <>
          <p>
            Places at events and programmes may be limited, subject to eligibility requirements or
            allocated through a selection process. We may change practical arrangements or cancel an
            event where reasonably necessary, and will aim to notify affected participants.
          </p>
          <p>
            Please behave respectfully towards other attendees, staff and partners. We may refuse
            entry or remove a participant for serious misconduct, safety concerns or breach of these
            Terms. Where an event or service is paid, any applicable refund or cancellation terms
            will be provided before purchase; your statutory rights remain unaffected.
          </p>
        </>
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      navTitle: 'Acceptable use',
      content: (
        <>
          <p>
            You must not misuse the Website, attempt to gain unauthorised access, introduce
            malicious software, send spam, scrape or bulk-download data without permission,
            impersonate others, or post content that is unlawful, threatening, abusive,
            discriminatory or infringes another person's rights.
          </p>
          <p>
            You may use the Website and our downloadable materials for your own personal career
            development. Commercial reuse, redistribution or reproduction of substantial content
            requires our prior written permission.
          </p>
        </>
      ),
    },
    {
      id: 'your-information',
      title: 'Information you provide',
      navTitle: 'Information you provide',
      content: (
        <>
          <p>
            You are responsible for ensuring that CVs, applications, messages and other materials
            you submit are accurate and that you have permission to share any third-party
            information included in them.
          </p>
          <p>
            You retain ownership of your materials. You give us permission to host, use and share
            them only as reasonably necessary to provide the service you requested, administer
            relevant opportunities and comply with our <Link to="/privacy">Privacy Policy</Link>.
            You must not submit content that infringes the rights of others.
          </p>
        </>
      ),
    },
    {
      id: 'ip',
      title: 'Intellectual property',
      navTitle: 'Intellectual property',
      content: (
        <p>
          Unless otherwise stated, the Website, its design, branding, educational materials and
          original content belong to FO Perspectives or its licensors. Nothing in these Terms
          transfers ownership of that content to you. You may view, print or download reasonable
          extracts for personal, non-commercial use, provided notices and attribution are retained.
        </p>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy and communications',
      navTitle: 'Privacy & communications',
      content: (
        <>
          <p>
            We handle personal information in accordance with our{' '}
            <Link to="/privacy">Privacy Policy</Link>. The policy explains the information we
            collect, how we use and share it, and your data protection rights.
          </p>
          <p>
            You can opt out of marketing emails using the unsubscribe link in those messages. We may
            still send essential service notices about accounts, bookings or applications.
          </p>
        </>
      ),
    },
    {
      id: 'external-links',
      title: 'External links and services',
      navTitle: 'External links',
      content: (
        <p>
          The Website may contain links to employer websites, application portals, social media or
          other third-party services. We are not responsible for their availability, content or
          privacy practices. Please review the relevant provider's terms and privacy notice before
          using those services.
        </p>
      ),
    },
    {
      id: 'availability',
      title: 'Availability and changes',
      navTitle: 'Availability & changes',
      content: (
        <p>
          We aim to keep the Website available and accurate, but cannot promise uninterrupted or
          error-free access. We may update, suspend or withdraw features for maintenance, security
          or operational reasons. Where practical, we will give reasonable notice of material
          changes affecting users.
        </p>
      ),
    },
    {
      id: 'termination',
      title: 'Suspension or termination',
      navTitle: 'Suspension & termination',
      content: (
        <p>
          We may restrict or close accounts where reasonably necessary to protect users, maintain
          security, comply with law or address a serious breach of these Terms. We will act
          proportionately and provide an explanation where appropriate. You may request account
          closure by contacting us, or close your account yourself from your{' '}
          <Link to="/settings">Settings</Link>. Retention or deletion of personal information is
          addressed in our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Our responsibility to you',
      navTitle: 'Our responsibility to you',
      content: (
        <>
          <p>
            We take reasonable care in providing our services. Career advice and listings are
            informational and do not replace your own assessment of an employer or opportunity. We
            are not responsible for decisions made by employers or for events beyond our reasonable
            control.
          </p>
          <p>
            Nothing in these Terms limits or excludes liability for death or personal injury caused
            by negligence, fraud or fraudulent misrepresentation, or any rights or remedies that
            cannot lawfully be excluded. If we breach these Terms, we remain responsible for losses
            that are a foreseeable result of that breach, subject to applicable law.
          </p>
        </>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to Terms, governing law and contact',
      navTitle: 'Changes & governing law',
      content: (
        <>
          <p>
            We may revise these Terms to reflect changes to our services or legal requirements. The
            current version will appear on this page, with its updated date. Where changes
            materially affect existing users, we will take reasonable steps to bring them to their
            attention.
          </p>
          <p>
            These Terms are governed by the law of England and Wales, without removing any mandatory
            consumer protections you may have under the law of your country of residence.
          </p>
          <p>
            For questions or complaints, contact FO Perspectives Ltd at{' '}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> or through{' '}
            <a href="https://www.foperspectives.co.uk" target="_blank" rel="noreferrer">
              www.foperspectives.co.uk
            </a>
            .
          </p>
        </>
      ),
    },
  ],
};
