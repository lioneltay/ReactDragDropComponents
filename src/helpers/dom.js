export const cumulativeOffset = (element) => {
  let top = 0
  let left = 0
  let el = element
  
  while (el) {
    top += el.offsetTop || 0
    left += el.offsetLeft || 0
    el = el.offsetParent
  }
    
  return { top, left }
}

export const getCenter = (element) => {
  const { top, left } = cumulativeOffset(element)
  const { height, width } = element.getBoundingClientRect()
  
  return {
    x: top - height / 2,
    y: left - width / 2,
  }
}

export const pageBoundingRect = (element) => {
  const { top, left } = cumulativeOffset(element)
  const height = element.clientHeight
  const width = element.clientWidth
  
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
  }
}

export const pointInElement = ({x,y}, element) => {
  const {top, left, bottom, right} = pageBoundingRect(element)
  
  return (
    x > left && x < right &&
    y > top && y < bottom
  )
}