const sourceCategoryTargets: Readonly<Record<string, readonly string[]>> = {
  '3D & Avatars': [
    '3d-model-generation',
    'avatar-and-portrait-generation',
    'ai-avatars-and-presenters',
    'illustration-and-character-design',
    'animation-and-motion-graphics',
    'machine-learning-platforms',
    'business-intelligence',
  ],
  'AI Agents & Automation': [
    'agent-builders-and-automation-agents',
    'workflow-automation',
  ],
  'Business & Operations': [
    'business-intelligence',
    'analytics-and-reporting',
    'crm-and-sales-assistants',
    'knowledge-bases',
    'meeting-assistants',
    'project-management',
    'calendar-and-scheduling',
    'workflow-automation',
    'document-and-pdf-chat',
    'spreadsheet-and-excel-helpers',
    'note-taking-and-summarizing',
    'machine-learning-platforms',
    'app-and-website-builders',
    'hr-and-recruiting',
    'logo-and-brand-design',
  ],
  'Chatbots & Assistants': [
    'general-chatbots',
    'personal-assistants',
    'customer-support-chatbots',
    'voice-assistants',
  ],
  'Code & Developer Tools': [
    'code-assistants-and-autocomplete',
    'app-and-website-builders',
    'no-code-and-low-code',
    'code-review-and-testing',
    'database-and-sql-helpers',
    'devops-and-cloud',
    'api-and-documentation-tools',
    'ai-coding-agents',
  ],
  'Customer Support': ['customer-support-chatbots'],
  'Data & Analytics': [
    'data-analysis-and-visualization',
    'business-intelligence',
    'machine-learning-platforms',
  ],
  'E-commerce': [
    'e-commerce-product-descriptions',
    'fashion-and-product-mockups',
    'app-and-website-builders',
    'ad-creation-and-optimization',
    'analytics-and-reporting',
    'seo-tools',
    'cybersecurity',
    'ai-search-engines',
    'customer-support-chatbots',
    'finance-and-accounting',
  ],
  'Education & Learning': [
    'tutoring-and-homework-help',
    'language-learning',
    'course-and-quiz-creation',
    'flashcards-and-study-tools',
  ],
  Email: ['email-writing'],
  'Fashion & Beauty': ['fashion-and-product-mockups'],
  'Finance & Accounting': ['finance-and-accounting'],
  'Games & Entertainment': ['gaming-and-game-dev'],
  'HR & Recruiting': ['hr-and-recruiting'],
  'Healthcare & Wellness': ['healthcare-and-wellness'],
  'Image Generators & Editing': [
    'image-generation',
    'image-editing-and-retouching',
    'background-removal',
    'image-upscaling-and-restoration',
    'logo-and-brand-design',
    'ui-and-ux-design',
    'graphic-and-poster-design',
    'interior-and-architecture-design',
    'avatar-and-portrait-generation',
    'fashion-and-product-mockups',
    'illustration-and-character-design',
    '3d-model-generation',
  ],
  Legal: ['legal-and-contract-review'],
  'Logo & Graphic Design': [
    'logo-and-brand-design',
    'ui-and-ux-design',
    'graphic-and-poster-design',
    'illustration-and-character-design',
  ],
  'Marketing & SEO': [
    'seo-tools',
    'ad-creation-and-optimization',
    'lead-generation-and-outreach',
    'analytics-and-reporting',
  ],
  'Music & Audio': [
    'text-to-speech',
    'voice-cloning',
    'speech-to-text-and-transcription',
    'music-generation',
    'podcast-editing',
    'audio-cleanup-and-noise-removal',
    'sound-effects-and-voiceover',
  ],
  'Presentations & Documents': [
    'presentation-and-slide-makers',
    'spreadsheet-and-excel-helpers',
    'document-and-pdf-chat',
    'note-taking-and-summarizing',
    'legal-and-contract-review',
    'finance-and-accounting',
    'ai-writing-assistants',
    'course-and-quiz-creation',
  ],
  Productivity: [
    'note-taking-and-summarizing',
    'meeting-assistants',
    'presentation-and-slide-makers',
    'spreadsheet-and-excel-helpers',
    'project-management',
    'calendar-and-scheduling',
    'document-and-pdf-chat',
    'workflow-automation',
    'knowledge-bases',
  ],
  'Real Estate & Architecture': [
    'real-estate',
    'interior-and-architecture-design',
  ],
  'Research & Science': [
    'academic-research',
    'literature-review-and-citations',
    'market-and-competitor-research',
    'web-scraping-and-data-extraction',
  ],
  'Sales & CRM': ['crm-and-sales-assistants', 'lead-generation-and-outreach'],
  'Security & Privacy': ['cybersecurity'],
  'Social Media': ['social-media-content'],
  'Text To Speech & Voice': ['text-to-speech', 'voice-cloning'],
  'Transcription & Meetings': [
    'speech-to-text-and-transcription',
    'meeting-assistants',
  ],
  Translation: ['translation-and-live-interpretation'],
  Travel: ['travel-planning'],
  'Video Generators & Editing': [
    'text-to-video',
    'video-editing',
    'ai-avatars-and-presenters',
    'video-repurposing-and-clips',
    'subtitles-and-captions',
    'animation-and-motion-graphics',
    'video-upscaling-and-enhancement',
    'lip-sync-and-dubbing',
  ],
  'Websites & App Builders': [
    'app-and-website-builders',
    'no-code-and-low-code',
  ],
  'Writing & Content': [
    'ai-writing-assistants',
    'copywriting-and-ad-copy',
    'blog-and-seo-content',
    'email-writing',
    'grammar-and-editing',
    'paraphrasing-and-rewriting',
    'story-and-creative-writing',
    'script-writing',
    'resume-and-cover-letter',
    'social-media-content',
  ],
  'Other AI Tools': [
    '3d-model-generation',
    'avatar-and-portrait-generation',
    'ai-companions-and-roleplay',
    'ai-avatars-and-presenters',
    'text-to-video',
    'video-editing',
    'video-repurposing-and-clips',
    'text-to-speech',
    'voice-cloning',
    'speech-to-text-and-transcription',
    'music-generation',
    'image-generation',
    'image-editing-and-retouching',
    'background-removal',
    'code-assistants-and-autocomplete',
    'translation-and-live-interpretation',
    'tutoring-and-homework-help',
    'legal-and-contract-review',
    'healthcare-and-wellness',
    'finance-and-accounting',
    'hr-and-recruiting',
    'cybersecurity',
    'travel-planning',
    'real-estate',
    'seo-tools',
    'academic-research',
    'literature-review-and-citations',
    'ai-search-engines',
    'general-chatbots',
    'agent-builders-and-automation-agents',
    'note-taking-and-summarizing',
    'ai-writing-assistants',
    'data-analysis-and-visualization',
    'e-commerce-product-descriptions',
    'customer-support-chatbots',
    'email-writing',
    'sound-effects-and-voiceover',
    'presentation-and-slide-makers',
    'spreadsheet-and-excel-helpers',
    'document-and-pdf-chat',
    'logo-and-brand-design',
    'graphic-and-poster-design',
    'workflow-automation',
    'app-and-website-builders',
    'prompt-tools-and-libraries',
  ],
}

