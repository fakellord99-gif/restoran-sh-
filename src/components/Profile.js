import React, { useState, useEffect } from 'react'
import { FaUser, FaPhone, FaEnvelope, FaStar, FaHistory, FaGift, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import Database from '../services/database'

export default function Profile({ currentUser, onUserUpdate }) {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    bonusPoints: 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: ''
  })

  useEffect(() => {
    loadUserData()
  }, [currentUser])

  const loadUserData = () => {
    if (!currentUser) return

    const userData = Database.getUserById(currentUser.id)
    setUser(userData)
    
    const userOrders = Database.getUserOrders(currentUser.id)
    setOrders(userOrders)

    const stats = Database.getUserStatistics(currentUser.id)
    setStatistics(stats)

    setEditFormData({
      name: userData.name,
      phone: userData.phone || ''
    })
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      setEditFormData({
        name: user.name,
        phone: user.phone || ''
      })
    }
  }

  const handleInputChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = () => {
    Database.updateUser(user.id, editFormData)
    loadUserData()
    setIsEditing(false)
    if (onUserUpdate) {
      onUserUpdate(Database.getUserById(user.id))
    }
  }

  const getStatusText = (status) => {
    const statuses = {
      'new': 'Новый',
      'processing': 'В обработке',
      'delivering': 'Доставляется',
      'completed': 'Завершен',
      'cancelled': 'Отменен'
    }
    return statuses[status] || status
  }

  const getStatusClass = (status) => {
    return `order-status status-${status}`
  }

  const getLoyaltyLevel = (points) => {
    if (points >= 5000) return { level: 'Platinum', icon: '💎', color: '#b9f2ff' }
    if (points >= 3000) return { level: 'Gold', icon: '🥇', color: '#ffd700' }
    if (points >= 1000) return { level: 'Silver', icon: '🥈', color: '#c0c0c0' }
    return { level: 'Bronze', icon: '🥉', color: '#cd7f32' }
  }

  if (!user) {
    return <div className="profile-page">Загрузка...</div>
  }

  const loyaltyInfo = getLoyaltyLevel(statistics.bonusPoints)

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser size={60} />
          </div>
          <div className="profile-info">
            {!isEditing ? (
              <>
                <h1>{user.name}</h1>
                <p className="profile-email"><FaEnvelope /> {user.email}</p>
                {user.phone && <p className="profile-phone"><FaPhone /> {user.phone}</p>}
                <button onClick={handleEditToggle} className="btn-edit-profile">
                  <FaEdit /> Редактировать профиль
                </button>
              </>
            ) : (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Имя</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                <div className="edit-buttons">
                  <button onClick={handleSaveProfile} className="btn-save">
                    <FaSave /> Сохранить
                  </button>
                  <button onClick={handleEditToggle} className="btn-cancel">
                    <FaTimes /> Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section bonus-section">
            <h2><FaGift /> Бонусная программа</h2>
            <div className="loyalty-card" style={{ borderColor: loyaltyInfo.color }}>
              <div className="loyalty-level">
                <span className="loyalty-icon">{loyaltyInfo.icon}</span>
                <span className="loyalty-name">{loyaltyInfo.level}</span>
              </div>
              <div className="bonus-points">
                <div className="points-value">{statistics.bonusPoints}</div>
                <div className="points-label">бонусных баллов</div>
              </div>
            </div>
            <div className="bonus-info">
              <p>💰 С каждого заказа начисляется 5% бонусами</p>
              <p>🎁 1 бонус = 1 рубль при следующем заказе</p>
              <p>⭐ Повышайте уровень и получайте больше привилегий!</p>
            </div>
            <div className="loyalty-progress">
              <h3>До следующего уровня:</h3>
              {loyaltyInfo.level === 'Platinum' ? (
                <p className="max-level">Вы достигли максимального уровня! 🎉</p>
              ) : (
                <div className="progress-info">
                  {loyaltyInfo.level === 'Bronze' && (
                    <p>Ещё {1000 - statistics.bonusPoints} баллов до уровня Silver 🥈</p>
                  )}
                  {loyaltyInfo.level === 'Silver' && (
                    <p>Ещё {3000 - statistics.bonusPoints} баллов до уровня Gold 🥇</p>
                  )}
                  {loyaltyInfo.level === 'Gold' && (
                    <p>Ещё {5000 - statistics.bonusPoints} баллов до уровня Platinum 💎</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="profile-section stats-section">
            <h2><FaStar /> Статистика</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{statistics.totalOrders}</div>
                <div className="stat-label">Всего заказов</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-value">{statistics.totalSpent.toLocaleString()} ₽</div>
                <div className="stat-label">Потрачено</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎁</div>
                <div className="stat-value">{statistics.bonusPoints}</div>
                <div className="stat-label">Бонусов</div>
              </div>
            </div>
          </div>

          <div className="profile-section orders-section">
            <h2><FaHistory /> История заказов</h2>
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>У вас пока нет заказов</p>
                <p className="no-orders-hint">Оформите первый заказ и получите бонусы!</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <div className="order-number">Заказ №{order.id}</div>
                      <div className={getStatusClass(order.status)}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                    <div className="order-date">
                      {new Date(order.date).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="order-items">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="order-item-detail">
                          <span>{item.title} x {item.quantity || 1}</span>
                          <span>{item.price * (item.quantity || 1)} ₽</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <strong>Итого: {order.total} ₽</strong>
                      {order.bonusEarned && (
                        <span className="bonus-earned">+{order.bonusEarned} бонусов</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

