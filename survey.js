/* Communication Skills student survey: shared definitions (questions, languages, storage).
   Every label is [Arabic, English, French]. Stored answers use the option keys, never the labels. */
(function () {
  'use strict';

  var CFG = {
    // Public Supabase key: it can only insert a response. Reading needs the admin password.
    url: 'https://dpbjpjtrsjbmlijpkaup.supabase.co',
    key: 'sb_publishable_08Lm9kVInE-dqMJWlqK8Hw_fwwFmOf5',
    table: 'comm_survey_responses'
  };

  var LANGS = ['ar', 'en'];
  var LANG_NAMES = { ar: 'العربية', en: 'English' };
  var LANG_SHORT = { ar: 'عربي', en: 'EN' };
  var lang = 'ar';
  try { var saved = localStorage.getItem('comm_lang'); if (LANGS.indexOf(saved) >= 0) lang = saved; } catch (e) {}

  function L(x, forLang) {
    if (x == null) return '';
    if (typeof x === 'string') return x;
    var i = LANGS.indexOf(forLang || lang);
    return x[i] != null ? x[i] : x[1];
  }
  function setLang(l) {
    if (LANGS.indexOf(l) < 0) return;
    lang = l;
    try { localStorage.setItem('comm_lang', l); } catch (e) {}
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  }

  var OTHER = { v: 'other', l: ['أخرى', 'Other'], other: true };
  var IDK = { v: 'idk', l: ['لا أعرف', 'I don’t know'] };
  var SCALE = [
    ['ضعيف جداً', 'Very weak'],
    ['ضعيف', 'Weak'],
    ['متوسط', 'Average'],
    ['جيد', 'Good'],
    ['ممتاز', 'Excellent']
  ];
  function o(v, ar, en) { return { v: v, l: [ar, en] }; }
  function same(v, s) { return { v: v, l: [s, s] }; }


  /* Country list: sorted alphabetically in the language of the interface (done at render time in app.js). */
  var COUNTRIES = (window.FGUCountries || []).slice();
  var COLLEGES = [o('sci', 'العلوم والتكنولوجيا والهندسة', 'Science, technology & engineering'), o('biz', 'الأعمال والاقتصاد', 'Business & economics'),
    o('edu', 'التربية', 'Education'), o('arts', 'الآداب والعلوم الإنسانية', 'Arts & humanities'), o('law', 'القانون والشريعة', 'Law & Sharia'),
    o('health', 'الطب والصحة', 'Medicine & health sciences'), OTHER];

  var SECTIONS = [
    {
      id: 'profile',
      title: ['بيانات الطالب', 'Student profile'],
      intro: ['نبدأ بالتعريف بك وببرنامجك الدراسي.', 'Let’s start with who you are and what you study.'],
      questions: [
        { id: 'full_name', type: 'text', minWords: 4, maxLength: 120, autocomplete: 'name',
          label: ['الاسم الرباعي', 'Full name (four parts)'],
          hint: ['كما هو مسجل في الجامعة', 'As registered at the university'] },
        { id: 'student_id', type: 'text', maxLength: 40, ltr: true,
          label: ['الرقم الجامعي', 'University ID number'] },
        { id: 'country', type: 'select', options: COUNTRIES,
          label: ['الدولة', 'Country'],
          hint: ['اختر دولتك من القائمة (مرتبة هجائياً)', 'Choose your country from the list (alphabetical)'] },
        { id: 'level', type: 'single',
          label: ['المرحلة الدراسية الحالية', 'Current degree programme'],
          options: [o('diploma', 'دبلوم', 'Diploma'), o('bachelor', 'بكالوريوس', 'Bachelor’s'), o('master', 'ماجستير', 'Master’s'), OTHER] },
        { id: 'college', type: 'single',
          label: ['الكلية أو مجال التخصص', 'Faculty or field of study'], options: COLLEGES },
        { id: 'year', type: 'single',
          label: ['المستوى الدراسي الحالي', 'Current year of study'],
          options: [o('y1', 'سنة أولى', 'First year'), o('y2', 'سنة ثانية', 'Second year'), o('y3', 'سنة ثالثة', 'Third year'),
            o('y4', 'سنة رابعة', 'Fourth year'), o('y5', 'سنة خامسة أو أكثر', 'Fifth year or above')] }
      ]
    },
    {
      id: 'language',
      title: ['الخلفية اللغوية', 'Language background'],
      intro: ['كيف تعلّمت الإنجليزية وكم تستخدمها؟', 'How did you learn English, and how much do you use it?'],
      questions: [
        { id: 'school_type', type: 'single',
          label: ['نوع المدرسة التي تخرجت منها', 'Type of school you graduated from'],
          options: [o('public', 'حكومية', 'Public'), o('private', 'خاصة', 'Private'), o('intl', 'دولية', 'International'), OTHER] },
        { id: 'eng_years', type: 'single',
          label: ['عدد سنوات دراسة الإنجليزية', 'Years of studying English'],
          options: [o('lt5', 'أقل من 5 سنوات', 'Fewer than 5 years'), o('5_9', 'من 5 إلى 9 سنوات', '5 to 9 years'),
            o('10_12', 'من 10 إلى 12 سنة', '10 to 12 years'), o('gt12', 'أكثر من 12 سنة', 'More than 12 years')] },
        { id: 'prev_eng', type: 'multi',
          label: ['مقررات الإنجليزية التي درستها في الجامعة', 'English courses you have taken at university'],
          options: [Object.assign(o('none', 'لم أدرس أياً منها', 'None of these'), { none: true }),
            o('remedial', 'إنجليزي تأسيسي', 'Remedial / foundation English'), o('gen', 'إنجليزي عام', 'General English'),
            o('eap', 'إنجليزي أكاديمي', 'English for academic purposes'), o('esp', 'إنجليزي لأغراض التخصص', 'English for my major')] },
        { id: 'eng_use', type: 'single',
          label: ['استخدامك للإنجليزية خارج قاعة الدرس', 'How often you use English outside class'],
          options: [o('daily', 'يومياً', 'Daily'), o('weekly', 'أسبوعياً', 'Weekly'), o('rare', 'نادراً', 'Rarely'), o('never', 'أبداً', 'Never')] },
        { id: 'exam', type: 'single',
          label: ['نتيجة اختبار إنجليزي سابق', 'Previous English test result'],
          options: [same('ielts', 'IELTS'), same('toefl', 'TOEFL'), o('placement', 'امتحان تحديد المستوى في الجامعة', 'University placement test'),
            o('none', 'لم أقدّم أي اختبار', 'I have not taken a test')] }
      ]
    },
    {
      id: 'quiz',
      title: ['اختبار تشخيصي قصير', 'Short diagnostic quiz'],
      intro: ['ثمانية أسئلة قصيرة لا تدخل في أي علامة. إذا لم تعرف الإجابة فاختر «لا أعرف» ولا تخمّن.',
        'Eight short questions that do not count towards any grade. If you are unsure, choose “I don’t know” rather than guessing.'],
      questions: [
        { id: 'q1', type: 'quiz', short: ['قواعد: زمن الفعل', 'Grammar: verb tense'],
          label: ['Choose the correct word: “She ____ to university every day.”', 'Choose the correct word: “She ____ to university every day.”'],
          options: [same('a', 'go'), same('b', 'goes'), same('c', 'going'), same('d', 'gone'), IDK] },
        { id: 'q2', type: 'quiz', short: ['مفردات', 'Vocabulary'],
          label: ['Which word is closest in meaning to “concise”?', 'Which word is closest in meaning to “concise”?'],
          options: [same('a', 'Lengthy'), same('b', 'Confusing'), same('c', 'Brief and clear'), same('d', 'Informal'), IDK] },
        { id: 'q3', type: 'quiz', short: ['فهم المقروء', 'Reading comprehension'],
          label: ['Read: “The meeting has moved from Tuesday to Thursday because the manager is travelling. Reports are still due on Monday.” When are the reports due?',
            'Read: “The meeting has moved from Tuesday to Thursday because the manager is travelling. Reports are still due on Monday.” When are the reports due?'],
          options: [same('a', 'Monday'), same('b', 'Tuesday'), same('c', 'Thursday'), same('d', 'The text does not say'), IDK] },
        { id: 'q4', type: 'quiz', short: ['عناصر الاتصال', 'Communication process'],
          label: ['في عملية الاتصال، يُسمّى ردّ المستقبِل على المرسِل:', 'In the communication process, the receiver’s response to the sender is called:'],
          options: [o('a', 'التشويش', 'Noise'), o('b', 'التغذية الراجعة', 'Feedback'), o('c', 'القناة', 'The channel'), o('d', 'الترميز', 'Encoding'), IDK] },
        { id: 'q5', type: 'quiz', short: ['الاستماع الفعّال', 'Active listening'],
          label: ['أي مما يلي مثال على الاستماع الفعّال؟', 'Which of these is an example of active listening?'],
          options: [o('a', 'مقاطعة المتحدث لتقديم نصيحة', 'Interrupting to give advice'),
            o('b', 'هزّ الرأس مع النظر إلى الهاتف', 'Nodding while looking at your phone'),
            o('c', 'إعادة صياغة كلام المتحدث للتأكد من الفهم', 'Paraphrasing what the speaker said to check understanding'),
            o('d', 'تحضير الرد بينما يتحدث الآخر', 'Preparing your reply while the other person talks'), IDK] },
        { id: 'q6', type: 'quiz', short: ['لغة الجسد', 'Body language'],
          label: ['أي سلوك يُظهر الثقة غالباً أثناء تقديم عرض؟', 'Which behaviour usually shows confidence during a presentation?'],
          options: [o('a', 'تجنّب النظر إلى الجمهور', 'Avoiding eye contact'), o('b', 'عقد الذراعين والنظر إلى الأرض', 'Crossed arms and looking at the floor'),
            o('c', 'قراءة الشرائح كلمة بكلمة', 'Reading the slides word for word'),
            o('d', 'وقفة معتدلة وتواصل بصري مع الجمهور', 'Upright posture and eye contact with the audience'), IDK] },
        { id: 'q7', type: 'quiz', short: ['البريد الرسمي', 'Formal email'],
          label: ['Which is the most suitable opening for a formal email to a professor you have not met?', 'Which is the most suitable opening for a formal email to a professor you have not met?'],
          options: [same('a', 'Hey prof!'), same('b', 'Dear Professor Ahmad,'), same('c', 'Hi there,'), same('d', 'Yo Dr. Ahmad,'), IDK] },
        { id: 'q8', type: 'quiz', short: ['إعادة الصياغة', 'Paraphrasing'],
          label: ['Which sentence best paraphrases: “The company’s profits declined sharply last year.”?', 'Which sentence best paraphrases: “The company’s profits declined sharply last year.”?'],
          options: [same('a', 'The company earned much less money last year.'), same('b', 'The company earned much more money last year.'),
            same('c', 'The company’s profits stayed the same last year.'), same('d', 'The company opened new branches last year.'), IDK] }
      ]
    },
    {
      id: 'skills',
      title: ['التقييم الذاتي للمهارات', 'Self-assessment of skills'],
      intro: ['قيّم نفسك بصدق من 1 إلى 5؛ التقييم يساعد في ضبط الأنشطة ومستوى الشرح.', 'Rate yourself honestly from 1 to 5; it helps set the activities and the level of the lectures.'],
      questions: [
        { id: 's_speak', type: 'scale', short: ['التحدث بالإنجليزية', 'Speaking English'], label: ['مستواك في التحدث بالإنجليزية', 'Your level in speaking English'] },
        { id: 's_listen', type: 'scale', short: ['الاستماع', 'Listening'], label: ['مستواك في الاستماع وفهم المحادثات', 'Your level in listening and understanding conversations'] },
        { id: 's_read', type: 'scale', short: ['القراءة', 'Reading'], label: ['مستواك في قراءة النصوص الإنجليزية', 'Your level in reading English texts'] },
        { id: 's_write', type: 'scale', short: ['الكتابة', 'Writing'], label: ['مستواك في الكتابة بالإنجليزية', 'Your level in writing English'] },
        { id: 's_present', type: 'scale', short: ['العرض أمام الجمهور', 'Presenting to an audience'], label: ['راحتك في العرض والتحدث أمام الجمهور', 'Your comfort presenting and speaking in front of an audience'] },
        { id: 's_email', type: 'scale', short: ['كتابة البريد الرسمي', 'Writing formal emails'], label: ['قدرتك على كتابة بريد إلكتروني رسمي', 'Your ability to write a formal email'] },
        { id: 's_team', type: 'scale', short: ['العمل الجماعي', 'Teamwork'], label: ['قدرتك على العمل ضمن فريق', 'Your ability to work in a team'] }
      ]
    },
    {
      id: 'tech',
      title: ['التقنية وأسلوب التعلم', 'Technology and learning style'],
      intro: ['ما الأدوات المتوفرة لديك وكيف تفضّل أن تتعلم؟', 'What tools do you have and how do you prefer to learn?'],
      questions: [
        { id: 'tools', type: 'multi',
          label: ['الأدوات التي استخدمتها', 'Tools you have used'],
          options: [Object.assign(o('none', 'لا شيء', 'None'), { none: true }),
            o('meet', 'Zoom أو Teams أو Meet', 'Zoom, Teams or Meet'), same('gdocs', 'Google Docs'), same('ppt', 'PowerPoint / Slides'),
            o('ai', 'أدوات الذكاء الاصطناعي', 'AI assistants'), same('grammarly', 'Grammarly')] },
        { id: 'device', type: 'single',
          label: ['الجهاز الذي تستخدمه للدراسة', 'The device you study on'],
          options: [o('laptop', 'حاسوب محمول أو مكتبي', 'Laptop or desktop'), o('tablet', 'جهاز لوحي', 'Tablet'),
            o('phone', 'هاتف فقط', 'Phone only'), o('shared', 'جهاز مشترك', 'A shared device')] },
        { id: 'internet', type: 'single',
          label: ['جودة اتصالك بالإنترنت', 'Quality of your internet connection'],
          options: [o('stable', 'مستقر', 'Stable'), o('sometimes', 'ينقطع أحياناً', 'Sometimes unstable'), o('weak', 'ضعيف', 'Weak')] },
        { id: 'learn_style', type: 'multi',
          label: ['أسلوب التعلم الذي تفضّله', 'Your preferred way of learning'],
          options: [o('lecture', 'شرح المحاضر', 'Lecturer explanation'), o('discussion', 'النقاش والحوار', 'Discussion'),
            o('practice', 'التطبيق العملي', 'Hands-on practice'), o('group', 'المشاريع الجماعية', 'Group projects'),
            o('video', 'الفيديو والوسائط', 'Videos and media')] }
      ]
    },
    {
      id: 'goals',
      title: ['التوقعات والأهداف', 'Expectations and goals'],
      intro: ['الخطوة الأخيرة: ماذا تريد من هذه المادة؟', 'Last step: what do you want from this course?'],
      questions: [
        { id: 'goals', type: 'multi',
          label: ['هدفك من المادة', 'Your goal for this course'],
          options: [o('pass', 'النجاح في المادة', 'Passing the course'), o('speak', 'تحسين المحادثة', 'Improving my speaking'),
            o('academic', 'الكتابة الأكاديمية', 'Academic writing'), o('interview', 'مقابلات العمل', 'Job interviews'),
            o('present', 'العرض والإلقاء', 'Presenting and public speaking'), o('prof', 'التواصل المهني', 'Professional communication')] },
        { id: 'difficulty', type: 'multi',
          label: ['أكبر الصعوبات التي تتوقعها', 'The biggest difficulties you expect'],
          options: [o('fear', 'الخوف من الكلام أمام الآخرين', 'Fear of speaking in front of others'), o('vocab', 'المفردات', 'Vocabulary'),
            o('grammar', 'القواعد', 'Grammar'), o('shy', 'الخجل', 'Shyness'), o('listen', 'فهم المتحدثين', 'Understanding speakers'), OTHER] },
        { id: 'hours', type: 'single',
          label: ['الساعات الأسبوعية المتاحة لدراسة المادة', 'Hours per week you can give this course'],
          options: [o('lt2', 'أقل من ساعتين', 'Less than 2 hours'), o('2_4', 'من 2 إلى 4 ساعات', '2 to 4 hours'),
            o('5_8', 'من 5 إلى 8 ساعات', '5 to 8 hours'), o('gt8', 'أكثر من 8 ساعات', 'More than 8 hours')] },
        { id: 'expect', type: 'longtext', maxLength: 600,
          label: ['ما توقعاتك من المادة؟', 'What do you expect from this course?'] },
        { id: 'concerns', type: 'longtext', maxLength: 600,
          label: ['ما مخاوفك أو الصعوبات التي تتوقعها؟', 'What concerns or difficulties do you expect?'] }
      ]
    }
  ];

  var ALL = [];
  SECTIONS.forEach(function (s) { s.questions.forEach(function (q) { q.section = s.id; ALL.push(q); }); });
  function visible(q, a) { return !q.showIf || q.showIf(a); }

  /* Is this question answered well enough to count? Returns '' when valid, otherwise an error key. */
  function check(q, a) {
    var v = a[q.id];
    if (q.type === 'text' || q.type === 'longtext') {
      var s = String(v == null ? '' : v).trim();
      if (!s) return 'required';
      if (q.minWords && s.split(/\s+/).length < q.minWords) return 'fourNames';
      if (q.type === 'longtext' && s.length < 3) return 'required';
      return '';
    }
    if (q.type === 'scale') return v >= 1 && v <= 5 ? '' : 'required';
    if (q.type === 'multi') {
      if (!Array.isArray(v) || !v.length) return 'required';
      if (v.indexOf('other') >= 0 && !String(a[q.id + '_other'] || '').trim()) return 'otherRequired';
      return '';
    }
    if (!v) return 'required';
    if (v === 'other' && !String(a[q.id + '_other'] || '').trim()) return 'otherRequired';
    return '';
  }

  function optLabel(q, v, forLang) {
    if (v === 'na') return L(['لا ينطبق', 'Not applicable'], forLang);
    for (var i = 0; i < q.options.length; i++) if (q.options[i].v === v) return L(q.options[i].l, forLang);
    return v == null ? '' : String(v);
  }

  function headers(extra) {
    var h = { apikey: CFG.key, Authorization: 'Bearer ' + CFG.key, 'Content-Type': 'application/json' };
    for (var k in extra || {}) h[k] = extra[k];
    return h;
  }
  function submit(row) {
    return fetch(CFG.url + '/rest/v1/' + CFG.table, {
      method: 'POST', headers: headers({ Prefer: 'return=minimal' }), body: JSON.stringify(row)
    }).then(function (r) { if (!r.ok) throw new Error('submit ' + r.status); });
  }
  function rpc(fn, args) {
    return fetch(CFG.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: headers(), body: JSON.stringify(args) })
      .then(function (r) {
        if (r.ok) return r.status === 204 ? null : r.json().catch(function () { return null; });
        return r.json().catch(function () { return {}; }).then(function (e) {
          var err = new Error(e.message || 'rpc ' + r.status);
          err.wrongPassword = e.code === '28P01';
          throw err;
        });
      });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  window.FGU = {
    LANGS: LANGS, LANG_NAMES: LANG_NAMES, LANG_SHORT: LANG_SHORT, SECTIONS: SECTIONS, ALL: ALL, SCALE: SCALE,
    COURSE: ['مهارات الاتصال والتواصل', 'Communication Skills'],
    UNI: ['جامعة فلوريدا العالمية', 'Florida Global University'],
    L: L, setLang: setLang, getLang: function () { return lang; },
    visible: visible, check: check, optLabel: optLabel,
    submit: submit, rpc: rpc, esc: esc
  };
  setLang(lang);
})();
