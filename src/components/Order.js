import React, { Component } from 'react'
import { FaTrash, FaPlus, FaMinus} from 'react-icons/fa6'

export class Order extends Component {
  render() {
    const quantity = this.props.item.quantity || 1
    const totalPrice = (parseFloat(this.props.item.price) * quantity).toFixed(0)
    
    return (
      <div className='item'>
        <img
          src={`/img/${this.props.item.img}?v=${this.props.assetsVersion}`}
          alt={this.props.item.title}
        />
                <h2>{this.props.item.title}</h2>
                <div className='quantity-controls'>
                  <FaMinus 
                    className='quantity-btn' 
                    onClick={() => this.props.updateQuantity(this.props.item.id, quantity - 1)}
                  />
                  <span className='quantity-value'>{quantity}</span>
                  <FaPlus 
                    className='quantity-btn' 
                    onClick={() => this.props.updateQuantity(this.props.item.id, quantity + 1)}
                  />
                </div>
                <b>{totalPrice} руб.</b>
                <FaTrash className='delete-icon' onClick={() => this.props.onDelete(this.props.item.id)}/>
      </div>
    )
  }
}

export default Order