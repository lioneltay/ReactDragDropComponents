import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {DragLayer, DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {DragContainer, DraggableItem} from 'components'
import {compose, withState, setPropTypes} from 'recompose'
import R from 'ramda'


const enhancer = compose(
  DragDropContext(HTML5Backend),
  withState('listOne', 'updateListOne', [
    { id: 1, text: 'Item 1', style: { height: Math.random() * 50 + 50 } },
    { id: 2, text: 'Item 2', style: { height: Math.random() * 50 + 50 } },
    { id: 3, text: 'Item 3', style: { height: Math.random() * 50 + 50 } },
    { id: 4, text: 'Item 4', style: { height: Math.random() * 50 + 50 } },
    { id: 5, text: 'Item 5', style: { height: Math.random() * 50 + 50 } }
  ]),
  withState('listTwo', 'updateListTwo', [
    { id: 6, text: 'Item 6', style: { height: Math.random() * 50 + 50 } },
    { id: 7, text: 'Item 7', style: { height: Math.random() * 50 + 50 } },
    { id: 8, text: 'Item 8', style: { height: Math.random() * 50 + 50 } },
    { id: 9, text: 'Item 9', style: { height: Math.random() * 50 + 50 } },
    { id: 10, text: 'Item 10', style: { height: Math.random() * 50 + 50 } }
  ]),
  withState('listThree', 'updateListThree', [
  ]),
  setPropTypes({
    listOne: PropTypes.array.isRequired,
    listTwo: PropTypes.array.isRequired,
    listThree: PropTypes.array.isRequired,
  })
)


const renderDraggableItems = R.map(item => (
  <DraggableItem 
    className='draggable-item' 
    key={item.id}
    item={item} 
    draggingClassName='draggable-item-dragging'
    style={item.style} >
    {item.text}
  </DraggableItem>
))

const AppContainer = ({ listOne, listTwo, listThree, updateListOne, updateListTwo, updateListThree }) => (
  <div>

    <div style={{ height: 200 }}>
      Drag Item
      <DragState />
    </div>

    <div className='root'>
      <DragContainer
        className='drag-container'
        canDropClassName='drag-container-can-drop'
        containerId={1}
        items={listOne}
        onChange={updateListOne}>
        {renderDraggableItems(listOne)}
      </DragContainer>


      <DragContainer
        className='drag-container'
        canDropClassName='drag-container-can-drop'
        containerId={2}
        items={listTwo}
        onChange={updateListTwo}>
        {renderDraggableItems(listTwo)}
      </DragContainer>

      <DragContainer
        className='drag-container'
        canDropClassName='drag-container-can-drop'
        containerId={3}
        items={listThree}
        onChange={updateListThree}>
        {renderDraggableItems(listThree)}
      </DragContainer>

    </div>

    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
      <pre>{JSON.stringify(listOne, null, 2)}</pre>
      <pre>{JSON.stringify(listTwo, null, 2)}</pre>
      <pre>{JSON.stringify(listThree, null, 2)}</pre>
    </div>

  </div>
)

export default enhancer(AppContainer)


@DragLayer(monitor => ({
  dragItem: monitor.getItem(),
}))
class DragState extends Component {

  render() {
    return (
      <pre>
        {JSON.stringify(this.props.dragItem, null, 2)}
      </pre>
    )
  }
}