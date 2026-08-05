export interface BlogPost {
  slug: string
  date: string
  minutes: number
  ru: { title: string; excerpt: string; content: string[] }
  en: { title: string; excerpt: string; content: string[] }
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-for-ecommerce",
    date: "2026-01-15",
    minutes: 6,
    ru: {
      title: "AI для e-commerce: 5 процессов, которые автоматизировать первыми",
      excerpt: "Поддержка, возвраты, карточки товаров, отчёты и сегментация — где e-commerce получает максимальный эффект от AI без больших вложений.",
      content: [
        "Маркетологи e-commerce чаще всего автоматизируют всё подряд — и получают хаос вместо эффекта. Правильный порядок другой: сначала процессы с самым большим объёмом однотипных действий, потом всё остальное. Вот 5 направлений, которые окупаются быстрее всего.",
        "1. Поддержка клиентов. 60–70% обращений в интернет-магазинах — типовые вопросы: где заказ, как вернуть, какого размера брать. База знаний + RAG-чат-бот отвечают на них автоматически, а сложные вопросы передают оператору. Экономия: 4–8 часов в неделю на каждые 100 обращений.",
        "2. Обработка возвратов. Заявка на возврат — это 3–5 ручных действий в системе. AI-сценарий читает заявку из чата, проверяет условия, создаёт возврат в CRM и отправляет инструкцию клиенту. Время обработки падает с 15 минут до минуты.",
        "3. Карточки товаров. Наполнение карточек — самый трудоёмкий контент-процесс. AI генерирует черновики описаний из характеристик поставщика, а менеджер только проверяет и правит. Время на карточку сокращается на 60–80%.",
        "4. Ежедневные отчёты. Сводки по продажам, остаткам и рекламе собираются вручную каждое утро. Автоотчёт по расписанию приходит в Telegram — 2–3 часа в неделю возвращаются команде.",
        "5. Сегментация базы. AI-кластеризация клиентов по поведению находит группы для рассылок, которые ручная сегментация пропускает. Результат — рост повторных покупок без увеличения бюджета.",
        "Начните с поддержки: это процесс с самым быстрым и измеримым эффектом. Пройдите диагностику — она покажет вашу точку старта с расчётом экономии в часах.",
      ],
    },
    en: {
      title: "AI for e-commerce: 5 processes to automate first",
      excerpt: "Support, returns, product cards, reports and segmentation — where e-commerce gets the biggest AI impact without large investment.",
      content: [
        "E-commerce marketers usually try to automate everything at once — and end up with chaos instead of impact. The right order is different: start with the processes that have the highest volume of repetitive actions. These 5 areas pay back fastest.",
        "1. Customer support. 60–70% of store inquiries are routine: where is my order, how do I return, what size should I pick. A knowledge base plus RAG chatbot answers them automatically and escalates complex cases to humans. Savings: 4–8 hours per week per 100 tickets.",
        "2. Return processing. A return request means 3–5 manual actions in your system. An AI scenario reads the chat request, validates it, creates the return in your CRM and sends instructions to the customer. Processing time drops from 15 minutes to under a minute.",
        "3. Product cards. Writing product descriptions is the most time-consuming content process. AI drafts descriptions from supplier specs; your manager reviews and edits. Time per card drops 60–80%.",
        "4. Daily reports. Sales, stock and ad summaries are assembled by hand every morning. A scheduled auto-report lands in Telegram — 2–3 hours per week go back to the team.",
        "5. Customer segmentation. AI clustering by behavior finds segments for campaigns that manual segmentation misses. The result: more repeat purchases without a bigger budget.",
        "Start with support — it has the fastest, most measurable impact. Run the assessment to see your starting point with hours saved calculated.",
      ],
    },
  },
  {
    slug: "ai-for-agencies",
    date: "2026-01-08",
    minutes: 5,
    ru: {
      title: "AI для агентств и экспертов: как убрать рутину из клиентской работы",
      excerpt: "Отчёты клиентам, черновики контента, постановки задач — три сценария, которые возвращают агентствам десятки часов в неделю.",
      content: [
        "В агентствах и у экспертов-одиночек главный враг не конкуренты, а рутина: отчёты клиентам, черновики, переписка. Разбираем три сценария, которые дают самый быстрый возврат времени.",
        "1. Отчёты клиентам. Ежемесячный отчёт — это 2–4 часа на клиента. AI собирает метрики из подключённых систем, пишет сводку и выводы по шаблону агентства. Менеджер добавляет 2–3 абзаца личных комментариев. Итог: отчёт за 20 минут вместо 3 часов.",
        "2. Черновики контента и постановки. Промпты «напиши пост» дают средний результат. Рабочий процесс другой: библиотека ваших лучших материалов как референс + шаблон структуры + AI-черновик + правка эксперта. Время на единицу контента сокращается на 50–70%, качество не падает, потому что финальное слово всегда за человеком.",
        "3. Онбординг клиентов. Первые недели с новым клиентом — это десятки вопросов и документов. AI-сценарий собирает бриф по анкете, генерирует ТЗ и план первой недели. Новый клиент стартует за день, а не за неделю.",
        "Главное правило агентства: AI не заменяет экспертизу — он убирает время, потраченное не на экспертизу. Диагностика покажет, какие из этих сценариев применимы именно к вашему набору клиентов.",
      ],
    },
    en: {
      title: "AI for agencies and experts: removing client-work routine",
      excerpt: "Client reports, content drafts, briefs — three scenarios that give agencies back dozens of hours every week.",
      content: [
        "For agencies and solo experts, the biggest enemy isn't competitors — it's routine: client reports, drafts, back-and-forth. Here are three scenarios with the fastest time payback.",
        "1. Client reports. A monthly report means 2–4 hours per client. AI pulls metrics from connected systems and writes the summary and conclusions in your agency's template. Your manager adds 2–3 paragraphs of personal commentary. Result: a report in 20 minutes instead of 3 hours.",
        "2. Content drafts and briefs. Generic 'write a post' prompts give average results. A working process is different: your library of best materials as reference + structure template + AI draft + expert edit. Time per content unit drops 50–70%, and quality stays because the final word is always human.",
        "3. Client onboarding. The first weeks with a new client mean dozens of questions and documents. An AI scenario collects the brief from a questionnaire, generates the scope and week-one plan. New clients start in a day, not a week.",
        "The rule for agencies: AI doesn't replace expertise — it removes time spent on everything that isn't expertise. The assessment will show which of these scenarios fit your client mix.",
      ],
    },
  },
  {
    slug: "ai-support-rag",
    date: "2025-12-20",
    minutes: 5,
    ru: {
      title: "Автоматизация поддержки клиентов: 3 сценария с RAG",
      excerpt: "Как база знаний + векторный поиск отвечают на 60–70% типовых вопросов, оставляя сложные — людям.",
      content: [
        "Чат-боты «по промпту» отвечают неточно, потому что не знают ваших документов. Решение — RAG: retrieval augmented generation. Сначала поиск по вашей базе знаний находит релевантные куски, и только потом LLM формулирует ответ. Разбираем 3 рабочих сценария.",
        "1. Самопомощь клиентов. FAQ, инструкции и политики загружаются в базу знаний. Клиент задаёт вопрос в чате — бот отвечает на основе именно ваших документов и указывает источник. Типовые вопросы (60–70% потока) закрываются без оператора.",
        "2. Поддержка операторов. Оператор на линии не ищет ответы по 10 вкладкам: он вводит вопрос, и RAG-ассистент показывает ответ с цитатой из регламента. Среднее время ответа сокращается на 30–40%, а качество перестаёт зависеть от памяти сотрудника.",
        "3. Внутренние знания компании. Та же связка работает для HR и отделов: «какой порядок согласования отпуска», «как оформить закупку». Сотрудник получает ответ за 10 секунд с указанием документа-первоисточника.",
        "Ключевые условия успеха: документы должны быть в актуальной версии (поэтому нужна переиндексация после обновлений), а для сценария «на линии» — скорость ответа под 2–3 секунды. При этих условиях 60–70% типовых обращений уходят из ручной обработки.",
      ],
    },
    en: {
      title: "Customer support automation: 3 RAG scenarios",
      excerpt: "How a knowledge base plus vector search answers 60–70% of common questions — leaving the hard ones to humans.",
      content: [
        "Prompt-only chatbots give inaccurate answers because they don't know your documents. The fix is RAG — retrieval augmented generation: first a search over your knowledge base finds relevant chunks, then an LLM formulates the answer. Here are 3 working scenarios.",
        "1. Customer self-service. FAQs, instructions and policies go into the knowledge base. A customer asks a question in chat — the bot answers based on your documents and cites the source. Routine questions (60–70% of the ticket volume) close without an agent.",
        "2. Agent assist. An agent on the line doesn't dig through 10 tabs: they type the question, and a RAG assistant shows the answer with a quote from the policy. Average handling time drops 30–40%, and quality stops depending on staff memory.",
        "3. Internal company knowledge. The same stack works for HR and departments: 'what's the vacation approval flow', 'how to file a purchase request'. An employee gets an answer in 10 seconds with the source document cited.",
        "Key success conditions: documents must stay current (hence reindexing after updates), and for the on-line scenario you need 2–3 second latency. With these in place, 60–70% of routine tickets leave manual processing.",
      ],
    },
  },
]
