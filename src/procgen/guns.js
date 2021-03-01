

export function gen_gun(level) {
    // TODO formula for balancing across given numerical level

    return {
        barrels: 1,
        rate_of_fire: .1,
        bullet_damage: 1,
        bullet_speed: 3,
        bullet_life: 3,
    }
}