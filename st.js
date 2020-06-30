const invoice = require( "./invoices.json" )


class Statement{
    constructor(invoice){
        this.comedyAmount = 40000;
        this.tragedyAmount = 30000;
        this.totalAmount = 0;
        this.volumeCredits = 0;
        this.plays = invoice.performance;
        this.customer = invoice.customer;
        this.numberOfComedies = 0;
    }


    countForTragedy(audience){
        return audience > 30 ? this.tragedyAmount  + 1000 * (audience - 30): this.tragedyAmount;
    }
    /**
     * очень много магических чисел, я их оставлю, т.к нету информации в описании к задаче
     * комедии получаются слишком дорогими
     */
    countForComedy(audience){  
        this.numberOfComedies++;
        if(audience > 20){ 
          return this.comedyAmount + 10000 + 500 * (audience - 20) + 300 * audience;
        }
          return this.comedyAmount + 300 * audience;
    }
    countBonus(audience){
        // Добавление бонусов
            return Math.max(audience - 30, 0);
       }
    countComedyBonus(audience){
        // Дополнительный бонус за каждые 10 комедий
           return Math.max(Math.floor(audience / 5), 0);
       }

    formatCurrency(price){
        return new Intl.NumberFormat("ru",
        { style: "currency", currency: "RUB",  minimumFractionDigits: 2}).format(price)
    }
       
    result(){
        let result = `Счет для ${this.customer}\n`;
        
        for (let perf of this.plays) {
            switch (perf.type) {
                case "tragedy":
                    this.totalAmount+= this.countForTragedy(perf.audience);
                    result += `${perf.playId}: ${this.formatCurrency(this.countForTragedy(perf.audience))}`;
                    result+=` (${perf.audience} мест)\n`
                    this.volumeCredits+= this.countBonus(perf.audience);
                    break;
                case "comedy":
                    this.totalAmount += this.countForComedy(perf.audience);
                    result += `${perf.playId}: ${this.formatCurrency(this.countForComedy(perf.audience))}`;
                    result+=` (${perf.audience} мест)\n`
                    this.volumeCredits+= this.countBonus(perf.audience);
                    if(this.comedyCount / 10 === 0){
                        this.volumeCredits+= this.countComedyBonus(perf.audience);
                        this.numberOfComedies = 0;
                    }
                    break;
                default:
                throw new Error(`неизвестный тип: ${perf.type}`);
            }
        }
        
        result+=
        `Итого с вас ${this.formatCurrency(this.totalAmount)}\nВы заработали ${this.volumeCredits} бонусов\n`
        return result;
    }
}

let statement = new Statement(invoice)
console.log(statement.result())