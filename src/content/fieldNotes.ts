import type { FieldNote } from './types';

export const fieldNotes: FieldNote[] = [
  {
    id: 'note-nameplate',
    slug: 'reading-a-motor-nameplate-after-twelve-idle-years',
    title: {
      ar: 'كيف تقرأ لوحة اسم محرك بعد اثني عشر عامًا من التوقف',
      en: 'Reading a motor nameplate after twelve idle years',
    },
    standfirst: {
      ar: 'لوحة البيانات هي أول شيء نبحث عنه، وآخر شيء يجب الوثوق به دون تدقيق.',
      en: 'The nameplate is the first thing we look for, and the last thing to trust without checking.',
    },
    publishedAt: '2025-11-02',
    readingMinutes: 4,
    body: {
      ar: [
        'كل محرك صناعي يحمل لوحة معدنية صغيرة تسجل القدرة والجهد والتيار وسنة التصنيع. بعد سنوات من التوقف، غالبًا ما تكون هذه اللوحة الدليل الوحيد المتبقي على هوية المعدّة الحقيقية.',
        'المشكلة أن اللوحة تصف المحرك كما صُنع، لا كما هو الآن. الصدأ، والرطوبة، وتبدّل الأجزاء غير الموثّق كلها تجعل القراءة الحرفية للوحة مضللة إن لم تُقرن بفحص فعلي للحالة.',
        'لهذا نسجّل كل لوحة بيانات كما هي، ثم نفحص المحرك بمعزل عنها. حين يتطابق الاثنان، تزداد الثقة بالتقييم. حين يختلفان، نكتب الفرق صراحة في التقرير.',
      ],
      en: [
        'Every industrial motor carries a small metal plate recording its power, voltage, current, and year of manufacture. After years of disuse, this plate is often the only surviving evidence of what the equipment actually is.',
        'The problem is that the plate describes the motor as it was built, not as it stands today. Corrosion, moisture, and undocumented part swaps all make a literal reading of the plate misleading unless it is checked against an actual condition inspection.',
        'So we record every nameplate exactly as found, then inspect the motor independently of it. When the two agree, confidence in the assessment rises. When they disagree, we say so plainly in the report.',
      ],
    },
    cover: {
      src: '/images/notes/nameplate.jpg',
      alt: {
        ar: 'مقربة لآلية تروس صناعية قديمة الطراز',
        en: 'A close-up of an old-fashioned industrial gear mechanism',
      },
      width: 1200,
      height: 700,
    },
  },
  {
    id: 'note-rust',
    slug: 'surface-rust-versus-structural-corrosion',
    title: {
      ar: 'الصدأ السطحي والصدأ الإنشائي: الفرق الذي يغيّر التكلفة',
      en: 'Surface rust versus structural corrosion: the distinction that moves the cost',
    },
    standfirst: {
      ar: 'مظهر واحد، وتقديران للتكلفة قد يفصل بينهما رقم بعشرة أضعاف.',
      en: 'One appearance, and two cost estimates that can differ by a factor of ten.',
    },
    publishedAt: '2025-10-14',
    readingMinutes: 5,
    body: {
      ar: [
        'من مسافة، الصدأ السطحي والصدأ الإنشائي يبدوان متماثلين تقريبًا: طبقة بنية حمراء تغطي المعدن.',
        'الفرق الحقيقي يظهر عند الفحص عن قرب وبأدوات بسيطة: سماكة القطعة المتبقية، وصلابة السطح تحت طبقة الصدأ، ووجود ثقوب أو تجاويف.',
        'الصدأ السطحي يُعالج بالتنظيف والطلاء. الصدأ الإنشائي يعني أن المقطع نفسه فقد من قوته، وقد يستدعي استبدال العنصر بالكامل. الخلط بين الاثنين في تقرير غير دقيق يمكن أن يضاعف تقدير التكلفة أو يقلّله بشكل خطير.',
      ],
      en: [
        'From a distance, surface rust and structural corrosion look almost identical: a reddish-brown layer over the metal.',
        'The real difference shows up on close inspection with simple tools: the remaining thickness of the piece, the hardness of the surface beneath the rust, and the presence of pitting or voids.',
        'Surface rust is addressed with cleaning and repainting. Structural corrosion means the section itself has lost strength, and may call for replacing the element entirely. Confusing the two in an imprecise report can multiply — or dangerously understate — the cost estimate.',
      ],
    },
    cover: {
      src: '/images/notes/rust.jpg',
      alt: {
        ar: 'مقربة لملمس سطح معدني متآكل بالكامل ومثقوب بالصدأ',
        en: 'A close-up texture of a heavily corroded metal surface, pitted with rust',
      },
      width: 1200,
      height: 700,
    },
  },
  {
    id: 'note-caretaker',
    slug: 'why-we-interview-the-caretaker-before-we-measure-anything',
    title: {
      ar: 'لماذا نقابل الحارس قبل أن نقيس أي شيء',
      en: 'Why we interview the caretaker before we measure anything',
    },
    standfirst: {
      ar: 'أول نصف ساعة في أي زيارة ميدانية تُقضى في الحديث، لا في القياس.',
      en: 'The first half hour of any site visit is spent talking, not measuring.',
    },
    publishedAt: '2025-09-20',
    readingMinutes: 3,
    body: {
      ar: [
        'من يحرس منشأة متوقفة لسنوات يعرف عنها ما لا يظهر في أي فحص بصري: متى توقف كل نظام، وبأي ترتيب، وما الذي حاول أحد إصلاحه ولم ينجح.',
        'هذه المعلومة لا تُغني عن الفحص الهندسي، لكنها توجّهه. حين يخبرنا الحارس أن التوقف بدأ بانقطاع الكهرباء لا بعطل ميكانيكي، نبحث عن دليل يؤكد ذلك أو ينفيه، بدل افتراض أسوأ سيناريو من الصدأ وحده.',
      ],
      en: [
        'Whoever has guarded a facility through years of idleness knows things no visual inspection reveals: when each system stopped, in what order, and what someone already tried to fix without success.',
        'This information does not replace an engineering inspection, but it directs it. When a caretaker tells us the shutdown began with a power cut rather than a mechanical failure, we look for evidence that confirms or contradicts that account, instead of assuming the worst case from rust alone.',
      ],
    },
    cover: {
      src: '/images/notes/caretaker.jpg',
      alt: {
        ar: 'عاملان يتحدثان في ممر مستودع بينما يمر شخص ثالث خلفهما',
        en: 'Two workers talking in a warehouse aisle as a third person walks past behind them',
      },
      width: 1200,
      height: 700,
    },
  },
  {
    id: 'note-exclusions',
    slug: 'what-a-visual-assessment-excludes',
    title: {
      ar: 'ما الذي يستثنيه أي تقييم بصري — ولماذا نقوله في الصفحة الأولى',
      en: 'What a visual assessment excludes, and why we say so on page one',
    },
    standfirst: {
      ar: 'التقييم الأولي لا يكشف كل شيء، وإخفاء ذلك يضعف التقرير بأكمله.',
      en: 'A preliminary assessment does not reveal everything, and hiding that weakens the whole report.',
    },
    publishedAt: '2025-08-05',
    readingMinutes: 4,
    body: {
      ar: [
        'التقييم البصري لا يشمل اختبار المواد إتلافيًا، ولا فحصًا مخبريًا، ولا تحققًا قانونيًا من الملكية، ولا تقييمًا بيئيًا. هذا ليس نقصًا نخفيه، بل حدود نعلنها.',
        'نكتب هذه الاستثناءات في الصفحة الأولى من كل تقرير، لا في حاشية بخط صغير. القارئ الذي يعرف حدود ما بين يديه يستطيع أن يثق بما تبقى منه.',
      ],
      en: [
        'A visual assessment does not include destructive material testing, laboratory analysis, legal title verification, or environmental assessment. That is not a gap we hide — it is a boundary we state.',
        'We write these exclusions on page one of every report, not in a small-print footnote. A reader who knows the limits of what they are holding can trust the rest of it.',
      ],
    },
    cover: {
      src: '/images/notes/exclusions.jpg',
      alt: {
        ar: 'دفتر ملاحظات وقلم ولوح تدوين عليه أوراق فوق مكتب خشبي',
        en: 'A notebook, pen, and clipboard of papers on a wooden desk',
      },
      width: 1200,
      height: 700,
    },
  },
];