type SubcategoryRule = readonly [pattern: RegExp, slug: string]

const unclassifiedToolRules: readonly SubcategoryRule[] = [
  [/youtube shorts|short.form video|video shorts|clip generator/, 'video-repurposing-and-clips'],
  [/time.series analysis|neural.*data|behavioral data|survey analysis engine|data analyst|data mapping/, 'data-analysis-and-visualization'],
  [/ai companion|virtual human|roleplay/, 'ai-companions-and-roleplay'],
  [/citation creation|citation management|literature review/, 'literature-review-and-citations'],
  [/knowledge sharing|team knowledge|knowledge base|company knowledge/, 'knowledge-bases'],
  [/poem generator|poetry creation|author of poems|children.s books|keepsake books|create.*e.?books|write.*e.?books/, 'story-and-creative-writing'],
  [/app icon|icon design|logo design|brand identity/, 'logo-and-brand-design'],
  [/color palette|graphic design|poster|mood board|moodboard/, 'graphic-and-poster-design'],
  [/storyboard|comic|character generator|visual storytelling/, 'illustration-and-character-design'],
  [/prompt helper|prompt randomizer|prompt generator|prompt tool/, 'prompt-tools-and-libraries'],
  [/swot analysis|pestel analysis|strategic planning|market insights|decision support|audit automation/, 'business-intelligence'],
  [/customer support|customer service|guest communication|helpdesk/, 'customer-support-chatbots'],
  [/workflow automation|integrations|automate apps|automation platform/, 'workflow-automation'],
  [/code assistant|\bcode\b|\bcoding\b|\bprogramming\b|developer tool|software development|\bsql\b/, 'code-assistants-and-autocomplete'],
  [/video generat|text.to.video/, 'text-to-video'],
  [/video editor|video edit/, 'video-editing'],
  [/video repurpos|video clip|clip generator|short.form video/, 'video-repurposing-and-clips'],
  [/animation|motion graphic|gif generator/, 'animation-and-motion-graphics'],
  [/video upscal|enhance video/, 'video-upscaling-and-enhancement'],
  [/lip.sync|dub|dubbing/, 'lip-sync-and-dubbing'],
  [/voice clon|clone.*voice/, 'voice-cloning'],
  [/text.to.speech|speech synthesis|voice generator/, 'text-to-speech'],
  [/speech.to.text|transcrib|speech recognition/, 'speech-to-text-and-transcription'],
  [/music generat|music composition/, 'music-generation'],
  [/podcast/, 'podcast-editing'],
  [/noise remov|audio cleanup|denois|audio enhancement/, 'audio-cleanup-and-noise-removal'],
  [/sound effect|voiceover|audio generation/, 'sound-effects-and-voiceover'],
  [/audio editor|audio edit/, 'audio-cleanup-and-noise-removal'],
  [/background remov|cutout/, 'background-removal'],
  [/image upscal|restore|restoration|enhance resolution/, 'image-upscaling-and-restoration'],
  [/retouch|edit image|image edit|photo edit/, 'image-editing-and-retouching'],
  [/logo design|brand identity|app icon|icon design/, 'logo-and-brand-design'],
  [/\bui\b|\bux\b|wireframe|prototype/, 'ui-and-ux-design'],
  [/color palette|graphic design|poster|comic generator|mood board|moodboard/, 'graphic-and-poster-design'],
  [/avatar|portrait|headshot|digital human/, 'avatar-and-portrait-generation'],
  [/interior|architecture|room design|room style/, 'interior-and-architecture-design'],
  [/fashion|mockup|product photo|product image|product photography/, 'fashion-and-product-mockups'],
  [/illustrat|character design|storyboard|visual storytelling/, 'illustration-and-character-design'],
  [/3d (model|asset|object)|mesh (model|generator)|text.to.3d/, '3d-model-generation'],
  [/image generat|text.to.image|ai art/, 'image-generation'],
  [/time reminder|text reminder|stay on track|task reminder/, 'project-management'],
  [/app builder|website builder|web application/, 'app-and-website-builders'],
  [/app store optimization|\baso\b|organic traffic to a mobile app/, 'seo-tools'],
  [/ecommerce.*seo|product listing.*seo/, 'seo-tools'],
  [/ecommerce.*(copy|content|description)|product listing.*description/, 'e-commerce-product-descriptions'],
  [/ecommerce.*(ad|marketing)|marketing.*ecommerce/, 'ad-creation-and-optimization'],
  [/ecommerce.*(insight|analytics|data)|retail merchandising/, 'analytics-and-reporting'],
  [/ecommerce.*(search|chat)|product search/, 'ai-search-engines'],
  [/pdf.*(chat|summar|query)|document interaction|document processing|document management/, 'document-and-pdf-chat'],
  [/business document|professional document|writing product documents/, 'ai-writing-assistants'],
  [/survey analysis|customer survey insight/, 'data-analysis-and-visualization'],
  [/financial document|financial planning|excel.*financial/, 'finance-and-accounting'],
  [/contract review|legal document|legal.*draft/, 'legal-and-contract-review'],
  [/enterprise.*(search|answers)|search.*company data/, 'knowledge-bases'],
  [/accessibility|assistive technology|screen reader/, 'accessibility'],
  [/portfolio management|investment|accounting/, 'finance-and-accounting'],
  [/audits|audit automation/, 'business-intelligence'],
  [/3d (model|asset|object)|mesh (model|generator)|text.to.3d/, '3d-model-generation'],
  [/translation|translator/, 'translation-and-live-interpretation'],
  [/tutor|homework|language learning|study tool|flashcard|course creator/, 'tutoring-and-homework-help'],
  [/legal|contract review/, 'legal-and-contract-review'],
  [/healthcare|medical|wellness/, 'healthcare-and-wellness'],
  [/accounting|finance|investment|portfolio/, 'finance-and-accounting'],
  [/recruit|human resources|\bhr\b/, 'hr-and-recruiting'],
  [/cybersecurity|cyber security|malware|threat detection/, 'cybersecurity'],
  [/travel planner|trip planner|travel planning/, 'travel-planning'],
  [/real estate|property management|architecture|interior design/, 'real-estate'],
  [/seo|search engine optimization/, 'seo-tools'],
  [/academic research|research paper|scientific literature|citation/, 'academic-research'],
  [/search engine|web search|answer engine/, 'ai-search-engines'],
  [/chatbot|conversational ai|chat assistant|virtual assistant|ai companion/, 'general-chatbots'],
  [/agentic|ai agent|autonomous agent|workflow automation/, 'agent-builders-and-automation-agents'],
  [/project management|task management|meeting assistant|note taking|summar|calendar|scheduling/, 'note-taking-and-summarizing'],
  [/writing assistant|content writer|copywriter|grammar|blog writing|story writer/, 'ai-writing-assistants'],
  [/data analy|data visual|data mapping|analytics|dashboard|csv analy/, 'data-analysis-and-visualization'],
  [/swot analysis|decision support|strategic planning/, 'business-intelligence'],
  [/product description|product listing|ecommerce product/, 'e-commerce-product-descriptions'],
  [/customer support|customer service|helpdesk|guest communication/, 'customer-support-chatbots'],
  [/email writing|email assistant|email generator/, 'email-writing'],
  [/sound effect|audio generation|ai.generated sound/, 'sound-effects-and-voiceover'],
  [/slide deck|presentation maker|presentation generator/, 'presentation-and-slide-makers'],
  [/spreadsheet|excel|csv tool/, 'spreadsheet-and-excel-helpers'],
  [/pdf|document chat|chat with documents/, 'document-and-pdf-chat'],
  [/logo design|brand identity|logo generator/, 'logo-and-brand-design'],
  [/graphic design|poster|comic generator/, 'graphic-and-poster-design'],
  [/illustration|storyboard|visual storytelling|comic/, 'illustration-and-character-design'],
  [/room style|interior design|decoration design/, 'interior-and-architecture-design'],
  [/prompt randomizer|prompt generator|prompt tool/, 'prompt-tools-and-libraries'],
  [/ai model comparison|compare ai models|model playground/, 'machine-learning-platforms'],
  [/content repurpos|youtube shorts|video shorts/, 'video-repurposing-and-clips'],
  [/visual journaling|journal entries/, 'note-taking-and-summarizing'],
  [/workflow|integrations|automate apps|automation platform/, 'workflow-automation'],
  [/app builder|website builder|web application/, 'app-and-website-builders'],
  [/prompt library|prompt generator|prompt tool/, 'prompt-tools-and-libraries'],
  [/subsurface utility mapping|satellite.*insight|sensor data|data integration/, 'data-analysis-and-visualization'],
  [/text reminder|stay on track|task reminder/, 'project-management'],
  [/app store optimization|\baso\b|organic traffic to a mobile app/, 'seo-tools'],
  [/business planning|business operations|operational efficiency|business process/, 'workflow-automation'],
  [/enterprise knowledge|company knowledge|centralize.*knowledge/, 'knowledge-bases'],
  [/business names|brandable names|domain availability/, 'logo-and-brand-design'],
  [/virtual staffing|staffing tool/, 'hr-and-recruiting'],
  [/meal planner|nutrition plan/, 'fitness-and-nutrition'],
  [/business model|swot analysis|strategic planning/, 'business-intelligence'],
  [/model.*(compare|comparison)|compare.*models|llm playground/, 'machine-learning-platforms'],
  [/customer intent|customer segmentation|predictive analytics/, 'analytics-and-reporting'],
  [/product photo|product photography|product image|digital staging|fashion retail/, 'fashion-and-product-mockups'],
  [/ecommerce.*(ad|marketing)|marketing.*ecommerce/, 'ad-creation-and-optimization'],
  [/ecommerce.*(insight|analytics|data)|retail merchandising/, 'analytics-and-reporting'],
  [/ecommerce.*(search|chat)|product search/, 'ai-search-engines'],
  [/fraud prevention|fraud detection|payment fraud/, 'cybersecurity'],
  [/ecommerce.*seo|product listing.*seo/, 'seo-tools'],
  [/ecommerce.*(copy|content|description)|product listing.*description/, 'e-commerce-product-descriptions'],
  [/pdf.*(chat|summar|query)|document interaction|document processing|document management/, 'document-and-pdf-chat'],
  [/business document|professional document|writing product documents/, 'ai-writing-assistants'],
  [/survey|form builder|quiz generator|question generation/, 'course-and-quiz-creation'],
  [/financial document|financial planning|excel.*financial/, 'finance-and-accounting'],
  [/contract review|legal document|legal.*draft/, 'legal-and-contract-review'],
  [/enterprise.*(search|answers)|search.*company data/, 'knowledge-bases'],
  [/accessibility|assistive technology|screen reader/, 'accessibility'],
  [/hotel|hospitality|guest communication/, 'customer-support-chatbots'],
  [/portfolio management|investment|accounting/, 'finance-and-accounting'],
  [/audits|audit automation/, 'business-intelligence'],
  [/app icon|icon design/, 'logo-and-brand-design'],
  [/storyboard|comic|character generator|visual storytelling/, 'illustration-and-character-design'],
  [/color palette|graphic design|poster design/, 'graphic-and-poster-design'],
  [/ai generated gif|gif generator/, 'animation-and-motion-graphics'],
  [/content repurpos/, 'blog-and-seo-content'],
  [/poem generator|poetry/, 'story-and-creative-writing'],
  [/chat with pdf|pdf.*interaction/, 'document-and-pdf-chat'],
]

