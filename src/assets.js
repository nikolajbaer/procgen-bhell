import  * as THREE from "three"

export const GEOMETRIES = {
    "box": new THREE.BoxGeometry(),
    "sphere": new THREE.SphereGeometry(),
    "plane": new THREE.PlaneGeometry(1,1,5,5),
    "ground": new THREE.PlaneGeometry(1000,1000, 50, 50),
}

export const MATERIALS = {
    "ground": new THREE.MeshLambertMaterial( { color: 0x333333 } ),
    "player": new THREE.MeshLambertMaterial( { color: 0xeeeeee } ),
    "default": new THREE.MeshLambertMaterial( { color: 0x9999FF } ),
    "default_bullet": new THREE.MeshLambertMaterial( { color: 0xffffff } ),
    "bullet-shooter2": new THREE.MeshLambertMaterial( { color: 0xaaaa00 } ),
    "gun-pickup": new THREE.MeshLambertMaterial( { color: 0x333333 } ),
    "explosion": new THREE.MeshBasicMaterial( { color: 0xF59B42 }),
    "enemy:shooter": new THREE.MeshLambertMaterial( { color: 0x9999FF } ),
    "enemy:shooter2": new THREE.MeshLambertMaterial( { color: 0x99FF99 } ),
    "enemy:shooter3": new THREE.MeshLambertMaterial( { color: 0x60a395 } ),
    "enemy:shooter4": new THREE.MeshLambertMaterial( { color: 0xaa00aa } ),
    "enemy:shooter5": new THREE.MeshLambertMaterial( { color: 0x1423f5 } ),
    "enemy:chaser": new THREE.MeshLambertMaterial( { color: 0xFF9999 } ),
}