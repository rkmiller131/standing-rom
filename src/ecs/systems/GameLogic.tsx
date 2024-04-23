import RenderLoop from "./RenderLoop";

export default function GameLogic() {
    // any side effects that need to happen, render here in a useEffect
    // if you need to listen to any ecs onEntityAdded or whatever changes, probably here too

    // pull from the hookstate store and if we have, say, levels length then return this renderloop (only start game when ready)
    return (
        <RenderLoop />
    )
}