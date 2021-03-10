
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

        // how do i pick from these and maintain balance?
        const gv = {
            barrels: {range:[1,6],weight:1},
            barrel_spread: {range:[30,120],weight:1},
            rate_of_fire: {range:[.1,1],weight:1},
            bullet_damage: {range:[.1,3],weight:1},
            bullet_speed: {range:[1,4],weight:1},
            bullet_life: {range:[1,4],weight:1},
        }
        const pickval = (k) => { 
            return (Math.random()*(gv[k].range[1] - gv[k].range[0])) + gv[k].range[0] 
        }

        const generated = {
            name: name,
            barrels: pickval("barrels"),
            barrel_spread: pickval("barrel_spread"),
            rate_of_fire: pickval("rate_of_fire"),
            bullet_damage: pickval("bullet_damage"),
            bullet_speed: pickval("bullet_speed"),
            bullet_life: pickval("bullet_life"),
        }
        console.log(generated)
        return generated
    }
}