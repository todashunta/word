const app = Vue.createApp({
    data() {
        return {
            word: 'word',
            mean: '単語',
            num: 0,
            selectBookId: '0',
            selectChapterId: '0',
            wordExist: false,
            wordBookName: '単語帳選択',
            wordBookFrameActive: false,
            chapterFrameActive: false,
            chapterName: 'チャプター選択',
            selectReset: false,
            chapters: {},
            words: [],
            wordCount: 0,
            langMode: '',
            langSwitch: 'english',
        }
    },
    methods: {
        shuffle(){
            console.log('shuffle')
        },
        leftSkip(){
            console.log('leftSkip')
        },
        start(){
            if(!this.words.length){
                alert('単語が選択されていません')
            }else{
                this.langMode = 'english'
                console.log(this.words[this.wordCount].name, this.langModes)
                speechText(this.words[this.wordCount].name, this.langMode)
                this.langSwitch = 'japanese'
            }
        },
        rightSkip(){
            console.log('rightSkip')
        },
        repeat(){
            console.log('repeat')
        },
        reset(){
            this.wordBookFrameActive = false
            const wordBookInput = document.querySelector('.word-book-input')
            wordBookInput.style.display = 'none'
            this.chapterFrameActive = false
            const chapterInput = document.querySelector('.chapter-input')
            chapterInput.style.display = 'none'
            const resetCover = document.getElementById('reset-cover')
            resetCover.style.height = '0'
        },
        wordBookFrame (){
            this.wordBookFrameActive = !this.wordBookFrameActive
            const wordBookInput = document.querySelector('.word-book-input')
            const resetCover = document.getElementById('reset-cover')
            if(this.wordBookFrameActive){
                wordBookInput.style.display = 'flex'
                resetCover.style.height = '100%'

            }else{
                wordBookInput.style.display = 'none'
                resetCover.style.height = '0'
            }
        },
        chapterFrame(){
            this.chapterFrameActive = !this.chapterFrameActive
            const chapterInput = document.querySelector('.chapter-input')
            const resetCover = document.getElementById('reset-cover')
            if(this.chapterFrameActive){
                chapterInput.style.display = 'flex'
                resetCover.style.height = '100%'
            }else{
                chapterInput.style.display = 'none'
                resetCover.style.height = '0'
            }
        },
        async getWords() {
            await fetch('api/words/' + this.selectChapterId)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.words = data.words
                    console.log(this.words)
                    this.wordExist = true
                }).catch(err => {
                    console.log(err)
                });
        },
        onend() {
            if(this.langSwitch == 'english'){
                this.langMode = 'english'
                console.log(this.words[this.wordCount].name, this.langModes)
                speechText(this.words[this.wordCount].name, this.langMode)
            }else if (this.langSwitch == 'japanese'){
                this.langMode = 'japanese'
                let text = ''
                this.words[this.wordCount].means.forEach((mean, index) => {
                    if(index == 0){
                        console.log(mean, index)
                        text += mean.mean
                    }else{
                        console.log(mean, index)
                        text += ',' + mean.mean
                    }
                });
                console.log(text, this.langModes)
                speechText(text, this.langMode)
            }
        }

    },
    watch: {
        selectBookId() {
            console.log('aiueo')
            const selectBookName = document.querySelector('.word-book-input input[type="radio"]:checked + label')
            this.wordBookName = selectBookName.textContent
            this.chapterName = 'チャプター選択'
            getApi('/api/chapters/' + this.selectBookId).then(data => {
                this.chapters = data.chapters
            }).catch(err => {
                console.log(err)
            })
        },
        selectChapterId() {
            const selectChapterName = document.querySelector('.chapter-input input[type="radio"]:checked + label')
            this.chapterName = selectChapterName.textContent
            this.getWords()
        }

    }
}).mount('#app')

async function getApi(url){
    const res = await fetch(url);
    const data = res.json();
    return data
}

speechSynthesis.cancel();
let speech = new SpeechSynthesisUtterance();

function speechText(text, mode) {
    const voices = speechSynthesis.getVoices();
    speech.text = text;
    if(mode == 'english'){
        speech.lang = 'en-US';
    }else if(mode = 'japanese'){
        speech.lang = 'ja-JP';
    }
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang == speech.lang) speech.voice = voices[i];
    }
    speechSynthesis.speak(speech);
};

speech.onend = () => {
    app.onend()
}