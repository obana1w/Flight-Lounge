# FlightLounge — Design Requirements

> Элегантный хай-тек дизайн для веб-приложения прослушивания авиационных переговоров

---

## 📋 Обзор проекта

**Название:** FlightLounge  
**Концепция:** Премиум минималистичный интерфейс для прослушивания переговоров диспетчеров и пилотов в реальном времени  
**Стиль:** Элегантный хай-тек, бизнес-лаундж аэропорта  
**Вдохновение:** Apple Music + Tesla Model S + Premium Airport Lounge

---

## 🎨 Цветовая палитра

### Основные цвета

```
Фон (Background):        #0B1120  (глубокий синий)
Карточки (Cards):        #141B2D  (чуть светлее)
Акцент (Accent):         #3B82F6  (спокойный синий)
Градиент (Gradient):     #3B82F6 → #6366F1
Текст основной (Text):   #F8FAFC  (почти белый)
Текст серый (Muted):     #64748B  (метаданные)
Границы (Border):        #1E293B  (тонкие линии)
```

### Дополнительные цвета

```
Success/Live:   #10B981  (зеленый для статуса Live)
Warning:        #F59E0B  (для важных уведомлений)
Error:          #EF4444  (ошибки)
```

---

## 🖋️ Типографика

### Основной шрифт: Inter

**Размеры:**
- H1 (Hero): `32px` / `2rem` — Inter Bold
- H2 (Sections): `24px` / `1.5rem` — Inter SemiBold  
- H3 (Cards): `20px` / `1.25rem` — Inter SemiBold
- Body: `16px` / `1rem` — Inter Regular
- Small: `14px` / `0.875rem` — Inter Regular
- Caption: `12px` / `0.75rem` — Inter Regular

### Дополнительный шрифт: JetBrains Mono

**Использование:** Числовые данные, частоты, технические параметры

```
118.1 MHz  •  120.5 MHz  •  125.2 MHz
```

---

## 🎬 Анимации

### 1. Subtle Lift (карточки при hover)

```css
.card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
```

### 2. Fade Scale (появление элементов)

```css
@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Применение: 0.4s ease-out */
```

### 3. Breathing (Live индикатор)

```css
@keyframes breathe {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.6; 
    transform: scale(0.95); 
  }
}

/* Применение: 3s infinite — медленно и спокойно */
```

### 4. Progress Shimmer (загрузка)

```css
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

---

## 📐 Структура главной страницы

### Header (фиксированный)

```
┌─────────────────────────────────────────┐
│  ✈ FlightLounge              [  Поиск] │
└─────────────────────────────────────────┘
```

**Характеристики:**
- Position: sticky
- Background: rgba(11, 17, 32, 0.95)
- Backdrop-filter: blur(20px)
- Height: 64px
- Border-bottom: 1px solid #1E293B

### Hero секция

```
Слушайте авиационные переговоры
в реальном времени

Москва • Санкт-Петербург • Новосибирск

[Начать слушать →]
```

**Характеристики:**
- Padding: 80px 0
- Text-align: center
- H1: 48px, line-height: 1.2
- Button: Gradient background

### Сетка карточек трансляций

```
┌────────────┐  ┌────────────┐  ┌────────────┐
│    Card    │  │    Card    │  │    Card    │
└────────────┘  └────────────┘  └────────────┘
```

**Layout:**
- Desktop (1200px+): 3 колонки
- Tablet (768-1199px): 2 колонки
- Mobile (<768px): 1 колонка
- Gap: 24px

---

## 🎵 Аудио-плеер (главный компонент)

### Визуальная структура

```
┌──────────────────────────────────────┐
│                                      │
│         ULLI — Санкт-Петербург       │  ← Название
│                                      │
│         ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲        │  ← Визуализация
│        ╱ ▁▂▃▅▆▇▆▅▃▂▁     ╲       │
│       ╱                    ╲      │
│                                      │
│    [▶]   [■]   ───────●──────  🔊   │  ← Контролы
│                                      │
│    ● 4                         Live  │  ← Метаданные
│                                      │
└──────────────────────────────────────┘
```

### Технические характеристики

**Размеры:**
- Width: 600px (desktop), 100% (mobile)
- Padding: 40px
- Border-radius: 20px
- Border: 1px solid #1E293B

**Эффекты:**
- Glassmorphism: backdrop-filter blur(20px)
- Box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2)

**Визуализация волн:**
- Цвет: #3B82F6
- Толщина линий: 1px
- Анимация: плавное движение вверх-вниз
- Высота: 120px

---

## 🎴 Карточка трансляции

### Визуальная структура

```
┌────────────────────┐
│                    │
│         ✈          │  ← Иконка (40px)
│                    │
│       ULLI         │  ← Код (20px Bold)
│  Санкт-Петербург   │  ← Город (14px)
│                    │
│  ● 4    Live       │  ← Статус
│                    │
│   Слушать  →       │  ← Ссылка
│                    │
└────────────────────┘
```

### CSS спецификация

```css
.card {
  background: #141B2D;
  border: 1px solid #1E293B;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #3B82F6;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

---

## 💎 Премиум эффекты

### Glassmorphism (матовое стекло)

```css
.glass {
  background: rgba(20, 27, 45, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### Градиенты для кнопок

```css
background: linear-gradient(135deg, 
  #3B82F6 0%, 
  #6366F1 100%
);
```

### Система теней (Elevation)

```css
/* Низкий уровень */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Средний уровень */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

/* Высокий уровень */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
```

---

## 📏 Spacing System

```
4px   → Мелкие отступы
8px   → Иконки, маленькие элементы
16px  → Стандартный padding
24px  → Между секциями
32px  → Внутри карточек
48px  → Между блоками
64px  → Большие разделы
```

---

## 🎨 Иконки

### Стиль
- **Тип:** Линейные (outline)
- **Толщина:** 1.5px
- **Размер:** 24px (стандарт)
- **Закругления:** rounded corners

### Библиотека
**Lucide Icons** — минималистичные иконки

### Основные иконки

```
✈  → Самолет (plane)
●  → Live точка (circle filled)
▶  → Play (play)
■  → Stop (square)
🔊 → Громкость (volume-2)
→  → Стрелка (arrow-right)
🔍 → Поиск (search)
⚙  → Настройки (settings)
```

---

## 🎯 UI элементы

### Кнопки

**Primary (главная кнопка):**
```css
.btn-primary {
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}
```

**Secondary (вторичная кнопка):**
```css
.btn-secondary {
  background: transparent;
  border: 1px solid #3B82F6;
  color: #3B82F6;
  padding: 12px 24px;
  border-radius: 8px;
}
```

### Статусы

**Live индикатор:**
```css
.status-live {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #10B981;
}

.status-live::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  animation: breathe 3s infinite;
}
```

**Offline индикатор:**
```css
.status-offline {
  color: #64748B;
}
```

### Progress Bar

```css
.progress {
  width: 100%;
  height: 4px;
  background: #1E293B;
  border-radius: 2px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #6366F1);
  border-radius: 2px;
  transition: width 0.3s ease;
}
```

---

## 📱 Адаптивный дизайн

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* 1 колонка */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1199px) {
  /* 2 колонки */
}

/* Desktop */
@media (min-width: 1200px) {
  /* 3 колонки */
}
```

