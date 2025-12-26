import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Items from './components/Items';
import Categories from './components/Categories';
import ShowFullitem from './components/ShowFullitem';
import About from './components/About';
import Menu from './components/Menu';
import Contacts from './components/Contacts';
import Reservation from './components/Reservation';
import Delivery from './components/Delivery';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import Profile from './components/Profile';
import Database from './services/database';


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      orders:[],
      currentItems: [],
      currentOrder: null,
      completedOrders: [],
      assetsVersion: Date.now(), // Обновлено: точные изображения для каждого блюда
      items: [
        {
          id: 1,
          title: 'Пицца Маргарита',
          img:'pizza-margherita.jpg',
          desc: "Классическая итальянская пицца с нежным томатным соусом, свежей моцареллой и ароматным базиликом. Тонкое тесто, приготовленное по традиционному рецепту.",
          category:'Pizze',
          price: '850'
        },
         {
          id: 2,
          title: 'Паста Карбонара',
          img:'pasta-carbonara.jpg' ,
          desc: "Аутентичная паста с соусом на основе яиц, пармезана, панчетты и черного перца. Сливочный, насыщенный вкус с пикантными нотками.",
          category:'Primi Piatti',
          price: '850'
        },
         {
          id: 3,
          title: 'Тирамису',
          img:'tiramisu.jpg' ,
          desc: "Нежный итальянский десерт из кофейных бисквитов, пропитанных эспрессо, с кремом маскарпоне и какао. Классический рецепт из Венето.",
          category:'Dolci',
          price: '850'
        },
         {
          id: 4,
          title: 'Брускетты и Кростини',
          img:'bruschetta.jpg' ,
          desc: "Хрустящие поджаренные ломтики хлеба с чесноком, свежими томатами, базиликом и оливковым маслом. Традиционная итальянская закуска.",
          category:'Antipasti',
          price: '850'
        },
         {
          id: 5,
          title: 'Сальтимбокка',
          img:'saltimbocca.jpg' ,
          desc: "Нежное телячье мясо с шалфеем и прошутто, тушенное в белом вине. Классическое римское блюдо с насыщенным ароматом.",
          category:'Secondi Piatti',
          price: '850'
        },
         {
          id: 6,
          title: 'Классический салат',
          img:'insalata-mista.jpg' ,
          desc: "Свежий салат из рукколы, помидоров черри, моцареллы и пармезана с бальзамическим уксусом и оливковым маслом. Легкий и освежающий.",
          category:'Insalate',
          price: '850'
        },
         {
          id: 7,
          title: 'Кьянти',
          img:'vino-chianti.jpg' ,
          desc: "Классическое тосканское красное вино Кьянти. Богатый, насыщенный вкус с нотками вишни и специй.",
          category:'Bevande',
          price: '1200'
        },
         {
          id: 8,
          title: 'Гарниры',
          img:'contorni-verdure.jpg' ,
          desc: "Свежие овощи на гриле, картофель по-деревенски, тушеные овощи и другие гарниры, идеально дополняющие основные блюда.",
          category:'Contorni',
          price: '850'
        },
        {
          id: 9,
          title: 'Пицца Пепперони',
          img:'pizza-pepperoni.jpg',
          desc: "Острая пицца с колбасой пепперони, моцареллой и томатным соусом. Для любителей пикантного вкуса.",
          category:'Pizze',
          price: '950'
        },
        {
          id: 10,
          title: 'Пицца Четыре Сыра',
          img:'pizza-quattro-formaggi.jpg',
          desc: "Нежная пицца с моцареллой, горгонзолой, пармезаном и рикоттой. Сырное изобилие на тонком тесте.",
          category:'Pizze',
          price: '1050'
        },
        {
          id: 11,
          title: 'Пицца Капричоза',
          img:'pizza-capricciosa.jpg',
          desc: "Классическая пицца с артишоками, ветчиной, грибами, оливками и моцареллой. Гармония вкусов.",
          category:'Pizze',
          price: '1100'
        },
        {
          id: 12,
          title: 'Паста Болоньезе',
          img:'pasta-bolognese.jpg',
          desc: "Традиционная паста с мясным соусом болоньезе, приготовленным из говядины, томатов, вина и ароматных трав. Сытное и ароматное блюдо.",
          category:'Primi Piatti',
          price: '900'
        },
        {
          id: 13,
          title: 'Паста Аматричана',
          img:'pasta-amatriciana.jpg',
          desc: "Аутентичная паста из Рима с гуанчиале, томатами, пекорино романо и красным перцем. Острое и насыщенное блюдо.",
          category:'Primi Piatti',
          price: '950'
        },
        {
          id: 14,
          title: 'Паста Альфредо',
          img:'pasta-alfredo.jpg',
          desc: "Сливочная паста с соусом из сливок, пармезана и масла. Нежное и изысканное блюдо.",
          category:'Primi Piatti',
          price: '850'
        },
        {
          id: 15,
          title: 'Лазанья',
          img:'lasagna.jpg',
          desc: "Многослойная лазанья с мясным соусом, бешамель и пармезаном. Запеченная до золотистой корочки.",
          category:'Primi Piatti',
          price: '1200'
        },
        {
          id: 16,
          title: 'Ризотто с грибами',
          img:'risotto-funghi.jpg',
          desc: "Кремовое ризотто с лесными грибами, пармезаном и белым вином. Классическое блюдо Северной Италии.",
          category:'Primi Piatti',
          price: '1000'
        },
        {
          id: 17,
          title: 'Оссобуко',
          img:'ossobuco-braised.jpg',
          desc: "Тушеная телячья голень с овощами, белым вином и соусом. Традиционное миланское блюдо.",
          category:'Secondi Piatti',
          price: '1500'
        },
        {
          id: 18,
          title: 'Пармиджана',
          img:'parmigiana-eggplant-baked.jpg',
          desc: "Запеченные баклажаны с томатным соусом, моцареллой и пармезаном. Вегетарианское блюдо с насыщенным вкусом.",
          category:'Secondi Piatti',
          price: '950'
        },
        {
          id: 19,
          title: 'Котолетта по-милански',
          img:'cotoletta-breaded.jpg',
          desc: "Хрустящая телячья отбивная в панировке, запеченная с пармезаном. Классическое блюдо Ломбардии.",
          category:'Secondi Piatti',
          price: '1400'
        },
        {
          id: 20,
          title: 'Капрезе',
          img:'caprese-salad.jpg',
          desc: "Свежие помидоры, моцарелла и базилик с оливковым маслом и бальзамическим уксусом. Классическая итальянская закуска.",
          category:'Antipasti',
          price: '750'
        },
        {
          id: 21,
          title: 'Прошутто с дыней',
          img:'prosciutto-melone-correct.jpg',
          desc: "Нежный прошутто ди Парма с сочной дыней. Идеальное сочетание соленого и сладкого.",
          category:'Antipasti',
          price: '900'
        },
        {
          id: 22,
          title: 'Аранчини',
          img:'arancini-correct.jpg',
          desc: "Жареные рисовые шарики с начинкой из моцареллы и мясного рагу. Хрустящие снаружи, нежные внутри.",
          category:'Antipasti',
          price: '800'
        },
        {
          id: 23,
          title: 'Салат Цезарь',
          img:'caesar-salad.jpg',
          desc: "Свежий салат романо с курицей, пармезаном, сухариками и соусом цезарь. Сытный и освежающий.",
          category:'Insalate',
          price: '850'
        },
        {
          id: 24,
          title: 'Панакотта',
          img:'pannacotta-berry.jpg',
          desc: "Нежный кремовый десерт с ванилью, подается с ягодным соусом. Легкий и изысканный.",
          category:'Dolci',
          price: '650'
        },
        {
          id: 25,
          title: 'Панна Котта',
          img:'panna-cotta.jpg',
          desc: "Классический итальянский десерт из сливок, ванили и желатина. Подается с карамелью или ягодами.",
          category:'Dolci',
          price: '700'
        },
        {
          id: 26,
          title: 'Каппучино',
          img:'cappuccino.jpg',
          desc: "Классический итальянский кофе с молочной пенкой. Идеальное завершение трапезы.",
          category:'Caffe',
          price: '250'
        },
        {
          id: 27,
          title: 'Эспрессо',
          img:'espresso.jpg',
          desc: "Крепкий итальянский эспрессо. Для истинных ценителей кофе.",
          category:'Caffe',
          price: '200'
        },
        {
          id: 28,
          title: 'Лимончелло',
          img:'limoncello.jpg',
          desc: "Традиционный итальянский ликер из лимонов. Освежающий и ароматный.",
          category:'Limoncello',
          price: '350'
        },
        {
          id: 29,
          title: 'Пиньо Гриджо',
          img:'vino-pinot-grigio.jpg',
          desc: "Легкое белое вино из региона Венето. Свежий, фруктовый вкус с цитрусовыми нотками.",
          category:'Bevande',
          price: '1100'
        },
        {
          id: 30,
          title: 'Барбера д\'Асти',
          img:'vino-barbera.jpg',
          desc: "Красное вино из Пьемонта. Мягкий, фруктовый вкус с бархатистыми танинами.",
          category:'Bevande',
          price: '1300'
        },
        {
          id: 31,
          title: 'Просекко',
          img:'vino-prosecco.jpg',
          desc: "Игристое белое вино из Венето. Легкое, свежее, идеально для аперитива.",
          category:'Bevande',
          price: '1400'
        },
        {
          id: 32,
          title: 'Брунелло ди Монтальчино',
          img:'vino-brunello.jpg',
          desc: "Элитное красное вино из Тосканы. Мощное, выдержанное вино с глубоким вкусом.",
          category:'Bevande',
          price: '3500'
        },
        {
          id: 33,
          title: 'Амароне',
          img:'vino-amarone.jpg',
          desc: "Красное вино из Венето. Богатый, концентрированный вкус с нотками сухофруктов.",
          category:'Bevande',
          price: '2800'
        },
        {
          id: 34,
          title: 'Лате',
          img:'caffe-latte.jpg',
          desc: "Нежный кофе с большим количеством молока. Сливочный и мягкий вкус.",
          category:'Caffe',
          price: '280'
        },
        {
          id: 35,
          title: 'Моккачино',
          img:'caffe-mocha.jpg',
          desc: "Кофе с шоколадом и молоком. Идеальное сочетание кофе и какао.",
          category:'Caffe',
          price: '320'
        },
        {
          id: 36,
          title: 'Американо',
          img:'caffe-americano.jpg',
          desc: "Эспрессо с горячей водой. Мягкий и менее крепкий, чем классический эспрессо.",
          category:'Caffe',
          price: '220'
        },
        {
          id: 37,
          title: 'Макиато',
          img:'caffe-macchiato.jpg',
          desc: "Эспрессо с небольшим количеством молочной пенки. Баланс крепости и нежности.",
          category:'Caffe',
          price: '240'
        },
        {
          id: 38,
          title: 'Корретто',
          img:'caffe-corretto.jpg',
          desc: "Эспрессо с добавлением граппы. Крепкий итальянский кофе с алкоголем.",
          category:'Caffe',
          price: '300'
        },
        {
          id: 39,
          title: 'Лимончелло Крем',
          img:'limoncello-cream.jpg',
          desc: "Сливочный лимончелло с добавлением молока. Нежный и мягкий вкус.",
          category:'Limoncello',
          price: '400'
        },
        {
          id: 40,
          title: 'Лимончелло Мятный',
          img:'limoncello-mint.jpg',
          desc: "Лимончелло с добавлением свежей мяты. Освежающий и бодрящий напиток.",
          category:'Limoncello',
          price: '380'
        },
        {
          id: 41,
          title: 'Лимончелло Медовый',
          img:'limoncello-honey.jpg',
          desc: "Лимончелло с натуральным медом. Сладкий и ароматный вариант классического ликера.",
          category:'Limoncello',
          price: '420'
        },
        {
          id: 42,
          title: 'Лимончелло Ледяной',
          img:'limoncello-iced.jpg',
          desc: "Лимончелло со льдом. Освежающий вариант для жаркого дня.",
          category:'Limoncello',
          price: '360'
        }
      ],
     showFullitem: false,
     fullItem: {},
     currentPage: 'menu',
     showAuthModal: null, // 'login', 'register' или null
     currentUser: null
    }
    this.state.currentItems = this.state.items
    this.addToOrder = this.addToOrder.bind(this)
    this.deleteOrder = this.deleteOrder.bind(this)
      this.chooseCategory = this.chooseCategory.bind(this)
        this.onShowItem = this.onShowItem.bind(this)
        this.changePage = this.changePage.bind(this)
        this.updateQuantity = this.updateQuantity.bind(this)
        this.handleOrderComplete = this.handleOrderComplete.bind(this)
        this.handleDeliverySubmit = this.handleDeliverySubmit.bind(this)
        this.handleBackToCheckout = this.handleBackToCheckout.bind(this)
        this.handleBackToCart = this.handleBackToCart.bind(this)
        this.openAuthModal = this.openAuthModal.bind(this)
        this.closeAuthModal = this.closeAuthModal.bind(this)
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    // Проверяем, есть ли сохраненный пользователь
    const currentUser = Database.getCurrentUser()
    if (currentUser) {
      this.setState({ currentUser })
    }
  }

  handleLoginSuccess(user) {
    this.setState({ currentUser: user })
    // Если администратор, переходим на админ панель
    if (user.role === 'admin') {
      this.setState({ currentPage: 'admin' })
    }
  }

  handleLogout() {
    Database.logout()
    this.setState({ 
      currentUser: null,
      currentPage: 'menu'
    })
  }

  handleUserUpdate = (updatedUser) => {
    this.setState({ currentUser: updatedUser })
  }

  openAuthModal(modalType) {
    this.setState({ showAuthModal: modalType })
  }

  closeAuthModal() {
    this.setState({ showAuthModal: null })
  }

