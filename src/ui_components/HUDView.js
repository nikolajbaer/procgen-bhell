import React, { useState } from "react";
import { observer } from "mobx-react-lite"
import { gun_output_score } from "../procgen/guns"
import { GunStat } from "./GunStat"
import { HealthBar } from "./HealthBar"
import { GameFlash } from "./GameFlash"

export const HUDView = observer( ({ hudState,newGameHandler,highScoreHandler,saveScoreHandler }) => {
    const [name, setName ] = useState("")
    if(hudState.gameover){
        let score_name = ""
        return (<div className="menu">
                    <h1>GAME OVER</h1>
                    <h3>Score: {hudState.score}</h3>
                    <p>You were eliminated during Wave {hudState.wave}</p>

                    <p>
                        <button onClick={newGameHandler.bind(this)}>PLAY AGAIN</button>
                    </p>
                    <p>
                        <button onClick={highScoreHandler.bind(this,hudState.score,hudState.wave)}>HIGH SCORES</button>
                    </p>
                </div>)
    }

    return (<div className="overlay">
        <div className="top">
        </div>
        <div className="gun_stats">
            <h2 style={{color:hudState.gun.bullet_color}}>Gun: {hudState.gun.name}</h2>
            <GunStat name="Barrels" value={hudState.gun.barrels} max_value={5} color={hudState.gun.bullet_color}></GunStat>
            <GunStat name="Bullet Damage" value={hudState.gun.bullet_damage} max_value={5} color={hudState.gun.bullet_color}></GunStat>
            <GunStat name="Bullet Speed" value={hudState.gun.bullet_speed} max_value={5} color={hudState.gun.bullet_color}></GunStat>
            <GunStat name="Bullet Distance" value={hudState.gun.bullet_life} max_value={3} color={hudState.gun.bullet_color}></GunStat>
        </div>
        <div className="bottom">
            <div className="hud">
                Score: {hudState.score} |
                Wave: {hudState.wave} |
                Enemies: {hudState.enemies_left}/{hudState.total_enemies}
            </div>
            <HealthBar health={hudState.health} max_health={hudState.max_health} />
            <div className="hud">
                WASD to move, LMB to fire 
            </div>
        </div>
        <GameFlash title={hudState.message}></GameFlash>
    </div>)
})

