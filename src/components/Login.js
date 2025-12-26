import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Database from '../services/database'

export default function Login({ changePage, closeModal, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Попытка входа
    const user = Database.login(formData.email, formData.password)
    
    if (user) {
      console.log('Вход успешен:', user)
      onLoginSuccess(user)
      closeModal()
    } else {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className='auth-page' onClick={closeModal}>
      <div className='auth-container' onClick={(e) => e.stopPropagation()}>
        <FaTimes className='auth-close-btn' onClick={closeModal} />
        <h1>Вход</h1>
        
        {error && <div className='auth-error'>{error}</div>}
        
        <div className='auth-demo-info'>
          <p><strong>Для теста:</strong></p>
          <p>Админ: admin@restaurant.ru / admin123</p>
          <p>Пользователь: user@example.ru / user123</p>
        </div>

        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Введите ваш email'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Пароль</label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Введите пароль'
              required
            />
          </div>

          <button type='submit' className='auth-btn'>Войти</button>
        </form>

        <div className='auth-footer'>
          <p>
            Нет аккаунта?{' '}
            <span className='auth-link' onClick={() => changePage('register')}>
              Зарегистрироваться
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

