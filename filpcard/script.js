let vm = new Vue({
    el: "#app",
    data: {
        intros: [],
        hasflippedCard: false,
        lockBoard: false,
        firstCard: "",
        secondCard: "",
        pairs: 6,
        success: false,
        count: 0
    },
    methods: {
        shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        resetBoard() {
            [this.hasFlippedCard, this.lockBoard] = [false, false];
            [this.firstCard, this.secondCard] = [null, null];
        },
        randomCard: function () {
            this.$nextTick(() => {
                cards = document.querySelectorAll(".card");
                cards.forEach((card) => {
                    let randomPos = Math.floor(Math.random() * (this.pairs*2));
                    card.style.order = randomPos;
                });
            });
        },
        flipcard(e) {
            if (this.lockBoard) return;
            if (e.currentTarget === this.firstCard) return;
            e.currentTarget.classList.add("flip");      
            if (!this.hasFlippedCard) {
                this.hasFlippedCard = true;
                this.firstCard = e.currentTarget;
            } else {
                this.secondCard = e.currentTarget;
                this.checkForMatch();
                if(this.count === this.pairs) this.success=true
            }
        },
        checkForMatch() {
            if (this.firstCard.dataset.name === this.secondCard.dataset.name) {
                this.disableCards();
                this.count++
            } else {
                this.unFlipCards();
            }
        },
        unFlipCards(){
            this.lockBoard = true;
            setTimeout(() => {
                this.firstCard.classList.remove("flip");
                this.secondCard.classList.remove("flip");
                this.resetBoard();
            }, 500);
        },
        disableCards(){
            this.firstCard.style.pointerEvents = "none";
            this.secondCard.style.pointerEvents = "none";
            this.resetBoard();
        },
        initData(){
            this.success = false
            axios
            .get("./data.json")
            .then((res) => {
                this.resetBoard();

                console.log(res.data);
                data = this.shuffle(res.data).slice(0,this.pairs);
                for (let index = 0; index < data.length; index++) {
                    data[index].id = index + 1;
                }
                this.intros = data;
                this.randomCard();

                let cards = document.querySelectorAll('.card')
                console.log(cards)
                cards.forEach(card => {
                    card.classList.remove('flip')
                    card.style.pointerEvents = "auto"
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    mounted() {
        this.initData()
    },
});
