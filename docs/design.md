# Design direction: The working drawing

The studio identity combines editorial typography with the precision of a structural engineering drawing. The brief's dark palette is the foundation. Blue identifies decisions and interaction, rather than decorating every surface.

Four directions considered without a 12ui tool: (1) an industrial terminal, strong technically but too software-centric; (2) a Swiss typographic monograph, clear but lacking a distinctive object; (3) a cinematic chrome sculpture, striking but unnecessarily heavy; (4) the working drawing, selected for its connection between design, construction, and maintainable systems.

## Composition

The homepage begins with a spacious split composition. Large left-aligned type sits against a precise isometric structural N on the right. A baseplate, two upright structural channels, a diagonal connecting beam, end caps, fastener plates, bolt heads, gussets, and ruled registration marks make the object tangible. Assembly and blueprint modes explain one connected system from two perspectives. This is a symbolic brand model, not a performance visualization.

Capabilities use numbered editorial rows with technical symbols. Work uses one honest, substantial independent project rather than invented client work. The process is a horizontal sequence on wide screens and a vertical sequence on mobile. The closing invitation uses large type and a single primary action.

## System

- Background #101318; surface #202630; elevated #262D37; foreground #F2F3F1; muted #8B9BAE; accent #648CFF; border #303640.
- Local variable Geist for headings, Inter for body, Geist Mono for labels. Headline scale 52–112 px; body 16–20 px. A 4px spacing base and generous 96–128px section spacing.
- Maximum page width 1400px. Gutters 24px mobile, 48px tablet, 72px desktop. Corners predominantly square; small radii for controls only.
- Buttons: solid off-white primary, transparent text secondary, blue for focused states. Minimum touch size 44px. Visible offset focus outlines.
- Mobile: stacked hero, compact graphic, full-width CTA, disclosure navigation, vertical process. No desktop canvas cropped into a phone.
- Motion: restrained entry and short state changes. No scroll locking or hidden content before animation. Reduced-motion disables decorative movement.

## Page specifications

Service pages share a semantic content model but use distinct symbolic diagrams and unique problems, deliverables, use cases, technology rationale, FAQs and engagement details. Industry pages explain operational use cases, scope boundaries and suitable starting points. About explains the founder-led model without inventing biography. Process defines concrete artifacts and decision gates.

Case studies and articles are local MDX, validated at build/test time. The initial case study documents this repository and is marked independent. Missing media must be visibly labelled rather than fabricated. Contact is a single accessible form with local test mode visibly distinguished from production delivery. Legal pages describe the implemented data flow and require operator details and legal review before public launch.
