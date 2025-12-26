// Симуляция базы данных с использованием localStorage

class Database {
  constructor() {
    this.initializeDatabase()
  }

  initializeDatabase() {
    // Инициализация базовых данных, если их нет
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        {
          id: 1,
          email: 'admin@restaurant.ru',
          password: 'admin123',
          name: 'Администратор',
          role: 'admin',
          phone: '+7 (999) 123-45-67',
          bonusPoints: 0
        },
        {
          id: 2,
          email: 'user@example.ru',
          password: 'user123',
          name: 'Иван Иванов',
          role: 'user',
          phone: '+7 (999) 987-65-43',
          bonusPoints: 1250
        }
      ]
      localStorage.setItem('users', JSON.stringify(defaultUsers))
    }

    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify([]))
    }

    if (!localStorage.getItem('reservations')) {
      localStorage.setItem('reservations', JSON.stringify([]))
    }

    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', null)
    }
  }

  // Пользователи
  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]')
  }

  getUserByEmail(email) {
    const users = this.getUsers()
    return users.find(user => user.email === email)
  }

  addUser(userData) {
    const users = this.getUsers()
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'user',
      bonusPoints: 0
    }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    return newUser
  }

  getUserById(userId) {
    const users = this.getUsers()
    return users.find(user => user.id === userId)
  }

  updateUser(userId, updateData) {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData }
      localStorage.setItem('users', JSON.stringify(users))
      
      // Обновляем currentUser если это текущий пользователь
      const currentUser = this.getCurrentUser()
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...users[userIndex] }
        delete updatedUser.password
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
      
      return users[userIndex]
    }
    return null
  }

  addBonusPoints(userId, points) {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      users[userIndex].bonusPoints = (users[userIndex].bonusPoints || 0) + points
      localStorage.setItem('users', JSON.stringify(users))
      
      // Обновляем currentUser если это текущий пользователь
      const currentUser = this.getCurrentUser()
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...users[userIndex] }
        delete updatedUser.password
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
      
      return users[userIndex]
    }
    return null
  }

  useBonusPoints(userId, points) {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      const currentPoints = users[userIndex].bonusPoints || 0
      if (currentPoints >= points) {
        users[userIndex].bonusPoints = currentPoints - points
        localStorage.setItem('users', JSON.stringify(users))
        
        // Обновляем currentUser если это текущий пользователь
        const currentUser = this.getCurrentUser()
        if (currentUser && currentUser.id === userId) {
          const updatedUser = { ...users[userIndex] }
          delete updatedUser.password
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        }
        
        return users[userIndex]
      }
    }
    return null
  }

  login(email, password) {
    const user = this.getUserByEmail(email)
    if (user && user.password === password) {
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    }
    return null
  }

  logout() {
    localStorage.setItem('currentUser', null)
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser')
    return user && user !== 'null' ? JSON.parse(user) : null
  }

  // Заказы
  getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]')
  }

  addOrder(orderData) {
    const orders = this.getOrders()
    
    // Начисляем бонусы (5% от суммы заказа)
    const bonusEarned = Math.floor((orderData.total || 0) * 0.05)
    
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'new',
      bonusEarned: bonusEarned,
      ...orderData
    }
    orders.push(newOrder)
    localStorage.setItem('orders', JSON.stringify(orders))
    
    // Начисляем бонусы пользователю
    if (orderData.userId && bonusEarned > 0) {
      this.addBonusPoints(orderData.userId, bonusEarned)
    }
    
    return newOrder
  }

  getUserOrders(userId) {
    const orders = this.getOrders()
    return orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders()
    const orderIndex = orders.findIndex(order => order.id === orderId)
    if (orderIndex !== -1) {
      orders[orderIndex].status = status
      localStorage.setItem('orders', JSON.stringify(orders))
      return orders[orderIndex]
    }
    return null
  }

  // Брони
  getReservations() {
    return JSON.parse(localStorage.getItem('reservations') || '[]')
  }

  addReservation(reservationData) {
    const reservations = this.getReservations()
    const newReservation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...reservationData
    }
    reservations.push(newReservation)
    localStorage.setItem('reservations', JSON.stringify(reservations))
    return newReservation
  }

  updateReservationStatus(reservationId, status) {
    const reservations = this.getReservations()
    const reservationIndex = reservations.findIndex(res => res.id === reservationId)
    if (reservationIndex !== -1) {
      reservations[reservationIndex].status = status
      localStorage.setItem('reservations', JSON.stringify(reservations))
      return reservations[reservationIndex]
    }
    return null
  }

  // Статистика
  getStatistics() {
    const orders = this.getOrders()
    const reservations = this.getReservations()
    const users = this.getUsers()

    // Выручка
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.status === 'completed' || order.status === 'delivered') {
        return sum + (order.total || 0)
      }
      return sum
    }, 0)

    // Заказы по статусам
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    // Брони по статусам
    const reservationsByStatus = reservations.reduce((acc, res) => {
      acc[res.status] = (acc[res.status] || 0) + 1
      return acc
    }, {})

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalReservations: reservations.length,
      totalUsers: users.length,
      ordersByStatus,
      reservationsByStatus,
      todayOrders: orders.filter(order => {
        const orderDate = new Date(order.date)
        const today = new Date()
        return orderDate.toDateString() === today.toDateString()
      }).length,
      todayReservations: reservations.filter(res => {
        const resDate = new Date(res.date)
        const today = new Date()
        return resDate.toDateString() === today.toDateString()
      }).length
    }
  }

  getUserStatistics(userId) {
    const orders = this.getUserOrders(userId)
    const user = this.getUserById(userId)
    
    const totalSpent = orders.reduce((sum, order) => {
      if (order.status === 'completed' || order.status === 'delivered') {
        return sum + (order.total || 0)
      }
      return sum
    }, 0)

    return {
      totalOrders: orders.length,
      totalSpent: totalSpent,
      bonusPoints: user?.bonusPoints || 0
    }
  }
}

export default new Database()

