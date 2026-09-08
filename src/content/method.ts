import type { MethodPhase } from './types';

export const methodPhases: MethodPhase[] = [
  {
    id: 'phase-sourcing',
    order: 1,
    name: { ar: 'الرصد والمصادر', en: 'Sourcing' },
    nameEn: 'Sourcing',
    whatHappens: {
      ar: [
        'نجمع كل ما هو متاح عن المنشأة قبل أي زيارة: صور سابقة، مخططات إن وُجدت، وشهادة المالك أو من ينوب عنه.',
        'نحدد نطاق الزيارة ونتفق على ما يمكن الوصول إليه فعليًا في يوم الفحص.',
      ],
      en: [
        'We gather everything available about the facility before any visit: earlier photographs, drawings if they exist, and the owner\'s own account or that of a representative.',
        'We fix the scope of the visit and agree what can actually be reached on the day of inspection.',
      ],
    },
    clientRole: {
      ar: 'تزويدنا بأي وثائق سابقة وتأكيد إمكانية الوصول إلى الموقع.',
      en: 'Provide any earlier documentation and confirm that the site can be reached.',
    },
    deliverables: [
      { id: 'd-intake', name: { ar: 'ورقة استلام الطلب', en: 'Intake sheet' }, importance: 'supporting' },
    ],
    durationDays: [1, 3],
  },
  {
    id: 'phase-field',
    order: 2,
    name: { ar: 'الفحص الميداني', en: 'Field assessment' },
    nameEn: 'Field assessment',
    whatHappens: {
      ar: [
        'زيارة ميدانية يقوم بها فريقنا: مسح بصري منهجي، تصوير مرقّم لكل نظام رئيسي، وقراءة لوحات البيانات حيثما بقيت سليمة.',
        'نقابل الحارس أو أي شخص على معرفة بتاريخ المنشأة — غالبًا ما تكشف هذه المحادثة ما لا يظهر في أي فحص بصري.',
      ],
      en: [
        'Our team conducts the site visit: a systematic visual survey, numbered photography of every major system, and nameplate reading wherever a plate has survived.',
        'We interview the caretaker or anyone with knowledge of the facility\'s history — this conversation often surfaces what no visual inspection can.',
      ],
    },
    clientRole: {
      ar: 'تسهيل الدخول إلى الموقع وتعريف فريقنا بأي شخص مطّلع على تاريخ المنشأة.',
      en: 'Facilitate access to the site and introduce our team to anyone familiar with the facility\'s history.',
    },
    deliverables: [
      { id: 'd-photo', name: { ar: 'سجل صور مرقّم', en: 'Numbered photo record' }, importance: 'critical' },
      { id: 'd-log', name: { ar: 'سجل ميداني', en: 'Field log' }, importance: 'critical' },
      { id: 'd-witness', name: { ar: 'شهادة شاهد', en: 'Witness statement' }, importance: 'core' },
    ],
    durationDays: [2, 3],
  },
  {
    id: 'phase-analysis',
    order: 3,
    name: { ar: 'التحليل والرقمنة', en: 'Analysis and digitisation' },
    nameEn: 'Analysis and digitisation',
    whatHappens: {
      ar: [
        'نحوّل الملاحظات الميدانية إلى جدول حالة مصنّف لكل نظام، ونرسم مخطط CAD لخط الإنتاج عند الطلب.',
        'يراجع مهندس أول مستقل النتائج الأولية قبل صياغة مسودة التقرير.',
      ],
      en: [
        'Field notes become a graded condition table for every system, and a CAD layout of the production line where requested.',
        'An independent senior engineer reviews the initial findings before the draft report is written.',
      ],
    },
    clientRole: {
      ar: 'لا حاجة لدور في هذه المرحلة، عدا الرد على أي استفسار توضيحي.',
      en: 'No role required at this stage beyond answering any clarifying question.',
    },
    deliverables: [
      { id: 'd-condition-table', name: { ar: 'جدول حالة', en: 'Condition table' }, importance: 'critical' },
      { id: 'd-cad', name: { ar: 'مخطط CAD', en: 'CAD layout' }, importance: 'core' },
      { id: 'd-draft', name: { ar: 'مسودة التقرير', en: 'Draft report' }, importance: 'core' },
    ],
    durationDays: [3, 5],
  },
  {
    id: 'phase-delivery',
    order: 4,
    name: { ar: 'التسليم', en: 'Delivery' },
    nameEn: 'Delivery',
    whatHappens: {
      ar: [
        'تسليم التقرير الأولي النهائي: ملخص تنفيذي، نطاق العمل وحدوده، نتائج نظامًا بنظام، ونطاقات تكلفة تقديرية.',
        'نخصص جلسة قصيرة للإجابة عن أي سؤال حول القراءة الفنية للتقرير.',
      ],
      en: [
        'Delivery of the final preliminary report: an executive summary, scope and limitations, system-by-system findings, and estimated cost bands.',
        'A short session is set aside to answer any question about the technical reading of the report.',
      ],
    },
    clientRole: {
      ar: 'مراجعة التقرير وطرح أي أسئلة خلال جلسة التسليم.',
      en: 'Review the report and raise any questions during the delivery session.',
    },
    deliverables: [
      { id: 'd-final-report', name: { ar: 'التقرير الأولي النهائي', en: 'Final preliminary report' }, importance: 'critical' },
      { id: 'd-appendices', name: { ar: 'الملاحق', en: 'Appendices' }, importance: 'supporting' },
    ],
    durationDays: [1, 2],
  },
  {
    id: 'phase-follow-through',
    order: 5,
    name: { ar: 'المتابعة', en: 'Follow-through' },
    nameEn: 'Follow-through',
    whatHappens: {
      ar: [
        'لمن يطلب متابعة ميدانية دورية: زيارات لاحقة على فترات متفق عليها، كل واحدة تُختم بمذكرة حالة مختصرة.',
      ],
      en: [
        'For clients who request ongoing site representation: subsequent visits at an agreed interval, each closed with a short status note.',
      ],
    },
    clientRole: {
      ar: 'تحديد وتيرة المتابعة المطلوبة، إن رغب المالك بها.',
      en: 'Set the desired follow-through interval, if the owner wants one.',
    },
    deliverables: [
      { id: 'd-status-note', name: { ar: 'مذكرة حالة دورية', en: 'Periodic status note' }, importance: 'core' },
    ],
    durationDays: [1, 1],
  },
];
