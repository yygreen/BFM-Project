/**
 * Locale registry for the translated program pages.
 *
 * The schema comment on `i18n` promises that growing into a new language
 * market is data entry. It wasn't: each locale needed its own near-identical
 * route file, because the UI chrome around the translated marketing copy (the
 * quote widget's labels, the section headings, the spec row) lived in the
 * template. Two locales meant two 200-to-360-line files that had already
 * drifted apart.
 *
 * That chrome now lives here, one entry per locale, and a single
 * `[locale]/buy/[slug].astro` renders all of them. Adding a market is an entry
 * in this file plus an `i18n.<locale>` block in airlines.json.
 *
 * `bespoke: true` opts a locale OUT of the generic route because it has its own
 * richer template — German carries a savings tool, a trust block and live euro
 * conversion that the generic page does not. Its route file still owns it, and
 * the generic route skips it so the two can't collide on /de/buy/*.
 *
 * Marketing copy never lives here. It stays per-program in airlines.json,
 * because "why buy KrisFlyer miles" is not the same sentence as "why buy
 * Avios" in any language.
 */

export type LocaleChrome = {
  /** the locale's own name, for the toggle on the English page */
  label: string;
  /**
   * Flag for the language toggle. A country, not a language, so it is only
   * set where one country obviously owns the page's market. Arabic has none
   * on purpose: no single country owns the language, our three Arabic pages
   * span Qatar and the UAE, and picking one nation's flag to stand for a
   * language spoken across twenty-odd countries is a claim we would not
   * defend if asked. That toggle shows its name alone, which is enough.
   *
   * Rendered as an emoji rather than an asset: no request, no CSP question,
   * and it inherits the text colour. Windows has no flag-emoji font and
   * falls back to the boxed two-letter code (TR, FR, CO), which still reads
   * correctly beside the language name.
   */
  flag?: string;
  /**
   * What goes in lang= and hreflang=. Defaults to the registry key. Split out
   * because the key is also the URL segment, and /zh-tw/ reads better in a URL
   * than /zh-TW/ while the tag itself is conventionally region-capitalised.
   */
  htmlLang?: string;
  dir: "ltr" | "rtl";
  /** number grouping, e.g. 49.000 in de/es/tr vs 49,000 in en */
  numLocale: string;
  /** has its own route file; the generic route must not also generate it */
  bespoke?: boolean;
  /** page furniture around the translated marketing copy */
  page: {
    home: string;
    programs: string;
    howItWorks: string;
    whyUs: string;
    faq: string;
    bestUses: string;
    ctaHead: string;
    ctaSub: string;
    quoteHeading: string;
    quoteSub: string;
    freeQuote: string;
    deliveredIn: string;
    yearsIn: string;
    ratePreConfirmed: string;
    on: string;
    /** "48 hours" is data; each language supplies its own unit */
    hours: string;
    /** the value section, which was missing from these pages entirely */
    bestUsesSub: string;
    greatValue: string;
    greatValueNote: string;
    worthHead: string;
    worthSub: string;
  };
  /**
   * The market's currency, and how this locale words the conversion note.
   *
   * Each locale draws on exactly one of the three rate sources, so the source
   * can be named in the locale's own words rather than assembled from parts:
   * EUR, TRY and HKD come from the ECB, TWD and COP from exchangerate-api,
   * and the Gulf currencies from their published dollar peg. A peg has no
   * date, which is why the Arabic strings carry no {d}.
   *
   * `{v}` is the converted amount including its symbol, `{d}` the rate date.
   * A program can override `currency` in its i18n block, the way it can
   * override `flag`: the Arabic pages sell into Qatar and the UAE, and one
   * riyal is not the other.
   */
  fx?: {
    currency: string;
    /** the line under the quote widget's estimate */
    note: string;
    /** the footnote under the savings tool */
    foot: string;
  };
  /** QuoteWidget label overrides; any key omitted falls back to English */
  widget: Record<string, string>;
  /** SavingsTool label overrides, same fallback rule */
  savings: Record<string, string>;
};