const excludedOtherToolPatterns: readonly RegExp[] = [
  /review management|review response|online review|reputation management/,
  /bitcoin layer.?2|blockchain infrastructure|decentralized ai network/,
  /asset management|data integration and management/,
  /content repurposing|digital noise generation|audiovisual sync/,
  /decision support for defense|customer survey experience|survey platform/,
]

function getSpecificSubcategory(
  sourceCategory: string,
  searchableText: string,
): string | undefined {
  const text = searchableText.toLocaleLowerCase()
  const matches = (pattern: RegExp) => pattern.test(text)

  if (sourceCategory === 'Other AI Tools') {
    if (excludedOtherToolPatterns.some((pattern) => matches(pattern))) {
      return undefined
    }
    return unclassifiedToolRules.find(([pattern]) => matches(pattern))?.[1]
  }

  switch (sourceCategory) {
    case '3D & Avatars':
      return matches(/avatar|portrait|headshot|digital human/)
        ? 'avatar-and-portrait-generation'
        : matches(/video|presenter/)
          ? 'ai-avatars-and-presenters'
          : '3d-model-generation'
    case 'AI Agents & Automation':
      return matches(/\bagent(s|ic)?\b/)
        ? 'agent-builders-and-automation-agents'
        : 'workflow-automation'
    case 'Business & Operations':
      if (matches(/crm|sales pipeline/)) return 'crm-and-sales-assistants'
      if (matches(/knowledge|enterprise search|company data/)) {
        return 'knowledge-bases'
      }
      if (matches(/analytics|report|dashboard|business intelligence/)) {
        return 'analytics-and-reporting'
      }
      if (matches(/business planning|business process|operations|automation/)) {
        return 'workflow-automation'
      }
      if (matches(/virtual staffing|recruit/)) return 'hr-and-recruiting'
      if (matches(/app builder|business website/)) {
        return 'app-and-website-builders'
      }
      if (matches(/business name|brand name|domain availability/)) {
        return 'logo-and-brand-design'
      }
      if (matches(/machine learning|enterprise ai|language model/)) {
        return 'machine-learning-platforms'
      }
      if (matches(/meeting|transcript/)) return 'meeting-assistants'
      if (matches(/project|task management|kanban/)) return 'project-management'
      if (matches(/calendar|schedule/)) return 'calendar-and-scheduling'
      if (matches(/workflow|automation/)) return 'workflow-automation'
      if (matches(/document|pdf/)) return 'document-and-pdf-chat'
      if (matches(/spreadsheet|excel/)) return 'spreadsheet-and-excel-helpers'
      if (matches(/note|summar/)) return 'note-taking-and-summarizing'
      return undefined
    case 'Chatbots & Assistants':
      if (matches(/customer support|helpdesk|customer service/)) {
        return 'customer-support-chatbots'
      }
      if (matches(/voice assistant|voice command/)) return 'voice-assistants'
      if (matches(/personal assistant/)) return 'personal-assistants'
      return 'general-chatbots'
    case 'Code & Developer Tools':
      if (matches(/code review|unit test|testing|debug/)) {
        return 'code-review-and-testing'
      }
      if (matches(/database|\bsql\b/)) return 'database-and-sql-helpers'
      if (matches(/devops|cloud deploy/)) return 'devops-and-cloud'
      if (matches(/\bapi\b|documentation/)) return 'api-and-documentation-tools'
      if (matches(/coding agent|code agent/)) return 'ai-coding-agents'
      if (matches(/no.code|low.code/)) return 'no-code-and-low-code'
      if (matches(/website|app builder/)) return 'app-and-website-builders'
      return 'code-assistants-and-autocomplete'
    case 'Data & Analytics':
      if (matches(/machine learning|\bml platform|model training/)) {
        return 'machine-learning-platforms'
      }
      if (matches(/business intelligence|\bbi tool|dashboard/)) {
        return 'business-intelligence'
      }
      return 'data-analysis-and-visualization'
    case 'E-commerce':
      if (matches(/product description|product listing|product copy/)) {
        return 'e-commerce-product-descriptions'
      }
      if (matches(/mockup|product photo|product image|product photography|fashion retail/)) {
        return 'fashion-and-product-mockups'
      }
      if (matches(/advertis|campaign|ecommerce ads/)) {
        return 'ad-creation-and-optimization'
      }
      if (matches(/analytics|insights|segmentation|customer intent/)) {
        return 'analytics-and-reporting'
      }
      if (matches(/seo|search optimization/)) return 'seo-tools'
      if (matches(/fraud|riskified/)) return 'cybersecurity'
      if (matches(/search/)) return 'ai-search-engines'
      if (matches(/customer service|chat/)) return 'customer-support-chatbots'
      if (matches(/financial/)) return 'finance-and-accounting'
      if (matches(/store builder|online store|ecommerce website/)) {
        return 'app-and-website-builders'
      }
      return undefined
    case 'Education & Learning':
      if (matches(/language learning|learn a language/)) return 'language-learning'
      if (matches(/flashcard|study guide|exam prep/)) {
        return 'flashcards-and-study-tools'
      }
      if (matches(/course|quiz|lesson/)) return 'course-and-quiz-creation'
      return 'tutoring-and-homework-help'
    case 'Fashion & Beauty':
      return matches(
        /fashion|outfit|clothing|apparel|beauty product|cosmetic product/,
      )
        ? 'fashion-and-product-mockups'
        : undefined
    case 'Image Generators & Editing':
      if (matches(/background remov|cutout/)) return 'background-removal'
      if (matches(/upscal|restore|restoration|enhance resolution/)) {
        return 'image-upscaling-and-restoration'
      }
      if (matches(/retouch|edit image|photo edit/)) {
        return 'image-editing-and-retouching'
      }
      if (matches(/logo|brand identity/)) return 'logo-and-brand-design'
      if (matches(/\bui\b|\bux\b|wireframe|prototype/)) return 'ui-and-ux-design'
      if (matches(/avatar|portrait|headshot/)) {
        return 'avatar-and-portrait-generation'
      }
      if (matches(/interior|architecture|room design/)) {
        return 'interior-and-architecture-design'
      }
      if (matches(/fashion|mockup|product design/)) {
        return 'fashion-and-product-mockups'
      }
      if (matches(/illustrat|character design/)) {
        return 'illustration-and-character-design'
      }
      if (matches(/3d model|3d asset|mesh/)) return '3d-model-generation'
      if (matches(/poster|graphic design|flyer/)) {
        return 'graphic-and-poster-design'
      }
      return 'image-generation'
    case 'Logo & Graphic Design':
      if (matches(/logo|brand identity/)) return 'logo-and-brand-design'
      if (matches(/\bui\b|\bux\b|wireframe|prototype/)) return 'ui-and-ux-design'
      if (matches(/illustrat|character design/)) {
        return 'illustration-and-character-design'
      }
      return 'graphic-and-poster-design'
    case 'Marketing & SEO':
      if (matches(/\bseo\b|search engine optim/)) return 'seo-tools'
      if (matches(/lead generation|outreach|prospect/)) {
        return 'lead-generation-and-outreach'
      }
      if (matches(/ad creation|advertis|campaign/)) {
        return 'ad-creation-and-optimization'
      }
      return undefined
    case 'Music & Audio':
      if (matches(/voice clone|clone.*voice/)) return 'voice-cloning'
      if (matches(/text.to.speech|speech synthesis|voice generator/)) {
        return 'text-to-speech'
      }
      if (matches(/transcrib|speech.to.text/)) {
        return 'speech-to-text-and-transcription'
      }
      if (matches(/podcast/)) return 'podcast-editing'
      if (matches(/noise remov|audio cleanup|denois|audio enhancement/)) {
        return 'audio-cleanup-and-noise-removal'
      }
      if (matches(/sound effect|voiceover/)) return 'sound-effects-and-voiceover'
      return undefined
    case 'Presentations & Documents':
      if (matches(/contract|legal|law firm/)) return 'legal-and-contract-review'
      if (matches(/financial|accounting/)) return 'finance-and-accounting'
      if (matches(/survey|form|quiz|question generation/)) {
        return 'course-and-quiz-creation'
      }
      if (matches(/writing|content creation|seo.optimized/)) {
        return 'ai-writing-assistants'
      }
      if (matches(/spreadsheet|excel|sheets/)) {
        return 'spreadsheet-and-excel-helpers'
      }
      if (matches(/pdf|document chat|chat with documents/)) {
        return 'document-and-pdf-chat'
      }
      if (matches(/presentation|slide deck|slides/)) {
        return 'presentation-and-slide-makers'
      }
      if (matches(/summar|meeting notes|meeting assistant/)) {
        return 'note-taking-and-summarizing'
      }
      return matches(/document|pdf|form|contract/) ? 'document-and-pdf-chat' : undefined
    case 'Productivity':
      if (matches(/meeting|transcript|minutes/)) return 'meeting-assistants'
      if (matches(/calendar|scheduling|schedule/)) {
        return 'calendar-and-scheduling'
      }
      if (matches(/project management|task management|kanban/)) {
        return 'project-management'
      }
      if (matches(/workflow|automation|integrat/)) return 'workflow-automation'
      if (matches(/knowledge base|wiki|knowledge management/)) {
        return 'knowledge-bases'
      }
      if (matches(/spreadsheet|excel/)) return 'spreadsheet-and-excel-helpers'
      if (matches(/presentation|slides/)) {
        return 'presentation-and-slide-makers'
      }
      if (matches(/pdf|document chat/)) return 'document-and-pdf-chat'
      return undefined
    case 'Real Estate & Architecture':
      if (matches(/real estate|property|realtor|house listing/)) {
        return 'real-estate'
      }
      if (matches(/architect|interior|floor plan|building design/)) {
        return 'interior-and-architecture-design'
      }
      return undefined
    case 'Research & Science':
      if (matches(/citation|literature review/)) {
        return 'literature-review-and-citations'
      }
      if (matches(/market|competitor|industry research/)) {
        return 'market-and-competitor-research'
      }
      return matches(/academic research|research paper|scientific literature|citation/)
        ? 'academic-research'
        : undefined
    case 'Sales & CRM':
      return matches(/lead|outreach|prospect/)
        ? 'lead-generation-and-outreach'
        : 'crm-and-sales-assistants'
    case 'Security & Privacy':
      return matches(/cyber|threat|malware|vulnerability|security tool/)
        ? 'cybersecurity'
        : undefined
    case 'Text To Speech & Voice':
      return matches(/voice clon|clone.*voice/)
        ? 'voice-cloning'
        : 'text-to-speech'
    case 'Transcription & Meetings':
      return matches(/meeting|minutes|conference/)
        ? 'meeting-assistants'
        : 'speech-to-text-and-transcription'
    case 'Video Generators & Editing':
      if (matches(/caption|subtitle/)) return 'subtitles-and-captions'
      if (matches(/avatar|presenter|talking head/)) {
        return 'ai-avatars-and-presenters'
      }
      if (matches(/clip|repurpose|short.form/)) {
        return 'video-repurposing-and-clips'
      }
      if (matches(/edit video|video editor/)) return 'video-editing'
      if (matches(/animation|motion graphic/)) {
        return 'animation-and-motion-graphics'
      }
      if (matches(/upscal|enhance video/)) {
        return 'video-upscaling-and-enhancement'
      }
      if (matches(/lip.sync|dub|dubbing/)) return 'lip-sync-and-dubbing'
      return undefined
    case 'Websites & App Builders':
      return matches(/no.code|low.code/)
        ? 'no-code-and-low-code'
        : 'app-and-website-builders'
    case 'Writing & Content':
      if (matches(/email|newsletter/)) return 'email-writing'
      if (matches(/grammar|proofread|edit text/)) return 'grammar-and-editing'
      if (matches(/paraphras|rewrite/)) return 'paraphrasing-and-rewriting'
      if (matches(/blog|seo|search engine optim/)) return 'blog-and-seo-content'
      if (matches(/copywriting|ad copy/)) return 'copywriting-and-ad-copy'
      if (matches(/resume|résumé|cover letter/)) {
        return 'resume-and-cover-letter'
      }
      if (matches(/social media/)) return 'social-media-content'
      if (matches(/story|fiction|novel/)) return 'story-and-creative-writing'
      if (matches(/script|screenplay/)) return 'script-writing'
      return 'ai-writing-assistants'
    case 'Finance & Accounting':
    case 'Games & Entertainment':
    case 'HR & Recruiting':
    case 'Healthcare & Wellness':
    case 'Legal':
    case 'Social Media':
    case 'Translation':
    case 'Travel':
    case 'Customer Support':
    case 'Email':
      return sourceCategoryTargets[sourceCategory]?.[0]
    default:
      return undefined
  }
}

export function getWorkbookCategorySlugs(
  sourceCategory: string,
  name: string,
  description: string,
): string[] {
  const allowedTargets =
    sourceCategory === 'Other AI Tools'
      ? Object.values(sourceCategoryTargets).flat()
      : sourceCategoryTargets[sourceCategory]
  if (!allowedTargets) return []

  const slug = getSpecificSubcategory(sourceCategory, `${name} ${description}`)
  return slug && allowedTargets.includes(slug) ? [slug] : []
}
