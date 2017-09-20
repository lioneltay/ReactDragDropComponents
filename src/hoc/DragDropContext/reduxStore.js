import {__, over, lensProp, merge, assoc} from 'ramda'

import {bindActionCreators, createStore} from 'redux'

const SET_DRAG_DATA = 'SET_DRAG_DATA'
const UPDATE_DRAG_DATA = 'UPDATE_DRAG_DATA'
const UPDATE_POINTER_POSITION = 'UPDATE_POINTER_POSITION'


const dragDataLens = lensProp('dragData')

const makeStore = () => {
  const initialState = {
    dragType: '',
    dragData: null,
    pointerPosition: { x: 0, y: 0},
    pointerElementOffset: null,
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DRAG_DATA: {
        return assoc('dragData', action.dragData, state)
      }
      case UPDATE_DRAG_DATA: {
        return over(dragDataLens, merge(__, action.dragData), state)
      }
      case UPDATE_POINTER_POSITION: {
        return assoc('pointerPosition', action.pointerPosition, state)
      }
    }
    return state
  }

  const store = createStore(
    reducer, initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  const {dispatch, getState} = store

  const actions = {
    setDragData(dragData) {
      return { type: SET_DRAG_DATA, dragData }
    },
    updateDragData(dragData) {
      return { type: UPDATE_DRAG_DATA, dragData }
    },
    updatePointerPosition(pointerPosition) {
      return { type: UPDATE_POINTER_POSITION, pointerPosition }
    }
  }

  const monitor = {
    dragData: () => getState().dragData,
  }

  return {
    store,
    actions: bindActionCreators(actions, dispatch),
    monitor,
  }
}

export default makeStore