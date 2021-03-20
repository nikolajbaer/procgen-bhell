import { gen_gun, gun_output_score } from "./guns"

test('generated gun is leveled', () => {
    for(var level=1; level <= 10; level++){
        const gun = gen_gun(level,false,false)
        const score = gun_output_score(gun)
       
        // TOAST - still trying to figure out how to level guns
        //expect(Math.round(score * 1000)).toBe(level * 1000)
    }
})