# 🔧 Настройка GitHub CLI для gorelikspb

## 1. Установка GitHub CLI

**Автоматическая установка (AI-ассистент):**
AI-ассистент может автоматически установить GitHub CLI при необходимости:
```powershell
winget install --id GitHub.cli --accept-package-agreements --accept-source-agreements
```

**Ручная установка (Windows через winget):**
```powershell
winget install --id GitHub.cli
```

**Или скачайте:** https://cli.github.com/

## 2. Авторизация

```powershell
gh auth login
```

Выберите:
- **GitHub.com**
- **HTTPS**
- **Yes** для аутентификации через браузер
- **Login with a web browser**
- Скопируйте код и вставьте в браузере

## 3. Проверка

```powershell
gh auth status
```

Должно показать: `Logged in to github.com as gorelikspb`

## 4. Готово!

Теперь можно использовать:
- `gh repo create` - создать репозиторий
- `git push` - пушить код (автоматически использует gh)

## 5. Автоматизация для AI-ассистента

**Предпочтение**: AI-ассистент должен автоматически устанавливать GitHub CLI при необходимости, если он не установлен.

**Команда для установки:**
```powershell
winget install --id GitHub.cli --accept-package-agreements --accept-source-agreements
```

**После установки может потребоваться:**
- Перезапуск терминала или обновление PATH
- Авторизация через `gh auth login`

---

**Ваш аккаунт:** `gorelikspb`  
**GitHub:** https://github.com/gorelikspb

