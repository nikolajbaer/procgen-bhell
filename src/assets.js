import  * as THREE from "three"

export const GEOMETRIES = {
    "box": new THREE.BoxGeometry(),
    "sphere": new THREE.SphereGeometry(),
    "plane": new THREE.PlaneGeometry(),
    "ground": new THREE.PlaneGeometry(1000,1000),
}

export const MATERIALS = {
    "ground": new THREE.MeshLambertMaterial( { color: 0x111111 } ),
    "player": new THREE.MeshLambertMaterial( { color: 0xeeeeee } ),
    "gun": new THREE.MeshLambertMaterial( { color: 0x333333 } ),
}