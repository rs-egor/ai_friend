# Настройка Stripe для AI Friend

## 📋 Что нужно сделать

### Шаг 1: Создайте аккаунт Stripe

1. Зарегистрируйтесь на https://stripe.com
2. Переключитесь в **Test Mode** (для тестирования)
3. Перейдите в **Dashboard** → **Developers** → **API keys**

---

### Шаг 2: Получите API ключи

В разделе **API keys** скопируйте:

```
Publishable key: pk_test_...
Secret key: sk_test_...
```

---

### Шаг 3: Создайте продукты и цены

1. Перейдите в **Products** → **Add product**

2. Создайте первый продукт (Monthly):
   ```
   Name: AI Friend Premium Monthly
   Description: Unlimited messages + priority support
   Pricing: Subscription → $9.99/month
   ```

3. Создайте второй продукт (Yearly):
   ```
   Name: AI Friend Premium Yearly
   Description: Unlimited messages + priority support
   Pricing: Subscription → $99.99/year (save 17%)
   ```

4. Скопируйте **Price IDs**:
   - Monthly: `price_...`
   - Yearly: `price_...`

---

### Шаг 4: Настройте переменные окружения

Скопируйте `.env.example` в `.env` в папке `backend`:

```bash
cd backend
cp .env.example .env
```

Заполните `.env`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_51ABC...
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
STRIPE_WEBHOOK_SECRET=whsec_...  # заполните позже
STRIPE_PRICE_ID_MONTHLY=price_1ABC...
STRIPE_PRICE_ID_YEARLY=price_1XYZ...
```

---

### Шаг 5: Настройте Webhook

Stripe будет отправлять уведомления об оплате на ваш сервер.

#### Для локальной разработки:

1. Установите Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (через winget)
   winget install stripe-cli
   
   # Или скачайте с https://github.com/stripe/stripe-cli/releases
   ```

2. Запустите forwarding:
   ```bash
   stripe listen --forward-to localhost:8000/api/subscription/webhook
   ```

3. Скопируйте webhook secret из вывода:
   ```
   Your webhook signing secret is: whsec_...
   ```

4. Добавьте в `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### Для production (Render):

1. В Stripe Dashboard перейдите в **Developers** → **Webhooks**

2. Нажмите **Add endpoint**

3. Заполните:
   ```
   Endpoint URL: https://your-render-url.onrender.com/api/subscription/webhook
   
   Events to send:
   ✓ checkout.session.completed
   ✓ customer.subscription.created
   ✓ customer.subscription.updated
   ✓ customer.subscription.deleted
   ```

4. Скопируйте **Signing secret** и добавьте в `.env` на Render

---

### Шаг 6: Задеплойте изменения

```bash
git add .
git commit -m "feat: Stripe integration for subscription payments"
git push
```

---

## 🧪 Тестирование

### Тестовые карты

Stripe предоставляет тестовые карты:

| Карта | Номер | Результат |
|-------|-------|-----------|
| Успешная оплата | 4242 4242 4242 4242 | ✅ Подписка активирована |
| Отклонена | 4000 0000 0000 0002 | ❌ Оплата отклонена |
| Требует 3D Secure | 4000 0027 6000 3184 | 🔐 Дополнительная проверка |

**Данные карты:**
- CVC: любые 3 цифры (например, 123)
- Дата: любая будущая (например, 12/34)
- ZIP: любые 5 цифр

---

### Проверка работы

1. Откройте сайт: https://ai-friend-eight.vercel.app
2. Зарегистрируйтесь / войдите
3. Отправьте 5 сообщений
4. На 6-е сообщение появится модальное окно подписки
5. Нажмите **Monthly** или **Yearly**
6. Перенаправит на Stripe Checkout
7. Введите тестовую карту `4242 4242 4242 4242`
8. После оплаты вернётесь на сайт с активной подпиской

---

## 📡 Webhook события

Stripe отправляет следующие события:

| Событие | Описание |
|---------|----------|
| `checkout.session.completed` | Пользователь успешно оплатил |
| `customer.subscription.created` | Подписка создана |
| `customer.subscription.updated` | Подписка обновлена |
| `customer.subscription.deleted` | Подписка отменена |

---

## 🔧 Управление подпиской

### Stripe Customer Portal

Пользователи могут управлять подпиской через Stripe Portal:

```
GET /api/subscription/portal
```

Возвращает URL для перенаправления в портал, где можно:
- Отменить подписку
- Изменить план
- Обновить карту
- Посмотреть историю платежей

---

## 🚀 Production checklist

- [ ] Переключить Stripe в **Live Mode**
- [ ] Получить **Live API keys**
- [ ] Создать **Live Products** с Price IDs
- [ ] Настроить **Live Webhook** endpoint
- [ ] Обновить переменные окружения на Render
- [ ] Протестировать с реальной картой
- [ ] Включить HTTPS (автоматически на Render)

---

## 🛠️ Troubleshooting

### Ошибка "Price ID не настроен"

Проверьте, что Price IDs указаны в `.env`:
```env
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
```

### Webhook не работает

1. Проверьте, что endpoint доступен:
   ```bash
   curl https://your-render-url.onrender.com/api/subscription/webhook
   ```

2. Проверьте логи на Render

3. Убедитесь, что webhook secret правильный

### Ошибка CORS

Убедитесь, что `FRONTEND_URL` в `.env` совпадает с вашим доменом:
```env
FRONTEND_URL=https://ai-friend-eight.vercel.app
```

---

## 💰 Стоимость Stripe

Stripe берёт комиссию с каждой транзакции:

**Стандартные тарифы (US):**
- 2.9% + $0.30 за успешную транзакцию
- Для подписок: дополнительно 0.5%

**Пример:**
- Подписка $9.99/мес
- Комиссия Stripe: ~$0.59
- Вы получаете: ~$9.40

---

## 📚 Документация

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/build-subscription)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
