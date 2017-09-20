import React, {PropTypes, Component} from 'react'

import {Card} from 'components'

import { DropTarget } from 'react-dnd'


const cardTarget = {
  drop(props, monitor, component) {
    const {id} = props
    const sourceObj = monitor.getItem()
    
    if (id !== sourceObj.listId) {
      component.pushCard(sourceObj.card)
    }
    return {
      listId: id
    }
  }
}

@DropTarget("CARD", cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Container extends Component {
  static propTypes = {
    // DnD Props
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,

    // Props
    id: PropTypes.number.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      cards: props.list,
    }
  }

  pushCard = (card) => {
    this.setState({
      cards: [ ...this.state.cards, card ],
    })
  }

  removeCard = (index) => {
    const cards = [ ...this.state.cards ]
    cards.splice(index, 1)
    this.setState({ cards })
  }

  moveCard = (dragIndex, hoverIndex) => {
    const cards = [ ...this.state.cards ]
    cards.splice(hoverIndex, 0, cards.splice(dragIndex, 1))

    this.setState({ cards })
  }

  render() {
    const { cards } = this.state
    const {canDrop, isOver, connectDropTarget} = this.props
    const isActive = canDrop && isOver
    const style = {
      width: '200px',
      height: '404px',
      border: '1px dashed gray',
    }

    const backgroundColor = isActive ? 'lightgreen' : '#FFF'

    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            index={index}
            card={card}
            removeCard={this.removeCard}
            moveCard={this.moveCard}
          />
        ))}
      </div>
    )
  }
}