export const LOCALES: Record<string, LocaleChrome> = {
  ar: {
    label: "العربية",
    dir: "rtl",
    numLocale: "ar-EG",
    page: {
      home: "الرئيسية",
      programs: "البرامج",
      howItWorks: "كيف تتم العملية",
      whyUs: "لماذا تشتري من buyflightmiles؟",
      faq: "أسئلة شائعة",
      bestUses: "أفضل استخدامات هذه الأميال",
      ctaHead: "جاهز لطلب عرض السعر؟",
      ctaSub: "نؤكد السعر أولاً، ولا يُحصَّل أي مبلغ على هذا الموقع.",
      quoteHeading: "كم ستكلف الأميال؟",
      quoteSub: "سعّرها ثم أرسل الطلب. نؤكد لك السعر النهائي قبل الدفع.",
      freeQuote: "عرض سعر مجاني وغير مُلزِم",
      deliveredIn: "التسليم خلال",
      yearsIn: "في السوق",
      ratePreConfirmed: "السعر يُؤكَّد قبل الدفع",
      on: "على",
      hours: "ساعة",
      bestUsesSub: "أين تمنحك هذه الأميال أفضل قيمة، ومتى يكون الدفع نقداً أفضل. جرّب أي منها مقابل سعر حقيقي.",
      greatValue: "قيمة ممتازة",
      greatValueNote: "الحجوزات التي تستحق شراء الأميال من أجلها",
      worthHead: "هل شراء الأميال أفضل من الدفع نقداً؟",
      worthSub: "الصق السعر النقدي من بحثك عن الرحلة. إذا كان الدفع نقداً أفضل، سنقول لك ذلك.",
    },
    fx: {
      currency: "AED",
      note: "≈ {v} حسب سعر الربط الرسمي بالدولار · الفوترة بالدولار الأمريكي",
      foot: "المبالغ محوَّلة حسب سعر الربط الرسمي بالدولار. الفوترة تتم بالدولار الأمريكي.",
    },
    widget: {
      dHours: "{n} ساعة",
      milesLabel: "الأميال",
      program: "البرنامج",
      howMany: "كم عدد الأميال؟",
      est: "التكلفة التقديرية",
      rate: "السعر",
      delivery: "التسليم",
      onQuote: "مع عرض السعر",
      note: "سعر استرشادي. اطلب عرض السعر ونؤكد لك السعر النهائي.",
      continue: "متابعة",
      back: "تغيير البرنامج →",
      milesUnit: "ميل",
      name: "الاسم *",
      email: "البريد الإلكتروني *",
      contact: "واتساب / تيليجرام",
      contactPh: "اختياري: كيف تفضّل أن نرد عليك",
      submit: "اطلب عرض السعر",
      foot: "الدفع يتم خارج هذا الموقع. لا نطلب رقم عضويتك إلا بعد موافقتك على العرض.",
      per1000: "≈ {v} لكل 1,000 ميل",
      range: "الحد الأدنى {min} والحد الأقصى {max}.",
      below: "الحد الأدنى لبرنامج {program} هو {min} ميل.",
      above: "الحد الأقصى للطلب الواحد في {program} هو {max} ميل.",
      use: "استخدم {v}",
      sending: "جارٍ الإرسال…",
      ok: "شكراً، استلمنا طلبك. سنؤكد لك السعر النهائي والتسليم قريباً.",
      errGeneric: "حدث خطأ ما. يرجى مراسلتنا عبر البريد الإلكتروني بدلاً من ذلك.",
      errNetwork: "خطأ في الاتصال. حاول مجدداً أو راسلنا مباشرة.",
      rateUnit: "¢/ميل",
      saveVs: "توفّر مقارنة بسعر الشراء المباشر {v}¢",
      d24: "خلال 24 ساعة",
      numLocale: "ar-EG",
    },
    savings: {
      milesLabel: "الأميال المطلوبة للحجز",
      fareLabel: "السعر النقدي الذي وجدته ({cur})",
      farePh: "مثال: 2500",
      cash: "السعر النقدي",
      vs: "مقابل",
      atOurRate: "بسعرنا {rate}¢",
      cta: "اطلب عرض السعر ←",
      emptyBoth: "أدخل الأميال والسعر النقدي وسنحسب لك الفرق.",
      emptyFare: "هذه تكلفة الأميال. أضف السعر النقدي لنخبرك أيهما أفضل.",
      win: "فارق واضح لصالح الأميال: هذا المقعد يقدّر الميل بـ {seat}¢ مقابل سعرنا {rate}¢. الشراء يوفّر {saving} ({pct}% من السعر النقدي).",
      ok: "الأميال أوفر: توفّر {saving} مقارنة بالسعر النقدي.",
      payCash: "بصراحة؟ ادفع نقداً هنا. عند {fare} يقدّر هذا المقعد الميل بـ {seat}¢، أي أقل من سعرنا {rate}¢.",
      numLocale: "ar-EG",
    },
  },

  de: {
    label: "Deutsch",
    flag: "🇩🇪",
    dir: "ltr",
    numLocale: "de-DE",
    // owns src/pages/de/buy/[slug].astro — richer than the generic page
    bespoke: true,
    page: {
      home: "Start", programs: "Programme", howItWorks: "So läuft es ab",
      whyUs: "Warum bei buyflightmiles kaufen?", faq: "Häufige Fragen",
      bestUses: "Die besten Einlösungen", ctaHead: "Bereit für dein Angebot?",
      ctaSub: "Wir bestätigen den Preis zuerst. Auf dieser Seite wird nichts abgebucht.",
      quoteHeading: "Was kosten die Meilen?",
      quoteSub: "Preis berechnen, dann Angebot anfordern.",
      freeQuote: "Kostenloses, unverbindliches Angebot", deliveredIn: "Lieferung in",
      yearsIn: "am Markt", ratePreConfirmed: "Preis vor Zahlung bestätigt", on: "auf",
      hours: "Stunden",
      bestUsesSub: "Wo diese Meilen am meisten wert sind und wann bar besser ist.",
      greatValue: "Sehr guter Wert",
      greatValueNote: "Die Einlösungen, für die sich Meilenkauf lohnt",
      worthHead: "Lohnt sich der Meilenkauf gegenüber dem Barpreis?",
      worthSub: "Füge den Preis aus deiner Flugsuche ein.",
    },
    fx: {
      currency: "EUR",
      note: "≈ {v} zum EZB\u2011Kurs vom {d} · Abrechnung in US\u2011Dollar",
      foot: "Euro\u2011Beträge sind zum EZB\u2011Kurs vom {d} umgerechnet. Abgerechnet wird in US\u2011Dollar.",
    },
    // German's own route file supplies the widget labels; this stays empty.
    widget: {},
    savings: {
      numLocale: "de-DE",
    },
  },

  es: {
    label: "Español",
    flag: "🇨🇴",
    dir: "ltr",
    numLocale: "es-CO",
    page: {
      home: "Inicio",
      programs: "Programas",
      howItWorks: "Cómo funciona",
      whyUs: "¿Por qué comprar en buyflightmiles?",
      faq: "Preguntas frecuentes",
      bestUses: "Las mejores formas de usar estas millas",
      ctaHead: "¿Listo para tu cotización?",
      ctaSub: "Confirmamos el precio antes de pagar. En este sitio no se cobra nada.",
      quoteHeading: "¿Cuánto cuestan las millas?",
      quoteSub: "Calcula el precio y pide tu cotización gratis. Confirmamos tu precio exacto antes de que pagues.",
      freeQuote: "Cotización gratis y sin compromiso",
      deliveredIn: "Entrega en",
      yearsIn: "en el mercado",
      ratePreConfirmed: "Precio confirmado antes de pagar",
      on: "en",
      hours: "horas",
      bestUsesSub: "Dónde rinden más estas millas y cuándo conviene pagar en efectivo. Ponlo a prueba contra una tarifa real.",
      greatValue: "Gran valor",
      greatValueNote: "Los canjes por los que vale la pena comprar millas",
      worthHead: "¿Comprar millas te conviene más que pagar la tarifa?",
      worthSub: "Pega el precio que viste en tu búsqueda de vuelos. Si gana el efectivo, te lo decimos.",
    },
    fx: {
      currency: "COP",
      note: "≈ {v} al tipo de cambio de exchangerate-api.com del {d} · el cobro es en dólares",
      foot: "Los montos en pesos se convierten al tipo de cambio de exchangerate-api.com del {d}. El cobro se hace en dólares estadounidenses.",
    },
    widget: {
      dHours: "{n} horas",
      milesLabel: "Millas",
      program: "Programa",
      howMany: "¿Cuántas millas?",
      est: "Costo estimado",
      rate: "Precio",
      delivery: "Entrega",
      onQuote: "Con la cotización",
      note: "Precio indicativo. Pide la cotización y confirmamos el precio exacto.",
      continue: "Continuar",
      back: "Cambiar de programa →",
      milesUnit: "millas",
      name: "Nombre *",
      email: "Correo electrónico *",
      contact: "WhatsApp / Telegram",
      contactPh: "Opcional: cómo prefieres que te respondamos",
      submit: "Pedir cotización",
      foot: "El pago se hace fuera de este sitio. Solo pedimos tu número de socio cuando ya aceptaste la cotización.",
      per1000: "≈ {v} por cada 1.000 millas",
      range: "Mínimo {min}, máximo {max}.",
      below: "El pedido mínimo de {program} es de {min} millas.",
      above: "El máximo por pedido en {program} es de {max} millas.",
      use: "Usar {v}",
      sending: "Enviando…",
      ok: "Gracias, recibimos tu solicitud. Te confirmamos el precio exacto y la entrega en breve.",
      errGeneric: "Algo salió mal. Escríbenos por correo y lo resolvemos.",
      errNetwork: "Error de conexión. Inténtalo de nuevo o escríbenos directamente.",
      rateUnit: "¢/milla",
      saveVs: "Ahorras frente a {v}¢ de precio de lista",
      d24: "24 horas",
      numLocale: "es-CO",
    },
    savings: {
      milesLabel: "Millas que necesita el canje",
      fareLabel: "Tarifa en efectivo que encontraste ({cur})",
      farePh: "ej. 2500",
      cash: "Tarifa en efectivo",
      vs: "vs",
      atOurRate: "Compradas a nuestro precio de {rate}¢",
      cta: "Pedir cotización →",
      emptyBoth: "Ingresa las millas y la tarifa en efectivo y hacemos las cuentas.",
      emptyFare: "Ese es el costo de las millas. Agrega la tarifa y te decimos cuál gana.",
      win: "Ganan las millas con claridad: este asiento valora cada milla en {seat}¢ frente a nuestro precio de {rate}¢. Comprarlas ahorra {saving} ({pct}% de la tarifa).",
      ok: "Las millas salen adelante: {saving} menos que la tarifa en efectivo.",
      payCash: "¿Honestamente? Aquí paga en efectivo. A {fare}, este asiento valora la milla en {seat}¢, por debajo de nuestro precio de {rate}¢.",
      numLocale: "es-CO",
    },
  },

  tr: {
    label: "Türkçe",
    flag: "🇹🇷",
    dir: "ltr",
    numLocale: "tr-TR",
    page: {
      home: "Ana sayfa",
      programs: "Programlar",
      howItWorks: "Nasıl işliyor",
      whyUs: "Neden buyflightmiles?",
      faq: "Sık sorulan sorular",
      bestUses: "Bu milleri en iyi nasıl kullanırsınız",
      ctaHead: "Teklifinizi almaya hazır mısınız?",
      ctaSub: "Önce fiyatı onaylıyoruz. Bu sitede hiçbir tahsilat yapılmaz.",
      quoteHeading: "Miller ne kadar tutar?",
      quoteSub: "Fiyatı hesaplayın, sonra ücretsiz teklifinizi isteyin. Ödemeden önce net fiyatınızı onaylıyoruz.",
      freeQuote: "Ücretsiz, bağlayıcı olmayan teklif",
      deliveredIn: "Teslimat",
      yearsIn: "yıldır piyasada",
      ratePreConfirmed: "Fiyat ödemeden önce onaylanır",
      on: "üzerinden",
      hours: "saat",
      bestUsesSub: "Bu miller nerede en çok değer kazanır ve ne zaman nakit ödemek daha iyidir. Gerçek bir ücretle test edin.",
      greatValue: "Yüksek değer",
      greatValueNote: "Mil satın almaya değer kullanımlar",
      worthHead: "Mil almak nakit ücretten daha mı iyi?",
      worthSub: "Uçuş aramanızda gördüğünüz fiyatı yapıştırın. Nakit kazanıyorsa bunu size söyleriz.",
    },
    fx: {
      currency: "TRY",
      note: "≈ {v} · {d} tarihli Avrupa Merkez Bankası kuru · tahsilat ABD dolarıyla",
      foot: "Lira tutarları {d} tarihli Avrupa Merkez Bankası kuruyla çevrilmiştir. Tahsilat ABD dolarıyla yapılır.",
    },
    widget: {
      dHours: "{n} saat",
      milesLabel: "Mil",
      program: "Program",
      howMany: "Kaç mil?",
      est: "Tahmini tutar",
      rate: "Birim fiyat",
      delivery: "Teslimat",
      onQuote: "Teklifle birlikte",
      note: "Gösterge fiyat. Teklif isteyin, net fiyatınızı onaylayalım.",
      continue: "Devam",
      back: "Programı değiştir →",
      milesUnit: "mil",
      name: "Ad soyad *",
      email: "E-posta *",
      contact: "WhatsApp / Telegram",
      contactPh: "İsteğe bağlı: size nasıl dönelim",
      submit: "Teklif iste",
      foot: "Ödeme bu sitenin dışında yapılır. Üyelik numaranızı ancak teklifi onayladıktan sonra isteriz.",
      per1000: "≈ 1.000 mil başına {v}",
      range: "En az {min}, en fazla {max}.",
      below: "{program} için en düşük sipariş {min} mildir.",
      above: "{program} için tek siparişte en fazla {max} mil alınabilir.",
      use: "{v} kullan",
      sending: "Gönderiliyor…",
      ok: "Teşekkürler, talebiniz bize ulaştı. Net fiyatınızı ve teslim süresini kısa sürede iletiyoruz.",
      errGeneric: "Bir sorun oluştu. Bunun yerine bize e-posta gönderin.",
      errNetwork: "Bağlantı hatası. Tekrar deneyin veya doğrudan yazın.",
      rateUnit: "¢/mil",
      saveVs: "Liste fiyatı {v}¢ ile kıyasla kazancınız",
      d24: "24 saat",
      numLocale: "tr-TR",
    },
    savings: {
      milesLabel: "Ödül bilet için gereken mil",
      fareLabel: "Bulduğunuz nakit ücret ({cur})",
      farePh: "örn. 2500",
      cash: "Nakit ücret",
      vs: "karşı",
      atOurRate: "{rate}¢ fiyatımızla alındığında",
      cta: "Teklif iste →",
      emptyBoth: "Mil miktarını ve nakit ücreti girin, hesabı biz yapalım.",
      emptyFare: "Bu, millerin maliyeti. Nakit ücreti de girin, hangisinin kazandığını söyleyelim.",
      win: "Miller açık ara önde: bu koltuk bir mili {seat}¢ değerliyor, bizim fiyatımız {rate}¢. Almak {saving} kazandırıyor (ücretin %{pct} kadarı).",
      ok: "Miller önde: nakit ücretten {saving} daha ucuz.",
      payCash: "Dürüst olalım, burada nakit ödeyin. {fare} ile bu koltuk bir mili {seat}¢ değerliyor, bizim {rate}¢ fiyatımızın altında.",
      numLocale: "tr-TR",
    },
  },

  fr: {
    label: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    numLocale: "fr-FR",
    page: {
      home: "Accueil",
      programs: "Programmes",
      howItWorks: "Comment ça marche",
      whyUs: "Pourquoi acheter chez buyflightmiles ?",
      faq: "Questions fréquentes",
      bestUses: "Les meilleures façons d'utiliser ces miles",
      ctaHead: "Prêt à recevoir votre devis ?",
      ctaSub: "Nous confirmons le prix avant tout paiement. Rien n'est débité sur ce site.",
      quoteHeading: "Combien coûtent les miles ?",
      quoteSub: "Calculez le prix, puis demandez votre devis gratuit. Nous confirmons votre tarif exact avant que vous payiez.",
      freeQuote: "Devis gratuit et sans engagement",
      deliveredIn: "Livraison en",
      yearsIn: "d'activité",
      ratePreConfirmed: "Tarif confirmé avant paiement",
      on: "sur",
      hours: "heures",
      bestUsesSub: "Là où ces miles valent le plus, et quand il vaut mieux payer en espèces. Testez-le contre un vrai tarif.",
      greatValue: "Excellente valeur",
      greatValueNote: "Les primes qui justifient d'acheter des miles",
      worthHead: "Acheter des miles vaut-il mieux que payer le tarif ?",
      worthSub: "Collez le prix vu dans votre recherche de vol. Si l'argent gagne, nous vous le dirons.",
    },
    fx: {
      currency: "EUR",
      note: "≈ {v} au taux de référence BCE du {d} · facturation en dollars US",
      foot: "Les montants en euros sont convertis au taux de référence BCE du {d}. La facturation se fait en dollars US.",
    },
    widget: {
      dHours: "{n} heures",
      milesLabel: "Miles",
      program: "Programme",
      howMany: "Combien de miles ?",
      est: "Coût estimé",
      rate: "Tarif",
      delivery: "Livraison",
      onQuote: "Avec le devis",
      note: "Tarif indicatif. Demandez le devis et nous confirmons le prix exact.",
      continue: "Continuer",
      back: "Changer de programme →",
      milesUnit: "miles",
      name: "Nom *",
      email: "E-mail *",
      contact: "WhatsApp / Telegram",
      contactPh: "Facultatif : comment vous répondre",
      submit: "Demander un devis",
      foot: "Le paiement se fait hors de ce site. Nous ne demandons votre numéro d'adhérent qu'une fois le devis accepté.",
      per1000: "≈ {v} pour 1 000 miles",
      range: "Minimum {min}, maximum {max}.",
      below: "La commande minimale pour {program} est de {min} miles.",
      above: "Le maximum par commande pour {program} est de {max} miles.",
      use: "Utiliser {v}",
      sending: "Envoi…",
      ok: "Merci, votre demande est enregistrée. Nous confirmons votre tarif exact et le délai sous peu.",
      errGeneric: "Une erreur est survenue. Écrivez-nous par e-mail.",
      errNetwork: "Erreur réseau. Réessayez ou écrivez-nous directement.",
      rateUnit: "¢/mile",
      saveVs: "Vous économisez face au tarif public de {v}¢",
      d24: "24 heures",
      numLocale: "fr-FR",
    },
    savings: {
      milesLabel: "Miles nécessaires pour la prime",
      fareLabel: "Tarif en espèces trouvé ({cur})",
      farePh: "ex. 2500",
      cash: "Tarif en espèces",
      vs: "contre",
      atOurRate: "Achetés à notre tarif de {rate}¢",
      cta: "Demander un devis →",
      emptyBoth: "Indiquez les miles et le tarif en espèces et nous faisons le calcul.",
      emptyFare: "Voilà le coût des miles. Ajoutez le tarif et nous vous dirons lequel gagne.",
      win: "Nette victoire des miles : ce siège valorise le mile à {seat}¢ face à notre tarif de {rate}¢. Les acheter économise {saving} ({pct}% du tarif).",
      ok: "Les miles l'emportent : {saving} de moins que le tarif en espèces.",
      payCash: "Honnêtement ? Payez en espèces ici. À {fare}, ce siège valorise le mile à {seat}¢, sous notre tarif de {rate}¢.",
      numLocale: "fr-FR",
    },
  },

  "zh-tw": {
    label: "繁體中文",
    flag: "🇹🇼",
    htmlLang: "zh-TW",
    dir: "ltr",
    numLocale: "zh-TW",
    page: {
      home: "首頁",
      programs: "航空計畫",
      howItWorks: "購買流程",
      whyUs: "為什麼向 buyflightmiles 購買？",
      faq: "常見問題",
      bestUses: "這些哩程最值得的用法",
      ctaHead: "準備好取得報價了嗎？",
      ctaSub: "我們先確認價格，本網站不會收取任何款項。",
      quoteHeading: "哩程要多少錢？",
      quoteSub: "先試算，再索取免費報價。付款前我們會確認你的確切價格。",
      freeQuote: "免費報價，無購買義務",
      deliveredIn: "入帳時間",
      yearsIn: "年經驗",
      ratePreConfirmed: "付款前確認價格",
      on: "於",
      hours: "小時",
      bestUsesSub: "這些哩程在哪裡最划算，以及什麼時候該直接付現。用真實票價試算看看。",
      greatValue: "非常划算",
      greatValueNote: "值得為它買哩程的兌換",
      worthHead: "買哩程比付現划算嗎？",
      worthSub: "把你在訂票網站看到的價格貼進來。如果付現比較好，我們會直說。",
    },
    fx: {
      currency: "TWD",
      note: "≈ {v}（{d} exchangerate-api.com 匯率）· 實際以美元計價",
      foot: "新台幣金額依 {d} 的 exchangerate-api.com 匯率換算，實際以美元結帳。",
    },
    widget: {
      dHours: "{n} 小時",
      milesLabel: "哩程",
      program: "航空計畫",
      howMany: "需要多少哩程？",
      est: "預估費用",
      rate: "單價",
      delivery: "入帳時間",
      onQuote: "報價時確認",
      note: "此為參考價。索取報價後我們會確認你的確切價格。",
      continue: "繼續",
      back: "更換計畫 →",
      milesUnit: "哩",
      name: "姓名 *",
      email: "電子郵件 *",
      contact: "WhatsApp / Telegram",
      contactPh: "選填：你希望我們如何回覆",
      submit: "索取報價",
      foot: "付款在本網站之外完成。你同意報價後，我們才會索取會員編號。",
      per1000: "每 1,000 哩約 {v}",
      range: "最低 {min}，最高 {max}。",
      below: "{program} 的最低訂購量為 {min} 哩。",
      above: "{program} 單筆訂單最高為 {max} 哩。",
      use: "使用 {v}",
      sending: "傳送中…",
      ok: "感謝你，我們已收到需求，會盡快確認確切價格與入帳時間。",
      errGeneric: "發生錯誤，請改以電子郵件與我們聯絡。",
      errNetwork: "連線錯誤。請再試一次，或直接與我們聯絡。",
      rateUnit: "¢/哩",
      saveVs: "與定價 {v}¢ 相比為你省下",
      d24: "24 小時",
      numLocale: "zh-TW",
    },
    savings: {
      milesLabel: "這趟兌換需要的哩程",
      fareLabel: "你查到的現金票價（{cur}）",
      farePh: "例如 2500",
      cash: "現金票價",
      vs: "對比",
      atOurRate: "以我們 {rate}¢ 的價格購買",
      cta: "索取報價 →",
      emptyBoth: "輸入哩程與現金票價，我們幫你算。",
      emptyFare: "這是哩程的成本。再輸入現金票價，我們告訴你哪個划算。",
      win: "哩程明顯勝出：這個座位把每哩算成 {seat}¢，我們的價格是 {rate}¢。買哩程可省下 {saving}（現金票價的 {pct}%）。",
      ok: "哩程比較划算：比現金票價便宜 {saving}。",
      payCash: "老實說，這趟直接付現。在 {fare} 之下，這個座位每哩只值 {seat}¢，低於我們 {rate}¢ 的價格。",
      numLocale: "zh-TW",
    },
  },

  "zh-hk": {
    label: "繁體中文",
    flag: "🇭🇰",
    htmlLang: "zh-HK",
    dir: "ltr",
    numLocale: "zh-HK",
    page: {
      home: "首頁",
      programs: "飛行常客計劃",
      howItWorks: "購買流程",
      whyUs: "為何向 buyflightmiles 購買？",
      faq: "常見問題",
      bestUses: "呢啲里數最抵嘅用法",
      ctaHead: "準備好攞報價未？",
      ctaSub: "我哋會先確認價格，本網站唔會收取任何款項。",
      quoteHeading: "里數要幾多錢？",
      quoteSub: "先計價，再索取免費報價。付款前我哋會確認你嘅確實價格。",
      freeQuote: "免費報價，無購買責任",
      deliveredIn: "入賬時間",
      yearsIn: "年經驗",
      ratePreConfirmed: "付款前確認價格",
      on: "於",
      hours: "小時",
      bestUsesSub: "呢啲里數喺邊度最抵，同幾時應該直接俾現金。用真實票價試吓。",
      greatValue: "非常抵",
      greatValueNote: "值得為佢買里數嘅兌換",
      worthHead: "買里數係咪抵過俾現金？",
      worthSub: "將你喺訂票網站見到嘅價錢貼入嚟。如果俾現金好啲，我哋會照直講。",
    },
    fx: {
      currency: "HKD",
      note: "≈ {v}（{d} 歐洲央行匯率）· 實際以美元計價",
      foot: "港元金額依 {d} 嘅歐洲央行匯率換算，實際以美元結帳。",
    },
    widget: {
      dHours: "{n} 小時",
      milesLabel: "里數",
      program: "飛行常客計劃",
      howMany: "需要幾多里數？",
      est: "預計費用",
      rate: "單價",
      delivery: "入賬時間",
      onQuote: "報價時確認",
      note: "此為參考價。索取報價後我哋會確認你嘅確實價格。",
      continue: "繼續",
      back: "更換計劃 →",
      milesUnit: "里數",
      name: "姓名 *",
      email: "電郵 *",
      contact: "WhatsApp / Telegram",
      contactPh: "選填：你想我哋點覆你",
      submit: "索取報價",
      foot: "付款喺本網站以外完成。你同意報價之後，我哋先會索取會員號碼。",
      per1000: "每 1,000 里數約 {v}",
      range: "最少 {min}，最多 {max}。",
      below: "{program} 嘅最低訂購量係 {min} 里數。",
      above: "{program} 單一訂單最多 {max} 里數。",
      use: "使用 {v}",
      sending: "傳送緊…",
      ok: "多謝你，我哋收到你嘅要求，會盡快確認確實價格同入賬時間。",
      errGeneric: "發生錯誤，請改用電郵聯絡我哋。",
      errNetwork: "連線錯誤。請再試一次，或直接聯絡我哋。",
      rateUnit: "¢/里",
      saveVs: "同定價 {v}¢ 相比為你慳咗",
      d24: "24 小時",
      numLocale: "zh-HK",
    },
    savings: {
      milesLabel: "今次兌換需要嘅里數",
      fareLabel: "你搵到嘅現金票價（{cur}）",
      farePh: "例如 2500",
      cash: "現金票價",
      vs: "對比",
      atOurRate: "以我哋 {rate}¢ 嘅價錢買",
      cta: "索取報價 →",
      emptyBoth: "輸入里數同現金票價，我哋幫你計。",
      emptyFare: "呢個係里數嘅成本。再輸入現金票價，我哋話你知邊個抵。",
      win: "里數明顯贏：呢個位每里計 {seat}¢，我哋嘅價錢係 {rate}¢。買里數慳到 {saving}（現金票價嘅 {pct}%）。",
      ok: "里數抵啲：平過現金票價 {saving}。",
      payCash: "老實講，今次直接俾現金。喺 {fare} 之下，呢個位每里只值 {seat}¢，低過我哋 {rate}¢ 嘅價錢。",
      numLocale: "zh-HK",
    },
  },
};

/**
 * The flag on the "English" toggle that localized pages carry back. The US
 * rather than the UK: prices are in dollars and the roster leans American.
 */
export const EN_FLAG = "🇺🇸";

/** Locales the generic [locale] route generates (everything without its own file). */
export const GENERIC_LOCALES = Object.keys(LOCALES).filter((l) => !LOCALES[l].bespoke);

/** Every locale's own name, for the language toggles on the English page. */
export const LOCALE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(LOCALES).map(([k, v]) => [k, v.label]),
);
