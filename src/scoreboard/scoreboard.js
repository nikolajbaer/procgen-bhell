import firebase from 'firebase/app';
import 'firebase/firestore';

const SCORE_VERSION = "1.0alpha" // Version based on gameplay dynamics

// TODO https://firebase.google.com/docs/auth/web/anonymous-auth

class Scoreboard {
    constructor(firebase_creds){
        if(firebase.apps.length == 0){
            this.app = firebase.initializeApp(firebase_creds);
        }
        this.db = firebase.firestore();
        this.highscores = this.db.collection("scores").where("version","==",SCORE_VERSION).orderBy("score","desc").limit(10)
    }

    load_scores(){
        return this.highscores.get().then((querySnapshot) => {
            const scores = []
            querySnapshot.forEach( (child) => {
                scores.push(child.data())
            })
            return scores
        })
    }

    submit(name,score,last_wave){
        const d = new Date()
        const k = name.replace(/[^\w\-_ ]/g,'').substring(0,32) + "-" + d.getTime()
        return this.db.collection("scores").add({
            name: name,
            score: score,
            last_wave: last_wave,
            version: SCORE_VERSION,
        })
    }
}

export function get_scoreboard(){
    const creds = JSON.parse(document.getElementById("firebase_creds").innerText)
    const scoreboard = new Scoreboard(creds)
    scoreboard.load_scores()
    return scoreboard
}