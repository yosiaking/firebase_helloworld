'use strict';
const config = {
apiKey: "AIzaSyAOOMio7D7cqpvZSCpuVbJY6msmayYeMs0",
authDomain: "fir-test-c1028.firebaseapp.com",
databaseURL: "https://fir-test-c1028.firebaseio.com",
projectId: "fir-test-c1028",
storageBucket: "fir-test-c1028.appspot.com",
messagingSenderId: "235152102892"
};
firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
const collection = db.collection('messages');


const auth = firebase.auth();
let me = null;

const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const login = document.getElementById('login');
const logout = document.getElementById('logout');

login.addEventListener('click', ()=>{
    auth.signInAnonymously();
});

logout.addEventListener('click', ()=>{
    auth.signOut();
});

auth.onAuthStateChanged(user => {
    if (user) {
        me = user;
        collection.orderBy('created').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const li = document.createElement('li');
                    const d = change.doc.data();
                    li.textContent = d.uid.substr(0,8) + `: ${d.message}`;
                    messages.appendChild(li);
                }
            });
        });
        login.style.display = 'none';
        [logout, form, messages].forEach(el => {
            el.style.display = '';
        })
        console.log(`login as : ${user.uid}`);
        return;
    }
    me = null;
    login.style.display = '';
    [logout, form, messages].forEach(el => {
        el.style.display = 'none';
    })
    console.log(`nobady is logged in`);
});


form.addEventListener('submit', e => {
    e.preventDefault();

    const val = message.value.trim();
    if (val == "") {
        return;
    }

    message.focus();
    message.value = '';

    collection.add({
        message: val,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        uid: me ? me.uid : 'nobady'
    })
    .then(doc => {
        console.log(`${doc.id} added!`);
    })
    .catch(error => {
        console.log(error);
    });
});

message.focus();