render(){
  const renderPage = () => {
    // Если админ, показываем админ панель
    if (this.state.currentPage === 'admin' && this.state.currentUser?.role === 'admin') {
      return <AdminPanel currentUser={this.state.currentUser} onLogout={this.handleLogout} />
    }

    switch(this.state.currentPage) {
      case 'about':
        return <About />
      case 'menu':
        return <Menu 
          chooseCategory={this.chooseCategory}
          items={this.state.currentItems}
          onShowItem={this.onShowItem}
          onAdd={this.addToOrder}
          assetsVersion={this.state.assetsVersion}
        />
      case 'contacts':
        return <Contacts />
      case 'reservation':
        return <Reservation />
      case 'profile':
        return <Profile 
          currentUser={this.state.currentUser}
          onUserUpdate={this.handleUserUpdate}
        />
      case 'checkout':
        return <Checkout 
          orders={this.state.orders}
          onOrderComplete={this.handleOrderComplete}
          onBack={this.handleBackToCart}
          assetsVersion={this.state.assetsVersion}
        />
      case 'delivery':
        return <Delivery 
          order={this.state.currentOrder}
          onOrderSubmit={this.handleDeliverySubmit}
          onBack={this.handleBackToCheckout}
        />
      default:
        return <Menu 
          chooseCategory={this.chooseCategory}
          items={this.state.currentItems}
          onShowItem={this.onShowItem}
          onAdd={this.addToOrder}
          assetsVersion={this.state.assetsVersion}
        />
    }
  }

  return (
  <div className="wrapper">
    <Header 
      orders={this.state.orders} 
      onDelete={this.deleteOrder}
      changePage={this.changePage}
      currentPage={this.state.currentPage}
      updateQuantity={this.updateQuantity}
      assetsVersion={this.state.assetsVersion}
      openAuthModal={this.openAuthModal}
      currentUser={this.state.currentUser}
      onLogout={this.handleLogout}
    />
    {renderPage()}
    {this.state.showFullitem && (
      <ShowFullitem
        onAdd={this.addToOrder}
        onShowItem={this.onShowItem}
        item={this.state.fullItem}
        assetsVersion={this.state.assetsVersion}
      />
    )}
    {this.state.showAuthModal === 'login' && (
      <Login 
        changePage={this.openAuthModal}
        closeModal={this.closeAuthModal}
        onLoginSuccess={this.handleLoginSuccess}
      />
    )}
    {this.state.showAuthModal === 'register' && (
      <Register 
        changePage={this.openAuthModal}
        closeModal={this.closeAuthModal}
      />
    )}
    <Footer />
  </div>
  )
}

