import React, { useState } from 'react'

export default function Checkout({ orders, onOrderComplete, onBack, assetsVersion }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  })

  const [errors, setErrors] = useState({})

  const calculateTotal = () => {
    let total = 0
    orders.forEach(item => {
      const quantity = item.quantity || 1
      total += parseFloat(item.price) * quantity
    })
    return total
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона'
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const order = {
      id: Date.now(),
      items: orders,
      customer: formData,
      total: calculateTotal(),
      date: new Date().toISOString(),
      status: 'pending'
    }

    onOrderComplete(order)
  }

  const total = calculateTotal()

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Оформление заказа</h1>
          <button className="back-btn" onClick={onBack}>
            ← Назад к корзине
          </button>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Ваши данные</h2>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Введите ваше имя"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+7 (___) ___-__-__"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="comment">Комментарий к заказу</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Особые пожелания, время доставки и т.д."
                />
              </div>

              <button type="submit" className="checkout-submit-btn">
                Перейти к доставке
              </button>
            </form>
          </div>

          <div className="checkout-summary-section">
            <h2>Ваш заказ</h2>
            <div className="order-items">
              {orders.map(item => {
                const quantity = item.quantity || 1
                const itemTotal = parseFloat(item.price) * quantity
                return (
                  <div key={item.id} className="order-item-summary">
                    <div className="order-item-info">
                      <img src={`/img/${item.img}?v=${assetsVersion}`} alt={item.title} />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{quantity} шт. × {item.price}₽</p>
                      </div>
                    </div>
                    <div className="order-item-price">
                      {itemTotal.toFixed(0)}₽
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="order-total">
              <div className="total-line">
                <span>Товары:</span>
                <span>{total.toFixed(0)}₽</span>
              </div>
              <div className="total-line">
                <span>Доставка:</span>
                <span>Бесплатно</span>
              </div>
              <div className="total-line total-final">
                <span>Итого:</span>
                <span>{total.toFixed(0)}₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


