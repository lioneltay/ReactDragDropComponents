import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


import {DragDropContext, DropTarget, DragSource} from 'hoc'


@DragSource({
  beginDrag(props) {
    return props.item
  }
})
class DragItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {

    }
  }

  render() {
    const {connectDragSource} = this.props

    return connectDragSource(
      <div className='dragItem'>
        DragItem
        <pre>{JSON.stringify(this.props.item, null, 2)}</pre>
      </div>
    )
  }
}

@DropTarget({
  drop(props, monitor, component) {
    console.log('monitor.dragData()', monitor.dragData())
    console.log(component)
    component.setState({ droppedItem: monitor.dragData() })
    console.log('dropped on bin', props.id)
  }
})
class DropBin extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      droppedItem: null,
    }
  }

  render() {
    const {connectDropTarget} = this.props

    return connectDropTarget(
      <div className='dropBin'>
        DropBin {this.props.id}
        <pre>{JSON.stringify(this.state.droppedItem, null, 2)}</pre>
      </div>
    )
  }
}




@DragDropContext()
@connect(
  state => ({ state }),
  null,
  null,
  { storeKey: 'dragDropStore' }
)
export default class MyDragLibDemo extends Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    
    let id = 1

    this.state = {
      items: [
        { id: id++, text: 'Apple' },
        { id: id++, text: 'Banana' },
        { id: id++, text: 'Nugget' },
        { id: id++, text: 'TACOS' }
      ]
    }
  }

  render() {
    return (
      <div className='myDragLibDemo'>
        <pre>{JSON.stringify(this.props.state, null, 2)}</pre>
        <div className='row'>
          {this.state.items.map(item => <DragItem key={item.id} item={item} />)}
        </div>

        <div className='row'>
          <DropBin id={1} />
          <DropBin id={2} />
          <DropBin id={3} />
        </div>
      </div>
    )
  }
}