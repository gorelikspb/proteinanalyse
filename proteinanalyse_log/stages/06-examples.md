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

**Скриншоты**:
- ru/01-main-page.png / en/01-main-page.png - Главная страница с примером анализа ДНК
- ru/02-gc-calculator.png / en/02-gc-calculator.png - GC калькулятор с примером последовательности
- ru/03-reverse-complement.png / en/03-reverse-complement.png - Reverse complement с примером
- ru/04-orf-finder.png / en/04-orf-finder.png - ORF finder с найденным ORF
- ru/05-protein-mw-calculator.png / en/05-protein-mw-calculator.png - Protein MW калькулятор с примером
- ru/06-dna-translation.png / en/06-dna-translation.png - DNA translation с примером трансляции
