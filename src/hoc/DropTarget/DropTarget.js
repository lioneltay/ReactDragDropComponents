import React, {Component, cloneElement} from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'


const DropTarget = ({drop}) => (WrappedComponent) => {


  @connect(
    (state) => ({
      pointerPosition: state.pointerPosition,
    }),
    null,
    null,
    { storeKey: 'dragDropStore' }
  )
  class DropTarget extends Component {
    static propTypes = {
      // pointerPosition: PropTypes.shape({
      //   x: PropTypes.number.isRequired,
      //   y: PropTypes.number.isRequired,
      // }).isRequired,
    }

    static contextTypes = {
      actions: PropTypes.object.isRequired,
      monitor: PropTypes.object.isRequired,
    }
  
    constructor(props, context) {
      super(props, context)
  
      this.state = {
  
      }
    }
  
    wrapOnMouseUp = (element) => (event) => {
      const {onMouseUp} = element.props

      onMouseUp ? onMouseUp(event) : null

      drop(this.props, this.context.monitor, this.component)
    }

    connectDropTarget = (element) => {
      return cloneElement(element, { onMouseUp: this.wrapOnMouseUp(element) })
    }

    render() {
      return (
        <WrappedComponent {...this.props} ref={el => this.component = el}
          connectDropTarget={this.connectDropTarget}
        />
      )
    }
  }

  return DropTarget
}


export default DropTarget