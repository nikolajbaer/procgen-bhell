import { MATERIALS } from "../assets"
import * as THREE from "three"
import { Vector3 } from "../ecs_types"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


export function gun_output_score(gun){
    return gun.barrels * (1/gun.rate_of_fire) * gun.bullet_damage * 1/gun.barrel_spread
}

export function gen_gun(level,default_gun=true,create_material=true,ammo_level=20) {

    if(default_gun){
        return {
            name: "X-1",
            barrels: 1,
            barrel_spread: 50,
            rate_of_fire: .1,
            bullet_damage: 1,
            bullet_speed: 3,
            bullet_life: 2,
            bullet_color: "white",
            bullet_scale: new Vector3(.2,.2,.2),
        }
    }else{
        const r = Math.random()
        const name =    ALPHABET[Math.floor(r)] 
                        + ALPHABET[Math.floor((r*10) % 10)] + "-" 
                        + (Math.floor(r*1000) % 100)

        const gv = {
            barrels: {range:[2,5],weight:1},
            barrel_spread: {range:[30,90],weight:1},
            rate_of_fire: {range:[.1,1],weight:1},
            bullet_damage: {range:[1,5],weight:1},
            bullet_speed: {range:[2,4],weight:1},
            bullet_life: {range:[1.5,3],weight:1},
        }

        const pickval = (k) => { 
            return (Math.random()*(gv[k].range[1] - gv[k].range[0])) + gv[k].range[0] 
        }

        const generated = {
            name: name,
            barrels: Math.floor(pickval("barrels")),
            barrel_spread: pickval("barrel_spread"),
            bullet_damage: pickval("bullet_damage"),
            rate_of_fire: pickval("rate_of_fire"),
            bullet_speed: pickval("bullet_speed"),
            bullet_life: pickval("bullet_life"),
        }
        if(generated.barrels <= 2){
            generated.barrel_spread = 1
        }
        const bscale = (generated.bullet_damage/gv.bullet_damage.range[1]) * .1 + .2
        generated.bullet_scale = new Vector3(bscale,bscale,bscale) // TODO generate value correlated to damage

        // generate random color material
        const color = "hsl("+Math.round(Math.random()*255) + ",100%," + Math.round(Math.random()*40 + 50) +"%)"
        const bullet_material = "bullet-"+generated.name
        MATERIALS[bullet_material] = new THREE.MeshLambertMaterial( { color: color } ), 
        generated.bullet_material = bullet_material
        generated.bullet_color = color

        // First, we scale the rate of fire by the difference from the level
        /*
        const adj_rof = ( generated.barrels * generated.bullet_damage ) / ( generated.barrel_spread * level )
        generated.rate_of_fire = adj_rof
        // then if this exceeds our allowable range, we adjust damage to compensate
        if(generated.rate_of_fire < gv.rate_of_fire.range[0]){
            generated.rate_of_fire = gv.rate_of_fire.range[0]
        }else if(generated.rate_of_fire > gv.rate_of_fire.range[1]){
            generated.rate_of_fire = gv.rate_of_fire.range[0]
        }
        if(adj_rof != generated.rate_of_fire){
            generated.bullet_damage = generated.rate_of_fire * ( ( generated.barrel_spread * level ) / generated.barrels )
        }
        */

        generated.ammo = generated.barrels * ammo_level

        return generated
    }
}
// for experimenting
window.gen_gun = gen_gun