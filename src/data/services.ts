export type Service = {
  slug: string;
  number: string;
  name: string;
  short: string;
  headline: string;
  intro: string;
  problem: string;
  opportunity: string;
  audience: string;
  deliverables: { title: string; text: string }[];
  uses: string[];
  technologies: { name: string; purpose: string }[];
  engagement: string;
  faqs: { question: string; answer: string }[];
};
export const services: Service[] = [
  {
    slug: 'web-engineering',
    number: '01',
    name: 'Web Engineering',
    short: 'A better first impression. A stronger foundation for growth.',
    headline: 'Your website should work as hard as you do.',
    intro:
      'Fast, considered websites that make your business easier to understand, trust and buy from. Designed around your customers, built for the long term.',
    problem:
      'A slow website, unclear offer or awkward checkout can lose a customer before a conversation begins. A redesign should solve those problems, not just change the colours.',
    opportunity:
      'Start with the customer journey. Give every page a purpose, make the next action obvious and build a fast foundation that your team can update.',
    audience:
      'Service businesses with an outdated website, founders launching a product, and retailers who need a clearer path from browsing to purchase.',
    deliverables: [
      {
        title: 'Business websites & landing pages',
        text: 'A clear information architecture, considered interface and purposeful conversion paths for your offer.',
      },
      {
        title: 'E-commerce experiences',
        text: 'Product discovery, responsive storefronts and integrations with an established checkout and order system.',
      },
      {
        title: 'Redesign & performance',
        text: 'A review of content, usability and loading behaviour, followed by prioritised improvements and measured checks.',
      },
      {
        title: 'Content your team can manage',
        text: 'CMS integrations, reusable page sections and practical editing guidance so routine changes stay routine.',
      },
    ],
    uses: [
      'A professional services website with a qualified enquiry flow',
      'A focused landing page for a new product or campaign',
      'An online store connected to inventory and fulfilment',
      'A responsive redesign with content migration and redirects',
    ],
    technologies: [
      {
        name: 'Next.js & React',
        purpose:
          'Fast page delivery and flexible interfaces without rebuilding the foundation for every change.',
      },
      {
        name: 'Shopify & content platforms',
        purpose: 'Established commerce and editing tools where they reduce operating complexity.',
      },
      {
        name: 'Semantic HTML & CSS',
        purpose: 'Accessible experiences that work across screen sizes and input methods.',
      },
    ],
    engagement:
      'We map the page structure and conversion goals first, agree the content and visual direction, build the experience, and review it across devices before launch. Handover includes editing and hosting guidance.',
    faqs: [
      {
        question: 'Can you improve our existing website?',
        answer:
          'Yes. We first assess the current platform, content and constraints. A focused improvement may be more useful than a complete rebuild.',
      },
      {
        question: 'Will our team be able to update the content?',
        answer:
          'Where regular editing is needed, the scope includes a suitable CMS and guidance. A small site may be better served by a simpler content workflow.',
      },
      {
        question: 'Do you include search optimisation?',
        answer:
          'Technical foundations such as metadata, page structure, crawlability and performance are part of the build. Ongoing content and search campaigns are scoped separately; rankings are never guaranteed.',
      },
      {
        question: 'How much does a website cost?',
        answer:
          'The estimate depends on content, number of page types, commerce and integrations. Share the goal and approximate budget, and we will propose a practical scope.',
      },
    ],
  },
  {
    slug: 'software-engineering',
    number: '02',
    name: 'Software Engineering',
    short: 'Software shaped around the way your business actually works.',
    headline: 'Build the system your spreadsheets are asking for.',
    intro:
      'Custom applications, useful MVPs and connected platforms. Turn a specific operational problem into software your team can depend on.',
    problem:
      'When work lives across spreadsheets, inboxes and disconnected tools, people become the integration layer. Information gets copied, permissions drift and routine decisions become difficult.',
    opportunity:
      'Model the workflow before the screens. Build a focused system with clear roles, a dependable data model and integrations that remove duplicate work.',
    audience:
      'Founders validating a SaaS idea, operations teams outgrowing spreadsheets, and businesses that need a secure customer or partner portal.',
    deliverables: [
      {
        title: 'SaaS MVPs & web applications',
        text: 'A focused first release built around the core user journey, with explicit scope and room to learn.',
      },
      {
        title: 'Internal tools & dashboards',
        text: 'Operational interfaces that put the right information and actions in one place, with appropriate access controls.',
      },
      {
        title: 'Customer portals',
        text: 'A coherent self-service experience for customer information, requests and account workflows.',
      },
      {
        title: 'APIs & connected data',
        text: 'Documented APIs, third-party integrations and database-backed platforms with validation and failure handling.',
      },
    ],
    uses: [
      'Replace a shared operations spreadsheet with a role-based tool',
      'Validate a SaaS proposition with a deliberately small MVP',
      'Give customers a place to view information and make requests',
      'Connect billing, fulfilment and reporting through APIs',
    ],
    technologies: [
      {
        name: 'TypeScript & React',
        purpose: 'Shared types and reusable interfaces make complex workflows easier to evolve.',
      },
      {
        name: 'PostgreSQL & Supabase',
        purpose:
          'Structured business data, constraints and access policies that support dependable operations.',
      },
      {
        name: 'APIs & automated tests',
        purpose: 'Explicit system contracts and checks around the workflows that matter most.',
      },
    ],
    engagement:
      'We define users, data ownership and the smallest useful release. Work proceeds in reviewable increments, with demonstrations, acceptance checks and a deployment and maintenance plan.',
    faqs: [
      {
        question: 'Can we start with an MVP?',
        answer:
          'Yes. We separate essential validation from future features, then agree a first release that can answer a real business question.',
      },
      {
        question: 'Who owns the code?',
        answer:
          'Ownership, third-party licences and handover are defined in the written agreement. The intended delivery includes source code and operational documentation.',
      },
      {
        question: 'Can you connect our existing tools?',
        answer:
          'Usually, where an appropriate API or supported data exchange exists. We review authentication, rate limits, data ownership and vendor restrictions before committing.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'We agree how defects, monitoring, backups and future improvements will be handled. Ongoing support is scoped separately from the initial build.',
      },
    ],
  },
  {
    slug: 'ai-automation',
    number: '03',
    name: 'AI & Automation',
    short: 'Less repetitive work. More room for the work that matters.',
    headline: 'Make the handoffs happen. Automatically.',
    intro:
      'Connect your tools, reduce manual steps and apply AI where it has a useful, testable role. Keep people in control of decisions that matter.',
    problem:
      'Leads arrive without context. Customer questions repeat. Information is copied from one application to another, and follow-ups depend on someone remembering.',
    opportunity:
      'Automate a stable process first. Use rules for predictable work, AI for suitable language tasks, and human review where uncertainty or business risk is higher.',
    audience:
      'Service businesses handling recurring enquiries, sales teams losing context between tools, and operators spending too much time on repetitive administration.',
    deliverables: [
      {
        title: 'Lead & CRM automation',
        text: 'Capture, validate, route and enrich enquiries with transparent qualification rules and a clear handoff.',
      },
      {
        title: 'Customer support assistants',
        text: 'Grounded answers from approved information, with escalation to a person and a defined scope of responsibility.',
      },
      {
        title: 'Workflow & email automation',
        text: 'Reliable triggers, notifications and follow-ups that respect consent and avoid duplicate actions.',
      },
      {
        title: 'AI agents & application integrations',
        text: 'Bounded tool use, permissions, review steps, logs and recovery paths rather than unattended guesswork.',
      },
    ],
    uses: [
      'Route a new enquiry to the right pipeline with its context intact',
      'Draft a support response from approved documentation for review',
      'Synchronise a customer record between a form, CRM and email tool',
      'Turn a recurring document workflow into a reviewable process',
    ],
    technologies: [
      {
        name: 'Workflow engines & webhooks',
        purpose: 'Connect events and actions with retry rules, visibility and explicit ownership.',
      },
      {
        name: 'Language model APIs',
        purpose:
          'Classify, summarise or draft where real examples demonstrate that the output is useful.',
      },
      {
        name: 'CRM & business APIs',
        purpose:
          'Keep the applications your team uses in sync without introducing another place to manage data.',
      },
    ],
    engagement:
      'We map the current process, identify exceptions and choose a bounded pilot. Before rollout, we test real examples, define success criteria and document human escalation and failure recovery.',
    faqs: [
      {
        question: 'Does every automation need AI?',
        answer:
          'No. Deterministic rules are often easier to test, cheaper to operate and better suited to a stable workflow. AI is introduced only when it solves a suitable problem.',
      },
      {
        question: 'Will an AI assistant make mistakes?',
        answer:
          'It can. We design scope boundaries, grounding, review steps and escalation paths, then test on representative examples. No model is treated as infallible.',
      },
      {
        question: 'What happens to our business data?',
        answer:
          'We review data categories, vendor terms, retention and access before selecting tools. Sensitive workflows may require a narrower scope or a different approach.',
      },
      {
        question: 'Are API and platform fees included?',
        answer:
          'Third-party usage fees and accounts are listed separately in the proposal, along with assumptions and controls for unexpected usage.',
      },
    ],
  },
  {
    slug: 'digital-infrastructure',
    number: '04',
    name: 'Digital Infrastructure',
    short: 'A dependable home for the systems your business relies on.',
    headline: 'Launch is a milestone. Reliability is ongoing.',
    intro:
      'Thoughtful deployment, monitoring and maintenance for the applications behind your business. Know how the system runs, and what to do when it needs attention.',
    problem:
      'A live application still needs updates, backups and someone who understands its failure modes. Unclear ownership turns small technical issues into avoidable disruption.',
    opportunity:
      'Create a clear operating baseline: repeatable deployments, useful alerts, controlled access and a recovery plan that has actually been reviewed.',
    audience:
      'Businesses with an application but no internal platform team, founders preparing for launch, and teams that need a review of hosting, performance or maintenance.',
    deliverables: [
      {
        title: 'Cloud deployment & hosting',
        text: 'Environment configuration, repeatable releases and a documented rollback path on an appropriate platform.',
      },
      {
        title: 'Monitoring & alerting',
        text: 'Health checks, error reporting and actionable alerts with clear ownership and escalation expectations.',
      },
      {
        title: 'Database operations',
        text: 'Access policies, backup configuration, migration discipline and recovery guidance for your data layer.',
      },
      {
        title: 'Maintenance & technical reviews',
        text: 'Dependency updates, performance and security reviews, and scoped technical support with explicit response arrangements.',
      },
    ],
    uses: [
      'Prepare an MVP for a controlled production launch',
      'Move an application to a maintainable hosting setup',
      'Establish alerts and a practical incident runbook',
      'Review application performance, access and backup arrangements',
    ],
    technologies: [
      {
        name: 'Cloudflare & cloud platforms',
        purpose:
          'Choose hosting around application behaviour, operational needs and a sensible cost model.',
      },
      {
        name: 'PostgreSQL & managed databases',
        purpose:
          'Managed persistence with explicit backups, access boundaries and migration processes.',
      },
      {
        name: 'Monitoring & CI/CD',
        purpose:
          'Detect meaningful failures and make releases repeatable instead of relying on manual steps.',
      },
    ],
    engagement:
      'We audit the application and operating responsibilities, agree a baseline, implement the highest-value fixes and hand over runbooks. Ongoing maintenance includes a defined scope and support window.',
    faqs: [
      {
        question: 'Do you provide 24/7 support?',
        answer:
          'Support hours and response arrangements are agreed explicitly. A round-the-clock operations team is not implied by a maintenance engagement.',
      },
      {
        question: 'Can you maintain software you did not build?',
        answer:
          'After a technical assessment. We need to understand the code, licences, deployment and access before taking responsibility for a system.',
      },
      {
        question: 'Is hosting included?',
        answer:
          'Platform charges are normally paid through accounts owned by your business. Setup and management are scoped separately so costs and ownership stay clear.',
      },
      {
        question: 'Can you guarantee uptime or security?',
        answer:
          'No system can carry an absolute guarantee. We can establish practical controls, monitoring, recovery plans and agreed service expectations appropriate to the application.',
      },
    ],
  },
];
export const getService = (slug: string) => services.find((service) => service.slug === slug);
