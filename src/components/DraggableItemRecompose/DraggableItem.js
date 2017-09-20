import React, {PropTypes} from 'react'
import {DropTarget, DragSource} from 'react-dnd'
import {compose, setPropTypes, withProps} from 'recompose'

const withDragBehaviour = DragSource(
  'test', 
  {
    beginDrag(props) {
      return {
        item: props.item,
        containerId: props.containerId,
        index: props.index,
      }
    },
    endDrag(props, monitor) {
      const dragData = monitor.getItem()
      const dropResult = monitor.getDropResult()

      if (dropResult && dropResult.containerId !== dragData.containerId) {
        props.removeItemFromContainer()
      }
    } 
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)

const withDropBehaviour = DropTarget(
  'test', 
  {
    hover(props, monitor) {
      const dragData = monitor.getItem()
      const dragIndex = dragData.index
      const hoverIndex = props.index

      if (props.containerId !== dragData.containerId || hoverIndex === dragIndex) {
        return
      }

      props.moveItemInContainer(dragIndex, hoverIndex)
      // Mutate the dragItem so that hovering continues to work
      dragData.index = hoverIndex
    }
  }, 
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)

const withCalculatedClassName = withProps(({ className, isDragging, draggingClassName }) => {
  const classNames = [className]
  if (isDragging) classNames.push(draggingClassName)
  return { className: classNames.join(' ') }
})

const enhance = compose(
  setPropTypes({
    containerId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    item: PropTypes.object,
    index: PropTypes.number,
    removeItemFromContainer: PropTypes.func,
    moveItemInContainer: PropTypes.func,
  }),
  withDragBehaviour,
  withDropBehaviour,
  setPropTypes({
    className: PropTypes.string,
    isDragging: PropTypes.bool.isRequired,
    draggingClassName: PropTypes.string,
  }),
  withCalculatedClassName,
  setPropTypes({
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    className: PropTypes.string,
  })
)

export default enhance(({ connectDropTarget, connectDragSource, children, className }) =>
  connectDropTarget(connectDragSource(
    <div className={className}>
      {children}
    </div>
  ))
)

