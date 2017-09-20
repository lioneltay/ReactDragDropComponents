



let items = [0, 1, 2, 3, 4, 5]


const from = 1
const to = 4

items.splice(to, 0, items.splice(from, 1)[0])



console.log(items)




function render() {
  return (
    <div>

      <DragContainer 
        containerId={1} 
        items={items}
        onChange={(items) => console.log(items)}>

        {items.map(item => (
          <DragableItem key={item.id}>
            <Item item={item} />
          </DragableItem>
        ))}

      </DragContainer>

      <DragContainer containerId={2}>
        {items.map(item => (
          <DragableItem key={item.id}>
            <Item item={item} />
          </DragableItem>
        ))}
      </DragContainer>

    </div>
  )
}
