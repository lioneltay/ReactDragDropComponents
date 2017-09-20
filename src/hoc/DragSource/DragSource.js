import React, {Component, cloneElement} from 'react'
import PropTypes from 'prop-types'


const DragSource = ({ beginDrag }) => (WrappedComponent) => {

  return class DragSource extends Component {
    static propTypes = {
      onMouseDown: PropTypes.func,      
    }

    static contextTypes = {
      dragDropStore: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
    }
  
    constructor(props, context) {
      super(props, context)
  
      this.state = {
  
      }
    }

    connectDragSource = (element) => {
      return cloneElement(element, { onMouseDown: this.wrapOnMouseDown(element) })
    }

    wrapOnMouseDown = (element) => (event) => {
      const {onMouseDown} = element.props
      const {actions} = this.context
      const {setDragData} = actions

      event.preventDefault()

      onMouseDown ? onMouseDown(event) : null

      setDragData(beginDrag(this.props))

      console.log('onMouseDown')
    }
  
    render() {
      return (
        <WrappedComponent {...this.props} 
          onMouseDown={this.onMouseDown}
          connectDragSource={this.connectDragSource}
        />
      )
    }
  }
}


export default DragSource
