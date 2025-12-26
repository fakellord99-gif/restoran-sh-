import React, { Component } from 'react'

export class Categories extends Component {
    constructor(props){
      super(props)  
      this.state = {
        categories: [
            {
                key: 'all',
                name: 'Всё'
            },
            {
                key: 'Pizze',
                name: 'Пицца'
            },
            {
                key: 'Primi Piatti',
                name: 'Первые блюда'
            },
            {
                key: 'Dolci',
                name: 'Десерты'
            },
             {
                key: 'Antipasti',
                name: 'Закуски'
            },
             {
                key: 'Secondi Piatti',
                name: 'Основные блюда'
            },
             {
                key: 'Insalate',
                name: 'Салаты'
            },
             {
                key: 'Bevande',
                name: 'Вина'
            },
             {
                key: 'Caffe',
                name: 'Кофе'
            },
             {
                key: 'Limoncello',
                name: 'Лимончелло'
            },
              {
                key: 'Contorni',
                name: 'Гарниры'
            },
        ]
      }
    }
  render() {
    return (
      <div className='categories'>
        {this.state.categories.map(el =>(
            <div key ={el.key} onClick={() => this.props.chooseCategory(el.key)}>{el.name}</div>
        ))}
      </div>
    )
  }
}

export default Categories