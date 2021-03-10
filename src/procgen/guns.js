
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function gen_gun(level,default_gun=true) {

    if(default_gun){
        return {
            name: "X-1",
            barrels: 1,
            barrel_spread: 50,
            rate_of_fire: .1,
            bullet_damage: 1,
            bullet_speed: 3,
            bullet_life: 2,
        }
    }else{
        const r = Math.random()
        const name =    ALPHABET[Math.floor(r)] 
                        + ALPHABET[Math.floor((r*10) % 10)] + "-" 
                        + (Math.floor(r*1000) % 100)

        // TODO formula for balancing across given numerical level
        return {
            name: name,
            barrels: 3,
            barrel_spread: 50,
            rate_of_fire: .1,
            bullet_damage: .25,
            bullet_speed: 3,
            bullet_life: 2,
        }

    }
}