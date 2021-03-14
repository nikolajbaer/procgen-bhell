import firebase from 'firebase/app';
import 'firebase/database';

class Scoreboard {
    constructor(firebase_creds){
        if(firebase.apps.length == 0){
            this.app = firebase.initializeApp(firebase_creds);
        }
        this.db = firebase.database();
        window.firebase = firebase // debug
        this.scores = this.db.ref('scores').orderByChild('score').limitToFirst(10)
    }

    load_scores(){
        return this.scores.once('value').then((snapshot) => {
            const scores = []
            snapshot.forEach( (child) => {
                scores.push(child.val())
            })
            return scores
        })
    }

    submit(name,score,last_wave){
        const d = new Date()
        const k = name.replace(/[^\w\-_ ]/g,'').substring(0,32) + "-" + d.getTime()
        this.db.ref('scores/' + name).set()
    }
}

export function get_scoreboard(){
    const creds = JSON.parse(document.getElementById("firebase_creds").innerText)
    const scoreboard = new Scoreboard(creds)
    scoreboard.load_scores()
    return scoreboard
}