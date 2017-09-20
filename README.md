# My Own Drag and Drop Library

Re-implementation of react-dnd for learning purposes and the addition of some features.

## Goals
- Learn by remaking react-dnd
- Provide many premade components that serve a general purpose. This will reduce the difficulty of implementing common drag and drop components which do not require the extremely fine grained control that react-dnd gives.


## TODO
HOCs
- [x] Basic functionality
- [ ] drag types
- [ ] drag preview
- [ ] flesh out monitor
- [ ] mouse support
- [ ] re-evaluate code/design

- [ ] touch support

Components
- [ ] SortableList
- [ ] SortableItem
- [ ] DropBin
- [ ] KanbanBoard




## API
### HOCs
#### DragDropContext
#### DragSource
#### DropTarget

### Components
#### SortableList
Defines a list of items that can be rearranged. Items must be SortableItems

#### SortableItem
An item within a SortableList that can be rearranged

#### DropBin
A bin that can react to DragSources which are dropped on it

#### KanbanBoard
A KanbanBoard!

