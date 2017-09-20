import React, {Component} from 'react'
import PropTypes from 'prop-types'

import createStore from './reduxStore'


const DragDropContext = () => (WrappedComponent) => {

  const {store, actions, monitor} = createStore()

  return class DragDropContext extends Component {
    static propTypes = {
  
    }

    static childContextTypes = {
      dragDropStore: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired,
      }).isRequired,
      actions: PropTypes.object.isRequired,
      monitor: PropTypes.object.isRequired,
    }

    getChildContext() {
      return {
        dragDropStore: store,
        actions: actions,
        monitor: monitor,
      }
    }

    onMouseMove = ({pageX, pageY}) => {
      console.log('mousemove')
      actions.updatePointerPosition({x: pageX, y: pageY})
    }

    componentDidMount() {
      document.addEventListener('mousemove', this.onMouseMove)
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.onMouseMove)
    }
  
    render() {
      return (
        <div>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}


export default DragDropContext