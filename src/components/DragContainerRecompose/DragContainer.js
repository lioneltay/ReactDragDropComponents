import React, {PropTypes, Children} from 'react'
import {DropTarget} from 'react-dnd'
import { compose, setPropTypes, withProps, withHandlers, } from 'recompose'
import R from 'ramda'

import FlipMove from 'react-flip-move'

const moveItem = (from, to, items) => 
  R.converge(R.insert, [R.always(to), R.prop(from), R.remove(from, 1)], items)


const withArrayManipulationHandlers = withHandlers({
  pushItem: ({ items, onChange }) => (item) => {
    if (onChange) onChange(R.append(item, items))
  },
  moveItem: ({ items, onChange }) => (from, to) => {
    if (onChange) onChange(moveItem(from, to, items))
  },
  removeItem: ({ items, onChange }) => (index) => {
    if (onChange) onChange(R.remove(index, 1, items))
  }
})

const withDropTargetBehaviour = DropTarget(
  'test',
  {
    drop(props, monitor) {
      const { containerId } = props
      const dragData = monitor.getItem()
      if (dragData.containerId !== containerId) props.pushItem(dragData.item)
      return { containerId }
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  })
)

const withEnhancedChildren = withProps(({ children, moveItem, removeItem, containerId }) => ({
  children: Children.map(children, (child, index) => {
    return React.cloneElement(
      child,
      {
        containerId: containerId,
        index: index,
        removeItemFromContainer: () => removeItem(index),
        moveItemInContainer: moveItem,
      }
    )
  })
}))

const withCalculatedClassName = withProps(({ className, canDrop, canDropClassName }) => {
  const classNames = [className]
  if (canDrop) classNames.push(canDropClassName)
  return { className: classNames.join(' ') }
})
  
const withPropTypes = setPropTypes({
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
})

const enhancer = compose(
  withArrayManipulationHandlers,
  withDropTargetBehaviour,
  withEnhancedChildren,
  withCalculatedClassName,
  withPropTypes
)

export default enhancer(({ children, className, connectDropTarget }) => 
  connectDropTarget(
    <div>
      <FlipMove duration={300} easing="ease-out" className={className}>
        {children}
      </FlipMove>
    </div>
  )
)

