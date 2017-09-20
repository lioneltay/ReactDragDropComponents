import {insert, append} from 'ramda'

import React, {Component, Children} from 'react'
import PropTypes from 'prop-types'

import {DropTarget} from 'react-dnd'

import FlipMove from 'react-flip-move'

// import DraggableItem from '../DraggableItem/DraggableItem'
import {DraggableItem} from 'components'

const dropTarget = {
  drop(props, monitor, component) {
    const { containerId } = props
    const dragData = monitor.getItem()

    if (dragData.containerId !== containerId) {
      console.log('dropping!!!!')
      console.log(dragData)
      component.pushItem(dragData.item)
      dragData.removeItemFromContainer(dragData.id)
    }

    return { containerId }
  },
  canDrop(props, monitor) {
    return !(props.containerId === monitor.getItem().containerId)
  }
}

@DropTarget('test', dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class DragContainer extends Component {
  static propTypes = {
    // Passed Props
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    items: PropTypes.array.isRequired, // The data from which the children will be rendered from, used in onChange
    onChange: PropTypes.func, // Called with items whenever items are changed
    onMove: PropTypes.func, // Called when items are moved
    onRemove: PropTypes.func, // Called whenever an item is removed
    onAdd: PropTypes.func, // called whenever an item is added
    className: PropTypes.string, // General Styles
    canDropClassName: PropTypes.string, // Styles to apply when canDrop is true
    isOverClassName: PropTypes.string, // Styles to apply when dragging over container
    containerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    disableSelfDrop: PropTypes.bool,

    // Animation Props
    animationDuration: PropTypes.number.isRequired,

    // DnD Props
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    animationDuration: 1000,
  }

  constructor(props) {
    super(props)

    // Not used in render so store on instance
    this.items = props.items
  }

  componentWillReceiveProps(nextProps) {
    this.items = nextProps.items
  }

  pushItem = (item) => {
    this.items = append(item, this.items)
    if (this.props.onChange) this.props.onChange(this.items)
    if (this.props.onAdd) this.props.onAdd(item)
  }

  insertItem = (index, item) => {
    console.log(index, item)
    this.items = insert(index, item, this.items)
    if (this.props.onChange) this.props.onChange(this.items)
    if (this.props.onAdd) this.props.onAdd(item)
  }

  moveItem = (from, to) => {
    this.items = [ ...this.items ]
    this.items.splice(to, 0, this.items.splice(from, 1)[0])
    if (!this.props.onChange && !this.props.onMove) return
    if (this.props.onChange) this.props.onChange(this.items)
    if (this.props.onMove) this.props.onMove(this.items)
  }

  removeItem = (itemId) => {
    this.items = this.items.filter(item => item.id !== itemId)
    if (this.props.onChange) this.props.onChange(this.items)
  }

  // Inject props into children
  renderChildren = () => {
    return Children.map(this.props.children, (child, index) => {
      if (!child || child.type !== DraggableItem) return child

      return React.cloneElement(
        child,
        {
          containerId: this.props.containerId,
          index: index,
          removeItemFromContainer: this.removeItem,
          moveItemInContainer: this.moveItem,
          insertItemInContainer: this.insertItem,

          animationDuration: this.props.animationDuration,
        }
      )
    })
  }

  getClassName() {
    const classNames = [this.props.className]

    if (this.props.canDrop) classNames.push(this.props.canDropClassName)

    if (this.props.isOver) classNames.push(this.props.isOverClassName)

    return classNames.join(' ')
  }

  render() {
    const { connectDropTarget, className, animationDuration } = this.props

    return connectDropTarget(
    // return (
      <div className={this.getClassName()}>
        <FlipMove duration={animationDuration} easing="ease-in-out" className={className}>
          {this.renderChildren()}
        </FlipMove>
      </div>
    )
  }
}