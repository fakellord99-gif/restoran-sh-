import React from 'react'
import Items from './Items'
import Categories from './Categories'

export default function Menu(props) {
  return (
    <div className="page-content">
      <h1>Меню</h1>
      <Categories chooseCategory={props.chooseCategory} />
      <Items
        onShowItem={props.onShowItem}
        items={props.items}
        onAdd={props.onAdd}
        assetsVersion={props.assetsVersion}
      />
    </div>
  )
}


