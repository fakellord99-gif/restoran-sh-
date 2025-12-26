import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Database from '../services/database'

export default function Register({ changePage, closeModal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
    
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают!')
      return
    }

    // Проверка существования пользователя
    if (Database.getUserByEmail(formData.email)) {
      setError('Пользователь с таким email уже существует')
      return
    }

    // Регистрация
    const newUser = Database.addUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    })

    console.log('Регистрация успешна:', newUser)
    alert('Регистрация успешна! Теперь вы можете войти.')
    changePage('login')
  }

  return (
    <div className='auth-page' onClick={closeModal}>
      <div className='auth-container' onClick={(e) => e.stopPropagation()}>
        <FaTimes className='auth-close-btn' onClick={closeModal} />
        <h1>Регистрация</h1>
        
        {error && <div className='auth-error'>{error}</div>}

        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='name'>Имя</label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Введите ваше имя'
              required
            />
          </div>

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
            <label htmlFor='phone'>Телефон</label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='+7 (999) 123-45-67'
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
              placeholder='Придумайте пароль'
              required
              minLength='6'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Подтвердите пароль</label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Повторите пароль'
              required
              minLength='6'
            />
          </div>

          <button type='submit' className='auth-btn'>Зарегистрироваться</button>
        </form>

        <div className='auth-footer'>
          <p>
            Уже есть аккаунт?{' '}
            <span className='auth-link' onClick={() => changePage('login')}>
              Войти
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

