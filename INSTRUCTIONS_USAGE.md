# 📦 Использование инструкций в новых проектах

## Как это работает

1. **Инструкции хранятся в папке `instructions/`** - локально, не в Git
2. **Архив `instructions.zip`** - для переноса в новые проекты
3. **Проверка перед push** - скрипт не даст запушить инструкции в публичный репо

## 🚀 Использование в новом проекте

### Шаг 1: Распакуйте архив

```powershell
# В корне нового проекта
Expand-Archive -Path instructions.zip -DestinationPath . -Force
```

Или просто распакуйте `instructions.zip` в корень проекта.

### Шаг 2: Инструкции готовы к использованию

Теперь у вас есть:
- `instructions/GITHUB_SETUP.md` - настройка GitHub CLI
- `instructions/PUBLIC_REPO_SETUP.md` - настройка публичного репо
- Другие инструкции

### Шаг 3: Настройте проверку (опционально)

**Windows:**
```powershell
Copy-Item pre-push-check.ps1 .git\hooks\pre-push
```

**Linux/Mac:**
```bash
cp pre-push-check.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

Теперь перед каждым push будет автоматическая проверка.

## ✅ Проверка перед push

Перед push в публичный репозиторий запустите:

**Windows:**
```powershell
.\pre-push-check.ps1
```

**Linux/Mac:**
```bash
./pre-push-check.sh
```

Скрипт проверит:
- Является ли репозиторий публичным
- Не пытаетесь ли вы запушить `instructions/`
- Есть ли `instructions/` в `.gitignore`

## 🔄 Обновление инструкций

Если обновили инструкции:

1. Создайте новый архив:
   ```powershell
   Compress-Archive -Path instructions\* -DestinationPath instructions.zip -Force
   ```

2. Храните `instructions.zip` отдельно (не в репозитории)

3. Используйте в новых проектах

## 📋 Что в архиве

- `GITHUB_SETUP.md` - настройка GitHub CLI
- `PUBLIC_REPO_SETUP.md` - инструкции по публичному репо
- `README.md` - описание папки инструкций
- Другие приватные инструкции

## ⚠️ Важно

- **НЕ коммитьте** `instructions/` в публичный репозиторий
- **НЕ коммитьте** `instructions.zip` (он уже в репо, но можно добавить в .gitignore)
- Храните архив отдельно для использования в новых проектах

---

**Готово!** Теперь инструкции защищены от случайной публикации.

