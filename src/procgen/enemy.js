import { gen_gun } from "./guns"

export function gen_enemy(level) {
    // TODO formula for creating random enemy
    const gun = gen_gun()

    return {
        gun: gun,
        max_health: 10,
    }
}