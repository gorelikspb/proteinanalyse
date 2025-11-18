# Этап 6: Добавление примеров последовательностей

**Что было**: Пользователям нужно было вводить последовательности вручную, чтобы понять, как работает инструмент.

**Решение**: На каждой странице добавлена кнопка "Load Example" с предустановленными примерами:
1. **Sequence Analyzer (index.html)**: 
   - DNA пример: `ATGCGTACCTGACTGGAAGGCTTACGATGCTTGAAGACCTGA`
   - Protein пример: `MKTFFVAGLVLAGALAAPALA`
2. **GC Calculator**: `GCGGATCCGTCGATGCGGCCGTTAGCGCGATCATGGCCGCA`
3. **Reverse Complement**: `ATGACCGTAAGCTTGGATCCGATTAAGC`
4. **ORF Finder**: `ATGAAACGTTTGACCTGAAGGTTCTACTGGAATAG`
5. **Protein MW Calculator**: `MQDRVKRPMNAFIVWSRDQRRKMALEN`
6. **DNA Translation**: `ATGGCTTCTGACCTGAAGGACATCGTGAACTGG`

**Почему такое решение**:
- Пользователи могут сразу увидеть, как работает инструмент
- Не нужно искать тестовые последовательности
- Улучшает UX и снижает барьер входа

**Плюсы**:
- ✅ Улучшенный UX
- ✅ Быстрое понимание функционала
- ✅ Нет необходимости искать примеры

**Минусы**:
- ❌ Немного больше кода на каждой странице

**Подводные камни**:
- Важно было выбрать репрезентативные примеры
- Примеры должны демонстрировать ключевой функционал каждой страницы

**Что сделано**:
- ✅ Добавлена кнопка "Load Example" на каждой странице
- ✅ Подобраны репрезентативные примеры для каждого инструмента

Примеры позволяют пользователям сразу увидеть, как работает каждый инструмент:

**Главная страница (Sequence Analyzer)**:
![Главная страница с примером анализа ДНК (RU)](screenshots/ru/01-main-page.png)
![Main page with DNA analysis example (EN)](screenshots/en/01-main-page.png)

**GC Calculator**:
![GC калькулятор с примером последовательности (RU)](screenshots/ru/02-gc-calculator.png)
![GC calculator with sequence example (EN)](screenshots/en/02-gc-calculator.png)

**Reverse Complement**:
![Reverse complement с примером (RU)](screenshots/ru/03-reverse-complement.png)
![Reverse complement with example (EN)](screenshots/en/03-reverse-complement.png)

**ORF Finder**:
![ORF finder с найденным ORF (RU)](screenshots/ru/04-orf-finder.png)
![ORF finder with detected ORF (EN)](screenshots/en/04-orf-finder.png)

**Protein MW Calculator**:
![Protein MW калькулятор с примером (RU)](screenshots/ru/05-protein-mw-calculator.png)
![Protein MW calculator with example (EN)](screenshots/en/05-protein-mw-calculator.png)

**DNA Translation**:
![DNA translation с примером трансляции (RU)](screenshots/ru/06-dna-translation.png)
![DNA translation with translation example (EN)](screenshots/en/06-dna-translation.png)
