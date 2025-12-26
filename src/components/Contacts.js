import React from 'react'

export default function Contacts() {
  return (
    <div className="page-content">
      <h1>Контакты</h1>
      <div className="contacts-content">
        <div className="contact-section">
          <h2>Адрес</h2>
          <p>г. Москва, ул. Примерная, д. 123</p>
          <p>Ближайшее метро: Примерная станция</p>
        </div>

        <div className="contact-section">
          <h2>Телефон</h2>
          <p>+7 (495) 123-45-67</p>
          <p>+7 (495) 123-45-68</p>
        </div>

        <div className="contact-section">
          <h2>Email</h2>
          <p>info@teplyy-vecher.ru</p>
          <p>reservations@teplyy-vecher.ru</p>
        </div>

        <div className="contact-section">
          <h2>Часы работы</h2>
          <p>Понедельник - Четверг: 12:00 - 23:00</p>
          <p>Пятница - Суббота: 12:00 - 00:00</p>
          <p>Воскресенье: 12:00 - 22:00</p>
        </div>

        <div className="contact-section">
          <h2>Как нас найти</h2>
          <p>
            Мы находимся в центре города, в удобном месте с парковкой. 
            Добраться до нас можно на общественном транспорте или на автомобиле.
          </p>
        </div>
      </div>
    </div>
  )
}


