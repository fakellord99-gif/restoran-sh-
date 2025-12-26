import React, { Component } from 'react'
import { FaTimes } from 'react-icons/fa'
export class ShowFullitem extends Component {
  render() {
    return (
      <div className='full-item'>
        <div>
            <img
              src={`/img/${this.props.item.img}?v=${this.props.assetsVersion}`}
              alt={this.props.item.title}
              onClick={() => this.props.onShowItem(this.props.item)}
            />
                <h2>{this.props.item.title}</h2>
                <p>{this.props.item.desc}</p>
                <b>{this.props.item.price}₽</b>
                <div className='add-to-cart' onClick={() => this.props.onAdd(this.props.item)}>+</div>
                <FaTimes className='FaTimes-button' onClick={() => this.props.onShowItem(this.props.item)}/>
        </div>
      </div>
    )
  }
}

export default ShowFullitem