import type { Service } from './types';

export const services: Service[] = [
  {
    id: 'svc-preliminary',
    slug: 'preliminary-facility-assessment',
    title: {
      ar: 'تقييم فني أولي للمنشأة',
      en: 'Preliminary facility assessment',
    },
    summary: {
      ar: 'رأي هندسي مستقل حول حالة منشأة صناعية بأكملها، مبني على زيارة ميدانية ومسح بصري منهجي.',
      en: 'An independent engineering opinion on the condition of an entire industrial facility, built on a field visit and a systematic visual survey.',
    },
    whatItIs: {
      ar: [
        'مسح بصري شامل للمنشأة يغطي المبنى والبنية التحتية وخطوط الإنتاج الرئيسية، مع تسجيل لوحات البيانات وقياسات ميدانية أساسية.',
        'يُصنَّف كل نظام رئيسي على سلم حالة من خمس درجات، مع ملاحظات حول العمر التشغيلي المتبقي المقدَّر ونطاق تقريبي لكلفة الإصلاح مقابل الاستبدال.',
      ],
      en: [
        'A comprehensive visual survey of the facility covering the building envelope, infrastructure, and principal production lines, with nameplate capture and basic field measurements.',
        'Every major system is graded on the five-point condition scale, with notes on estimated remaining useful life and an approximate cost band for repair versus replacement.',
      ],
    },
    whoAsks: {
      ar: 'مالك خارج سوريا يحتاج ملفًا يعرضه على شريك أو ممول، أو مستثمر يفحص فرصة قبل الالتزام.',
      en: 'An owner outside Syria who needs a file to put in front of a partner or lender, or an investor screening an opportunity before committing.',
    },
    youReceive: [
      { ar: 'تقرير تقييم أولي مع ملخص تنفيذي', en: 'A preliminary assessment report with an executive summary' },
      { ar: 'جدول حالة لكل نظام رئيسي', en: 'A condition table for every major system' },
      { ar: 'سجل صور مرقّم', en: 'A numbered photographic record' },
      { ar: 'نطاق تكلفة تقديري للإصلاح والاستبدال', en: 'An estimated cost band for repair and replacement' },
    ],
    duration: { ar: '7–10 أيام من تاريخ الزيارة', en: '7–10 days from the site visit' },
  },
  {
    id: 'svc-cad',
    slug: 'production-line-documentation-cad',
    title: {
      ar: 'توثيق خط إنتاج ورسم CAD',
      en: 'Production line documentation and CAD drawing',
    },
    summary: {
      ar: 'مخطط مقاس لخط الإنتاج مع سجل كامل للمعدات، لمن يحتاج تصورًا دقيقًا للمساحة قبل أي قرار توسعة أو نقل.',
      en: 'A measured layout of the production line with a complete equipment register, for anyone who needs an accurate picture of the space before an expansion or relocation decision.',
    },
    whatItIs: {
      ar: [
        'قياس ميداني لمساحة الخط ومواقع المعدات، يُحوَّل إلى مخطط CAD ثنائي الأبعاد بمقياس رسم دقيق.',
        'سجل معدات يضم كل آلة رئيسية مع الصانع والقدرة وسنة التركيب حيثما توفرت لوحة البيانات.',
      ],
      en: [
        'Field measurement of the line footprint and equipment positions, converted into a two-dimensional CAD layout at an accurate scale.',
        'An equipment register listing every principal machine with make, rating, and year installed where a nameplate survives.',
      ],
    },
    whoAsks: {
      ar: 'من يخطط لإعادة تشغيل الخط، أو نقله، أو عرضه على مقاول لتقدير كلفة إعادة التأهيل.',
      en: 'Someone planning to restart the line, relocate it, or put it in front of a contractor for a rehabilitation quote.',
    },
    youReceive: [
      { ar: 'رسم CAD بصيغة قابلة للتحرير', en: 'A CAD drawing in an editable format' },
      { ar: 'سجل معدات كامل', en: 'A complete equipment register' },
      { ar: 'صور موثّقة لكل محطة عمل', en: 'Documented photographs of every workstation' },
    ],
    duration: { ar: '5–8 أيام من تاريخ الزيارة', en: '5–8 days from the site visit' },
  },
  {
    id: 'svc-single-machine',
    slug: 'single-machine-condition-report',
    title: {
      ar: 'تقرير حالة معدّة مفردة',
      en: 'Single-machine condition report',
    },
    summary: {
      ar: 'تقييم مركّز لآلة واحدة — مكبس، أو ناقل، أو مرجل — حين لا يكون الخط كاملًا موضوع السؤال.',
      en: 'A focused assessment of one machine — a press, a conveyor, a boiler — when the whole line is not the question.',
    },
    whatItIs: {
      ar: [
        'فحص بصري مفصّل للمعدّة الواحدة مع قراءة كاملة للوحة البيانات وقياسات الأبعاد الحرجة.',
        'درجة حالة واحدة مع شرح لما يدعمها، وملاحظة صريحة بأي جزء يحتاج فحصًا إضافيًا لا يدخل ضمن نطاق التقييم البصري.',
      ],
      en: [
        'A detailed visual inspection of the single machine with a full nameplate reading and measurement of critical dimensions.',
        'One condition grade with the reasoning behind it, and a plain note on anything that needs further testing outside the scope of a visual assessment.',
      ],
    },
    whoAsks: {
      ar: 'من يفاوض على شراء آلة مستعملة بعينها، أو يحتاج تأكيد حالة معدّة قبل تأمينها أو تمويلها.',
      en: 'Someone negotiating the purchase of one used machine, or needing to confirm its condition before insuring or financing it.',
    },
    youReceive: [
      { ar: 'تقرير حالة مفرد بدرجة واحدة', en: 'A single-machine condition report with one grade' },
      { ar: 'قراءة كاملة للوحة البيانات', en: 'A full nameplate reading' },
      { ar: 'صور مقرَّبة للنقاط الحرجة', en: 'Close-up photographs of critical points' },
    ],
    duration: { ar: '3–5 أيام من تاريخ الزيارة', en: '3–5 days from the site visit' },
  },
  {
    id: 'svc-ongoing',
    slug: 'ongoing-site-representation',
    title: {
      ar: 'متابعة ميدانية دورية',
      en: 'Ongoing site representation',
    },
    summary: {
      ar: 'حضور دوري بالوكالة عن مالك لا يستطيع الحضور بنفسه، مع الإشراف على مقاول محلي عند الحاجة.',
      en: 'Recurring on-site presence on behalf of an owner who cannot attend in person, including supervising a local contractor when needed.',
    },
    whatItIs: {
      ar: [
        'زيارات دورية متفق على تكرارها، تنتهي كل واحدة منها بمذكرة حالة مختصرة.',
        'عند وجود مقاول يعمل على الموقع، نتابع تقدّم العمل بالنيابة عن المالك ونُبلغ بأي انحراف عن الخطة المتفق عليها.',
      ],
      en: [
        'Recurring visits at an agreed interval, each closing with a short status note.',
        'Where a contractor is working on site, we track progress on the owner\'s behalf and flag any deviation from the agreed plan.',
      ],
    },
    whoAsks: {
      ar: 'مالك بدأ إعادة تأهيل ويحتاج عينًا محايدة على الأرض بين زياراته الخاصة.',
      en: 'An owner who has started a rehabilitation and needs a neutral eye on the ground between their own visits.',
    },
    youReceive: [
      { ar: 'مذكرة حالة بعد كل زيارة', en: 'A status note after every visit' },
      { ar: 'إشراف ميداني على المقاول', en: 'On-site supervision of the contractor' },
      { ar: 'إخطار فوري بأي انحراف جوهري', en: 'Prompt notice of any material deviation' },
    ],
    duration: { ar: 'اتفاقية دورية، حسب التكرار المتفق عليه', en: 'A recurring arrangement, at an agreed interval' },
  },
];