### Адаптация плеера

**Desktop:**
- Width: 600px
- Padding: 40px

**Mobile:**
- Width: 100%
- Padding: 24px
- Уменьшенные элементы управления

---

## 🎨 Референсы для вдохновения

### Продукты

1. **Apple Music Web Player**
   - Минимализм главного плеера
   - Типографика и отступы

2. **Tesla Model S Interface**
   - Премиум хай-тек без неона
   - Чистота интерфейса

3. **Stripe Dashboard**
   - Элегантность темной темы
   - Система spacing

4. **Linear App**
   - Современный минимализм
   - Анимации

5. **Vercel Dashboard**
   - Темная тема
   - Тонкие акценты

### Dribbble поиск

- "Minimal dark dashboard"
- "Premium audio player clean"
- "Flight app minimalist"
- "SAS airlines" by Gleb Kuznetsov
- "Aircraft Monitoring Web UI" by Nixtio

---

## 🛠️ Технологический стек

### Frontend Framework
- **React** (рекомендуется) или Next.js

### Styling
- **Tailwind CSS** — быстрая разработка с custom config
- или **Styled Components**

### UI Components
- **shadcn/ui** — минималистичные компоненты
- **Radix UI** — для accessibility

### Иконки
- **Lucide Icons** — линейные иконки

### Анимации
- **CSS Animations** — для базовых эффектов
- **Framer Motion** (опционально) — для сложных переходов

### Аудио
- **HTML5 Audio API**
- **Howler.js** (опционально) — для продвинутого управления

---

## ✅ Финальный чеклист

```
Design Principles:
[✓] Премиум минимализм
[✓] Много белого пространства
[✓] Темная, но не черная палитра
[✓] Спокойный синий акцент (НЕ неон)
[✓] Мягкие тени и градиенты
[✓] Плавные анимации (0.3-0.4s)

UI Elements:
[✓] Линейные иконки
[✓] Glassmorphism эффекты
[✓] Тонкие границы
[✓] Большие отступы (32-48px)
[✓] Скругленные углы (12-20px)
[✓] Hover эффекты с lift

Typography:
[✓] Inter для основного текста
[✓] JetBrains Mono для данных
[✓] Четкая иерархия размеров
[✓] Достаточные межстрочные интервалы

Responsiveness:
[✓] Mobile-first подход
[✓] Адаптивная сетка
[✓] Оптимизация для touch
```

---

## 🎯 Ключевые принципы

1. **Минимализм** — убрать всё лишнее
2. **Элегантность** — как в бизнес-классе
3. **Функциональность** — каждый элемент служит цели
4. **Технологичность** — современно, но не агрессивно
5. **Комфорт** — приятно находиться долго

**Вайб:** Lufthansa Business Lounge + Apple Music + Tesla Interface

---

## 📝 Примечания

- Все анимации должны быть **плавными** (ease-out)
- Hover эффекты — **тонкие**, не агрессивные
- Цвета — **приглушенные**, не кричащие
- Отступы — **щедрые**, не тесно
- Акценты — **минимальные**, где действительно нужно

**Главное правило:** Когда сомневаешься — убери, а не добавь.

---

*Документ создан для проекта FlightLounge*  
*Версия: 1.0*  
*Дата: Февраль 2026*
