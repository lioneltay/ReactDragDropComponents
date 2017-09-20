import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom'

import {pointInElement} from 'helpers/dom'

import {DropTarget, DragSource, DragLayer} from 'react-dnd'


const dragSource = {
  beginDrag(props) {
    return {
      id: props.item.id,
      item: props.item,
      containerId: props.containerId,
      index: props.index,
      removeItemFromContainer: props.removeItemFromContainer,
      lastReorder: 0, // timestamp of last reorder
    }
  },
  endDrag(props, monitor) {
    const dragData = monitor.getItem()
    const dropResult = monitor.getDropResult()
    
    if (dropResult && dropResult.containerId && dropResult.containerId !== dragData.containerId) {
      props.removeItemFromContainer(dragData.id)
    }
  }
}

// let x, y
// document.addEventListener('mousemove', (event) => {
//   console.log('mousemove')
//   x = event.pageX
//   y = event.pageY
//   console.log('xy', x, y)
// })

// document.addEventListener('mousemove', (event) => {
//   console.log('mousemove')
//   x = event.pageX
//   y = event.pageY
//   console.log('true xy', x, y)
// }, true)

const dropTarget = {
  hover(props, monitor, component) {
    const dragData = monitor.getItem()
    const dragIndex = dragData.index    
    const hoverIndex = props.index

    const hoveringDOMElement = findDOMNode(component)
    
    if (props.containerId === dragData.containerId && hoverIndex === dragIndex) {
      // console.log('dragging on yourself bro!')
      return
    }

    // const lastReorder = dragData.lastReorder

    // if (Date.now() - lastReorder < props.animationDuration) {
    //   return
    // }

    if (true) return 
    if (!pointInElement({x, y}, hoveringDOMElement)) {
      console.log(x, y, 'cows')
      return
    }

    // Different Containers
    if (props.containerId !== dragData.containerId) {
      console.log('different container item invading us!')

      // dragData.lastReorder = Date.now()
      props.insertItemInContainer(props.index, dragData.item)
      dragData.removeItemFromContainer(dragData.item.id)

      // update the dragItem since we are hovering
      // mutations are fast
      dragData.containerId = props.containerId
      dragData.index = props.index
      dragData.removeItemFromContainer = props.removeItemFromContainer

      // insert item before
      // remove from other container
      console.log('done')
      return
    }

    // Save Containers
    else {
      // dragData.lastReorder = Date.now()
      props.moveItemInContainer(dragIndex, hoverIndex)
      // Mutate the dragItem so that hovering continues to work
      dragData.index = hoverIndex
      return
    }
  }
}

@DropTarget('test', dropTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource('test', dragSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@DragLayer(monitor => ({
  draggingItemId: monitor.getItem() && monitor.getItem().id,
}))
export default class DraggableItem extends Component {
  static propTypes = {
    // Passed Props
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    item: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    draggingClassName: PropTypes.string,

    // DnD Props
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    draggingItemId: PropTypes.number,

    // Props injected by DragContainer
    containerId: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    removeItemFromContainer: PropTypes.func.isRequired,
    moveItemInContainer: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const element = this.element

    element.addEventListener('mouseover', event => {
      console.log(event.pageX, event.pageY)
    })
  }

  getClassName() {
    const classNames = [this.props.className]

    // not relevant using the new type of dragging stuff where we remove the item entirely
    // if (this.props.isDragging) classNames.push(this.props.draggingClassName)
    if (this.props.item.id === this.props.draggingItemId) classNames.push(this.props.draggingClassName)

    return classNames.join(' ')
  }

  render() {
    const { connectDropTarget, connectDragSource, children, style } = this.props

    return connectDropTarget(connectDragSource(
      <div ref={el => this.element = el} className={this.getClassName()} style={style}>
        {children}
      </div>
    ))
  }
}
