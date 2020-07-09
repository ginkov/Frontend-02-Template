class Dog {
    attack_ability = true
    attack_behavior = 'bited'
    attack_value = 20
    constructor(name) {
        this.name = name
    }
}

class Person {
    hp = 100
    constructor(name) {
        this.name = name
    }
    show_hp() {
        console.log(this.name, "'s hp = ", this.hp)
    }
    hurt(dog) {
        this.show_hp()
        if(dog.attack_ability) {
            console.log(dog.name, dog.attack_behavior, this.name)
            this.hp -= dog.attack_value
            this.show_hp()
        } else {
            console.log(dog.name, ' can not hurt ', this.name)
        }
    }
}

d = new Dog('Tom')
p = new Person('John')

p.hurt(d)
