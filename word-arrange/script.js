let vm = new Vue({
    el: '#app',
    data:{
        question: "蘋果",
        answer: [],
        elements: [],
        reply: [],
        msg: '',
        complete: false
    },
    methods:{
        shuffle(array){
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            if(JSON.stringify(array) === JSON.stringify(this.answer)){
                return this.shuffle(array)
            }else{
                return array
            }
        },
        use(index){
            temp = this.elements[index]
            this.reply.push(temp)
            this.elements.splice(index,1)
            window.navigator.vibrate(100); 
            if(JSON.stringify(this.reply)===JSON.stringify(this.answer)){
                this.msg = "恭喜答對囉!"
                // this.msg = ""
                console.log('good')
                this.complete = true
            }
        },
        back(index){
            temp = this.reply[index]
            this.elements.push(temp)
            this.reply.splice(index,1)
            window.navigator.vibrate(100); 
            if(!this.complete){
                temp = this.reply[index]
                this.elements.push(temp)
                this.reply.splice(index,1)
                window.navigator.vibrate(100); 
            }else{
                this.msg = "已經答對囉"
                window.navigator.vibrate(200); 
            }

        }
    },
    mounted(){
        axios
            .get('./data.json')
            .then((res) => {

                randIdx = Math.floor(Math.random()*res.data.length);
                console.log(res.data)
                this.answer = res.data[randIdx].answer
                this.question = res.data[randIdx].question

                this.elements = this.shuffle(Array.from(this.answer))
            })
            .catch(function (error) { // 
                
            });
        
    },
    
})