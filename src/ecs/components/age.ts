/*
Miniplex documentation examples of adding components:
      entity      world
const player = world.add({
  position: { x: 0, y: 0 }, <- component
  velocity: { x: 0, y: 0 },
  health: { current: 100, max: 100 }
})

But with separation of concerns, each component is a function
that returns an object with the given property:
age returns {age: 0}, which will translate to
const bubble = world.add({
  age: 0
})
*/

export type AgeComponent = {
  age: number
}

export const age = (): AgeComponent => ({ age: 0 });