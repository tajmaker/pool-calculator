# Shopify Integration Guide - Pool Calculator

## Обзор

Калькулятор бассейнов теперь поддерживает полное админское управление через Shopify. Админ может управлять статусами карточек и дефолтными выборами для каждого шага.

## Структура данных

### Поля карточек

Каждая карточка имеет следующие поля:

- `id` - уникальный идентификатор
- `title` - название карточки
- `desc` - описание
- `img` - путь к изображению
- `included` - включено в базовую стоимость (true/false)
- `default` - выбирается по умолчанию (true/false)
- `badge` - бейдж "Included" (опционально)
- `price` - цена опции (0 для included)
- `group` - группа (для finishes: "coping" или "internal")

### Приоритет выбора

1. **included: true** - карточка включена в базовую стоимость
2. **default: true** - карточка выбирается по умолчанию
3. **Ничего** - пользователь выбирает сам

## Шаги калькулятора

### Шаг 0: Material
- **Массив**: `materialOptions`
- **Выбор**: одна карточка
- **Примеры**: Fibreglass (default), Concrete, Vinyl

### Шаг 1: Design
- **Массив**: `fibreglassModels` (для fibreglass) или `concreteShapes` (для concrete)
- **Выбор**: одна карточка
- **Примеры**: Eden Center Steps (default), The Stride, Free Form Pool

### Шаг 2: Equipment
- **Массив**: `equipmentOptions`
- **Выбор**: одна карточка
- **Примеры**: Basic (included), Intermediate, Family Size

### Шаг 3: Finishes
- **Массив**: `finishesOptions`
- **Группы**: coping, internal
- **Выбор**: по одной карточке из каждой группы
- **Примеры**: Concrete Pool Edge (included), Natural Stone, Glass Mosaic (included)

### Шаг 4: Hardscape
- **Массив**: `hardscapeOptions`
- **Выбор**: одна карточка
- **Примеры**: Honed Concrete, Natural Stone, Pavers

### Шаг 5: Cover
- **Массив**: `coverOptions`
- **Выбор**: одна карточка
- **Примеры**: Solar Bubble Cover, Automatic Pool Cover

### Шаг 6: Amenities
- **Массив**: `amenitiesOptions`
- **Выбор**: множественный выбор
- **Примеры**: Bubblers, Fire Pits, LED Waterbowls

### Шаг 7: Included
- **Массив**: `includedOptions`
- **Выбор**: информационный шаг (все карточки included)
- **Примеры**: Excavation, Reinforced Steel, Plumbing & Electric

### Шаг 8: Planning
- **Массив**: `planningOptions`
- **Выбор**: множественный выбор
- **Примеры**: Permits, Pool Fence, HOA

### Шаг 9: Review
- **Выбор**: без карточек (итоговый шаг)

## Функции для Shopify

### Экспорт настроек
```javascript
const settings = exportSettingsForShopify();
```

### Импорт настроек
```javascript
importSettingsFromShopify(settings);
```

### Примеры управления

```javascript
// Сделать Concrete материал дефолтным
setConcreteAsDefault();

// Сделать The Stride модель дефолтной
setTheStrideAsDefault();

// Сделать Free Form форму дефолтной
setFreeFormAsDefault();

// Сделать Intermediate оборудование дефолтным
setIntermediateAsDefault();

// Сделать Natural Stone coping included
setNaturalStoneAsIncluded();

// Установить Pavers как дефолтный hardscape
setPaversAsDefaultHardscape();

// Сделать Automatic cover дефолтным
setAutomaticCoverAsDefault();

// Установить дефолтные amenities
setDefaultAmenities();

// Установить дефолтные planning опции
setDefaultPlanning();
```

## Структура для админки Shopify

