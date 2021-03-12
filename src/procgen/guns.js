import { MATERIALS } from "../assets"
import * as THREE from "three"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


export function gun_output_score(gun){
    // damage per second 
    const dmg_out = gun.barrels * (1/gun.rate_of_fire) * gun.bullet_damage
    // projection factor? spread and 
    const dmg_focus = ( gun.barrels <= 2)?1.0:(180/gun.barrel_spread)
    // bullet life?

    return dmg_out * dmg_focus 
}

export function gen_gun(level,default_gun=true,create_material=true) {

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

        // IDEA:  
        // how do i pick from these and maintain balance?
        const gv = {
            barrels: {range:[1,5],weight:1},
            barrel_spread: {range:[30,120],weight:1},
            rate_of_fire: {range:[.1,1],weight:1},
            bullet_damage: {range:[.25,3],weight:1},
            bullet_speed: {range:[1,4],weight:1},
            bullet_life: {range:[1,3],weight:1},
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
        const init_level = gun_output_score(generated)

        // generate random color material
        const color = "hsl("+Math.round(Math.random()*255) + ",100%," + Math.round(Math.random()*40 + 50) +"%)"
        const bullet_material = "bullet-"+generated.name
        MATERIALS[bullet_material] = new THREE.MeshLambertMaterial( { color: color } ), 
        generated.bullet_material = bullet_material

        // we scale damage and rate of fire by the difference from the level
        const x = level / init_level
        console.log(generated)

        //generated.bullet_damage *= x  
        //generated.rate_of_fire *= x

        const updated_level = gun_output_score(generated)
        console.log(init_level,level,updated_level,x)
        return generated
    }
}
// for experimenting
window.gen_gun = gen_gun