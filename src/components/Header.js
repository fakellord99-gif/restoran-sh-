import React, { useState } from 'react'
import { FaBasketShopping } from 'react-icons/fa6' // Правильный импорт корзины
import Order from './Order'


const showOrders = (props) => {
    let summa = 0
    props.orders.forEach(el => {
        const quantity = el.quantity || 1
        summa += Number.parseFloat(el.price) * quantity
    })
    return (<div>
        {props.orders.map(el => (
            <Order 
                onDelete={props.onDelete} 
                updateQuantity={props.updateQuantity}
                key={el.id} 
                item={el}
                assetsVersion={props.assetsVersion}
            />
        ))}
        <p className='summa'>Сумма: {new Intl.NumberFormat().format(summa)}₽</p>
        <button 
            className='checkout-btn' 
            onClick={() => props.changePage('checkout')}
        >
            Оформить заказ
        </button>
    </div>)
}

const showNothing = () => {
    return (<div className='empty'>
<h2>Корзина пуста</h2>
    </div>)
}
export default function Header(props) {
    let [cartOpen, setCartOpen] = useState(false)
    
    return (
        <header>
            <div>
                <span className='logo'>Теплый вечер</span>
                <ul className='nav'>
                    <li 
                        className={props.currentPage === 'about' ? 'active' : ''}
                        onClick={() => props.changePage('about')}
                    >
                        О нас
                    </li>
                    <li 
                        className={props.currentPage === 'menu' ? 'active' : ''}
                        onClick={() => props.changePage('menu')}
                    >
                        Меню
                    </li>
                    <li 
                        className={props.currentPage === 'contacts' ? 'active' : ''}
                        onClick={() => props.changePage('contacts')}
                    >
                        Контакты
                    </li>
                    <li 
                        className={props.currentPage === 'reservation' ? 'active' : ''}
                        onClick={() => props.changePage('reservation')}
                    >
                        Забронировать
                    </li>
                    {props.currentUser?.role === 'admin' && (
                        <li 
                            className={props.currentPage === 'admin' ? 'active' : ''}
                            onClick={() => props.changePage('admin')}
                        >
                            Админ панель
                        </li>
                    )}
                    {props.currentUser ? (
                        <>
                            {props.currentUser.role !== 'admin' && (
                                <li 
                                    className={props.currentPage === 'profile' ? 'active' : ''}
                                    onClick={() => props.changePage('profile')}
                                >
                                    Профиль
                                </li>
                            )}
                            <li onClick={props.onLogout}>
                                Выйти
                            </li>
                        </>
                    ) : (
                        <li onClick={() => props.openAuthModal('login')}>
                            Войти
                        </li>
                    )}
                </ul>
                <FaBasketShopping onClick={() => setCartOpen(cartOpen = !cartOpen)} className={`shop-cart-button ${cartOpen && 'active'}`}/>

                    {cartOpen && (
                      <div className='shop-cart'>
                        {props.orders.length > 0 ?
                        showOrders({...props, changePage: props.changePage}) : showNothing()}
                        </div>
                    )}
            </div>
            <div className='presentation'></div>
        </header>
    )
}