```javascript
const shopifyAdminStructure = {
  material: {
    step: 0,
    title: "Material",
    options: materialOptions
  },
  design: {
    step: 1,
    title: "Design",
    groups: {
      fibreglass: { title: "Fibreglass Models", options: [...] },
      concrete: { title: "Concrete Shapes", options: [...] }
    }
  },
  equipment: {
    step: 2,
    title: "Equipment",
    options: equipmentOptions
  },
  finishes: {
    step: 3,
    title: "Finishes",
    groups: {
      coping: { title: "Coping Material", options: [...] },
      internal: { title: "Internal Finish", options: [...] }
    }
  },
  hardscape: {
    step: 4,
    title: "Hardscape",
    options: hardscapeOptions
  },
  cover: {
    step: 5,
    title: "Cover",
    options: coverOptions
  },
  amenities: {
    step: 6,
    title: "Amenities",
    options: amenitiesOptions
  },
  included: {
    step: 7,
    title: "What's Included",
    options: includedOptions
  },
  planning: {
    step: 8,
    title: "Planning",
    options: planningOptions
  }
};
```

## Интеграция с Shopify

### 1. Создание админского интерфейса
- Используйте `shopifyAdminStructure` для создания форм
- Позвольте админу редактировать `included`, `default`, `badge`, `price`
- Сохраняйте изменения через Shopify API

### 2. Синхронизация данных
- Экспортируйте настройки: `exportSettingsForShopify()`
- Импортируйте изменения: `importSettingsFromShopify(settings)`
- Обновляйте массивы опций при изменении настроек

### 3. Валидация
- Убедитесь, что только одна карточка имеет `default: true` в каждой группе
- Проверьте, что `included: true` карточки имеют `price: 0`
- Валидируйте уникальность `id` карточек

## Примеры использования

### Сценарий 1: Изменение дефолтного материала
```javascript
// Админ хочет сделать Concrete дефолтным вместо Fibreglass
setConcreteAsDefault();
// Fibreglass остается доступным, но не выбирается по умолчанию
```

### Сценарий 2: Изменение дефолтной модели
```javascript
// Админ хочет сделать The Stride дефолтной моделью
setTheStrideAsDefault();
// Eden Center Steps остается доступной, но не выбирается по умолчанию
```

### Сценарий 3: Добавление нового included элемента
```javascript
// Админ хочет включить Natural Stone в базовую стоимость
setNaturalStoneAsIncluded();
// Natural Stone становится included и default
```

### Сценарий 4: Установка дефолтных amenities
```javascript
// Админ хочет предвыбрать популярные amenities
setDefaultAmenities();
// Bubblers, Fire Pits, LED Waterbowls выбираются автоматически
```

### Сценарий 5: Изменение цен
```javascript
// Админ изменяет цену через Shopify админку
const settings = {
  equipment: [{
    id: "intermediate",
    price: 15000, // новая цена
    included: false,
    default: false
  }]
};
importSettingsFromShopify(settings);
```

## Технические детали

### Функция initializeDefaultSelections()
Автоматически выбирает карточки при первом входе в шаг:
1. Ищет карточку с `included: true`
2. Если не найдена, ищет карточку с `default: true`
3. Если не найдена, ничего не выбирает

### Расчет стоимости
- `included: true` карточки имеют цену 0
- `default: true` карточки учитываются в расчете по их `price`
- Пользователь может изменить выбор в любой момент

### Совместимость
- Обратная совместимость с существующими данными
- Поле `default` по умолчанию `false` для всех карточек
- Существующие `included` карточки автоматически получают `default: true`

### Особенности для разных типов шагов

#### Одиночный выбор (Material, Equipment, Hardscape, Cover)
- Только одна карточка может иметь `default: true`
- Приоритет: `included` > `default` > ничего

#### Множественный выбор (Amenities, Planning)
- Несколько карточек могут иметь `default: true`
- Все `default: true` карточки выбираются автоматически

#### Группированный выбор (Finishes)
- Для каждой группы (coping, internal) своя логика
- В каждой группе приоритет: `included` > `default` > ничего

#### Информационный шаг (Included)
- Все карточки `included: true` по умолчанию
- Админ может управлять `default` для показа 