onShowItem(item){
  this.setState({fullItem: item })
  this.setState({showFullitem: !this.state.showFullitem})
}

chooseCategory(category) {
if(category === 'all') {
  this.setState({ currentItems: this.state.items})
  return
}
 this.setState({
  currentItems: this.state.items.filter(el => el.category === category)
 })
}

deleteOrder(id) {
this.setState({ orders: this.state.orders.filter(el => el.id !== id)})
}

addToOrder(item){
  let isInArray = false
  let newOrders = this.state.orders.map(el => {
    if (el.id === item.id) {
      isInArray = true
      return {...el, quantity: (el.quantity || 1) + 1}
    }
    return el
  })
  
  if (!isInArray) {
    newOrders = [...newOrders, {...item, quantity: 1}]
  }
  
  this.setState({orders: newOrders}, () =>{
    console.log(this.state.orders)
  })
}

updateQuantity(id, quantity) {
  if (quantity <= 0) {
    this.deleteOrder(id)
    return
  }
  this.setState({
    orders: this.state.orders.map(el => 
      el.id === id ? {...el, quantity} : el
    )
  })
}

changePage(page) {
  this.setState({currentPage: page})
}

handleOrderComplete(order) {
  this.setState({
    currentOrder: order,
    currentPage: 'delivery'
  })
}

handleDeliverySubmit(finalOrder) {
  // Сохраняем заказ
  const completedOrders = [...this.state.completedOrders, finalOrder]
  this.setState({
    completedOrders: completedOrders,
    orders: [], // Очищаем корзину
    currentOrder: null,
    currentPage: 'menu'
  })
  
  alert(`Заказ №${finalOrder.id} успешно оформлен!\n\nАдрес доставки: ${finalOrder.delivery.address}\n\nМы свяжемся с вами для подтверждения!`)
}

handleBackToCheckout() {
  this.setState({currentPage: 'checkout'})
}

handleBackToCart() {
  this.setState({currentPage: 'menu'})
}
}

export default App;
