import React, { useState, useEffect } from 'react'
import Database from '../services/database'

export default function AdminPanel({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('statistics')
  const [statistics, setStatistics] = useState(null)
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setStatistics(Database.getStatistics())
    setOrders(Database.getOrders())
    setReservations(Database.getReservations())
    setUsers(Database.getUsers())
  }

  const handleOrderStatusChange = (orderId, newStatus) => {
    Database.updateOrderStatus(orderId, newStatus)
    loadData()
  }

  const handleReservationStatusChange = (reservationId, newStatus) => {
    Database.updateReservationStatus(reservationId, newStatus)
    loadData()
  }

  const renderStatistics = () => {
    if (!statistics) return <div>Загрузка...</div>

    return (
      <div className='admin-statistics'>
        <h2>Статистика</h2>
        
        <div className='stats-cards'>
          <div className='stat-card'>
            <h3>Общая выручка</h3>
            <p className='stat-value'>{new Intl.NumberFormat().format(statistics.totalRevenue)} ₽</p>
          </div>
          
          <div className='stat-card'>
            <h3>Заказов сегодня</h3>
            <p className='stat-value'>{statistics.todayOrders}</p>
          </div>
          
          <div className='stat-card'>
            <h3>Всего заказов</h3>
            <p className='stat-value'>{statistics.totalOrders}</p>
          </div>
          
          <div className='stat-card'>
            <h3>Броней сегодня</h3>
            <p className='stat-value'>{statistics.todayReservations}</p>
          </div>
          
          <div className='stat-card'>
            <h3>Всего броней</h3>
            <p className='stat-value'>{statistics.totalReservations}</p>
          </div>
          
          <div className='stat-card'>
            <h3>Пользователей</h3>
            <p className='stat-value'>{statistics.totalUsers}</p>
          </div>
        </div>

        <div className='stats-details'>
          <div className='stats-section'>
            <h3>Заказы по статусам</h3>
            <ul>
              <li>Новые: {statistics.ordersByStatus.new || 0}</li>
              <li>В обработке: {statistics.ordersByStatus.processing || 0}</li>
              <li>Доставляются: {statistics.ordersByStatus.delivering || 0}</li>
              <li>Завершены: {statistics.ordersByStatus.completed || 0}</li>
            </ul>
          </div>

          <div className='stats-section'>
            <h3>Брони по статусам</h3>
            <ul>
              <li>Ожидают: {statistics.reservationsByStatus.pending || 0}</li>
              <li>Подтверждены: {statistics.reservationsByStatus.confirmed || 0}</li>
              <li>Завершены: {statistics.reservationsByStatus.completed || 0}</li>
              <li>Отменены: {statistics.reservationsByStatus.cancelled || 0}</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const renderOrders = () => {
    return (
      <div className='admin-orders'>
        <h2>Заказы</h2>
        {orders.length === 0 ? (
          <p>Заказов пока нет</p>
        ) : (
          <table className='admin-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.date).toLocaleString('ru-RU')}</td>
                  <td>{order.customerName || 'Не указано'}</td>
                  <td>{new Intl.NumberFormat().format(order.total || 0)} ₽</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                      className='status-select'
                    >
                      <option value='new'>Новый</option>
                      <option value='processing'>В обработке</option>
                      <option value='delivering'>Доставляется</option>
                      <option value='completed'>Завершен</option>
                      <option value='cancelled'>Отменен</option>
                    </select>
                  </td>
                  <td>
                    <button className='btn-view'>Просмотр</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  const renderReservations = () => {
    return (
      <div className='admin-reservations'>
        <h2>Брони</h2>
        {reservations.length === 0 ? (
          <p>Броней пока нет</p>
        ) : (
          <table className='admin-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата брони</th>
                <th>Время</th>
                <th>Гостей</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>#{reservation.id}</td>
                  <td>{reservation.date || 'Не указано'}</td>
                  <td>{reservation.time || 'Не указано'}</td>
                  <td>{reservation.guests || 'Не указано'}</td>
                  <td>{reservation.name || 'Не указано'}</td>
                  <td>{reservation.phone || 'Не указано'}</td>
                  <td>
                    <select 
                      value={reservation.status} 
                      onChange={(e) => handleReservationStatusChange(reservation.id, e.target.value)}
                      className='status-select'
                    >
                      <option value='pending'>Ожидает</option>
                      <option value='confirmed'>Подтверждена</option>
                      <option value='completed'>Завершена</option>
                      <option value='cancelled'>Отменена</option>
                    </select>
                  </td>
                  <td>
                    <button className='btn-view'>Просмотр</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  const renderUsers = () => {
    return (
      <div className='admin-users'>
        <h2>Пользователи</h2>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'Не указано'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className='admin-panel'>
      <div className='admin-header'>
        <h1>Админ панель</h1>
        <div className='admin-user-info'>
          <span>Привет, {currentUser.name}!</span>
          <button onClick={onLogout} className='btn-logout'>Выйти</button>
        </div>
      </div>

      <div className='admin-tabs'>
        <button 
          className={activeTab === 'statistics' ? 'active' : ''} 
          onClick={() => setActiveTab('statistics')}
        >
          Статистика
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Заказы
        </button>
        <button 
          className={activeTab === 'reservations' ? 'active' : ''} 
          onClick={() => setActiveTab('reservations')}
        >
          Брони
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
      </div>

      <div className='admin-content'>
        {activeTab === 'statistics' && renderStatistics()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'users' && renderUsers()}
      </div>
    </div>
  )
}

